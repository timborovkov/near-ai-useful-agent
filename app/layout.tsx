import type { Metadata } from 'next';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base, baseSepolia } from 'wagmi/chains';

import './globals.css';

export const metadata: Metadata = {
  title: 'Data Classifier Agent',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='flex min-h-screen flex-col'>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY ?? ''}
          chain={process.env.NODE_ENV === 'production' ? base : baseSepolia}
        >
          <main className='flex flex-grow items-center justify-center px-4'>
            {children}
          </main>
        </OnchainKitProvider>
      </body>
    </html>
  );
}
