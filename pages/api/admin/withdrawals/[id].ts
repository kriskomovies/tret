import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';
import { processWithdrawal } from '../../withdrawals';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession(req);
    if (!session?.isAdmin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const withdrawalId = parseInt(req.query.id as string);
    const { status } = req.body;

    if (!withdrawalId || !status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }

    const result = await processWithdrawal(withdrawalId, status);

    return res.status(200).json({
      message: `Withdrawal ${status.toLowerCase()} successfully`,
      withdrawal: result,
    });
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    if (error instanceof Error && error.message === 'Invalid withdrawal or already processed') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
} 