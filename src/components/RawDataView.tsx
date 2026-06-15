import React from 'react';
import { ArrowLeft, Database, FilePlus2, PencilLine, Trash2 } from 'lucide-react';
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
  const [selectedRowIds, setSelectedRowIds] = React.useState<Set<string>>(() => new Set());
  const [actionHint, setActionHint] = React.useState('请选择需要操作的原始数据记录');
  const selectedCount = selectedRowIds.size;
  const allRowsSelected = rows.length > 0 && selectedCount === rows.length;

  React.useEffect(() => {
    setSelectedRowIds(new Set());
    setActionHint('筛选条件已更新，请重新选择需要操作的记录');
  }, [rows]);

  const getRowId = (row: RawSourceDataRow) => `${row.customerAccountId}-${row.consumeDate}`;

  const toggleAllRows = () => {
    if (allRowsSelected) {
      setSelectedRowIds(new Set());
      setActionHint('已取消选择全部记录');
      return;
    }

    setSelectedRowIds(new Set(rows.map(getRowId)));
    setActionHint(`已选择全部 ${rows.length} 条记录`);
  };

  const toggleRow = (row: RawSourceDataRow) => {
    const rowId = getRowId(row);
    const nextSelectedRowIds = new Set(selectedRowIds);

    if (nextSelectedRowIds.has(rowId)) {
      nextSelectedRowIds.delete(rowId);
    } else {
      nextSelectedRowIds.add(rowId);
    }

    setSelectedRowIds(nextSelectedRowIds);
    setActionHint(nextSelectedRowIds.size > 0 ? `已选择 ${nextSelectedRowIds.size} 条记录` : '请选择需要操作的原始数据记录');
  };

  const handleCreate = () => {
    setActionHint('新增记录：后续可在这里打开新增表单，当前先保留操作入口');
  };

  const handleEdit = () => {
    setActionHint(selectedCount > 0 ? `修改记录：已选择 ${selectedCount} 条记录` : '请先勾选要修改的记录');
  };

  const handleDelete = () => {
    setActionHint(selectedCount > 0 ? `删除记录：已选择 ${selectedCount} 条记录` : '请先勾选要删除的记录');
  };

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

          <div className="flex items-center gap-2">
            <div className="mr-2 hidden text-xs font-semibold text-slate-400 xl:block">{actionHint}</div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 border-emerald-500/45 bg-emerald-500/10 px-3 text-xs font-bold text-emerald-100 hover:bg-emerald-500/20"
              onClick={handleCreate}
            >
              <FilePlus2 className="h-3.5 w-3.5" />
              新增记录
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 border-blue-500/45 bg-blue-500/10 px-3 text-xs font-bold text-blue-100 hover:bg-blue-500/20"
              onClick={handleEdit}
            >
              <PencilLine className="h-3.5 w-3.5" />
              修改记录
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 border-rose-500/45 bg-rose-500/10 px-3 text-xs font-bold text-rose-100 hover:bg-rose-500/20"
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
              删除记录
            </Button>
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
        </div>

        <div className="min-h-0 flex-1 overflow-auto dashboard-scrollbar">
          <table className="min-w-[1820px] w-full border-separate border-spacing-0 text-left text-xs">
            <thead className="sticky top-0 z-10 bg-[#132038] text-slate-300">
              <tr>
                <th className="sticky left-0 z-20 w-12 border-b border-blue-900/50 bg-[#132038] px-3 py-3 text-center">
                  <input
                    type="checkbox"
                    aria-label="选择全部原始数据"
                    checked={allRowsSelected}
                    onChange={toggleAllRows}
                    className="h-4 w-4 rounded border-slate-600 bg-[#0d1425] accent-blue-500"
                  />
                </th>
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
              {rows.map((row) => {
                const rowId = getRowId(row);
                const isSelected = selectedRowIds.has(rowId);

                return (
                  <tr key={rowId} className={`group ${isSelected ? 'bg-blue-950/35' : ''}`}>
                    <td className="sticky left-0 z-10 w-12 border-b border-blue-900/25 bg-[#101a2e] px-3 py-3 text-center group-hover:bg-blue-950/40">
                      <input
                        type="checkbox"
                        aria-label={`选择记录 ${row.customerAccountName}`}
                        checked={isSelected}
                        onChange={() => toggleRow(row)}
                        className="h-4 w-4 rounded border-slate-600 bg-[#0d1425] accent-blue-500"
                      />
                    </td>
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
                );
              })}
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
