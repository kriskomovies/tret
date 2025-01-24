import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Search, Bell, Settings, User } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="header-icon-button">
              <Bell className="w-5 h-5" />
            </button>
            <button className="header-icon-button">
              <Settings className="w-5 h-5" />
            </button>
            <button className="header-icon-button">
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 