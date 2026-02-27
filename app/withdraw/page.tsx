'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useRedeem, useUserBalance } from '@yo-protocol/react';

import { getAccountById, getAllAccounts, type AccountId } from '@/lib/accounts';
import { WithdrawForm } from '@/components/WithdrawForm';

export default function WithdrawPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { address } = useAccount();
  
  const preselectedAccountId = searchParams.get('account') as AccountId | null;
  const [selectedAccountId, setSelectedAccountId] = useState<AccountId>(
    preselectedAccountId || 'dollar'
  );

  const selectedAccount = getAccountById(selectedAccountId);
  const allAccounts = getAllAccounts();
  
  const { redeem, isLoading: redeemLoading } = useRedeem({ vault: selectedAccount.vaultAddress as `0x${string}` });
  const { position, isLoading: balanceLoading } = useUserBalance(
    selectedAccount.vaultAddress as `0x${string}`, 
    address
  );
  const availableBalance = Number(position?.assets || BigInt(0));

  const handleWithdraw = async (amount: number) => {
    try {
      // Real YO SDK flow:
      // 1. Redeem vault shares for the underlying token amount
      // 2. Tokens are automatically sent to user wallet
      await redeem(BigInt(amount));
      
      // Success is handled by the WithdrawForm component
    } catch (error) {
      console.error('Withdrawal failed:', error);
      throw error;
    }
  };

  if (!address) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-400">Please connect your wallet first</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="p-2 hover:bg-zinc-800/50 rounded-xl transition-colors"
        >
          <span className="text-xl">←</span>
        </Link>
        <h1 className="text-lg font-medium text-zinc-200">Withdraw</h1>
        <div className="w-8" /> {/* Spacer */}
      </div>

      {/* Account Selector */}
      {!preselectedAccountId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-sm font-medium text-zinc-400">
            Choose Account to Withdraw From
          </h2>
          
          <div className="space-y-2">
            {allAccounts.map((account) => {
              const { position } = useUserBalance(account.vaultAddress as `0x${string}`, address);
              const balance = Number(position?.assets || BigInt(0));
              
              return (
                <motion.button
                  key={account.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedAccountId(account.id)}
                  disabled={!balance || balance <= 0}
                  className={`w-full p-3 rounded-xl border transition-all ${
                    selectedAccountId === account.id
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
                      : balance && balance > 0
                      ? 'bg-zinc-900/30 border-zinc-800/50 text-zinc-300 hover:border-zinc-700/50'
                      : 'bg-zinc-900/10 border-zinc-800/30 text-zinc-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{account.icon}</span>
                      <span className="font-medium">{account.displayName}</span>
                    </div>
                    <div className="text-sm tabular-nums">
                      {account.currencySymbol}{balance.toFixed(2)}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Withdraw Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <WithdrawForm
          account={selectedAccount}
          availableBalance={availableBalance || 0}
          onWithdraw={handleWithdraw}
          isLoading={balanceLoading}
        />
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="p-4 bg-zinc-900/20 rounded-xl border border-zinc-800/30">
          <h3 className="text-sm font-medium text-zinc-300 mb-2">
            Withdrawal Details
          </h3>
          <div className="space-y-2 text-xs text-zinc-500">
            <div className="flex items-start space-x-2">
              <span className="text-emerald-500 mt-0.5">•</span>
              <span>Funds sent directly to your connected wallet</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-emerald-500 mt-0.5">•</span>
              <span>No withdrawal fees or penalties</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-emerald-500 mt-0.5">•</span>
              <span>Processing typically takes 1-2 minutes</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-orange-500">⚠️</span>
            <span className="text-sm font-medium text-orange-500">Important</span>
          </div>
          <p className="text-xs text-zinc-400">
            Withdrawn funds will stop earning interest immediately. You can deposit again anytime to resume earning.
          </p>
        </div>

        <div className="p-4 bg-zinc-900/20 rounded-xl border border-zinc-800/30">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-zinc-400">💡</span>
            <span className="text-sm font-medium text-zinc-300">Tip</span>
          </div>
          <p className="text-xs text-zinc-500">
            Consider creating a savings goal instead of withdrawing. Goals help you save for specific purposes while keeping your money earning interest.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}