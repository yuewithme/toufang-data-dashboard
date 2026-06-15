import React from 'react';
import { ArrowLeft, Database } from 'lucide-react';
import { Button } from './ui/button';
import { DateRangeFilters, RawSourceDataRow, getRawSourceRows } from '../lib/mock-data';

const formatNumber = (value: number) => value.toLocaleString('en-US', {
  maximumFractionDigits: 2,
});

const columns: Array<{
  key: keyof RawSourceDataRow;
  label: string;
  align?: 'left' | 'right';
  format?: (row: RawSourceDataRow) => React.ReactNode;
}> = [
  { key: 'customerAccountId', label: '客户账户ID' },
  { key: 'customerAccountName', label: '客户账户名' },
  { key: 'brandName', label: '品牌名称' },
  { key: 'companyEntity', label: '公司主体' },
  { key: 'agencyAccountName', label: '代理商账户名' },
  { key: 'customerGroup', label: '客户群' },
  { key: 'nonGiftConsumption', label: '非赠款消耗', align: 'right', format: (row) => formatNumber(row.nonGiftConsumption) },
  { key: 'brandAdGroup', label: '品牌广告组', align: 'right' },
  { key: 'biddingAdGroup', label: '竞价广告组', align: 'right' },
  { key: 'giftConsumption', label: '赠款消耗', align: 'right', format: (row) => formatNumber(row.giftConsumption) },
  { key: 'returnPointTotal', label: '返点（货点）', align: 'right' },
  { key: 'returnPointCash', label: '返点（现金点）', align: 'right' },
  { key: 'remark', label: '备注' },
  { key: 'consumeDate', label: '消耗日期' },
  { key: 'platform', label: '平台' },
];

export const RawDataView: React.FC<{
  filters: DateRangeFilters;
  onBack: () => void;
}> = ({ filters, onBack }) => {
  const rows = React.useMemo(() => getRawSourceRows(filters), [filters]);

  return (
    <main className="flex-1 overflow-hidden p-4 md:p-6">
      <section className="flex h-full flex-col rounded-lg border border-blue-900/50 bg-[#101a2e] shadow-xl shadow-black/20">
        <div className="flex shrink-0 items-center justify-between border-b border-blue-900/40 px-5 py-4">
          <div>
            <div className="flex items-center gap-2 text-lg font-extrabold text-slate-50">
              <Database className="h-5 w-5 text-blue-400" />
              原始数据
            </div>
            <div className="mt-1 text-xs font-medium text-slate-400">
              当前筛选：{filters.startDate} 至 {filters.endDate}
              {filters.selectedPlatform ? ` / ${filters.selectedPlatform}` : ''}
              {filters.brandName ? ` / ${filters.brandName}` : ''}
              <span className="ml-3 text-blue-300">共 {rows.length} 条</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 border-slate-700 bg-[#111b2f] px-4 text-xs text-slate-200 hover:bg-slate-800"
            onClick={onBack}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            返回看板
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto dashboard-scrollbar">
          <table className="min-w-[1760px] w-full border-separate border-spacing-0 text-left text-xs">
            <thead className="sticky top-0 z-10 bg-[#132038] text-slate-300">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`border-b border-blue-900/50 px-4 py-3 font-extrabold ${column.align === 'right' ? 'text-right' : 'text-left'}`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.customerAccountId}-${row.consumeDate}`} className="group">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`max-w-[220px] border-b border-blue-900/25 px-4 py-3 font-semibold text-slate-200 group-hover:bg-blue-950/25 ${column.align === 'right' ? 'text-right tabular-nums text-amber-300' : ''}`}
                      title={String(row[column.key] ?? '')}
                    >
                      <span className="block truncate">
                        {column.format ? column.format(row) : String(row[column.key] ?? '')}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length === 0 && (
            <div className="flex h-48 items-center justify-center text-sm font-bold text-slate-500">
              当前筛选条件下暂无原始数据
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
