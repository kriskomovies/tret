import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { 
  connectMetaMask, 
  connectPhantom, 
  isMetaMaskInstalled,
  isPhantomInstalled,
  WalletInfo 
} from '@/lib/wallet-auth';
import { useLoginWithWalletMutation } from '@/redux/services/auth.service';
import { useDispatch } from 'react-redux';
import { setLoggedIn } from '@/redux/features/app-state-slice';
import { useRouter } from 'next/router';

export function WalletLogin() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<'metamask' | 'phantom' | null>(null);
  const [loginWithWallet] = useLoginWithWalletMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleWalletLogin = async (walletType: 'metamask' | 'phantom') => {
    try {
      setIsConnecting(true);
      setSelectedWallet(walletType);

      // Check if wallet is installed before attempting connection
      if (walletType === 'metamask' && !isMetaMaskInstalled()) {
        window.open('https://metamask.io/download/', '_blank');
        throw new Error('Please install MetaMask to continue');
      }

      if (walletType === 'phantom' && !isPhantomInstalled()) {
        window.open('https://phantom.app/download', '_blank');
        throw new Error('Please install Phantom wallet to continue');
      }

      // Connect to wallet with explicit selection
      let walletInfo: WalletInfo | null = null;
      
      if (walletType === 'metamask') {
        walletInfo = await connectMetaMask();
      } else {
        walletInfo = await connectPhantom();
      }

      if (!walletInfo) {
        throw new Error(`Failed to connect ${walletType === 'metamask' ? 'MetaMask' : 'Phantom'} wallet`);
      }

      // Call backend to authenticate
      const result = await loginWithWallet({
        address: walletInfo.address,
        network: walletInfo.network,
        publicKey: walletInfo.publicKey,
      }).unwrap();

      const { user, token } = result;
      dispatch(setLoggedIn({ user, token }));
      router.push('/dashboard');
      
      toast({
        title: 'Successfully connected wallet',
        description: `Connected to ${walletType === 'metamask' ? 'MetaMask' : 'Phantom'}`,
      });
    } catch (error: any) {
      console.error('Wallet login error:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to connect wallet',
        description: error.message || 'An unexpected error occurred',
      });
    } finally {
      setIsConnecting(false);
      setSelectedWallet(null);
    }
  };

  const getButtonText = (walletType: 'metamask' | 'phantom') => {
    if (isConnecting && selectedWallet === walletType) {
      return `Connecting to ${walletType === 'metamask' ? 'MetaMask' : 'Phantom'}...`;
    }
    
    if (walletType === 'metamask') {
      return isMetaMaskInstalled() ? 'Connect with MetaMask' : 'Install MetaMask';
    }
    
    return isPhantomInstalled() ? 'Connect with Phantom' : 'Install Phantom';
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Connect Wallet</h3>
        <p className="text-sm text-muted-foreground">
          Choose your preferred wallet to connect
        </p>
      </div>
      
      <div className="grid gap-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => handleWalletLogin('metamask')}
          disabled={isConnecting}
        >
          <img src="/metamask-logo.svg" alt="MetaMask" className="w-5 h-5" />
          {getButtonText('metamask')}
        </Button>
        
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => handleWalletLogin('phantom')}
          disabled={isConnecting}
        >
          <img src="/phantom-logo.svg" alt="Phantom" className="w-5 h-5" />
          {getButtonText('phantom')}
        </Button>
      </div>
    </Card>
  );
} 