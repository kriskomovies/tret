import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useValidateDepositMutation } from '@/redux/services/deposits.service';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Loader2 } from 'lucide-react';

// Transaction ID validation patterns
const TX_PATTERNS = {
  'ETH-Base': /^0x([A-Fa-f0-9]{64})$/,
  'SOL': /^[A-Za-z0-9]{87,88}$/,
  'TRC-20': /^[A-Fa-f0-9]{64}$/
};

interface ManualDepositFormProps {
  selectedNetwork: string;
}

export function ManualDepositForm({ selectedNetwork }: ManualDepositFormProps) {
  const [txId, setTxId] = useState('');
  const [validateDeposit, { isLoading }] = useValidateDepositMutation();
  const userId = useSelector((state: RootState) => state.appState.user?.id);

  const validateTransactionId = (network: string, txId: string) => {
    const pattern = TX_PATTERNS[network as keyof typeof TX_PATTERNS];
    if (!pattern) return false;
    return pattern.test(txId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please log in to submit a deposit',
      });
      return;
    }

    if (!txId || !selectedNetwork) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all fields',
      });
      return;
    }

    // Validate transaction ID format
    if (!validateTransactionId(selectedNetwork, txId)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Transaction ID',
        description: `Please enter a valid ${selectedNetwork} transaction ID`,
      });
      return;
    }

    try {
      toast({
        title: 'Validating Transaction',
        description: 'Please wait while we validate your transaction...',
      });

      const result = await validateDeposit({
        txId,
        network: selectedNetwork,
        userId,
      }).unwrap();

      if (result.success) {
        const { amount, token, status } = result.transaction;
        toast({
          title: 'Transaction Validated',
          description: `Successfully validated deposit of ${amount} ${token} (${status})`,
        });
        setTxId('');
      }
    } catch (error: any) {
      console.error('Validation error:', error);
      toast({
        variant: 'destructive',
        title: 'Validation Failed',
        description: error.data?.error || 'Failed to validate transaction',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="network">Network</Label>
        <Select
          value={selectedNetwork}
          disabled
        >
          <SelectTrigger id="network" className="bg-white">
            <SelectValue placeholder="Select network" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ETH-Base">Ethereum (Base)</SelectItem>
            <SelectItem value="SOL">Solana</SelectItem>
            <SelectItem value="TRC-20">Tron (TRC-20)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="txId">Transaction ID</Label>
        <Input
          id="txId"
          value={txId}
          onChange={(e) => setTxId(e.target.value)}
          placeholder={selectedNetwork ? `Enter valid ${selectedNetwork} transaction ID` : "Select network first"}
          className="bg-white font-mono"
        />
        {selectedNetwork && txId && !validateTransactionId(selectedNetwork, txId) && (
          <p className="text-sm text-destructive">Invalid transaction ID format for {selectedNetwork}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !selectedNetwork || !txId || !validateTransactionId(selectedNetwork, txId)}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Validating...
          </>
        ) : (
          'Validate Deposit'
        )}
      </Button>
    </form>
  );
} 