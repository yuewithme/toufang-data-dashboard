import React from 'react';
import { Card, CardContent } from './ui/card';
import { DashboardData } from '../lib/mock-data';

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

const getConsumptionStats = (data: DashboardData): StatCard[] => [
  {
    label: '本期总消耗',
    value: data.periodConsumption,
    tone: 'text-blue-400',
    compare: {
      value: getPercentChange(data.periodConsumption, data.previousPeriodConsumption),
      text: formatComparePercent(getPercentChange(data.periodConsumption, data.previousPeriodConsumption)),
    },
    className: 'border-blue-900/40 bg-[#172437]',
  },
  {
    label: '上期总消耗',
    value: data.previousPeriodConsumption,
    tone: 'text-amber-400',
    className: 'border-amber-900/30 bg-[#1d2031]',
  },
  {
    label: '本期日均消耗',
    value: data.periodAverageConsumption,
    tone: 'text-emerald-400',
    compare: {
      value: getPercentChange(data.periodAverageConsumption, data.previousPeriodAverageConsumption),
      text: formatComparePercent(getPercentChange(data.periodAverageConsumption, data.previousPeriodAverageConsumption)),
    },
    className: 'border-emerald-900/30 bg-[#142d34]',
  },
  {
    label: '上期日均消耗',
    value: data.previousPeriodAverageConsumption,
    tone: 'text-slate-100',
    className: 'border-slate-800 bg-[#161827]',
  },
];

const getCustomerStats = (data: DashboardData): StatCard[] => [
  {
    label: '本期客户量',
    value: data.periodCustomers,
    tone: 'text-cyan-300',
    compare: {
      value: data.periodCustomers - data.previousPeriodCustomers,
      text: formatCompareNumber(data.periodCustomers - data.previousPeriodCustomers),
    },
    className: 'border-cyan-900/40 bg-[#102436]',
  },
  {
    label: '上期客户量',
    value: data.previousPeriodCustomers,
    tone: 'text-violet-300',
    className: 'border-violet-900/30 bg-[#1c1b32]',
  },
  {
    label: '本期日均客户',
    value: data.periodAverageCustomers,
    tone: 'text-lime-300',
    compare: {
      value: data.periodAverageCustomers - data.previousPeriodAverageCustomers,
      text: formatCompareNumber(data.periodAverageCustomers - data.previousPeriodAverageCustomers),
    },
    className: 'border-lime-900/30 bg-[#152b25]',
  },
  {
    label: '上期日均客户',
    value: data.previousPeriodAverageCustomers,
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
        ? 'text-[#b91c1c]'
        : isDown
          ? 'text-[#047857]'
          : 'text-slate-500';

      return (
        <Card key={stat.label} className={`${stat.className} min-h-[132px] shadow-lg`}>
          <CardContent className="flex h-full flex-col justify-between p-5">
            <span className="text-xs font-semibold text-slate-400">{stat.label}</span>
            <div className="flex items-baseline gap-3">
              <span className={`text-3xl font-bold tabular-nums ${stat.tone}`}>{formatNumber(stat.value)}</span>
              {stat.compare && (
                <span className={`text-[21px] font-extrabold tabular-nums leading-none drop-shadow ${compareClassName}`}>
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

export const TaskCompletionPanel: React.FC<{ data: DashboardData }> = ({ data }) => {
  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-4">
        <h2 className="px-1 text-sm font-medium text-slate-400">消耗数据统计</h2>
        <StatGrid items={getConsumptionStats(data)} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="px-1 text-sm font-medium text-slate-400">客户数据统计</h2>
        <StatGrid items={getCustomerStats(data)} />
      </section>
    </div>
  );
};
