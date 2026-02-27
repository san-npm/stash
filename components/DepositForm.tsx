'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { SavingsAccount } from '@/lib/accounts';
import { parseAmountInput } from '@/lib/format';
import { Confetti } from './Confetti';

interface DepositFormProps {
  account: SavingsAccount;
  onDeposit: (amount: number) => Promise<void>;
  isLoading?: boolean;
}

const quickAmounts = [50, 100, 500, 1000];

export function DepositForm({ account, onDeposit, isLoading = false }: DepositFormProps) {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successAmount, setSuccessAmount] = useState(0);

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    const cleaned = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return;
    }
    
    setAmount(cleaned);
  };

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = parseAmountInput(amount);
    if (parsedAmount <= 0) return;

    setIsSubmitting(true);
    setSuccessAmount(parsedAmount);
    
    try {
      await onDeposit(parsedAmount);
      setShowSuccess(true);
      setAmount('');
    } catch (error) {
      console.error('Deposit failed:', error);
      // In real app, show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const parsedAmount = parseAmountInput(amount);
  const isValid = parsedAmount > 0;

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 space-y-6"
      >
        <Confetti
          active={showSuccess}
          onComplete={() => setShowSuccess(false)}
        />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center"
        >
          <span className="text-2xl">✅</span>
        </motion.div>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold text-zinc-200 mb-2">
            Done!
          </h2>
          <p className="text-zinc-400">
            {account.currencySymbol}{successAmount} added to {account.displayName}
          </p>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSuccess(false)}
          className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors"
        >
          Done
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Account Header */}
      <div className="flex items-center space-x-3 p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
        <div className="w-10 h-10 flex items-center justify-center bg-zinc-800/50 rounded-full text-lg">
          {account.icon}
        </div>
        <div>
          <h2 className="font-medium text-zinc-200">{account.displayName}</h2>
          <p className="text-sm text-zinc-500">Add money to start earning</p>
        </div>
      </div>

      {/* Amount Input */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-zinc-400">
          Amount
        </label>
        
        <div className="relative">
          <input
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0.00"
            className="w-full text-4xl font-semibold text-center bg-transparent text-zinc-200 placeholder-zinc-600 border-none outline-none tabular-nums"
            autoFocus
          />
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 text-2xl text-zinc-400">
            {account.currencySymbol}
          </div>
        </div>

        {/* Quick Amounts */}
        <div className="grid grid-cols-4 gap-2">
          {quickAmounts.map((quickAmount) => (
            <motion.button
              key={quickAmount}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickAmount(quickAmount)}
              className="py-2 px-3 text-sm font-medium text-zinc-400 bg-zinc-800/50 rounded-xl hover:bg-zinc-700/50 hover:text-zinc-300 transition-colors"
            >
              {account.currencySymbol}{quickAmount}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Deposit Button */}
      <motion.button
        type="submit"
        disabled={!isValid || isSubmitting || isLoading}
        whileTap={{ scale: isValid ? 0.95 : 1 }}
        className={`w-full h-12 rounded-xl font-medium transition-all ${
          isValid
            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center space-x-2">
            <motion.div
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <span>Processing your deposit...</span>
          </div>
        ) : (
          `Deposit ${isValid ? `${account.currencySymbol}${amount}` : ''}`
        )}
      </motion.button>

      {/* Info */}
      <div className="text-center text-xs text-zinc-500 space-y-1">
        <p>Your deposit will start earning immediately</p>
        <p>Secured by YO Protocol • Withdraw anytime</p>
      </div>
    </motion.form>
  );
}