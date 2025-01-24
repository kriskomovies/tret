Updated Models and Relationships for Backend Architecture
1. User
Fields: id, username, email, phoneNumber, password, referral (foreign key to another user), balance, lastActivity, status, membership (foreign key to the packages table).
Relationships:
One-to-Many with Wallet: Each user can have multiple wallets.
One-to-Many with Deposit: Each user can have multiple deposits.
One-to-Many with Withdrawal: Each user can have multiple withdrawals.
Self-Referencing Many-to-Many: Users have a referral system where a user can refer others.
2. Wallet
Fields: id, network (e.g., Solana, Tron, Ethereum), publicKey, privateKey, balance, userId (foreign key to User).
Relationships:
Many-to-One with User: Each wallet belongs to a single user.
3. Package
Fields: id, name, price, dailyIncome.
Relationships:
One-to-Many with User: A user can only have one active package at a time, but many users can belong to the same package.
4. Deposit
Fields: id, userId (foreign key to User), amount, transactionId, status (Pending, Confirmed, Rejected), createdAt, updatedAt.
Relationships:
Many-to-One with User: Each deposit is tied to a single user.
5. Withdrawal
Fields: id, userId (foreign key to User), userWalletId (foreign key to Wallet), withdrawWallet (external address), amount, status (Pending, Approved, Rejected), network, createdAt, updatedAt.
Relationships:
Many-to-One with User: Each withdrawal is tied to a single user.
Many-to-One with Wallet: The user specifies a wallet on the relevant blockchain network for the withdrawal.
6. Application Wallet
Fields: id, network (e.g., Solana, Tron, Ethereum), publicKey, privateKey, balance, createdAt, updatedAt.
Purpose: Tracks the overall balance of the application for each blockchain network.
Relationships:
Standalone: Interacts with deposits and withdrawals for balance updates but does not have direct foreign key relationships.
Repository Pattern Integration
Why Use the Repository Pattern?
The repository pattern separates the data access layer from the business logic layer, enabling:

Cleaner code and easier testing.
Swappable data sources (e.g., switch from Supabase to another database without rewriting logic).
Centralized data access logic for reusability.
Repository Pattern Implementation
Structure:

Repository Layer: Each model (e.g., User, Wallet, Deposit) has a dedicated repository class responsible for querying the database (e.g., UserRepository).
Service Layer: Services interact with repositories to execute business logic (e.g., calculating referral earnings, handling deposits/withdrawals).
Controller Layer: API routes interact with services and handle HTTP responses.
Example Repository Implementation (Using Prisma)

User Repository:

typescript
Copy
Edit
// repositories/user.repository.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserRepository {
  async findById(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: { wallets: true, deposits: true, withdrawals: true },
    });
  }

  async create(data: any) {
    return prisma.user.create({ data });
  }

  async update(userId: number, data: any) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}
Deposit Repository:

typescript
Copy
Edit
// repositories/deposit.repository.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class DepositRepository {
  async findByUserId(userId: number) {
    return prisma.deposit.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: any) {
    return prisma.deposit.create({ data });
  }
}
Service Layer Example:

typescript
Copy
Edit
// services/user.service.ts
import { UserRepository } from "../repositories/user.repository";

const userRepository = new UserRepository();

export class UserService {
  async getUserDetails(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User not found");
    return user;
  }

  async registerUser(data: any) {
    return userRepository.create(data);
  }
}
Controller Layer Example:

typescript
Copy
Edit
// pages/api/users/[id].ts
import { UserService } from "../../../services/user.service";

const userService = new UserService();

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const user = await userService.getUserDetails(Number(id));
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}