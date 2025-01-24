import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  Wallet,
  Package,
  DollarSign,
  ArrowRightCircle,
  ClipboardList,
  Users,
  HeadphonesIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const menuItems = [
  {
    name: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: '/dashboard',
  },
  {
    name: 'Deposit',
    icon: <Wallet className="w-5 h-5" />,
    href: '/deposit',
  },
  {
    name: 'Packages',
    icon: <Package className="w-5 h-5" />,
    href: '/packages',
  },
  {
    name: 'Earn',
    icon: <DollarSign className="w-5 h-5" />,
    href: '/earn',
  },
  {
    name: 'Withdraw',
    icon: <ArrowRightCircle className="w-5 h-5" />,
    href: '/withdraw',
  },
  {
    name: 'Withdraw Requests',
    icon: <ClipboardList className="w-5 h-5" />,
    href: '/withdraw-requests',
  },
  {
    name: 'Referrals',
    icon: <Users className="w-5 h-5" />,
    href: '/referrals',
  },
  {
    name: 'Customer Support',
    icon: <HeadphonesIcon className="w-5 h-5" />,
    href: '/support',
  },
];

export function Sidebar() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSignOut = () => {
    // Add sign out logic here
    console.log('Signing out...');
  };

  return (
    <aside 
      className={cn(
        "relative h-screen bg-white border-r flex flex-col transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white border rounded-full p-1 hover:bg-gray-100"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Logo */}
      <div className={cn(
        "p-6",
        isCollapsed ? "px-4" : "px-6"
      )}>
        <Link 
          href="/dashboard" 
          className={cn(
            "text-2xl font-bold hover:text-primary transition-colors",
            isCollapsed ? "text-center" : ""
          )}
        >
          {isCollapsed ? "TM" : "TretaMiner"}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isCollapsed && "justify-center"
                )}
              >
                {item.icon}
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Sign Out Button */}
      <div className={cn(
        "p-4 border-t",
        isCollapsed ? "px-3" : "px-4"
      )}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-foreground",
            isCollapsed && "justify-center"
          )}
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3">Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
} 