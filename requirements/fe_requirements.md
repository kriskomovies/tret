# Project Overview
This project involves building a crypto-based platform that allows users to deposit cryptocurrency, purchase packages, and earn dividends based on their deposits and referrals. The platform will also enable users to participate in GPU and CPU outsourcing, where users invest in computational power packages to earn passive income. Additionally, the system includes a referral program with a hierarchical tree structure to reward users for referring others. The frontend will be developed using Next.js and ShadCN for UI.

# Feature Requirements
1. Core Functionalities
System Wallet Creation:

Automatically generate system wallets for Solana, Tron (TRC-20), and Ethereum (Base network) upon user registration.
Integrate with popular browser wallets like MetaMask, Phantom Wallet, and TronLink for seamless user connection.
Deposit:

Users can deposit cryptocurrency into their system wallet.
Display supported cryptocurrencies (Solana, Tron, Ethereum).
Withdraw:

Users can withdraw their earnings/dividends.
Withdrawal requests should be tracked with status updates (e.g., Pending, Approved, Denied).
Earnings:

Calculate and display earnings based on the user’s chosen package.
Display dividends earned from referral rewards.
Referral System:

Multi-level referral system:
10% of the first deposit from direct referrals.
5% of the first deposit of second-level referrals.
2% for all further levels down the tree.
Display referral tree structure graphically in the dashboard.
Packages:

List available investment packages (e.g., Basic, Standard, Premium) with their expected returns.
Allow users to purchase packages using their deposited funds.
Customer Support:

Provide a support/contact page with a ticket-raising system for customer issues.
Dashboard:

Overview of wallet balance, earnings, referral statistics, deposit history, and withdrawals.
2. Pages
Index Page:

A landing page with an overview of the platform, features, and package details.
Dashboard:

User’s wallet balance.
Current package.
Referral statistics and earnings.
Buttons for Deposit and Withdraw.
Deposit Page:

Deposit form with wallet addresses for Solana, Tron, and Ethereum.
QR code generation for wallet addresses.
Deposit History Page:

List of deposits with details (amount, date, transaction ID, blockchain).
Withdraw Page:

Withdraw form for requesting payouts.
Withdrawal history with status (Pending, Approved, Denied).
Earnings Page:

Details of package-based earnings.
Referral-based earnings breakdown.
Team Page:

Referral tree visualization.
Packages Page:

List of available packages with details.
Package purchase functionality.
Customer Service Page:

Form for submitting customer support tickets.
Step-by-Step Development Plan
Step 1: Technology Stack Setup
Frontend:

Next.js: Framework for server-rendered React applications.
ShadCN: For reusable and customizable UI components.
TypeScript: For type-safe development.
Blockchain Integration:

Solana: Solana Web3.js SDK.
Ethereum: Ethers.js for Base network integration.
Tron: TronWeb for TRC-20 operations.
State Management:

Redux Toolkit (for global state).
Mock Data:

Use JSON server or a similar tool for backend API mocks.
Step 2: Authentication and Wallet Connection
Wallet Integration:

Implement wallet connection with MetaMask, Phantom Wallet, and TronLink.
Provide a unified wallet connection button.
System Wallet Generation:

Mock wallet generation for Solana, Tron, and Ethereum using placeholder addresses.
Authentication:

Use wallet address as the primary identifier for login.
Step 3: UI Development
ShadCN Setup:

Configure themes and components such as buttons, forms, modals, and tables.
Build Pages:

Design responsive and user-friendly pages for all key functionalities.
Use mock data to populate tables and forms.
Step 4: Mock Data Implementation
Create mock JSON APIs for:

Wallet balances.
Deposit history.
Withdrawal history.
Referral tree structure.
Example Mock Data:

json
Copy
Edit
{
  "user": {
    "wallets": {
      "solana": "5Gp...xyz",
      "tron": "TWa...abc",
      "ethereum": "0xAb...123"
    },
    "balance": {
      "solana": 10.5,
      "tron": 20.0,
      "ethereum": 5.8
    }
  },
  "referrals": [
    {
      "name": "John Doe",
      "level": 1,
      "amount": 50
    },
    {
      "name": "Jane Smith",
      "level": 2,
      "amount": 20
    }
  ]
}
Step 5: Referral System
Design a graphical tree structure for referrals using a library like D3.js or react-d3-tree.
Calculate dividends based on referral levels using the mock data.
Step 6: Mock Earnings Calculations
Simulate earnings calculations for:
Package-based returns.
Referral-based dividends.
Step 7: Testing
Test all pages using mock wallet connections and mock APIs.
Ensure responsiveness and user experience are polished.
Required Technology Stack
Framework: Next.js
UI Library: ShadCN (with Tailwind CSS)
Blockchain SDKs: Solana Web3.js, Ethers.js, TronWeb
State Management: Redux Toolkit
Visualization: D3.js or react-d3-tree
Testing: Jest + React Testing Library
Mock Data: JSON Server or Mock Service Worker (MSW)

# Relevant Documentation
User Flow Documentation:

A step-by-step guide on how users interact with the application.
API Documentation:

Mock API routes for deposits, withdrawals, and referrals.
Referral System Design:

Explanation of the referral calculation logic and tree structure.
Earnings Logic:

Description of package ROI and referral dividends calculation.
Frontend Architecture:

Folder structure and component hierarchy.

# Current File Structure
AI-CRYPTO/
├── .next/
├── app/
├── common/
├── components/
├── hooks/
├── lib/
├── models/
├── pages/
│   ├── api/
│   ├── collect/
│   ├── customer-service/
│   ├── dashboard/
│   ├── deposit/
│   ├── deposit-history/
│   ├── login/
│   ├── packages/
│   ├── register/
│   ├── team/
│   ├── transactions/
│   ├── withdraw/
│   ├── withdraw-requests/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx
│   └── not-found.tsx
├── public/
├── redux/
│   ├── features/
│   │   ├── app-state-slice.ts
│   ├── services/
│   │   ├── api.utils.ts
│   │   ├── auth.service.ts
│   │   ├── deposits.service.ts
│   │   ├── packages.service.ts
│   │   ├── users.service.ts
│   │   └── withdrawals.service.ts
│   └── store.ts
├── test/
├── utils/
├── .env
├── .eslintrc.js
├── .gitignore
├── .prettierrc.js
├── components.json
├── env.production
├── input.css
└── tsconfig.json
# Rules
.All new components should go in /components and be named like example-component.tsx unless otherwise specified
.All new pages go in /app


