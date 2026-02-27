'use client';

import { motion } from 'framer-motion';
import { CountUp } from './CountUp';
import { formatCurrency } from '@/lib/format';
import { BalanceSkeleton } from './Skeleton';

interface BalanceCardProps {
  totalBalance: number;
  monthlyEarnings: number;
  isLoading?: boolean;
  userName?: string;
}

export function BalanceCard({
  totalBalance,
  monthlyEarnings,
  isLoading = false,
  userName = 'there',
}: BalanceCardProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800/50"
      >
        <BalanceSkeleton />
        <div className="mt-4">
          <BalanceSkeleton />
        </div>
      </motion.div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800/50"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h1 className="text-lg font-medium text-zinc-300 mb-1">
          {getGreeting()}, {userName}
        </h1>
        <p className="text-sm text-zinc-500">
          Here's your savings overview
        </p>
      </motion.div>

      <div className="space-y-4">
        {/* Total Balance */}
        <div>
          <p className="text-sm font-medium text-zinc-400 mb-2">
            Total Balance
          </p>
          <div className="flex items-baseline space-x-2">
            <CountUp
              end={totalBalance}
              duration={1500}
              decimals={2}
              className="text-4xl font-semibold text-zinc-50 tabular-nums"
            >
              {(value) => formatCurrency(value, 'USD')}
            </CountUp>
          </div>
        </div>

        {/* Monthly Earnings */}
        {monthlyEarnings > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center space-x-2 pt-4 border-t border-zinc-800/50"
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm text-zinc-400">
              You've earned{' '}
              <CountUp
                end={monthlyEarnings}
                duration={1000}
                decimals={2}
                className="font-semibold text-emerald-500 tabular-nums"
              >
                {(value) => formatCurrency(value, 'USD')}
              </CountUp>
              {' '}this month
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}