import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DailyTrendPoint } from '../lib/mock-data';

const formatNumber = (value: number) => value.toLocaleString('en-US');

const formatCompactMoney = (value: number) => {
  if (value >= 10000) return `${Math.round(value / 10000).toLocaleString('en-US')}万`;
  return formatNumber(value);
};

export const SevenDayTrendPanel: React.FC<{
  data: DailyTrendPoint[];
  endDate: string;
  selectedPlatform: string;
  brandName: string;
}> = ({ data, endDate, selectedPlatform, brandName }) => {
  const total = data.reduce((sum, item) => sum + item.consumption, 0);
  const peak = data.reduce((max, item) => Math.max(max, item.consumption), 0);
  const scopeText = [
    selectedPlatform || '全部平台',
    brandName.trim() || '全部客户',
  ].join(' / ');

  return (
    <section className="flex h-full min-h-[420px] flex-col rounded-lg border border-blue-900/50 bg-[#101a2e] p-3 shadow-lg shadow-black/20 2xl:p-4">
      <div className="mb-3 flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-300">近七天消耗趋势</h2>
          <div className="mt-1 truncate text-[11px] font-semibold text-slate-500">
            截止 {endDate} · {scopeText}
          </div>
        </div>
        <div className="rounded-full border border-blue-400/30 bg-blue-500/15 px-2.5 py-1 text-xs font-extrabold text-blue-100">
          7天
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2">
        <div className="rounded-md border border-blue-900/40 bg-[#172437] p-3">
          <div className="text-[10px] font-bold text-slate-500">七天总消耗</div>
          <div className="mt-1 whitespace-nowrap text-[clamp(20px,1.8vw,28px)] font-extrabold leading-none tabular-nums text-blue-400">
            {formatNumber(total)}
          </div>
        </div>
        <div className="rounded-md border border-emerald-900/35 bg-[#132d2f] p-3">
          <div className="text-[10px] font-bold text-slate-500">单日峰值</div>
          <div className="mt-1 whitespace-nowrap text-[clamp(20px,1.8vw,28px)] font-extrabold leading-none tabular-nums text-emerald-400">
            {formatNumber(peak)}
          </div>
        </div>
      </div>

      <div className="mt-3 min-h-0 flex-1 rounded-md border border-blue-900/30 bg-[#0d1729] px-2 py-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: -10 }}>
            <CartesianGrid stroke="rgba(59, 130, 246, 0.14)" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
              tickFormatter={formatCompactMoney}
              width={52}
            />
            <Tooltip
              cursor={{ stroke: 'rgba(96, 165, 250, 0.28)', strokeWidth: 1 }}
              contentStyle={{
                background: '#0f1a2e',
                border: '1px solid rgba(59, 130, 246, 0.45)',
                borderRadius: 8,
                color: '#e2e8f0',
                boxShadow: '0 18px 48px rgba(0,0,0,0.35)',
              }}
              labelStyle={{ color: '#93c5fd', fontWeight: 800 }}
              formatter={(value) => [formatNumber(Number(value)), '消耗']}
              labelFormatter={(label) => `${label}`}
            />
            <Line
              type="monotone"
              dataKey="consumption"
              stroke="#60a5fa"
              strokeWidth={3}
              dot={{ r: 3, strokeWidth: 2, fill: '#0d1729', stroke: '#60a5fa' }}
              activeDot={{ r: 5, strokeWidth: 2, fill: '#3b82f6', stroke: '#bfdbfe' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
