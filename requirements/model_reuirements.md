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