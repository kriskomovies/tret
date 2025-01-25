import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { address, network, publicKey } = req.body;

    // Find user by wallet address
    let user = await prisma.users.findFirst({
      where: {
        wallets: {
          some: {
            public_key: publicKey,
            network: network,
          },
        },
      },
      include: {
        wallets: true,
      },
    });

    if (!user) {
      // Create new user if wallet not found
      user = await prisma.users.create({
        data: {
          username: `${network}_${address.slice(0, 8)}`,
          email: `${address.slice(0, 8)}@wallet.user`,
          password: '', // No password for wallet users
          wallets: {
            create: {
              network,
              public_key: publicKey,
              private_key: '', // We don't store private keys
              balance: 0.0,
            },
          },
        },
        include: {
          wallets: true,
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, address },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Update last activity
    await prisma.users.update({
      where: { id: user.id },
      data: { last_activity: new Date() },
    });

    return res.status(200).json({
      message: 'Login successful',
      user,
      token,
    });
  } catch (error) {
    console.error('Wallet login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 