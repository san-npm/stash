'use client';

import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useVaults, useUserBalance } from '@yo-protocol/react';
import { AccountRow } from '@/components/AccountRow';
import { getAllAccounts } from '@/lib/accounts';

// Helper function to get APY (placeholder until YO SDK provides this)
const getVaultAPY = (symbol?: string) => {
  const apyMap: Record<string, number> = {
    yoUSD: 8.5,
    yoEUR: 7.2,
    yoBTC: 5.8,
    yoETH: 6.5,
    yoGOLD: 4.2,
  };
  return symbol ? apyMap[symbol] : 0;
};

export default function AccountsPage() {
  const { address, isConnected } = useAccount();
  const { vaults, isLoading: vaultsLoading } = useVaults();
  
  // Get all accounts with their data
  const accounts = getAllAccounts();
  const accountsWithData = accounts.map(account => {
    // Map vault data from real YO SDK response
    const vault = vaults?.find(v => v.address.toLowerCase() === account.vaultAddress.toLowerCase());
    const { position, isLoading: balanceLoading } = useUserBalance(account.vaultAddress as `0x${string}`, address);
    
    return {
      ...account,
      balance: Number(position?.assets || BigInt(0)),
      annualRate: getVaultAPY(vault?.symbol),
      isLoading: vaultsLoading || balanceLoading,
    };
  });

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-4">
          <div className="text-4xl mb-4">💳</div>
          <h1 className="text-xl font-semibold text-zinc-200">Savings Accounts</h1>
          <p className="text-zinc-400">Connect your wallet to view your accounts</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-200">Savings Accounts</h1>
        <p className="text-zinc-400 mt-1">
          Your money, earning more every day
        </p>
      </div>

      {/* Accounts List */}
      <div className="space-y-4">
        <div className="text-sm font-medium text-zinc-400 flex items-center justify-between">
          <span>Available Accounts</span>
          <span>Balance</span>
        </div>

        <div className="space-y-3">
          {accountsWithData.map((account, index) => (
            <AccountRow
              key={account.id}
              account={account}
              balance={account.balance}
              annualRate={account.annualRate}
              isLoading={account.isLoading}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 bg-zinc-900/20 rounded-xl border border-zinc-800/30"
      >
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-sm">📊</span>
          <span className="text-sm font-medium text-zinc-300">Account Summary</span>
        </div>
        <div className="space-y-1 text-xs text-zinc-500">
          <p>• All accounts earn interest daily</p>
          <p>• No minimum balance requirements</p>
          <p>• Withdraw anytime with no penalties</p>
          <p>• Secured by audited smart contracts</p>
        </div>
      </motion.div>

      {/* Bottom spacing for nav */}
      <div className="pb-20" />
    </motion.div>
  );
}