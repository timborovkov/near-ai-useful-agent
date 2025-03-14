import type { Metadata } from 'next';

import './globals.css';

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
