import { Keypair } from '@solana/web3.js';
import { ethers } from 'ethers';

export async function generateWallets(userId: number) {
  try {
    // Generate Solana wallet
    const solanaKeypair = Keypair.generate();
    
    // Generate Ethereum (Base) wallet
    const ethereumWallet = ethers.Wallet.createRandom();
    
    // Generate Tron wallet using ethers
    const tronWallet = ethers.Wallet.createRandom();

    return [
      {
        user_id: userId,
        network: 'SOL',
        public_key: solanaKeypair.publicKey.toString(),
        private_key: Buffer.from(solanaKeypair.secretKey).toString('hex'),
        balance: 0.0,
      },
      {
        user_id: userId,
        network: 'ETH-Base',
        public_key: ethereumWallet.address,
        private_key: ethereumWallet.privateKey,
        balance: 0.0,
      },
      {
        user_id: userId,
        network: 'TRC-20',
        public_key: tronWallet.address,
        private_key: tronWallet.privateKey,
        balance: 0.0,
      },
    ];
  } catch (error) {
    console.error('Error generating wallets:', error);
    throw new Error('Failed to generate wallets');
  }
} 