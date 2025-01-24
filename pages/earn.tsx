import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Wallet, Clock, Award, TrendingUp, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for mining history
const mockMiningHistory = [
  {
    id: 1,
    date: '2024-03-01T10:00:00Z',
    token: 'ETH',
    amount: 0.56,
    network: 'ETH-Base',
  },
  {
    id: 2,
    date: '2024-02-29T10:00:00Z',
    token: 'SOL',
    amount: 1.2,
    network: 'Solana',
  },
  {
    id: 3,
    date: '2024-02-28T10:00:00Z',
    token: 'TRX',
    amount: 100,
    network: 'Tron',
  },
];

// Mock data for user's wallets
const userWallets = [
  {
    id: 'eth',
    network: 'ETH-Base',
    tokenSymbol: 'ETH',
    balance: 5.34,
    dailyEarning: 0.56,
    icon: <Wallet className="w-6 h-6 text-blue-500" />,
  },
  {
    id: 'sol',
    network: 'Solana',
    tokenSymbol: 'SOL',
    balance: 12.78,
    dailyEarning: 1.2,
    icon: <Wallet className="w-6 h-6 text-purple-500" />,
  },
  {
    id: 'trc',
    network: 'Tron',
    tokenSymbol: 'TRX',
    balance: 890.25,
    dailyEarning: 100,
    icon: <Wallet className="w-6 h-6 text-red-500" />,
  },
];

export default function EarnPage() {
  const [miningProgress, setMiningProgress] = useState(75);
  const [timeRemaining, setTimeRemaining] = useState('5h 23m 45s');
  const [isEligible, setIsEligible] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [streak, setStreak] = useState(3);

  useEffect(() => {
    // Simulate progress updates
    const interval = setInterval(() => {
      setMiningProgress((prev) => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          setIsEligible(true);
          return 100;
        }
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleClaimRewards = async () => {
    if (!isEligible) return;

    setIsCollecting(true);
    // Simulate collection animation and API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsCollecting(false);
    setMiningProgress(0);
    setIsEligible(false);
    setStreak((prev) => prev + 1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Claim Your Rewards</h1>
        <p className="text-lg text-muted-foreground">
          Every 24 hours, your wallet accumulates rewards. Click the button below to collect your earnings and keep mining!
        </p>
        {!isEligible && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Next mining opportunity: {timeRemaining}</span>
          </div>
        )}
      </div>

      {/* Mining Status Display */}
      <Card>
        <CardHeader>
          <CardTitle>Mining Progress</CardTitle>
          <CardDescription>Watch your rewards grow in real-time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress 
            value={miningProgress} 
            className="h-4 bg-secondary"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Mining Progress</div>
              <div className="text-2xl font-bold">{miningProgress}%</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Daily Streak</div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold">{streak} Days</span>
              </div>
            </div>
          </div>

          {/* Mining Button */}
          <Button
            size="lg"
            className={cn(
              "w-full py-6 text-xl font-bold transition transform",
              isEligible ? "bg-gradient-to-r from-primary/80 to-primary hover:scale-[1.02]" : "bg-muted",
              isCollecting && "animate-pulse"
            )}
            onClick={handleClaimRewards}
            disabled={!isEligible || isCollecting}
          >
            <div className="flex items-center gap-2">
              <Coins className="w-6 h-6" />
              <span>
                {isCollecting ? "Collecting Rewards..." : isEligible ? "Mine Now" : "Come Back Later"}
              </span>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Rewards Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Your Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userWallets.map((wallet) => (
            <Card key={wallet.id} className="relative overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  {wallet.icon}
                  <span className="font-medium">{wallet.network}</span>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">
                    {wallet.balance} {wallet.tokenSymbol}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>+{wallet.dailyEarning} {wallet.tokenSymbol} / day</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mining History */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Mining History</h2>
        <Card>
          <CardContent className="pt-6">
            {mockMiningHistory.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Network</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMiningHistory.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{formatDate(entry.date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{entry.network}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {entry.amount} {entry.token}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No mining activity yet. Start earning today!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 