import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';

// USDT/USDC contract addresses
const TOKEN_CONTRACTS = {
  'ETH-Base': {
    USDT: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  'SOL': {
    USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  },
  'TRC-20': {
    USDT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    USDC: 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8',
  },
} as const;

// Transaction ID validation patterns
const TX_PATTERNS = {
  'ETH-Base': /^0x([A-Fa-f0-9]{64})$/,
  'SOL': /^[A-Za-z0-9]{87,88}$/,
  'TRC-20': /^[A-Fa-f0-9]{64}$/
} as const;

type Network = keyof typeof TOKEN_CONTRACTS;

// Create TronWeb instance
const createTronWeb = () => {
  // Use require for TronWeb to avoid ESM issues
  const TronWeb = require('tronweb');
  return new TronWeb({
    fullHost: process.env.TRON_RPC_URL || 'https://api.trongrid.io',
    headers: { "TRON-PRO-API-KEY": process.env.TRON_API_KEY },
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { txId, network, userId, walletId } = req.body;

    // Validate required fields
    if (!txId || !network || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get user's wallet for this network
    const userWallet = await prisma.wallets.findFirst({
      where: {
        user_id: userId,
        network: network,
      },
    });

    if (!userWallet) {
      return res.status(400).json({ error: 'No wallet found for this network' });
    }

    // Validate network type
    if (!Object.keys(TOKEN_CONTRACTS).includes(network)) {
      return res.status(400).json({ error: 'Invalid network' });
    }

    const typedNetwork = network as Network;

    // Validate transaction ID format
    const pattern = TX_PATTERNS[typedNetwork];
    if (!pattern.test(txId)) {
      return res.status(400).json({ error: `Invalid transaction ID format for ${network}` });
    }

    // Check if transaction was already processed
    try {
      const existingTx = await prisma.deposits.findUnique({
        where: { transaction_id: txId },
      });

      if (existingTx) {
        return res.status(400).json({ error: 'Transaction already processed' });
      }
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to check transaction status' });
    }

    let validationResult;
    
    switch (typedNetwork) {
      case 'ETH-Base':
        try {
          const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);
          const tx = await provider.getTransaction(txId).catch(() => null);
          
          if (!tx) {
            return res.status(400).json({ error: 'Transaction not found on Base network' });
          }

          // Wait for transaction confirmation
          const receipt = await tx.wait().catch(() => null);
          
          if (!receipt || receipt.status === 0) {
            return res.status(400).json({ error: 'Transaction failed or not confirmed' });
          }

          // Check if it's a token transfer
          const contractAddress = tx.to?.toLowerCase();
          const isUSDT = contractAddress === TOKEN_CONTRACTS[typedNetwork].USDT.toLowerCase();
          const isUSDC = contractAddress === TOKEN_CONTRACTS[typedNetwork].USDC.toLowerCase();

          if (!isUSDT && !isUSDC) {
            return res.status(400).json({ error: 'Transaction is not a USDT/USDC transfer' });
          }

          // Parse token transfer event
          const iface = new ethers.Interface([
            'event Transfer(address indexed from, address indexed to, uint256 value)'
          ]);
          const transferEvent = receipt.logs
            .map(log => { try { return iface.parseLog(log); } catch { return null; } })
            .find(event => event?.name === 'Transfer');

          if (!transferEvent) {
            return res.status(400).json({ error: 'No valid token transfer found in transaction' });
          }

          // Check if receiver matches user's wallet
          if (transferEvent.args.to.toLowerCase() !== userWallet.public_key.toLowerCase()) {
            return res.status(400).json({ error: 'Transaction receiver does not match your wallet address' });
          }

          validationResult = {
            success: true,
            status: 'completed',
            amount: Number(ethers.formatUnits(transferEvent.args.value, 6)),
            from: transferEvent.args.from,
            token: isUSDT ? 'USDT' : 'USDC'
          };
        } catch (error: any) {
          console.error('Base validation error:', error);
          return res.status(400).json({ error: error.message || 'Failed to validate Base transaction' });
        }
        break;

      case 'SOL':
        try {
          const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');
          const tx = await connection.getTransaction(txId, { maxSupportedTransactionVersion: 0 }).catch(() => null);
          
          if (!tx) {
            return res.status(400).json({ error: 'Transaction not found on Solana network' });
          }

          if (!tx.meta || tx.meta.err) {
            return res.status(400).json({ error: 'Transaction failed on Solana network' });
          }

          // Get destination token account from post token balances
          const destinationInfo = tx.meta.postTokenBalances?.find(balance => 
            balance.uiTokenAmount?.uiAmount != null && balance.uiTokenAmount.uiAmount > 0
          );

          if (!destinationInfo?.uiTokenAmount?.uiAmount) {
            return res.status(400).json({ error: 'Could not determine transaction destination' });
          }

          // Get mint address (token contract)
          const mintAddress = tx.meta.preTokenBalances?.[0]?.mint;
          if (!mintAddress) {
            return res.status(400).json({ error: 'Could not determine token type' });
          }

          const isUSDT = mintAddress === TOKEN_CONTRACTS[typedNetwork].USDT;
          const isUSDC = mintAddress === TOKEN_CONTRACTS[typedNetwork].USDC;

          if (!isUSDT && !isUSDC) {
            return res.status(400).json({ error: 'Transaction is not a USDT/USDC transfer' });
          }

          // Get the owner of the destination token account
          const destinationTokenAccount = tx.transaction.message.staticAccountKeys[destinationInfo.accountIndex];
          const accountInfo = await connection.getAccountInfo(destinationTokenAccount);
          
          if (!accountInfo) {
            return res.status(400).json({ error: 'Could not fetch destination token account info' });
          }

          // The first 32 bytes of the account data contain the owner's public key
          const ownerPublicKey = new PublicKey(accountInfo.data.slice(32, 64));
          
          // Check if the token account owner matches user's wallet
          if (ownerPublicKey.toString() !== userWallet.public_key) {
            return res.status(400).json({ error: 'Transaction receiver does not match your wallet address' });
          }

          validationResult = {
            success: true,
            status: 'completed',
            amount: destinationInfo.uiTokenAmount.uiAmount,
            from: tx.transaction.message.staticAccountKeys[0].toString(),
            token: isUSDT ? 'USDT' : 'USDC'
          };
        } catch (error: any) {
          console.error('Solana validation error:', error);
          return res.status(400).json({ error: error.message || 'Failed to validate Solana transaction' });
        }
        break;

      case 'TRC-20':
        try {
          const tronWeb = createTronWeb();
          
          const tx = await tronWeb.trx.getTransaction(txId).catch(() => null);
          if (!tx) {
            return res.status(400).json({ error: 'Transaction not found on Tron network' });
          }

          if (!tx.raw_data?.contract?.[0]) {
            return res.status(400).json({ error: 'Invalid transaction structure' });
          }

          if (tx.ret?.[0]?.contractRet !== 'SUCCESS') {
            return res.status(400).json({ error: 'Transaction failed on Tron network' });
          }

          const contractData = tx.raw_data.contract[0];
          
          if (!contractData || contractData.type !== 'TriggerSmartContract') {
            return res.status(400).json({ error: 'Not a valid smart contract transaction' });
          }

          if (!contractData.parameter?.value) {
            return res.status(400).json({ error: 'Invalid contract parameter structure' });
          }

          const { contract_address, data } = contractData.parameter.value;
          if (!contract_address || !data) {
            return res.status(400).json({ error: 'Missing contract address or data' });
          }

          // Decode transfer function data
          const transferFunctionSelector = 'a9059cbb'; // transfer(address,uint256)
          if (!data.startsWith(transferFunctionSelector)) {
            return res.status(400).json({ error: 'Not a token transfer transaction' });
          }

          // Extract recipient address and amount from data
          const recipientHex = '0x' + data.slice(32, 72);
          const amountHex = '0x' + data.slice(72);
          
          const recipient = tronWeb.address.fromHex(recipientHex);
          const amount = parseInt(amountHex, 16);

          // Check if receiver matches user's wallet
          if (recipient !== userWallet.public_key) {
            console.log('Address mismatch:', {
              recipient,
              userWallet: userWallet.public_key
            });
            return res.status(400).json({ error: 'Transaction receiver does not match your wallet address' });
          }

          const contractAddress = tronWeb.address.fromHex(contract_address);
          const isUSDT = contractAddress === TOKEN_CONTRACTS[typedNetwork].USDT;
          const isUSDC = contractAddress === TOKEN_CONTRACTS[typedNetwork].USDC;

          if (!isUSDT && !isUSDC) {
            return res.status(400).json({ error: 'Not a USDT/USDC transfer' });
          }

          validationResult = {
            success: true,
            status: 'completed',
            amount: amount / 1e6, // USDT/USDC use 6 decimals
            from: tronWeb.address.fromHex(contractData.parameter.value.owner_address),
            token: isUSDT ? 'USDT' : 'USDC'
          };
        } catch (error: any) {
          console.error('Tron validation error:', error);
          return res.status(400).json({ error: error.message || 'Failed to validate Tron transaction' });
        }
        break;

      default:
        return res.status(400).json({ error: 'Unsupported network' });
    }

    if (validationResult?.success) {
      try {
        // Create transaction record and update balances in a transaction
        const transaction = await prisma.$transaction(async (tx) => {
          // Create deposit record
          const deposit = await tx.deposits.create({
            data: {
              user_id: userId,
              amount: validationResult.amount,
              status: validationResult.status,
              transaction_id: txId,
              network: network,
              from_address: validationResult.from,
              token: validationResult.token
            },
          });

          // Update user balance
          await tx.users.update({
            where: { id: userId },
            data: {
              balance: {
                increment: validationResult.amount,
              },
            },
          });

          // Update wallet balance
          await tx.wallets.update({
            where: { id: walletId },
            data: {
              balance: {
                increment: validationResult.amount,
              },
            },
          });

          return deposit;
        });

        return res.status(200).json({
          success: true,
          transaction,
        });
      } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to process transaction' });
      }
    }

    return res.status(400).json({ error: 'Transaction validation failed' });
  } catch (error: any) {
    console.error('Deposit validation error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
} 