import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const publicPaths = ['/auth/login', '/auth/register'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.appState.isLoggedIn);
  
  useEffect(() => {
    if (!isLoggedIn && !publicPaths.includes(router.pathname)) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  return <>{children}</>;
} 