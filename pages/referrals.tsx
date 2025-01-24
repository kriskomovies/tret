import { useState } from 'react';
import Tree, { CustomNodeElementProps } from 'react-d3-tree';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Users,
  Link,
  Copy,
  Share2,
  QrCode,
  TrendingUp,
  Clock,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for referrals
const referrals = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    dateJoined: '2024-02-15T10:00:00Z',
    active: true,
    earnings: 150.50,
    level: 1,
  },
  {
    id: 2,
    name: 'Alice Smith',
    email: 'alice@example.com',
    dateJoined: '2024-02-10T15:30:00Z',
    active: true,
    earnings: 75.25,
    level: 1,
  },
  {
    id: 3,
    name: 'Bob Wilson',
    email: 'bob@example.com',
    dateJoined: '2024-02-05T09:15:00Z',
    active: false,
    earnings: 25.00,
    level: 2,
  },
];

// Mock data for referral tree
const treeData = {
  name: 'You',
  attributes: {
    earnings: '$250.75',
  },
  children: [
    {
      name: 'John Doe',
      attributes: {
        earnings: '$150.50',
        joined: '15 Feb 2024',
      },
      children: [
        {
          name: 'Bob Wilson',
          attributes: {
            earnings: '$25.00',
            joined: '05 Feb 2024',
          },
        },
      ],
    },
    {
      name: 'Alice Smith',
      attributes: {
        earnings: '$75.25',
        joined: '10 Feb 2024',
      },
    },
  ],
};

// Calculate summary statistics
const summaryStats = {
  totalEarnings: referrals.reduce((sum, ref) => sum + ref.earnings, 0),
  activeReferrals: referrals.filter(ref => ref.active).length,
  pendingRewards: 50.00, // Mock pending rewards
};

interface TreeNodeDatum {
  name: string;
  attributes?: {
    earnings?: string;
    joined?: string;
  };
  children?: TreeNodeDatum[];
}

export default function ReferralsPage() {
  const [referralLink] = useState('https://example.com/ref/ABC123');
  const [copySuccess, setCopySuccess] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const renderReferralNode = ({ nodeDatum }: CustomNodeElementProps) => (
    <g>
      <circle r={20} fill="#2563eb" />
      <foreignObject
        width={150}
        height={50}
        x={-75}
        y={-25}
        style={{ overflow: 'visible' }}
      >
        <div className="p-2 bg-white rounded-lg shadow-sm border min-w-[150px]">
          <h3 className="font-medium text-sm">{nodeDatum.name}</h3>
          {(nodeDatum as TreeNodeDatum).attributes && (
            <div className="text-xs text-muted-foreground">
              <p>Earnings: {(nodeDatum as TreeNodeDatum).attributes?.earnings}</p>
              {(nodeDatum as TreeNodeDatum).attributes?.joined && (
                <p>Joined: {(nodeDatum as TreeNodeDatum).attributes?.joined}</p>
              )}
            </div>
          )}
        </div>
      </foreignObject>
    </g>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Your Referrals</h1>
        <p className="text-lg text-muted-foreground">
          Invite friends and earn rewards when they join and participate in our platform.
          Monitor your referral activity and earnings below.
        </p>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">Total Earnings</h3>
            </div>
            <p className="text-2xl font-bold">
              ${summaryStats.totalEarnings.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">Active Referrals</h3>
            </div>
            <p className="text-2xl font-bold">{summaryStats.activeReferrals}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">Pending Rewards</h3>
            </div>
            <p className="text-2xl font-bold">
              ${summaryStats.pendingRewards.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>
            Share this link with friends to earn rewards when they join
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex">
                <div className="relative flex-1">
                  <Input
                    value={referralLink}
                    readOnly
                    className="pr-24"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "absolute right-0 top-0 h-full",
                      copySuccess && "text-green-500"
                    )}
                    onClick={handleCopyLink}
                  >
                    {copySuccess ? (
                      "Copied!"
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button variant="outline" className="ml-2">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center w-24 h-24 bg-gray-100 rounded-lg">
              <QrCode className="w-12 h-12 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Tree */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Network</CardTitle>
          <CardDescription>
            Visualize your referral network and their earnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-gray-50 rounded-lg">
            <Tree
              data={treeData}
              renderCustomNodeElement={renderReferralNode}
              orientation="vertical"
              pathFunc="step"
              translate={{ x: 400, y: 50 }}
              separation={{ siblings: 2, nonSiblings: 2.5 }}
              nodeSize={{ x: 200, y: 100 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Referrals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Referrals</CardTitle>
          <CardDescription>
            Track all your referrals and their activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">{referral.name}</TableCell>
                    <TableCell>{referral.email}</TableCell>
                    <TableCell>{formatDate(referral.dateJoined)}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "font-medium",
                          referral.active
                            ? "bg-green-500/10 text-green-500"
                            : "bg-gray-500/10 text-gray-500"
                        )}
                      >
                        {referral.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>${referral.earnings.toFixed(2)}</TableCell>
                    <TableCell>Level {referral.level}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Referrals Yet</h2>
              <p className="text-muted-foreground mb-4">
                Start inviting friends to see your referral network grow!
              </p>
              <Button onClick={handleCopyLink}>
                <div className="flex items-center gap-2">
                  Copy Referral Link
                  <Copy className="w-4 h-4" />
                </div>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 