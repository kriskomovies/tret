import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Wallet, ArrowUpRight, ArrowDownRight, Package, ExternalLink, Plus } from 'lucide-react';
import { MemberTree } from '@/components/dashboard/MemberTree';
import { DashboardLoadingState } from '@/components/dashboard/LoadingState';
import { AppDispatch, RootState } from '@/redux/store';
import { User } from '@/types/models';
import { useGetUserWalletsQuery } from '@/redux/services/wallets.service';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';

// Mock user data for the tree visualization
const mockUsers: User[] = [
  {
    id: 1,
    username: 'John Doe',
    email: 'john@example.com',
    balance: 5000,
    referral: null,
    created_at: '2024-01-01',
    last_activity: '2024-03-01',
    status: 'Active',
  },
  {
    id: 2,
    username: 'Alice Smith',
    email: 'alice@example.com',
    balance: 3000,
    referral: 1,
    created_at: '2024-01-15',
    last_activity: '2024-03-01',
    status: 'Active',
  },
  {
    id: 3,
    username: 'Bob Johnson',
    email: 'bob@example.com',
    balance: 2500,
    referral: 1,
    created_at: '2024-01-20',
    last_activity: '2024-03-01',
    status: 'Active',
  },
  {
    id: 4,
    username: 'Carol White',
    email: 'carol@example.com',
    balance: 1800,
    referral: 2,
    created_at: '2024-02-01',
    last_activity: '2024-03-01',
    status: 'Active',
  },
  {
    id: 5,
    username: 'Dave Brown',
    email: 'dave@example.com',
    balance: 2200,
    referral: 2,
    created_at: '2024-02-05',
    last_activity: '2024-03-01',
    status: 'Active',
  },
  {
    id: 6,
    username: 'Eve Wilson',
    email: 'eve@example.com',
    balance: 1500,
    referral: 3,
    created_at: '2024-02-10',
    last_activity: '2024-03-01',
    status: 'Active',
  },
];

// Mock recent activity data
const recentActivity = [
  { id: 1, type: 'Deposit', amount: 200, date: '2024-03-01', status: 'Completed' },
  { id: 2, type: 'Withdrawal', amount: 150, date: '2024-02-28', status: 'Pending' },
  { id: 3, type: 'Deposit', amount: 500, date: '2024-02-27', status: 'Completed' },
  { id: 4, type: 'Withdrawal', amount: 300, date: '2024-02-26', status: 'Completed' },
];

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.appState.user.id);
  const { data: wallets, isLoading } = useGetUserWalletsQuery(userId);

  // Update the walletData array to use real data
  const walletData = wallets?.map(wallet => ({
    network: wallet.network,
    mainNetwork: wallet.network === 'SOL' ? 'Solana' : 
                 wallet.network === 'ETH-Base' ? 'Ethereum' : 'Tron',
    balance: Number(wallet.balance),
    address: wallet.public_key,
    icon: <Wallet className={`w-5 h-5 text-${
      wallet.network === 'SOL' ? 'blue' : 
      wallet.network === 'ETH-Base' ? 'purple' : 'red'
    }-500`} />,
    color: wallet.network === 'SOL' ? 'blue' : 
           wallet.network === 'ETH-Base' ? 'purple' : 'red'
  })) || [];

  // Calculate total referral earnings
  const calculateReferralEarnings = (users: User[], userId: number, level: number = 1): number => {
    const directReferrals = users.filter(user => user.referral === userId);
    let totalEarnings = 0;

    directReferrals.forEach(referral => {
      const percentage = level === 1 ? 0.10 : level === 2 ? 0.05 : 0.02;
      totalEarnings += referral.balance * percentage;
      totalEarnings += calculateReferralEarnings(users, referral.id, level + 1);
    });

    return totalEarnings;
  };

  const rootUser = mockUsers.find(user => !user.referral);
  const totalReferralEarnings = rootUser ? calculateReferralEarnings(mockUsers, rootUser.id) : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}

      {/* Wallet Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {walletData.map((wallet) => (
          <Card 
            key={wallet.network}
            className="relative overflow-hidden transition-all duration-200 hover:shadow-lg"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {wallet.icon}
                  <CardTitle className="text-lg font-bold">
                    {wallet.mainNetwork}
                  </CardTitle>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-${wallet.color}-500 border-${wallet.color}-200 bg-${wallet.color}-50`}
                >
                  {wallet.network}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="mt-2 space-y-1">
                <p className="text-2xl font-bold text-gray-900">
                  ${wallet.balance.toLocaleString()}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <p className="font-mono">{wallet.address}</p>
                </div>
              </div>
            </CardContent>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`text-${wallet.color}-500 hover:text-${wallet.color}-600 hover:bg-${wallet.color}-50 gap-1`}
                >
                  <Plus className="w-4 h-4" />
                  Deposit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`text-${wallet.color}-500 hover:text-${wallet.color}-600 hover:bg-${wallet.color}-50 gap-1`}
                >
                  <ExternalLink className="w-4 h-4" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-4 h-4" /> Package Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary mb-2">$0</p>
            <Progress value={75} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">75% of monthly target</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4" /> Referral Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary mb-2">${totalReferralEarnings.toLocaleString()}</p>
            <Progress value={60} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">From {mockUsers.length - 1} referrals</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Tree and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-[500px] flex flex-col">
          <CardHeader>
            <CardTitle>Member Network</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <MemberTree data={mockUsers} className="bg-gray-50 rounded-lg h-full" />
          </CardContent>
        </Card>

        <Card className="h-[500px] flex flex-col">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableCell className="w-1/4 pl-4">Type</TableCell>
                  <TableCell className="w-1/4">Amount</TableCell>
                  <TableCell className="w-1/4">Date</TableCell>
                  <TableCell className="w-1/4 pr-4">Status</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="flex items-center gap-2 pl-4">
                      {activity.type === 'Deposit' ? (
                        <ArrowDownRight className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-red-500" />
                      )}
                      {activity.type}
                    </TableCell>
                    <TableCell>${activity.amount}</TableCell>
                    <TableCell>{activity.date}</TableCell>
                    <TableCell className="pr-4">
                      <Badge variant={activity.status === 'Completed' ? 'default' : 'secondary'}>
                        {activity.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 