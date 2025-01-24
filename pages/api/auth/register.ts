import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';

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

    // Create user
    const user = await prisma.users.create({
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

    return res.status(201).json(user);
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 