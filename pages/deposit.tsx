import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Wallet, ExternalLink, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for deposits
const mockDeposits = [
  {
    id: 1,
    amount: '0.5',
    currency: 'ETH',
    transactionId: '0x1234567890abcdef1234567890abcdef12345678',
    status: 'Confirmed',
    createdAt: '2024-01-23T10:34:00Z',
  },
  {
    id: 2,
    amount: '1.2',
    currency: 'SOL',
    transactionId: '5GSq2VQXXJviKb1ZHvAkVBWgCJJYpw3ic7jRp1',
    status: 'Pending',
    createdAt: '2024-01-22T15:20:00Z',
  },
  {
    id: 3,
    amount: '100',
    currency: 'TRX',
    transactionId: 'TRXa1b2c3d4e5f6g7h8i9j0',
    status: 'Rejected',
    createdAt: '2024-01-21T09:15:00Z',
  },
];

// Wallet options with their details
const walletOptions = [
  {
    id: 'eth-base',
    name: 'Ethereum',
    network: 'ETH-Base',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    balance: 1235.50,
    icon: <Wallet className="w-4 h-4 text-blue-500" />,
  },
  {
    id: 'sol',
    name: 'Solana',
    network: 'SOL',
    address: '5GSq2VQXXJviKb1ZHvAkVBWgCJJYpw3ic7jRp1',
    balance: 2750.80,
    icon: <Wallet className="w-4 h-4 text-purple-500" />,
  },
  {
    id: 'trc20',
    name: 'Tron',
    network: 'TRC-20',
    address: 'TRXa1b2c3d4e5f6g7h8i9j0',
    balance: 890.25,
    icon: <Wallet className="w-4 h-4 text-red-500" />,
  },
];

export default function DepositPage() {
  const [selectedWallet, setSelectedWallet] = useState(walletOptions[0]);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleWalletSelect = (value: string) => {
    const wallet = walletOptions.find(w => w.id === value);
    if (wallet) setSelectedWallet(wallet);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
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

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Rejected':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Wallet Selection & Details Section */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Deposit</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Wallet</CardTitle>
              <CardDescription>Choose the network you want to deposit to</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                onValueChange={handleWalletSelect}
                defaultValue={selectedWallet.id}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a wallet" />
                </SelectTrigger>
                <SelectContent>
                  {walletOptions.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      <div className="flex items-center gap-2">
                        {wallet.icon}
                        <span>{wallet.name} ({wallet.network})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Network</span>
                  <span className="font-medium">{selectedWallet.network}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Balance</span>
                  <span className="font-medium">${selectedWallet.balance.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Deposits may take up to 15 minutes to reflect in your account. Make sure to send only supported tokens to this address.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* QR Code and Address Section */}
      <Card>
        <CardHeader>
          <CardTitle>Deposit to {selectedWallet.name}</CardTitle>
          <CardDescription>
            Scan the QR code or copy the wallet address below to deposit funds
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="w-48 h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
            {/* QR Code placeholder - you'll need to add a QR code library */}
            <span className="text-sm text-muted-foreground">QR Code</span>
          </div>
          
          <div className="flex items-center gap-2">
            <code className="bg-muted px-2 py-1 rounded text-sm">
              {truncateAddress(selectedWallet.address)}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(selectedWallet.address)}
              className={cn(
                "transition-colors",
                copySuccess && "text-green-500 border-green-500"
              )}
            >
              {copySuccess ? "Copied!" : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deposits History Section */}
      <Card>
        <CardHeader>
          <CardTitle>Deposit History</CardTitle>
          <CardDescription>Track all your deposit transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDeposits.map((deposit) => (
                <TableRow key={deposit.id}>
                  <TableCell className="font-medium">
                    {deposit.amount} {deposit.currency}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {truncateAddress(deposit.transactionId)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(deposit.status)}>
                      {deposit.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(deposit.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(deposit.transactionId)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`https://etherscan.io/tx/${deposit.transactionId}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 