import type { Metadata } from 'next';

import './globals.css';
import '@coinbase/onchainkit/styles.css';

import LayoutWrapper from '@/components/layout-wrapper';
import Providers from '@/components/providers';

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
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
