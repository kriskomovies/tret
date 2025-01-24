import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession(req);
    if (!session?.isAdmin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { status, page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where = status ? { status: status as string } : {};

    const [withdrawals, total] = await Promise.all([
      prisma.withdrawals.findMany({
        where,
        include: {
          user: {
            select: {
              username: true,
              email: true,
            },
          },
          wallets: {
            select: {
              network: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip,
        take,
      }),
      prisma.withdrawals.count({ where }),
    ]);

    return res.status(200).json({
      withdrawals,
      pagination: {
        total,
        pages: Math.ceil(total / take),
        currentPage: parseInt(page as string),
        limit: take,
      },
    });
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 