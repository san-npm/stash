'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { SavingsAccount } from '@/lib/accounts';
import { formatBalance, formatPercentage } from '@/lib/format';
import { AccountRowSkeleton } from './Skeleton';
import { CountUp } from './CountUp';

interface AccountRowProps {
  account: SavingsAccount;
  balance: number;
  annualRate: number;
  isLoading?: boolean;
  index?: number;
}

export function AccountRow({
  account,
  balance,
  annualRate,
  isLoading = false,
  index = 0,
}: AccountRowProps) {
  if (isLoading) {
    return <AccountRowSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        href={`/accounts/${account.id}`}
        className="block p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 hover:border-zinc-700/50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-10 h-10 flex items-center justify-center bg-zinc-800/50 rounded-full text-lg"
              whileHover={{ rotate: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {account.icon}
            </motion.div>
            
            <div>
              <h3 className="font-medium text-zinc-200">
                {account.displayName}
              </h3>
              <p className="text-sm text-zinc-500">
                {formatPercentage(annualRate)} annual rate
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-semibold text-zinc-200 tabular-nums">
              <CountUp
                end={balance}
                duration={1000}
                decimals={account.id === 'bitcoin' ? 8 : account.id === 'ethereum' ? 6 : 2}
              >
                {(value) => {
                  if (account.id === 'bitcoin') {
                    return `${account.currencySymbol}${value.toFixed(8)}`;
                  }
                  if (account.id === 'ethereum') {
                    return `${account.currencySymbol}${value.toFixed(6)}`;
                  }
                  if (account.id === 'gold') {
                    return `${value.toFixed(4)} ${account.currencySymbol}`;
                  }
                  return `${account.currencySymbol}${value.toFixed(2)}`;
                }}
              </CountUp>
            </div>
            
            {balance > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-xs text-emerald-500 flex items-center justify-end space-x-1"
              >
                <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                <span>Earning</span>
              </motion.div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}