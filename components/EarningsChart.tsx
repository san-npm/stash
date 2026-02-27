'use client';

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/format';
import { ChartSkeleton } from './Skeleton';
import type { AccountId } from '@/lib/accounts';

interface ChartDataPoint {
  date: string;
  balance: number;
  earnings: number;
}

interface EarningsChartProps {
  data: ChartDataPoint[];
  accountId: AccountId;
  isLoading?: boolean;
}

const getCurrencyFromAccountId = (accountId: AccountId) => {
  const currencyMap = {
    dollar: 'USD',
    euro: 'EUR', 
    bitcoin: 'BTC',
    ethereum: 'ETH',
    gold: 'GOLD',
  } as const;
  
  return currencyMap[accountId];
};

function CustomTooltip({ active, payload, label, accountId }: any) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const currency = getCurrencyFromAccountId(accountId);
  const data = payload[0].payload;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-zinc-800/95 backdrop-blur-sm border border-zinc-700 rounded-xl p-3 shadow-lg"
    >
      <p className="text-xs text-zinc-400 mb-1">
        {new Date(label).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })}
      </p>
      <p className="text-sm font-semibold text-zinc-200">
        Balance: {formatCurrency(data.balance, currency as any)}
      </p>
      <p className="text-xs text-emerald-500">
        Earned: {formatCurrency(data.earnings, currency as any)}
      </p>
    </motion.div>
  );
}

export function EarningsChart({ data, accountId, isLoading = false }: EarningsChartProps) {
  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-48 flex items-center justify-center text-zinc-500 bg-zinc-900/20 rounded-xl border border-zinc-800/50"
      >
        <div className="text-center">
          <div className="text-2xl mb-2">📊</div>
          <p className="text-sm">No earnings data yet</p>
          <p className="text-xs text-zinc-600">Start saving to see your progress</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-zinc-200">
          Earnings (Last 30 days)
        </h3>
        <div className="text-xs text-zinc-500 flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
          <span>Balance</span>
        </div>
      </div>
      
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id={`colorGradient-${accountId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71717A', fontSize: 12 }}
              tickFormatter={(value) => new Date(value).getDate().toString()}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71717A', fontSize: 12 }}
              tickFormatter={(value) => {
                const currency = getCurrencyFromAccountId(accountId);
                return formatCurrency(value, currency as any, { compact: true, maximumFractionDigits: 0 });
              }}
            />
            
            <Tooltip 
              content={<CustomTooltip accountId={accountId} />}
              cursor={{ stroke: '#10B981', strokeWidth: 1, strokeDasharray: '5 5' }}
            />
            
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#10B981"
              strokeWidth={2}
              fill={`url(#colorGradient-${accountId})`}
              dot={{ fill: '#10B981', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: '#10B981', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}