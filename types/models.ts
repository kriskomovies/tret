export interface User {
  id: number;
  username: string;
  email: string;
  phonenumber?: string;
  referral?: number | null;
  balance: number;
  last_activity: string;
  status: 'Active' | 'Suspended';
  membership?: number;
  created_at: string;
}

export interface Package {
  id: number;
  name: string;
  price: number;
  daily_income: number;
  created_at: string;
}

export interface Wallet {
  id: number;
  user_id: number;
  network: string;
  public_key: string;
  balance: number;
  created_at: string;
}

export interface Deposit {
  id: number;
  user_id: number;
  amount: number;
  transaction_id: string;
  status: 'Pending' | 'Confirmed' | 'Rejected';
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: number;
  user_id: number;
  member_id: number;
  created_at: string;
}

export interface Withdrawal {
  id: number;
  user_id: number;
  user_wallet_id: number;
  withdraw_wallet: string;
  amount: number;
  network: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
  updated_at: string;
}

export interface ApplicationWallet {
  id: number;
  network: string;
  balance: number;
}

// Dashboard specific types
export interface DashboardStats {
  total_profit: number;
  total_order: number;
  impression: number;
  profit_change: number;
  order_change: number;
  impression_change: number;
}

export interface TopProduct {
  id: number;
  name: string;
  sold: number;
  change: number;
  image?: string;
} 