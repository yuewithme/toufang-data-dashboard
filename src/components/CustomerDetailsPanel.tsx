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
  onClick?: () => void;
  clickLabel?: string;
}> = ({ label, current, previous, valueClassName, compareType, onClick, clickLabel }) => {
  const change = current - previous;
  const percentChange = getPercentChange(current, previous);
  const compareTone = getCompareTone(change);
  const arrow = change > 0 ? '↑' : change < 0 ? '↓' : '→';
  const compareText = compareType === 'percent' ? formatPercent(percentChange) : formatCompareNumber(change);

  const content = (
    <>
      <div className="whitespace-nowrap text-xs font-extrabold text-slate-200 xl:text-sm">{label}</div>
      <div className="mt-2.5 flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-1 xl:mt-3 xl:gap-x-2">
        <span className={`min-w-0 whitespace-nowrap text-[clamp(20px,1.45vw,26px)] font-extrabold leading-none tabular-nums ${valueClassName}`}>{formatNumber(current)}</span>
        <span className={`shrink-0 whitespace-nowrap text-[clamp(12px,0.85vw,16px)] font-extrabold tabular-nums ${compareTone}`}>{arrow} {compareText}</span>
      </div>
      <div className="mt-2.5 truncate border-t border-slate-700/45 pt-2 text-xs font-bold tabular-nums text-slate-500 xl:mt-3 xl:pt-2.5 xl:text-sm">
        上期 {formatNumber(previous)}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        aria-label={clickLabel ?? label}
        className="group min-w-0 rounded-md border border-blue-900/40 bg-[#1b3048] p-3 text-left transition hover:border-blue-400/70 hover:bg-[#213a56] focus:outline-none focus:ring-2 focus:ring-blue-400/70 xl:p-4"
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  return (
    <div className="min-w-0 rounded-md border border-blue-900/40 bg-[#1b3048] p-3 xl:p-4">
      {content}
    </div>
  );
};

const PlatformCard: React.FC<{
  platform: PlatformPerformance;
  customers: PlatformCustomerItem[];
  rankCount: number;
  compact?: boolean;
  onPlatformSelect?: (platformName: string) => void;
  onBrandSelect?: (brandName: string) => void;
}> = ({ platform, customers, rankCount, compact = false, onPlatformSelect, onBrandSelect }) => {
  const styles = accentStyles[platform.accentColor];
  const rankedCustomers = [...customers]
    .sort((a, b) => b.consumption - a.consumption)
    .slice(0, rankCount);
  const previousPlatformConsumption = customers.reduce((total, customer) => total + (customer.previousConsumption ?? 0), 0);
  const previousPlatformCustomers = customers.filter((customer) => (customer.previousConsumption ?? 0) > 0).length;

  return (
    <section
      className={`flex min-h-0 flex-col overflow-hidden rounded-lg border ${styles.border} ${styles.top} border-t-2 bg-[#152437] shadow-lg shadow-black/20 ${compact ? 'min-h-[380px]' : ''}`}
      style={detailFontStyle}
    >
      <div className="px-3 pb-3 pt-3 xl:px-4 xl:pb-3.5 xl:pt-3.5">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            className={`rounded-sm text-left text-xl font-extrabold transition hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/70 xl:text-2xl ${styles.title}`}
            onClick={() => onPlatformSelect?.(platform.name)}
            aria-label={`筛选平台 ${platform.name}`}
          >
            {platform.name}
          </button>
          <span className="rounded-full border border-blue-400/30 bg-blue-500/15 px-2.5 py-1 text-xs font-extrabold text-blue-100 xl:px-3 xl:text-sm">
            TOP {rankedCustomers.length}
          </span>
        </div>

        <div className="grid min-w-0 grid-cols-[minmax(0,1.55fr)_minmax(104px,0.85fr)] gap-2 xl:grid-cols-[minmax(0,1.65fr)_minmax(120px,0.9fr)] xl:gap-3">
          <MetricBlock
            label="本期消耗量"
            current={platform.periodConsumption}
            previous={previousPlatformConsumption}
            valueClassName={styles.value}
            compareType="percent"
            onClick={() => onPlatformSelect?.(platform.name)}
            clickLabel={`筛选平台 ${platform.name}`}
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

      <div className="dashboard-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-3 pr-1.5">
        <div className="space-y-1.5 pr-2">
          {rankedCustomers.map((customer) => {
            const previousConsumption = customer.previousConsumption ?? 0;
            const change = customer.consumption - previousConsumption;
            const percentChange = getPercentChange(customer.consumption, previousConsumption);
            const compareTone = getCompareTone(change);
            const arrow = change > 0 ? '↑' : change < 0 ? '↓' : '→';

            return (
              <div
                key={customer.name}
                role="button"
                tabIndex={0}
                aria-label={`筛选品牌 ${customer.name}`}
                className={`flex min-h-[70px] cursor-pointer flex-col items-start justify-center rounded-md border border-blue-900/25 bg-gradient-to-r ${styles.row} px-3 py-2 shadow-sm shadow-black/10 transition hover:border-blue-400/70 hover:bg-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-400/70`}
                onClick={() => onBrandSelect?.(customer.name)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onBrandSelect?.(customer.name);
                  }
                }}
              >
                <div className="w-full truncate text-sm font-extrabold text-slate-50">{customer.name}</div>
                <div className={`mt-0.5 flex w-full items-baseline gap-1.5 text-xl font-extrabold tabular-nums ${compareTone}`}>
                  <span>{formatNumber(customer.consumption)}</span>
                  <span className="text-sm font-extrabold">{arrow} {formatPercent(percentChange)}</span>
                </div>
                <div className="mt-0.5 text-[11px] font-bold tabular-nums text-slate-500">上期 {formatNumber(previousConsumption)}</div>
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
  compact?: boolean;
  onPlatformSelect?: (platformName: string) => void;
  onBrandSelect?: (brandName: string) => void;
}> = ({ data, rankCount, selectedPlatform, brandName, compact = false, onPlatformSelect, onBrandSelect }) => {
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

      <div
        className={`grid min-h-0 flex-1 gap-3 ${
          compact
            ? 'grid-cols-1 overflow-y-auto pr-1 dashboard-scrollbar'
            : `overflow-hidden ${platformViews.length === 1 ? 'grid-cols-1' : 'grid-cols-3'}`
        }`}
      >
        {platformViews.length > 0 ? (
          platformViews.map(({ platform, customers }) => (
            <PlatformCard
              key={platform.name}
              platform={platform}
              customers={customers}
              rankCount={rankCount}
              compact={compact && platformViews.length > 1}
              onPlatformSelect={onPlatformSelect}
              onBrandSelect={onBrandSelect}
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
