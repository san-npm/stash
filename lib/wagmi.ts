import { createConfig } from '@privy-io/wagmi';
import { base } from 'wagmi/chains';
import { http } from 'viem';

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});

export const baseChain = base;