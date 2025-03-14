'use client';

import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'zenlog-ai',
    }),
  ],
  ssr: true,
  transports: {
    [base.id]: http(),
  },
});

export const wagmiConfigDev = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'zenlog-ai',
    }),
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
  },
});
