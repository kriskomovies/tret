import { Keypair } from '@solana/web3.js';
import { ethers } from 'ethers';
import { createCipheriv, randomBytes, scryptSync } from 'crypto';

// Create a proper encryption key using scrypt
function getDerivedKey(secret: string) {
  // Generate a 32-byte key using scrypt
  return scryptSync(secret, 'salt', 32);
}

function encryptPrivateKey(privateKey: string): string {
  try {
    const key = getDerivedKey(process.env.JWT_SECRET || 'your-secret-key-here');
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    
    // Convert to Buffer if it's not already
    const privateKeyBuffer = Buffer.from(privateKey);
    
    // Encrypt and combine IV with encrypted data
    const encrypted = Buffer.concat([
      iv,
      cipher.update(privateKeyBuffer),
      cipher.final()
    ]);
    
    // Return as base64 for shorter string
    return encrypted.toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt private key');
  }
}

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
        private_key: encryptPrivateKey(Buffer.from(solanaKeypair.secretKey).toString('hex')),
        balance: 0.0,
      },
      {
        user_id: userId,
        network: 'ETH-Base',
        public_key: ethereumWallet.address,
        private_key: encryptPrivateKey(ethereumWallet.privateKey),
        balance: 0.0,
      },
      {
        user_id: userId,
        network: 'TRC-20',
        public_key: tronWallet.address,
        private_key: encryptPrivateKey(tronWallet.privateKey),
        balance: 0.0,
      },
    ];
  } catch (error) {
    console.error('Error generating wallets:', error);
    throw new Error('Failed to generate wallets');
  }
} 