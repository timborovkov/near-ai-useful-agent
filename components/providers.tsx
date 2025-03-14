'use client';

import { wagmiConfig, wagmiConfigDev } from '@/wagmi';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { WagmiProvider } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

const queryClient = new QueryClient();

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WagmiProvider
      config={
        process.env.NODE_ENV === 'production' ? wagmiConfig : wagmiConfigDev
      }
    >
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          config={{ appearance: { theme: 'base' } }}
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY ?? ''}
          chain={process.env.NODE_ENV === 'production' ? base : baseSepolia}
        >
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
