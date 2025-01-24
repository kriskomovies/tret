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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Package as PackageIcon, Percent, DollarSign, Clock, Award, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for available packages
const availablePackages = [
  {
    id: 'starter',
    name: 'Starter',
    price: 50,
    dailyIncome: 2,
    description: 'Perfect for beginners to start earning daily rewards.',
    icon: <PackageIcon className="w-5 h-5" />,
    recommended: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 200,
    dailyIncome: 3,
    description: 'For intermediate users looking to maximize daily rewards.',
    icon: <Award className="w-5 h-5" />,
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 500,
    dailyIncome: 4,
    description: 'Advanced package for serious investors.',
    icon: <TrendingUp className="w-5 h-5" />,
    recommended: false,
  },
];

// Mock data for user's purchased packages
const purchasedPackages = [
  {
    id: 1,
    name: 'Starter',
    price: 50,
    purchaseDate: '2024-01-15T10:00:00Z',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Pro',
    price: 200,
    purchaseDate: '2023-12-20T15:30:00Z',
    status: 'Expired',
  },
];

// Mock data for user's wallets
const userWallets = [
  { id: 'eth', network: 'ETH-Base', balance: 1235.50 },
  { id: 'sol', network: 'SOL', balance: 2750.80 },
  { id: 'trc', network: 'TRC-20', balance: 890.25 },
];

export default function PackagesPage() {
  const [selectedPackage, setSelectedPackage] = useState<typeof availablePackages[0] | null>(null);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [isPurchaseModalOpen, setPurchaseModalOpen] = useState(false);

  const handlePackageSelect = (pkg: typeof availablePackages[0]) => {
    setSelectedPackage(pkg);
    setPurchaseModalOpen(true);
  };

  const handlePurchaseConfirm = () => {
    // Add purchase logic here
    console.log('Purchasing package:', selectedPackage?.name, 'with wallet:', selectedWallet);
    setPurchaseModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Choose Your Package</h1>
        <p className="text-lg text-muted-foreground">
          Select a package that suits your needs and start earning daily dividends based on your choice.
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Your current package:</span>
          <Badge variant="outline" className="text-primary">Starter</Badge>
        </div>
      </div>

      {/* Package Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availablePackages.map((pkg) => (
          <Card 
            key={pkg.id}
            className={cn(
              "relative overflow-hidden transition-all duration-200 hover:shadow-lg",
              pkg.recommended && "border-primary"
            )}
          >
            {pkg.recommended && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-1 text-xs rounded-bl">
                Recommended
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2">
                {pkg.icon}
                <CardTitle>{pkg.name}</CardTitle>
              </div>
              <CardDescription>{pkg.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-2xl font-bold">${pkg.price}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Percent className="w-4 h-4" />
                <span>Earn {pkg.dailyIncome}% Daily</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Rewards credited every 24 hours</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={pkg.recommended ? "default" : "outline"}
                onClick={() => handlePackageSelect(pkg)}
              >
                Choose Package
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Purchase Modal */}
      <Dialog open={isPurchaseModalOpen} onOpenChange={setPurchaseModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Purchase</DialogTitle>
            <DialogDescription>
              You are purchasing the <span className="font-bold">{selectedPackage?.name}</span> package.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Price:</span>
              <span className="font-medium">${selectedPackage?.price}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Daily Dividends:</span>
              <span className="font-medium">{selectedPackage?.dailyIncome}% Daily</span>
            </div>
            <div className="space-y-2">
              <Label>Choose Wallet:</Label>
              <Select onValueChange={setSelectedWallet}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a wallet" />
                </SelectTrigger>
                <SelectContent>
                  {userWallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.network} - ${wallet.balance.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPurchaseModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePurchaseConfirm} disabled={!selectedWallet}>
              Buy Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Purchased Packages Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Your Packages</h2>
        <Card>
          <CardContent className="pt-6">
            {purchasedPackages.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Date Purchased</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchasedPackages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.name}</TableCell>
                      <TableCell>${pkg.price}</TableCell>
                      <TableCell>{formatDate(pkg.purchaseDate)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={pkg.status === 'Active' ? 'default' : 'secondary'}
                        >
                          {pkg.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No packages purchased yet. Select a package to start earning dividends!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 