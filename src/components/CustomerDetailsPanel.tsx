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

const PlatformCard: React.FC<{ platform: PlatformPerformance }> = ({ platform }) => {
  const styles = accentStyles[platform.accentColor];
  const sortedCustomers = [...platform.customers].sort((a, b) => b.consumption - a.consumption);

  return (
    <section className={`flex min-h-0 flex-col overflow-hidden rounded-lg border ${styles.border} ${styles.top} border-t-2 bg-[#152437] shadow-lg shadow-black/20`}>
      <div className="px-4 pb-3 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className={`text-base font-bold ${styles.title}`}>{platform.name}</h3>
          <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-200">
            TOP {sortedCustomers.length}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border border-blue-900/40 bg-[#1b3048] p-3">
            <div className="text-[10px] font-medium text-slate-500">本期消耗量</div>
            <div className={`mt-1 text-xl font-bold tabular-nums ${styles.value}`}>{formatNumber(platform.periodConsumption)}</div>
          </div>
          <div className="rounded-md border border-blue-900/40 bg-[#1b3048] p-3">
            <div className="text-[10px] font-medium text-slate-500">本期客户总量</div>
            <div className={`mt-1 text-xl font-bold tabular-nums ${styles.customer}`}>{formatNumber(platform.periodCustomers)}</div>
          </div>
        </div>
      </div>

      <div className="mx-4 mb-3 flex items-center border-b border-blue-900/40 pb-2 text-[10px] font-semibold text-slate-500">
        <span className="w-9 shrink-0">排名</span>
        <span className="min-w-0 flex-1">客户名称</span>
        <span className="w-20 shrink-0 text-right">消耗量</span>
      </div>

      <div className="dashboard-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-4 pr-2">
        <div className="space-y-2 pr-2">
          {sortedCustomers.map((customer, index) => (
            <div
              key={customer.name}
              className={`flex min-h-11 items-center gap-3 rounded-md border border-blue-900/25 bg-gradient-to-r ${styles.row} px-3 py-2 text-xs shadow-sm shadow-black/10`}
            >
              <span className={`w-7 shrink-0 font-bold tabular-nums ${styles.rank}`}>{index + 1}</span>
              <span className="min-w-0 flex-1 truncate font-semibold text-slate-100">{customer.name}</span>
              <span className="w-20 shrink-0 text-right font-bold tabular-nums text-[#ffb000]">{formatNumber(customer.consumption)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const CustomerDetailsPanel: React.FC = () => {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="px-1">
        <h2 className="text-sm font-medium text-slate-400">客户明细</h2>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-3 gap-3 overflow-hidden">
        {mockDashboardData.platformPerformance.map((platform) => (
          <PlatformCard key={platform.name} platform={platform} />
        ))}
      </div>
    </div>
  );
};
