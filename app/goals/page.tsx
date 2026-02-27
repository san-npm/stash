'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';

import { ClientOnly } from '@/components/ClientOnly';
import { GoalCard } from '@/components/GoalCard';
import { loadGoals, createGoal, updateGoal, deleteGoal, type SavingsGoal } from '@/lib/goals';
import { getAllAccounts, type AccountId } from '@/lib/accounts';
import { formatCurrency } from '@/lib/format';

function GoalsPageContent() {
  const { address, isConnected } = useAccount();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load goals on mount
  useEffect(() => {
    const loadedGoals = loadGoals();
    setGoals(loadedGoals);
    setIsLoading(false);
  }, []);

  const refreshGoals = () => {
    setGoals(loadGoals());
  };

  const handleCreateGoal = (goalData: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
    createGoal(goalData);
    refreshGoals();
    setShowCreateForm(false);
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-4">
          <div className="text-4xl mb-4">🎯</div>
          <h1 className="text-xl font-semibold text-zinc-200">Savings Goals</h1>
          <p className="text-zinc-400">Connect your wallet to create savings goals</p>
        </div>
      </div>
    );
  }

  if (showCreateForm) {
    return <CreateGoalForm onSubmit={handleCreateGoal} onCancel={() => setShowCreateForm(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-200">Savings Goals</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateForm(true)}
          className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
        >
          <span className="text-lg">+</span>
        </motion.button>
      </div>

      {/* Subtitle */}
      <p className="text-zinc-400">
        Create goals to save for what matters most to you
      </p>

      {/* Goals List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-6 h-6 bg-zinc-800 rounded" />
                <div className="w-32 h-4 bg-zinc-800 rounded" />
              </div>
              <div className="w-full h-12 bg-zinc-800 rounded" />
            </div>
          ))}
        </div>
      ) : goals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 space-y-4"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-zinc-300">No goals yet</h3>
          <p className="text-zinc-500 max-w-sm mx-auto">
            Create your first savings goal to start working towards something special
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="mt-6 btn-primary"
          >
            Create Your First Goal
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              index={index}
              onTap={() => {
                // Could open goal details or quick deposit
                console.log('Tapped goal:', goal.id);
              }}
            />
          ))}
        </div>
      )}

      {/* Quick Tips */}
      {goals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-zinc-900/20 rounded-xl border border-zinc-800/30"
        >
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm">💡</span>
            <span className="text-sm font-medium text-zinc-300">Tips for Success</span>
          </div>
          <div className="space-y-1 text-xs text-zinc-500">
            <p>• Set realistic target amounts you can achieve</p>
            <p>• Link goals to accounts that match your timeline</p>
            <p>• Your money keeps earning interest while working toward goals</p>
          </div>
        </motion.div>
      )}

      {/* Bottom spacing for nav */}
      <div className="pb-20" />
    </motion.div>
  );
}

// Create Goal Form Component
function CreateGoalForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🎯');
  const [targetAmount, setTargetAmount] = useState('');
  const [linkedAccountId, setLinkedAccountId] = useState<AccountId>('dollar');

  const accounts = getAllAccounts();
  const popularEmojis = ['🎯', '🏖️', '🏡', '🚗', '💻', '🎓', '💍', '✈️', '🎸', '📱'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(targetAmount);
    if (!name.trim() || !amount || amount <= 0) return;

    onSubmit({
      name: name.trim(),
      emoji,
      targetAmount: amount,
      currentAmount: 0,
      linkedAccountId,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-zinc-800/50 rounded-xl transition-colors"
        >
          <span className="text-xl">←</span>
        </button>
        <h1 className="text-lg font-medium text-zinc-200">Create Goal</h1>
        <div className="w-8" /> {/* Spacer */}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Goal Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-400">
            What are you saving for?
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Vacation, Emergency Fund, New Car"
            className="w-full input"
            autoFocus
          />
        </div>

        {/* Emoji Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-400">
            Choose an emoji
          </label>
          <div className="grid grid-cols-5 gap-2">
            {popularEmojis.map((emojiOption) => (
              <button
                key={emojiOption}
                type="button"
                onClick={() => setEmoji(emojiOption)}
                className={`p-3 rounded-xl border transition-all ${
                  emoji === emojiOption
                    ? 'bg-emerald-500/10 border-emerald-500/50'
                    : 'bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600/50'
                }`}
              >
                <span className="text-xl">{emojiOption}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Target Amount */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-400">
            Target amount
          </label>
          <div className="relative">
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full input pl-8"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400">
              $
            </span>
          </div>
        </div>

        {/* Linked Account */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-400">
            Link to savings account
          </label>
          <div className="space-y-2">
            {accounts.map((account) => (
              <button
                key={account.id}
                type="button"
                onClick={() => setLinkedAccountId(account.id)}
                className={`w-full p-3 rounded-xl border transition-all ${
                  linkedAccountId === account.id
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
                    : 'bg-zinc-900/30 border-zinc-800/50 text-zinc-300 hover:border-zinc-700/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{account.icon}</span>
                  <span className="font-medium">{account.displayName}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!name.trim() || !targetAmount || parseFloat(targetAmount) <= 0}
          whileTap={{ scale: 0.95 }}
          className={`w-full h-12 rounded-xl font-medium transition-all ${
            name.trim() && targetAmount && parseFloat(targetAmount) > 0
              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          Create Goal
        </motion.button>
      </form>

      {/* Info */}
      <div className="p-4 bg-zinc-900/20 rounded-xl border border-zinc-800/30">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-sm">ℹ️</span>
          <span className="text-sm font-medium text-zinc-300">How it works</span>
        </div>
        <p className="text-xs text-zinc-500">
          Goals are linked to your savings accounts. Your money continues earning interest while you track progress toward your target. You can contribute to goals through regular deposits.
        </p>
      </div>
    </motion.div>
  );
}

export default function GoalsPage() {
  return <GoalsPageContent />;
}