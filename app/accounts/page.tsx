'use client';

import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { AccountRow } from '@/components/AccountRow';
import { getAllAccounts } from '@/lib/accounts';

// Mock hooks - same as home page
const useVaults = () => {
  return {
    data: [
      { name: 'yoUSD', apy: 8.5 },
      { name: 'yoEUR', apy: 7.2 },
      { name: 'yoBTC', apy: 5.8 },
      { name: 'yoETH', apy: 6.5 },
      { name: 'yoGOLD', apy: 4.2 },
    ],
    isLoading: false,
  };
};

const useUserBalance = (vaultName: string, address?: string) => {
  const mockBalances: Record<string, number> = {
    yoUSD: 2450.75,
    yoEUR: 1200.50,
    yoBTC: 0.05,
    yoETH: 1.25,
    yoGOLD: 2.5,
  };
  
  return {
    data: address ? (mockBalances[vaultName] || 0) : 0,
    isLoading: false,
  };
};

export default function AccountsPage() {
  const { address, isConnected } = useAccount();
  const { data: vaults, isLoading: vaultsLoading } = useVaults();
  
  // Get all accounts with their data
  const accounts = getAllAccounts();
  const accountsWithData = accounts.map(account => {
    const vault = vaults?.find(v => v.name === account.yoVault);
    const { data: balance, isLoading: balanceLoading } = useUserBalance(account.yoVault, address);
    
    return {
      ...account,
      balance: balance || 0,
      annualRate: vault?.apy || 0,
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