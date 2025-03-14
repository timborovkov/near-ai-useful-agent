'use client';

import { wagmiConfig } from '@/wagmi';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

const queryClient = new QueryClient();

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          config={{ appearance: { theme: 'base' } }}
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY ?? ''}
          chain={process.env.NODE_ENV === 'production' ? base : baseSepolia}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
