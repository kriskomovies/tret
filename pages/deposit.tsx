import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ManualDepositForm } from '@/components/deposits/ManualDepositForm';
import { useGetDepositHistoryQuery } from '@/redux/services/deposits.service';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, AlertCircle, ExternalLink, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useGetUserWalletsQuery } from '@/redux/services/wallets.service';

const NETWORK_TOKENS = {
  'ETH-Base': 'USDT/USDC on Base network',
  'SOL': 'USDT/USDC (SPL)',
  'TRC-20': 'USDT/USDC (TRC-20)',
} as const;

type Network = keyof typeof NETWORK_TOKENS;

export default function DepositPage() {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>('ETH-Base');
  const { data: depositHistory, isLoading: isLoadingHistory } = useGetDepositHistoryQuery();
  const [copySuccess, setCopySuccess] = useState(false);
  const userId = useSelector((state: RootState) => state.appState.user?.id);
  const { data: wallets } = useGetUserWalletsQuery(userId!, { skip: !userId });

  const selectedWallet = wallets?.find(w => w.network === selectedNetwork);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      toast({
        title: 'Address copied',
        description: 'Wallet address copied to clipboard',
      });
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
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getExplorerUrl = (network: string, txId: string) => {
    switch (network) {
      case 'ETH-Base':
        return `https://basescan.org/tx/${txId}`;
      case 'SOL':
        return `https://solscan.io/tx/${txId}`;
      case 'TRC-20':
        return `https://tronscan.org/#/transaction/${txId}`;
      default:
        return '#';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Deposit</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white transition-all duration-300">
          <CardHeader>
            <CardTitle>Select Network</CardTitle>
            <CardDescription>
              Select a network and send USDT or USDC to your wallet address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(NETWORK_TOKENS) as Network[]).map((network) => (
                <Button
                  key={network}
                  variant={selectedNetwork === network ? 'default' : 'outline'}
                  onClick={() => setSelectedNetwork(network)}
                  className="flex-1"
                >
                  {network === 'ETH-Base' ? 'Ethereum (Base)' :
                   network === 'SOL' ? 'Solana' :
                   'Tron (TRC-20)'}
                </Button>
              ))}
            </div>

            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-yellow-700">
                Important: Send only {NETWORK_TOKENS[selectedNetwork]} to this address.
                Sending other tokens may result in permanent loss.
              </AlertDescription>
            </Alert>

            <div className="p-4 border rounded-lg space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <QRCodeSVG
                  value={selectedWallet?.public_key || ''}
                  size={176}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="L"
                  includeMargin={false}
                  className="rounded-md"
                />
                
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-3 py-2 rounded-md text-sm transition-colors duration-200 hover:bg-muted/80">
                    {selectedWallet ? truncateAddress(selectedWallet.public_key) : 'Loading...'}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => selectedWallet && copyToClipboard(selectedWallet.public_key)}
                    className={cn(
                      "transition-all duration-300",
                      copySuccess ? "text-green-500 border-green-500" : "hover:bg-primary/5"
                    )}
                    disabled={!selectedWallet}
                  >
                    {copySuccess ? "Copied!" : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-white transition-all duration-300">
            <CardHeader>
              <CardTitle>Manual Validation</CardTitle>
              <CardDescription>
                If your deposit is not automatically detected, you can validate it manually
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ManualDepositForm selectedNetwork={selectedNetwork} />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-white transition-all duration-300">
        <CardHeader>
          <CardTitle>Deposit History</CardTitle>
          <CardDescription>Track all your deposit transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Transaction ID</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {depositHistory?.map((deposit) => (
                  <tr 
                    key={deposit.id}
                    className="border-b transition-colors duration-200 hover:bg-muted/50"
                  >
                    <td className="px-6 py-4 font-medium">
                      {deposit.amount} {deposit.network}
                    </td>
                    <td className="px-6 py-4 font-mono">
                      {truncateAddress(deposit.transaction_id)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusVariant(deposit.status)}>
                        {deposit.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(deposit.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(deposit.transaction_id)}
                          className="transition-colors duration-200 hover:bg-primary/5"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(getExplorerUrl(deposit.network, deposit.transaction_id), '_blank')}
                          className="transition-colors duration-200 hover:bg-primary/5"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 