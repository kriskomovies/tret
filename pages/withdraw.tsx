import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Wallet, ArrowRight, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

// Mock data for user's wallets
const userWallets = [
  {
    id: 'eth',
    network: 'ETH-Base',
    tokenSymbol: 'ETH',
    balance: 5.34,
    address: '0x1234...5678',
    icon: <Wallet className="w-4 h-4 text-blue-500" />,
  },
  {
    id: 'sol',
    network: 'Solana',
    tokenSymbol: 'SOL',
    balance: 12.78,
    address: 'Sol1234...5678',
    icon: <Wallet className="w-4 h-4 text-purple-500" />,
  },
  {
    id: 'trc',
    network: 'Tron',
    tokenSymbol: 'TRX',
    balance: 890.25,
    address: 'TRX1234...5678',
    icon: <Wallet className="w-4 h-4 text-red-500" />,
  },
];

// Mock data for withdrawal history
const withdrawalHistory = [
  {
    id: 1,
    date: '2024-03-01T10:00:00Z',
    network: 'ETH-Base',
    recipientKey: '0x9876...5432',
    amount: 2.5,
    tokenSymbol: 'ETH',
    status: 'Approved',
  },
  {
    id: 2,
    date: '2024-02-29T15:30:00Z',
    network: 'Solana',
    recipientKey: 'Sol9876...5432',
    amount: 5.0,
    tokenSymbol: 'SOL',
    status: 'Pending',
  },
  {
    id: 3,
    date: '2024-02-28T08:45:00Z',
    network: 'Tron',
    recipientKey: 'TRX9876...5432',
    amount: 500,
    tokenSymbol: 'TRX',
    status: 'Rejected',
  },
];

export default function WithdrawPage() {
  const [selectedWallet, setSelectedWallet] = useState('');
  const [recipientKey, setRecipientKey] = useState('');
  const [amount, setAmount] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedWalletDetails = userWallets.find(w => w.id === selectedWallet);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWallet || !recipientKey || !amount || !isConfirmed) return;

    setError('');
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setSelectedWallet('');
      setRecipientKey('');
      setAmount('');
      setIsConfirmed(false);
    } catch (err) {
      setError('Failed to submit withdrawal request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'Pending':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      case 'Rejected':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Withdraw Funds</h1>
        <p className="text-lg text-muted-foreground">
          Withdraw your earnings to your external wallet by submitting a request.
          Our team will review and process your withdrawal within 24 hours.
        </p>
      </div>

      {/* Withdrawal Form */}
      <Card>
        <CardHeader>
          <CardTitle>Request Withdrawal</CardTitle>
          <CardDescription>
            Please fill in the details below to initiate your withdrawal request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="wallet">Select Wallet</Label>
              <Select
                value={selectedWallet}
                onValueChange={setSelectedWallet}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose your wallet" />
                </SelectTrigger>
                <SelectContent>
                  {userWallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      <div className="flex items-center gap-2">
                        {wallet.icon}
                        <span>
                          {wallet.network} - {wallet.balance} {wallet.tokenSymbol}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientKey">Recipient Public Key</Label>
              <Input
                id="recipientKey"
                value={recipientKey}
                onChange={(e) => setRecipientKey(e.target.value)}
                placeholder="Enter the recipient's public key"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter the amount to withdraw"
                  min="0"
                  step="0.000001"
                />
                {selectedWalletDetails && (
                  <div className="absolute right-0 top-0 h-full flex items-center pr-3 text-sm text-muted-foreground">
                    {selectedWalletDetails.tokenSymbol}
                  </div>
                )}
              </div>
              {selectedWalletDetails && (
                <p className="text-sm text-muted-foreground">
                  Available: {selectedWalletDetails.balance} {selectedWalletDetails.tokenSymbol}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="confirmDetails"
                checked={isConfirmed}
                onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
              />
              <Label
                htmlFor="confirmDetails"
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I confirm that the details provided are correct
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!selectedWallet || !recipientKey || !amount || !isConfirmed || isSubmitting}
            >
              <div className="flex items-center gap-2">
                {isSubmitting ? (
                  "Processing..."
                ) : (
                  <>
                    Submit Withdrawal Request
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </div>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Withdrawal History */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Withdrawal History</h2>
        <Card>
          <CardContent className="pt-6">
            {withdrawalHistory.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Network</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawalHistory.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell>{formatDate(withdrawal.date)}</TableCell>
                      <TableCell>{withdrawal.network}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {withdrawal.recipientKey}
                      </TableCell>
                      <TableCell>
                        {withdrawal.amount} {withdrawal.tokenSymbol}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "font-medium",
                            getStatusColor(withdrawal.status)
                          )}
                        >
                          {withdrawal.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No withdrawals yet. Submit your first request above!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 