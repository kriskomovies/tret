import type { AppProps } from 'next/app';
import { MainLayout } from '@/components/layout/MainLayout';
import { Providers } from '@/providers';
import { persistor } from '@/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from '@/components/ui/toaster';
import '../styles/globals.css';
import { Montserrat } from 'next/font/google';
import { AuthGuard } from '@/components/auth/AuthGuard';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PersistGate loading={null} persistor={persistor}>
      <Providers>
        <AuthGuard>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </AuthGuard>
        <Toaster />
      </Providers>
      <style jsx global>{`
        html {
          font-family: ${montserrat.style.fontFamily};
        }
      `}</style>
    </PersistGate>
  );
} 