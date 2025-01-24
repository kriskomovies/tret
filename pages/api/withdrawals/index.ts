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
      return getWithdrawals(req, res);
    case 'POST':
      return createWithdrawal(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Get user's withdrawals
async function getWithdrawals(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const withdrawals = await prisma.withdrawals.findMany({
      where: {
        user_id: session.userId,
      },
      include: {
        wallets: {
          select: {
            network: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return res.status(200).json(withdrawals);
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Create a new withdrawal request
async function createWithdrawal(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { amount, walletId, withdrawWallet, network } = req.body;

    // Validate required fields
    if (!amount || !walletId || !withdrawWallet || !network) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get user's wallet
    const wallet = await prisma.wallets.findFirst({
      where: {
        id: walletId,
        user_id: session.userId,
      },
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Check if user has enough balance
    if (wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Start transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create withdrawal request
      const withdrawal = await prisma.withdrawals.create({
        data: {
          user_id: session.userId,
          user_wallet_id: walletId,
          withdraw_wallet: withdrawWallet,
          amount,
          network,
          status: 'Pending',
        },
      });

      // Update wallet balance
      await prisma.wallets.update({
        where: { id: walletId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      return withdrawal;
    });

    return res.status(201).json({
      message: 'Withdrawal request created successfully',
      withdrawal: result,
    });
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Note: This would typically be an admin-only endpoint
export async function processWithdrawal(withdrawalId: number, status: 'Approved' | 'Rejected') {
  return prisma.$transaction(async (prisma) => {
    // Get withdrawal details
    const withdrawal = await prisma.withdrawals.findUnique({
      where: { id: withdrawalId },
      include: {
        wallets: true,
      },
    });

    if (!withdrawal || withdrawal.status !== 'Pending') {
      throw new Error('Invalid withdrawal or already processed');
    }

    // Update withdrawal status
    await prisma.withdrawals.update({
      where: { id: withdrawalId },
      data: { status },
    });

    // If rejected, refund the amount to user's wallet
    if (status === 'Rejected') {
      await prisma.wallets.update({
        where: { id: withdrawal.user_wallet_id },
        data: {
          balance: {
            increment: withdrawal.amount,
          },
        },
      });
    }

    // If approved, update platform wallet
    if (status === 'Approved') {
      await prisma.application_wallets.update({
        where: { network: withdrawal.network },
        data: {
          balance: {
            decrement: withdrawal.amount,
          },
        },
      });
    }

    return withdrawal;
  });
} 