import type { AppProps } from 'next/app';
import { MainLayout } from '@/components/layout/MainLayout';
import { Providers } from '@/providers';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </Providers>
  );
} 