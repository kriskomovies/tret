import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import { generateWallets } from '@/lib/wallet';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, email, password, phonenumber, referral } = req.body;

    // Check if user exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email },
          { username },
          ...(phonenumber ? [{ phonenumber }] : []),
        ],
      },
      select: {
        id: true,
        email: true,
        username: true,
        phonenumber: true
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email, username, or phone number already exists',
      });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user and wallets in a transaction
    const result = await prisma.$transaction(async (tx) => {
      try {
        // Create user
        const user = await tx.users.create({
          data: {
            username,
            email,
            password: hashedPassword,
            phonenumber,
            referral: referral ? parseInt(referral) : null,
          },
          select: {
            id: true,
            username: true,
            email: true,
            phonenumber: true,
            balance: true,
            status: true,
            created_at: true
          }
        });

        // Generate wallets
        const wallets = await generateWallets(user.id);

        // Create all wallets in the database
        await tx.wallets.createMany({
          data: wallets,
        });

        // Fetch created wallets
        const createdWallets = await tx.wallets.findMany({
          where: {
            user_id: user.id
          },
          select: {
            network: true,
            public_key: true,
          }
        });

        return {
          user,
          wallets: createdWallets
        };
      } catch (error) {
        console.error('Transaction error:', error);
        throw error; // This will trigger a rollback
      }
    });

    return res.status(201).json({
      message: 'Registration successful',
      user: {
        ...result.user,
        wallets: result.wallets
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
} 