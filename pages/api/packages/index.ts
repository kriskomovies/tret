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
      return getPackages(req, res);
    case 'POST':
      return purchasePackage(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Get all available packages
async function getPackages(req: NextApiRequest, res: NextApiResponse) {
  try {
    const packages = await prisma.packages.findMany({
      orderBy: {
        price: 'asc',
      },
    });

    return res.status(200).json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Purchase a package
async function purchasePackage(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { packageId, walletId } = req.body;

    // Get package details
    const package_ = await prisma.packages.findUnique({
      where: { id: packageId },
    });

    if (!package_) {
      return res.status(404).json({ error: 'Package not found' });
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
    if (wallet.balance < package_.price) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Start transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Update user's wallet balance
      await prisma.wallets.update({
        where: { id: walletId },
        data: {
          balance: {
            decrement: package_.price,
          },
        },
      });

      // Update user's membership
      const user = await prisma.users.update({
        where: { id: session.userId },
        data: {
          membership: packageId,
        },
        include: {
          packages: true,
        },
      });

      // Update platform wallet
      await prisma.application_wallets.update({
        where: { network: wallet.network },
        data: {
          balance: {
            increment: package_.price,
          },
        },
      });

      return user;
    });

    return res.status(200).json({
      message: 'Package purchased successfully',
      user: result,
    });
  } catch (error) {
    console.error('Error purchasing package:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 