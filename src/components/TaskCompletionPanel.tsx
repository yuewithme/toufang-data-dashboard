import React from 'react';
import { Card, CardContent } from './ui/card';
import { mockDashboardData } from '../lib/mock-data';

const formatNumber = (value: number) => value.toLocaleString('en-US');

const getPercentChange = (current: number, previous: number) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

const formatComparePercent = (value: number) => `${Math.abs(value).toFixed(1)}%`;
const formatCompareNumber = (value: number) => `${Math.abs(value)}`;

type StatCard = {
  label: string;
  value: number;
  tone: string;
  className: string;
  compare?: {
    value: number;
    text: string;
  };
};

const consumptionStats: StatCard[] = [
  {
    label: '本期总消耗',
    value: mockDashboardData.periodConsumption,
    tone: 'text-blue-400',
    compare: {
      value: getPercentChange(mockDashboardData.periodConsumption, mockDashboardData.previousPeriodConsumption),
      text: formatComparePercent(getPercentChange(mockDashboardData.periodConsumption, mockDashboardData.previousPeriodConsumption)),
    },
    className: 'border-blue-900/40 bg-[#172437]',
  },
  {
    label: '上期总消耗',
    value: mockDashboardData.previousPeriodConsumption,
    tone: 'text-amber-400',
    className: 'border-amber-900/30 bg-[#1d2031]',
  },
  {
    label: '本期日均消耗',
    value: mockDashboardData.periodAverageConsumption,
    tone: 'text-emerald-400',
    compare: {
      value: getPercentChange(mockDashboardData.periodAverageConsumption, mockDashboardData.previousPeriodAverageConsumption),
      text: formatComparePercent(getPercentChange(mockDashboardData.periodAverageConsumption, mockDashboardData.previousPeriodAverageConsumption)),
    },
    className: 'border-emerald-900/30 bg-[#142d34]',
  },
  {
    label: '上期日均消耗',
    value: mockDashboardData.previousPeriodAverageConsumption,
    tone: 'text-slate-100',
    className: 'border-slate-800 bg-[#161827]',
  },
];

const customerStats: StatCard[] = [
  {
    label: '本期客户量',
    value: mockDashboardData.periodCustomers,
    tone: 'text-cyan-300',
    compare: {
      value: mockDashboardData.periodCustomers - mockDashboardData.previousPeriodCustomers,
      text: formatCompareNumber(mockDashboardData.periodCustomers - mockDashboardData.previousPeriodCustomers),
    },
    className: 'border-cyan-900/40 bg-[#102436]',
  },
  {
    label: '上期客户量',
    value: mockDashboardData.previousPeriodCustomers,
    tone: 'text-violet-300',
    className: 'border-violet-900/30 bg-[#1c1b32]',
  },
  {
    label: '本期日均客户',
    value: mockDashboardData.periodAverageCustomers,
    tone: 'text-lime-300',
    compare: {
      value: mockDashboardData.periodAverageCustomers - mockDashboardData.previousPeriodAverageCustomers,
      text: formatCompareNumber(mockDashboardData.periodAverageCustomers - mockDashboardData.previousPeriodAverageCustomers),
    },
    className: 'border-lime-900/30 bg-[#152b25]',
  },
  {
    label: '上期日均客户',
    value: mockDashboardData.previousPeriodAverageCustomers,
    tone: 'text-slate-100',
    className: 'border-slate-800 bg-[#171827]',
  },
];

const StatGrid: React.FC<{ items: StatCard[] }> = ({ items }) => (
  <div className="grid grid-cols-2 gap-4">
    {items.map((stat) => {
      const isUp = stat.compare ? stat.compare.value > 0 : false;
      const isDown = stat.compare ? stat.compare.value < 0 : false;
      const compareClassName = isUp
        ? 'border-rose-400/30 bg-rose-500/10 text-rose-300'
        : isDown
          ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
          : 'border-slate-500/30 bg-slate-500/10 text-slate-300';

      return (
        <Card key={stat.label} className={`${stat.className} min-h-[132px] shadow-lg`}>
          <CardContent className="flex h-full flex-col justify-between p-5">
            <span className="text-xs font-semibold text-slate-400">{stat.label}</span>
            <div className="flex items-baseline gap-3">
              <span className={`text-3xl font-bold tabular-nums ${stat.tone}`}>{formatNumber(stat.value)}</span>
              {stat.compare && (
                <span className={`rounded-full border px-2 py-0.5 text-xs font-bold tabular-nums ${compareClassName}`}>
                  {isUp ? '↑' : isDown ? '↓' : '→'} {stat.compare.text}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      );
    })}
  </div>
);

export const TaskCompletionPanel: React.FC = () => {
  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-4">
        <h2 className="px-1 text-sm font-medium text-slate-400">消耗数据统计</h2>
        <StatGrid items={consumptionStats} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="px-1 text-sm font-medium text-slate-400">客户数据统计</h2>
        <StatGrid items={customerStats} />
      </section>
    </div>
  );
};
