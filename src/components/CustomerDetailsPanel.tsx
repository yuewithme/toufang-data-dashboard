import React from 'react';
import { mockDashboardData, PlatformPerformance } from '../lib/mock-data';

const accentStyles = {
  red: {
    border: 'border-rose-500/60',
    top: 'border-t-rose-400',
    title: 'text-rose-100',
    value: 'text-blue-400',
    customer: 'text-emerald-300',
    row: 'from-rose-500/16 to-transparent',
    rank: 'text-rose-300',
  },
  green: {
    border: 'border-emerald-500/60',
    top: 'border-t-emerald-400',
    title: 'text-emerald-100',
    value: 'text-blue-400',
    customer: 'text-emerald-300',
    row: 'from-emerald-500/16 to-transparent',
    rank: 'text-emerald-300',
  },
  blue: {
    border: 'border-blue-500/60',
    top: 'border-t-blue-400',
    title: 'text-blue-100',
    value: 'text-blue-400',
    customer: 'text-emerald-300',
    row: 'from-blue-500/18 to-transparent',
    rank: 'text-blue-300',
  },
} satisfies Record<PlatformPerformance['accentColor'], {
  border: string;
  top: string;
  title: string;
  value: string;
  customer: string;
  row: string;
  rank: string;
}>;

const formatNumber = (value: number) => value.toLocaleString('en-US');

const PlatformCard: React.FC<{ platform: PlatformPerformance; rankCount: number }> = ({ platform, rankCount }) => {
  const styles = accentStyles[platform.accentColor];
  const rankedCustomers = [...platform.customers]
    .sort((a, b) => b.consumption - a.consumption)
    .slice(0, rankCount);

  return (
    <section className={`flex min-h-0 flex-col overflow-hidden rounded-lg border ${styles.border} ${styles.top} border-t-2 bg-[#152437] shadow-lg shadow-black/20`}>
      <div className="px-4 pb-3 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className={`text-lg font-extrabold ${styles.title}`}>{platform.name}</h3>
          <span className="rounded-full border border-blue-400/30 bg-blue-500/15 px-2.5 py-1 text-xs font-bold text-blue-100">
            TOP {rankedCustomers.length}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border border-blue-900/40 bg-[#1b3048] p-3">
            <div className="text-xs font-bold text-slate-300">本期消耗量</div>
            <div className={`mt-1 text-2xl font-extrabold tabular-nums ${styles.value}`}>{formatNumber(platform.periodConsumption)}</div>
          </div>
          <div className="rounded-md border border-blue-900/40 bg-[#1b3048] p-3">
            <div className="text-xs font-bold text-slate-300">本期客户总量</div>
            <div className={`mt-1 text-2xl font-extrabold tabular-nums ${styles.customer}`}>{formatNumber(platform.periodCustomers)}</div>
          </div>
        </div>
      </div>

      <div className="mx-4 mb-3 flex items-center border-b border-blue-900/40 pb-2 text-xs font-bold text-slate-300">
        <span className="w-9 shrink-0">排名</span>
        <span className="min-w-0 flex-1">客户名称</span>
        <span className="w-20 shrink-0 text-right">消耗量</span>
      </div>

      <div className="dashboard-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-4 pr-2">
        <div className="space-y-2 pr-2">
          {rankedCustomers.map((customer, index) => (
            <div
              key={customer.name}
              className={`flex min-h-12 items-center gap-3 rounded-md border border-blue-900/25 bg-gradient-to-r ${styles.row} px-3 py-2 text-sm shadow-sm shadow-black/10`}
            >
              <span className={`w-7 shrink-0 font-extrabold tabular-nums ${styles.rank}`}>{index + 1}</span>
              <span className="min-w-0 flex-1 truncate font-bold text-slate-50">{customer.name}</span>
              <span className="w-20 shrink-0 text-right font-extrabold tabular-nums text-[#ffb000]">{formatNumber(customer.consumption)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const CustomerDetailsPanel: React.FC<{
  rankCount: number;
  selectedPlatform: string;
}> = ({ rankCount, selectedPlatform }) => {
  const visiblePlatforms = selectedPlatform
    ? mockDashboardData.platformPerformance.filter((platform) => platform.name === selectedPlatform)
    : mockDashboardData.platformPerformance;

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="px-1">
        <h2 className="text-sm font-medium text-slate-400">客户明细</h2>
      </div>

      <div className={`grid min-h-0 flex-1 gap-3 overflow-hidden ${visiblePlatforms.length === 1 ? 'grid-cols-1' : 'grid-cols-3'}`}>
        {visiblePlatforms.map((platform) => (
          <PlatformCard key={platform.name} platform={platform} rankCount={rankCount} />
        ))}
      </div>
    </div>
  );
};
