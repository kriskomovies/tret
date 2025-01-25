import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Search, Bell, Settings, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

interface MainLayoutProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

export function MainLayout({ children }: MainLayoutProps) {
  const isLoggedIn = useSelector((state: RootState) => state.appState.isLoggedIn);
  const router = useRouter();
  const isAuthPage = router.pathname.startsWith('/auth');

  if (!isLoggedIn || isAuthPage) {
    return <main className="h-screen">{children}</main>;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header 
          className="h-16 bg-white border-b flex items-center justify-between px-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
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

          <div className="flex items-center gap-6">
            <motion.button 
              className="header-icon-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-4 h-4" />
            </motion.button>
            <motion.button 
              className="header-icon-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-4 h-4" />
            </motion.button>
            <motion.button 
              className="header-icon-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <User className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto main-content bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={router.pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                className="h-full w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
} 