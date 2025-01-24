import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      return getDeposits(req, res);
    case 'POST':
      return createDeposit(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Get user's deposits
async function getDeposits(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const deposits = await prisma.deposits.findMany({
      where: {
        user_id: session.userId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return res.status(200).json(deposits);
  } catch (error) {
    console.error('Error fetching deposits:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Create a new deposit
async function createDeposit(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { amount, transactionId, network } = req.body;

    // Validate required fields
    if (!amount || !transactionId || !network) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if transaction ID already exists
    const existingDeposit = await prisma.deposits.findUnique({
      where: { transaction_id: transactionId },
    });

    if (existingDeposit) {
      return res.status(400).json({ error: 'Transaction ID already exists' });
    }

    // Create deposit record
    const deposit = await prisma.deposits.create({
      data: {
        user_id: session.userId,
        amount,
        transaction_id: transactionId,
        status: 'Pending',
      },
    });

    return res.status(201).json({
      message: 'Deposit request created successfully',
      deposit,
    });
  } catch (error) {
    console.error('Error creating deposit:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Note: This would typically be an admin-only endpoint
export async function confirmDeposit(depositId: number) {
  return prisma.$transaction(async (prisma) => {
    // Get deposit details
    const deposit = await prisma.deposits.findUnique({
      where: { id: depositId },
      include: {
        users: true,
      },
    });

    if (!deposit || deposit.status !== 'Pending') {
      throw new Error('Invalid deposit or already processed');
    }

    // Update deposit status
    await prisma.deposits.update({
      where: { id: depositId },
      data: { status: 'Confirmed' },
    });

    // Update user's balance
    await prisma.users.update({
      where: { id: deposit.user_id },
      data: {
        balance: {
          increment: deposit.amount,
        },
      },
    });

    return deposit;
  });
} 