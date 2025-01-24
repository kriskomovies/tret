import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const ADMIN_PHRASE = process.env.ADMIN_PHRASE || 'test';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, email, password, phonenumber, referralCode } = req.body;

    // Check if user already exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email },
          { username },
          phonenumber ? { phonenumber } : {},
        ],
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Determine if this is an admin registration
    const isAdmin = referralCode === ADMIN_PHRASE;

    // If this is an admin registration, check if an admin already exists
    if (isAdmin) {
      const existingAdmin = await prisma.users.findFirst({
        where: { 
          role: 'admin'
        },
      });

      if (existingAdmin) {
        return res.status(400).json({ error: 'Admin account already exists' });
      }
    }

    // Find referrer if referral code provided and not an admin registration
    let referrerId = null;
    if (referralCode && !isAdmin) {
      const referrer = await prisma.users.findFirst({
        where: { username: referralCode },
      });
      if (referrer) {
        referrerId = referrer.id;
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.users.create({
      data: {
        username,
        email,
        password: hashedPassword,
        phonenumber,
        referral: referrerId,
        status: 'Active',
        role: isAdmin ? 'admin' : 'user',
      },
      select: {
        id: true,
        username: true,
        email: true,
        phonenumber: true,
        balance: true,
        status: true,
        role: true,
      },
    });

    // If there's a referrer and not an admin registration, create the referral relationship
    if (referrerId && !isAdmin) {
      await prisma.members.create({
        data: {
          user_id: referrerId,
          member_id: user.id,
        },
      });
    }

    return res.status(201).json({
      message: `${isAdmin ? 'Admin' : 'User'} registered successfully`,
      user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 