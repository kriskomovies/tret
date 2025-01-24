# Project overview
This project is a crypto-based platform with the following key features:

User Management: Users can register, log in, and manage their profiles. Each user has an associated wallet (or multiple wallets), referral relationships, and membership packages.
Wallets: Each user can have multiple wallets for different blockchain networks (e.g., Solana, Tron, Ethereum). Wallet details such as public/private keys and individual balances are stored in the database.
Packages: Users can purchase packages (e.g., daily income plans) which define how much they earn daily.
Deposits & Withdrawals: Users can deposit funds to their wallets and request withdrawals to external wallets. Both deposits and withdrawals have statuses (e.g., Pending, Confirmed / Approved, Rejected).
Referrals & Team Building: A user can refer others, creating a hierarchy tracked in a many-to-many “members” table (or a direct referral field), enabling reward/commission structures.
Application Wallets: The platform itself has wallets to manage platform-wide assets on different blockchains.
Supabase Storage: Files (images, documents, etc.) are stored in Supabase buckets, enabling easy file uploads and management.

# Tech Stack
Next.js

Frontend: User-facing pages and components built with React.
Backend (API Routes): Next.js also provides a backend environment via the /api folder (or the new App Router if using Next.js 13+).
Rendering: Server-side rendering (SSR) or static site generation (SSG) where beneficial.
Supabase

Database: Leverage Supabase’s hosted Postgres database.
Storage: Use Supabase buckets (e.g., “treta”) for file uploads.
Authentication (optional): You could use Supabase Auth, but since you already have a users table, you may handle authentication manually or integrate Supabase Auth as needed.
Prisma

ORM: Prisma can connect to Supabase’s Postgres database, providing a type-safe way to query and mutate your data.
Schema Definition: Use schema.prisma to map the existing tables (users, packages, wallets, deposits, members, withdrawals, application_wallets).
Repository Pattern: While Prisma already acts as a data access layer, you can wrap Prisma calls in repositories to keep your domain logic separate and maintain a cleaner architecture.
# Tables and buckets already created

Supabase storage and bucket already created
Supabase storage bucket: "treta"
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    phonenumber VARCHAR(20) UNIQUE,
    password VARCHAR(255) NOT NULL,
    referral INT REFERENCES users(id) ON DELETE SET NULL, -- Referring user ID
    balance DECIMAL(20, 2) DEFAULT 0.0, -- Overall balance for the user
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Active', -- e.g., Active, Suspended
    membership INT REFERENCES packages(id) ON DELETE SET NULL, -- Current package
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Packages Table: Store available membership packages
CREATE TABLE packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(20, 2) NOT NULL,
    daily_income DECIMAL(20, 2) NOT NULL, -- Daily income for the package
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wallets Table: Store details of wallets associated with users
CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE, -- Wallet belongs to a user
    network VARCHAR(50) NOT NULL, -- Blockchain network (e.g., Solana, Tron, Ethereum)
    public_key VARCHAR(255) NOT NULL UNIQUE, -- Public key of the wallet
    private_key VARCHAR(255) NOT NULL, -- Encrypted private key of the wallet
    balance DECIMAL(20, 8) DEFAULT 0.0, -- Wallet-specific balance
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deposits Table: Track deposits made by users
CREATE TABLE deposits (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(20, 2) NOT NULL,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Members Table: Represent many-to-many relationships for referrals
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE, -- The user who invited others
    member_id INT REFERENCES users(id) ON DELETE CASCADE, -- The referred user
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE withdrawals (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    user_wallet_id INT REFERENCES wallets(id) ON DELETE CASCADE,
    withdraw_wallet VARCHAR(255) NOT NULL,
    amount DECIMAL(20, 2) NOT NULL,
    network VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE application_wallets (
    id SERIAL PRIMARY KEY,
    network VARCHAR(50) NOT NULL UNIQUE, 
    balance DECIMAL(20, 8) DEFAULT 0.0
);

# Requirements
User Accounts

CRUD operations for users (registration, login, profile updates).
Manage user membership status, referral links, and overall balance.
Wallets Management

Users can create or link multiple wallets.
Store network details, keys, and balances securely.
Deposits and Withdrawals

Ability to initiate and track deposits (with statuses like Pending, Confirmed, Rejected).
Ability to initiate and track withdrawals to external addresses (with statuses like Pending, Approved, Rejected).
Automatic or manual confirmation process.
Packages

Store membership packages with pricing, daily income rate, and potential duration.
Users purchase packages and earn daily income or dividends.
Referrals & Members

Maintain a tree/hierarchy or many-to-many relationship of who referred whom.
Possibly reward users with referral commissions based on deposit or package purchase.
Application Wallets

A set of platform-owned wallets for each blockchain network.
Manage or track the overall platform balance and transactions.
Supabase Storage

Support file uploads to a designated bucket (e.g., “treta”).
Users or admins can upload documents, images (possibly for KYC or profile avatars).
API Endpoints

Must provide REST endpoints to handle all the above functionalities.
Must secure the endpoints with proper authentication and authorization checks.


Admin(s) can manage user status, confirm or reject deposits/withdrawals, and oversee referral structures.
# Documentation 
## Example of uploading files to supabase storage
import {createClient} from '@supabase/supabase.js'

// Create supabase client
import { createClient } from 'supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

// Upload file to supabase storage
const { data, error } = await supabase.storage.from('images').upload('file_path', file)
if (error) {
// Handle error
} else {
// Handle success
}

# Project structure project/
├── prisma/
│   ├── schema.prisma  // Prisma schema 
├── src/
│   ├── pages/         // Next.js pages (if using the Pages Router)
│   │   ├── api/
│   │   │   ├── users/
│   │   │   │   └── index.ts  // e.g. user CRUD
│   │   │   ├── wallets/
│   │   │   │   └── index.ts
│   │   │   └── ...
│   │   └── ...
│   ├── app/           // Next.js 13+ App Router (if using the App Router approach)
│   ├── repositories/  // Repository classes (UserRepo, WalletRepo, etc.)
│   ├── services/      // Business logic that calls repositories
│   ├── components/    // Shared React components
│   ├── utils/         // Utility functions, constants, etc.
│   └── ...
├── .env               // Store Supabase keys, environment variables
├── package.json
├── next.config.js
└── tsconfig.json
