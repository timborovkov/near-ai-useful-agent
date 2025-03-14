'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base, baseSepolia } from 'wagmi/chains';

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY ?? ''}
      chain={process.env.NODE_ENV === 'production' ? base : baseSepolia}
    >
      {children}
    </OnchainKitProvider>
  );
}
