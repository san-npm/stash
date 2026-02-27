'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAccount } from 'wagmi';

import { getAccountById, type AccountId } from '@/lib/accounts';
import { EarningsChart } from '@/components/EarningsChart';
import { formatBalance, formatPercentage, formatDateRelative } from '@/lib/format';

// Mock hooks
const useVault = (vaultName: string) => {
  const mockRates: Record<string, number> = {
    yoUSD: 8.5,
    yoEUR: 7.2, 
    yoBTC: 5.8,
    yoETH: 6.5,
    yoGOLD: 4.2,
  };
  
  return {
    data: {
      apy: mockRates[vaultName] || 0,
      tvl: 50000000,
    },
    isLoading: false,
  };
};

const useUserBalance = (vaultName: string, address?: string) => {
  const mockBalances: Record<string, number> = {
    yoUSD: 2450.75,
    yoEUR: 1200.50,
    yoBTC: 0.05128943,
    yoETH: 1.25934721,
    yoGOLD: 2.5687,
  };
  
  return {
    data: address ? (mockBalances[vaultName] || 0) : 0,
    isLoading: false,
  };
};

const useVaultHistory = (vaultName: string) => {
  // Generate mock 30-day history
  const generateHistory = (accountId: AccountId) => {
    const data = [];
    const today = new Date();
    const balance = mockBalances[vaultName] || 0;
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simulate gradual growth
      const growthFactor = 1 + (29 - i) * 0.003; // 0.3% growth per day
      const dayBalance = balance / growthFactor;
      const earnings = balance - dayBalance;
      
      data.push({
        date: date.toISOString(),
        balance: dayBalance,
        earnings: earnings,
      });
    }
    
    return data;
  };
  
  const mockBalances: Record<string, number> = {
    yoUSD: 2450.75,
    yoEUR: 1200.50,
    yoBTC: 0.05128943,
    yoETH: 1.25934721,
    yoGOLD: 2.5687,
  };

  return {
    data: generateHistory('dollar' as AccountId),
    isLoading: false,
  };
};

// Mock transaction history
const mockTransactions = [
  {
    id: '1',
    type: 'deposit' as const,
    amount: 500,
    timestamp: '2024-02-25T10:30:00Z',
    status: 'completed' as const,
  },
  {
    id: '2', 
    type: 'deposit' as const,
    amount: 1000,
    timestamp: '2024-02-20T15:45:00Z',
    status: 'completed' as const,
  },
  {
    id: '3',
    type: 'withdrawal' as const,
    amount: 200,
    timestamp: '2024-02-18T09:15:00Z',
    status: 'completed' as const,
  },
];

export default function AccountDetailPage() {
  const params = useParams();
  const accountId = params.id as AccountId;
  const { address } = useAccount();
  
  const account = getAccountById(accountId);
  const { data: vault, isLoading: vaultLoading } = useVault(account.yoVault);
  const { data: balance, isLoading: balanceLoading } = useUserBalance(account.yoVault, address);
  const { data: history, isLoading: historyLoading } = useVaultHistory(account.yoVault);

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-400">Account not found</p>
      </div>
    );
  }

  const annualRate = vault?.apy || 0;
  const isLoading = vaultLoading || balanceLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="p-2 hover:bg-zinc-800/50 rounded-xl transition-colors"
        >
          <span className="text-xl">←</span>
        </Link>
        <h1 className="text-lg font-medium text-zinc-200">Account Details</h1>
        <div className="w-8" /> {/* Spacer */}
      </div>

      {/* Account Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800/50"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 flex items-center justify-center bg-zinc-800/50 rounded-full text-xl">
            {account.icon}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-200">
              {account.displayName}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-emerald-500 font-medium">
                {formatPercentage(annualRate)} annual rate
              </span>
              <div className="w-1 h-1 bg-zinc-600 rounded-full" />
              <span className="text-sm text-zinc-500">Earning daily</span>
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="space-y-2 mb-6">
          <p className="text-sm text-zinc-400">Current Balance</p>
          <div className="text-4xl font-semibold text-zinc-200 tabular-nums">
            {isLoading ? (
              <div className="w-32 h-10 bg-zinc-800/50 rounded animate-pulse" />
            ) : (
              formatBalance(balance, accountId)
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Link href={`/deposit?account=${accountId}`}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full btn-primary"
            >
              Deposit
            </motion.button>
          </Link>
          <Link href={`/withdraw?account=${accountId}`}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full btn-secondary"
            >
              Withdraw
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Earnings Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 bg-zinc-900/30 rounded-2xl border border-zinc-800/50"
      >
        <EarningsChart
          data={history || []}
          accountId={accountId}
          isLoading={historyLoading}
        />
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-medium text-zinc-200">Recent Activity</h3>
        
        <div className="space-y-3">
          {mockTransactions.length === 0 ? (
            <div className="p-8 text-center bg-zinc-900/20 rounded-2xl border border-zinc-800/30">
              <div className="text-3xl mb-2">📄</div>
              <p className="text-sm text-zinc-500">No transactions yet</p>
              <p className="text-xs text-zinc-600">Your activity will appear here</p>
            </div>
          ) : (
            mockTransactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-zinc-900/20 rounded-xl border border-zinc-800/30"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    tx.type === 'deposit'
                      ? 'bg-emerald-500/20 text-emerald-500'
                      : 'bg-zinc-700/50 text-zinc-400'
                  }`}>
                    {tx.type === 'deposit' ? '↓' : '↑'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200 capitalize">
                      {tx.type}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {formatDateRelative(tx.timestamp)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-sm font-semibold tabular-nums ${
                    tx.type === 'deposit' ? 'text-emerald-500' : 'text-zinc-400'
                  }`}>
                    {tx.type === 'deposit' ? '+' : '-'}{formatBalance(tx.amount, accountId)}
                  </div>
                  <div className="text-xs text-zinc-500 capitalize">
                    {tx.status}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Trust & Safety */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 bg-zinc-900/20 rounded-xl border border-zinc-800/30"
      >
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-sm">🔒</span>
          <span className="text-sm font-medium text-zinc-300">Secured by YO Protocol</span>
        </div>
        <p className="text-xs text-zinc-500">
          Your funds are always yours. Withdraw anytime with no fees.{' '}
          <a href="#" className="text-emerald-500 hover:text-emerald-400 underline">
            View audit reports
          </a>
        </p>
      </motion.div>

      {/* Bottom spacing */}
      <div className="pb-20" />
    </motion.div>
  );
}