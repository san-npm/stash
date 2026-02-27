import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Stash - Your Savings, Earning More',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'stash-yo-savings',
  chains: [base],
  ssr: true,
});

export const baseChain = base;