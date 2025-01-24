import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const userId = parseInt(req.query.userId as string);

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const wallets = await prisma.wallets.findMany({
      where: {
        user_id: userId,
      },
      select: {
        id: true,
        network: true,
        public_key: true,
        private_key: true,
        balance: true,
      },
    });

    return res.status(200).json(wallets);
  } catch (error) {
    console.error('Error fetching wallets:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 