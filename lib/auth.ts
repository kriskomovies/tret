import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface Session {
  userId: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

export async function getSession(req: NextApiRequest): Promise<Session | null> {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    if (!decoded?.userId) return null;

    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    if (!user) return null;

    return {
      userId: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.role === 'admin',
    };
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function requireAuth(handler: Function) {
  return async (req: NextApiRequest, res: any) => {
    const session = await getSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return handler(req, res, session);
  };
} 