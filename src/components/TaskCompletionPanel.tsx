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
  previousLabel: string;
  previousValue: number;
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
    previousLabel: '上期总消耗',
    previousValue: data.previousPeriodConsumption,
    tone: 'text-blue-400',
    compare: {
      value: getPercentChange(data.periodConsumption, data.previousPeriodConsumption),
      text: formatComparePercent(getPercentChange(data.periodConsumption, data.previousPeriodConsumption)),
    },
    className: 'border-blue-900/40 bg-[#172437]',
  },
  {
    label: '本期日均消耗',
    value: data.periodAverageConsumption,
    previousLabel: '上期日均消耗',
    previousValue: data.previousPeriodAverageConsumption,
    tone: 'text-emerald-400',
    compare: {
      value: getPercentChange(data.periodAverageConsumption, data.previousPeriodAverageConsumption),
      text: formatComparePercent(getPercentChange(data.periodAverageConsumption, data.previousPeriodAverageConsumption)),
    },
    className: 'border-emerald-900/30 bg-[#142d34]',
  },
];

const getCustomerStats = (data: DashboardData): StatCard[] => [
  {
    label: '本期客户量',
    value: data.periodCustomers,
    previousLabel: '上期客户量',
    previousValue: data.previousPeriodCustomers,
    tone: 'text-cyan-300',
    compare: {
      value: data.periodCustomers - data.previousPeriodCustomers,
      text: formatCompareNumber(data.periodCustomers - data.previousPeriodCustomers),
    },
    className: 'border-cyan-900/40 bg-[#102436]',
  },
  {
    label: '本期日均客户',
    value: data.periodAverageCustomers,
    previousLabel: '上期日均客户',
    previousValue: data.previousPeriodAverageCustomers,
    tone: 'text-lime-300',
    compare: {
      value: data.periodAverageCustomers - data.previousPeriodAverageCustomers,
      text: formatCompareNumber(data.periodAverageCustomers - data.previousPeriodAverageCustomers),
    },
    className: 'border-lime-900/30 bg-[#152b25]',
  },
];

const StatGrid: React.FC<{ items: StatCard[] }> = ({ items }) => (
  <div className="grid grid-cols-1 gap-2 2xl:gap-3.5">
    {items.map((stat) => {
      const isUp = stat.compare ? stat.compare.value > 0 : false;
      const isDown = stat.compare ? stat.compare.value < 0 : false;
      const compareClassName = isUp
        ? 'text-[#b91c1c]'
        : isDown
          ? 'text-[#047857]'
          : 'text-slate-500';

      return (
        <Card key={stat.label} className={`${stat.className} min-h-[78px] shadow-lg 2xl:min-h-[104px]`}>
          <CardContent className="flex h-full flex-col justify-center gap-1 p-3 2xl:gap-2 2xl:p-4">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 2xl:text-xs">{stat.label}</span>
              <div className="mt-1 flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5 2xl:mt-2 2xl:gap-x-3">
                <span className={`whitespace-nowrap text-[clamp(20px,1.55vw,29px)] font-bold leading-none tabular-nums 2xl:text-[clamp(26px,2vw,36px)] ${stat.tone}`}>{formatNumber(stat.value)}</span>
                {stat.compare && (
                  <span className={`whitespace-nowrap text-[clamp(13px,0.9vw,17px)] font-extrabold tabular-nums leading-none drop-shadow 2xl:text-[clamp(17px,1.15vw,21px)] ${compareClassName}`}>
                    {isUp ? '↑' : isDown ? '↓' : '→'} {stat.compare.text}
                  </span>
                )}
              </div>
            </div>
            <div className="text-[10px] font-bold tabular-nums text-slate-500 2xl:text-xs">
              上期 {formatNumber(stat.previousValue)}
            </div>
          </CardContent>
        </Card>
      );
    })}
  </div>
);

export const TaskCompletionPanel: React.FC<{ data: DashboardData }> = ({ data }) => {
  return (
    <div className="flex flex-col gap-2.5 2xl:gap-4">
      <section className="flex flex-col gap-2 2xl:gap-3">
        <h2 className="px-1 text-xs font-semibold text-slate-400 2xl:text-sm">消耗数据统计</h2>
        <StatGrid items={getConsumptionStats(data)} />
      </section>

      <section className="flex flex-col gap-2 2xl:gap-3">
        <h2 className="px-1 text-xs font-semibold text-slate-400 2xl:text-sm">客户数据统计</h2>
        <StatGrid items={getCustomerStats(data)} />
      </section>
    </div>
  );
};
