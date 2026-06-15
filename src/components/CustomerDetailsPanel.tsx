import React from 'react';
import { DashboardData, PlatformCustomerItem, PlatformPerformance } from '../lib/mock-data';

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

const detailFontStyle = {
  fontFamily: '"Inter", "DIN Alternate", "Microsoft YaHei", "PingFang SC", sans-serif',
};

const getCompareTone = (change: number) => {
  if (change > 0) return 'text-[#b91c1c]';
  if (change < 0) return 'text-[#047857]';
  return 'text-slate-500';
};

const getPercentChange = (current: number, previous: number) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

const formatPercent = (value: number) => `${Math.abs(value).toFixed(1)}%`;

const formatCompareNumber = (value: number) => `${Math.abs(value)}`;

const MetricBlock: React.FC<{
  label: string;
  current: number;
  previous: number;
  valueClassName: string;
  compareType: 'percent' | 'number';
}> = ({ label, current, previous, valueClassName, compareType }) => {
  const change = current - previous;
  const percentChange = getPercentChange(current, previous);
  const compareTone = getCompareTone(change);
  const arrow = change > 0 ? '↑' : change < 0 ? '↓' : '→';
  const compareText = compareType === 'percent' ? formatPercent(percentChange) : formatCompareNumber(change);

  return (
    <div className="rounded-md border border-blue-900/40 bg-[#1b3048] p-3">
      <div className="text-xs font-bold text-slate-300">{label}</div>
      <div className="mt-2 flex min-w-0 items-baseline gap-1.5">
        <span className={`min-w-0 text-xl font-extrabold tabular-nums ${valueClassName}`}>{formatNumber(current)}</span>
        <span className={`shrink-0 text-sm font-extrabold tabular-nums ${compareTone}`}>{arrow} {compareText}</span>
      </div>
      <div className="mt-2 border-t border-slate-700/45 pt-2 text-xs font-bold tabular-nums text-slate-500">
        上期 {formatNumber(previous)}
      </div>
    </div>
  );
};

const PlatformCard: React.FC<{
  platform: PlatformPerformance;
  customers: PlatformCustomerItem[];
  rankCount: number;
}> = ({ platform, customers, rankCount }) => {
  const styles = accentStyles[platform.accentColor];
  const rankedCustomers = [...customers]
    .sort((a, b) => b.consumption - a.consumption)
    .slice(0, rankCount);
  const previousPlatformConsumption = customers.reduce((total, customer) => total + (customer.previousConsumption ?? 0), 0);
  const previousPlatformCustomers = customers.filter((customer) => (customer.previousConsumption ?? 0) > 0).length;

  return (
    <section
      className={`flex min-h-0 flex-col overflow-hidden rounded-lg border ${styles.border} ${styles.top} border-t-2 bg-[#152437] shadow-lg shadow-black/20`}
      style={detailFontStyle}
    >
      <div className="px-4 pb-3 pt-3">
        <div className="mb-3 flex items-center justify-between">
          <h3 className={`text-xl font-extrabold ${styles.title}`}>{platform.name}</h3>
          <span className="rounded-full border border-blue-400/30 bg-blue-500/15 px-2.5 py-1 text-xs font-bold text-blue-100">
            TOP {rankedCustomers.length}
          </span>
        </div>

        <div className="grid grid-cols-[1.6fr_0.9fr] gap-3">
          <MetricBlock
            label="本期消耗量"
            current={platform.periodConsumption}
            previous={previousPlatformConsumption}
            valueClassName={styles.value}
            compareType="percent"
          />
          <MetricBlock
            label="本期客户总量"
            current={platform.periodCustomers}
            previous={previousPlatformCustomers}
            valueClassName={styles.customer}
            compareType="number"
          />
        </div>
      </div>

      <div className="dashboard-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-4 pr-2">
        <div className="space-y-2 pr-2">
          {rankedCustomers.map((customer) => {
            const previousConsumption = customer.previousConsumption ?? 0;
            const change = customer.consumption - previousConsumption;
            const percentChange = getPercentChange(customer.consumption, previousConsumption);
            const compareTone = getCompareTone(change);
            const arrow = change > 0 ? '↑' : change < 0 ? '↓' : '→';

            return (
              <div
                key={customer.name}
                className={`flex min-h-[92px] flex-col items-start justify-center rounded-md border border-blue-900/25 bg-gradient-to-r ${styles.row} px-4 py-3 shadow-sm shadow-black/10`}
              >
                <div className="w-full truncate text-base font-extrabold text-slate-50">{customer.name}</div>
                <div className={`mt-1 flex w-full items-baseline gap-2 text-2xl font-extrabold tabular-nums ${compareTone}`}>
                  <span>{formatNumber(customer.consumption)}</span>
                  <span className="text-base font-extrabold">{arrow} {formatPercent(percentChange)}</span>
                </div>
                <div className="mt-1 text-xs font-bold tabular-nums text-slate-500">上期 {formatNumber(previousConsumption)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const CustomerDetailsPanel: React.FC<{
  data: DashboardData;
  rankCount: number;
  selectedPlatform: string;
  brandName: string;
}> = ({ data, rankCount, selectedPlatform, brandName }) => {
  const normalizedBrandName = brandName.trim();
  const visiblePlatforms = selectedPlatform
    ? data.platformPerformance.filter((platform) => platform.name === selectedPlatform)
    : data.platformPerformance;
  const platformViews = visiblePlatforms
    .map((platform) => ({
      platform,
      customers: normalizedBrandName
        ? platform.customers.filter((customer) => customer.name.includes(normalizedBrandName))
        : platform.customers,
    }))
    .filter((view) => !normalizedBrandName || view.customers.length > 0);

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="px-1">
        <h2 className="text-sm font-medium text-slate-400">客户明细</h2>
      </div>

      <div className={`grid min-h-0 flex-1 gap-3 overflow-hidden ${platformViews.length === 1 ? 'grid-cols-1' : 'grid-cols-3'}`}>
        {platformViews.length > 0 ? (
          platformViews.map(({ platform, customers }) => (
            <PlatformCard
              key={platform.name}
              platform={platform}
              customers={customers}
              rankCount={rankCount}
            />
          ))
        ) : (
          <div className="col-span-3 flex items-center justify-center rounded-lg border border-blue-900/40 bg-[#101a2e] text-sm font-bold text-slate-400">
            暂无匹配客户数据
          </div>
        )}
      </div>
    </div>
  );
};
