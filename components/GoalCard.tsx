'use client';

import { motion } from 'framer-motion';
import type { SavingsGoal } from '@/lib/goals';
import { getAccountById } from '@/lib/accounts';
import { getGoalProgress } from '@/lib/goals';
import { formatCurrency } from '@/lib/format';

interface GoalCardProps {
  goal: SavingsGoal;
  onTap?: () => void;
  index?: number;
}

export function GoalCard({ goal, onTap, index = 0 }: GoalCardProps) {
  const account = getAccountById(goal.linkedAccountId);
  const progress = getGoalProgress(goal);
  const currencyMap = {
    dollar: 'USD',
    euro: 'EUR', 
    bitcoin: 'BTC',
    ethereum: 'ETH',
    gold: 'GOLD',
  } as const;
  
  const currency = currencyMap[goal.linkedAccountId];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onTap}
      className="p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 hover:border-zinc-700/50 transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-xl">{goal.emoji}</span>
          <div>
            <h3 className="font-medium text-zinc-200">{goal.name}</h3>
            <p className="text-sm text-zinc-500">
              Linked to {account.displayName}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm font-semibold text-zinc-200 tabular-nums">
            {formatCurrency(goal.currentAmount, currency)}
          </div>
          <div className="text-xs text-zinc-500">
            of {formatCurrency(goal.targetAmount, currency)}
          </div>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="flex items-center space-x-3">
        <div className="relative w-12 h-12 flex-shrink-0">
          <svg
            className="w-12 h-12 transform -rotate-90"
            viewBox="0 0 48 48"
          >
            {/* Background circle */}
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="#27272A"
              strokeWidth="4"
              fill="none"
            />
            
            {/* Progress circle */}
            <motion.circle
              cx="24"
              cy="24"
              r="20"
              stroke="#10B981"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 126" }}
              animate={{ 
                strokeDasharray: `${(progress / 100) * 126} 126` 
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-zinc-200 tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-zinc-400">Progress</span>
            <span className="text-emerald-500 font-medium">
              {formatCurrency(goal.targetAmount - goal.currentAmount, currency)} to go
            </span>
          </div>
          
          <div className="w-full bg-zinc-800/50 rounded-full h-2">
            <motion.div
              className="h-2 bg-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
      
      {/* Achievement message */}
      {progress >= 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
        >
          <div className="flex items-center space-x-2 text-emerald-500">
            <span className="text-sm">🎉</span>
            <span className="text-sm font-medium">Goal completed!</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}