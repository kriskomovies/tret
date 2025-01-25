import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession(req);
    if (!session?.userId) {
      // return res.status(401).json({ error: 'Unauthorized' });
    }

    const deposits = await prisma.deposits.findMany({
      where: {
        user_id: 6,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return res.status(200).json(deposits);
  } catch (error) {
    console.error('Failed to fetch deposit history:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 