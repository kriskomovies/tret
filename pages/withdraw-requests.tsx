import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowRight, Clock, DollarSign, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for withdrawal requests
const withdrawRequests = [
  {
    id: 1,
    date: '2024-03-01T15:45:00Z',
    network: 'ETH-Base',
    recipient: '0x1234567890abcdef1234567890abcdef12345678',
    amount: 1250.50,
    fee: 10.00,
    status: 'Pending',
    tokenSymbol: 'ETH',
  },
  {
    id: 2,
    date: '2024-02-28T12:30:00Z',
    network: 'Solana',
    recipient: 'Sol1234567890abcdef1234567890abcdef12345678',
    amount: 500.75,
    fee: 5.00,
    status: 'Approved',
    tokenSymbol: 'SOL',
  },
  {
    id: 3,
    date: '2024-02-27T09:15:00Z',
    network: 'Tron',
    recipient: 'TRX1234567890abcdef1234567890abcdef12345678',
    amount: 2000.00,
    fee: 15.00,
    status: 'Rejected',
    tokenSymbol: 'TRX',
  },
];

// Calculate summary statistics
const summaryStats = {
  totalWithdrawals: withdrawRequests.reduce((sum, req) => 
    req.status === 'Approved' ? sum + req.amount : sum, 0
  ),
  pendingRequests: withdrawRequests.filter(req => req.status === 'Pending').length,
  lastWithdrawal: withdrawRequests
    .filter(req => req.status === 'Approved')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date,
};

export default function WithdrawRequestsPage() {
  const router = useRouter();

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
        <h1 className="text-3xl font-bold">Withdraw Requests</h1>
        <p className="text-lg text-muted-foreground">
          Track the status of your withdrawal requests. Here, you can see all past and pending withdrawal transactions along with their current status.
        </p>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">Total Withdrawals</h3>
            </div>
            <p className="text-2xl font-bold">
              ${summaryStats.totalWithdrawals.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">Pending Requests</h3>
            </div>
            <p className="text-2xl font-bold">{summaryStats.pendingRequests}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">Last Withdrawal</h3>
            </div>
            <p className="text-2xl font-bold">
              {summaryStats.lastWithdrawal ? formatDate(summaryStats.lastWithdrawal) : 'No withdrawals yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Withdraw Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
          <CardDescription>
            View and track all your withdrawal requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {withdrawRequests.length > 0 ? (
            <TooltipProvider>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Network</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{formatDate(request.date)}</TableCell>
                      <TableCell>{request.network}</TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger className="font-mono text-sm">
                            {truncateAddress(request.recipient)}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-mono text-xs">{request.recipient}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="font-medium">
                        {request.amount} {request.tokenSymbol}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {request.fee} {request.tokenSymbol}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "font-medium",
                            getStatusColor(request.status)
                          )}
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TooltipProvider>
          ) : (
            <div className="text-center py-12">
              <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Withdrawal Requests Yet</h2>
              <p className="text-muted-foreground mb-4">
                You haven't submitted any withdrawal requests yet. Start by submitting one on the Withdrawal Page.
              </p>
              <Button onClick={() => router.push('/withdraw')}>
                <div className="flex items-center gap-2">
                  Go to Withdrawal Page
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 