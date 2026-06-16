import React from 'react';
import { ArrowLeft, Database, FilePlus2, PencilLine, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import {
  agencyAccountOptions,
  DateRangeFilters,
  RawSourceDataRow,
  getRawSourceRows,
  normalizePlatform,
} from '../lib/mock-data';

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

type RecordFormValues = {
  customerGroup: string;
  nonGiftConsumption: string;
  agencyAccountName: string;
};

type RecordDialogState = {
  mode: 'create' | 'edit';
  rowId?: string;
  values: RecordFormValues;
} | null;

const getRowId = (row: RawSourceDataRow) => `${row.customerAccountId}-${row.consumeDate}`;

const getDefaultAgencyAccount = (selectedPlatform?: string) => {
  const option = agencyAccountOptions.find((agencyAccountName) => normalizePlatform(agencyAccountName) === selectedPlatform);
  return option ?? agencyAccountOptions[0];
};

const createEmptyFormValues = (selectedPlatform?: string): RecordFormValues => ({
  customerGroup: '沃虎&新增客户代投对接群',
  nonGiftConsumption: '',
  agencyAccountName: getDefaultAgencyAccount(selectedPlatform),
});

const toNumber = (value: string) => Number(value.replace(/,/g, '').trim());

const filterRawRows = (rawRows: RawSourceDataRow[], filters: DateRangeFilters) => {
  const normalizedBrandName = filters.brandName?.trim() ?? '';

  return rawRows
    .filter((row) => row.customerGroup.includes('代投'))
    .filter((row) => row.consumeDate >= filters.startDate)
    .filter((row) => row.consumeDate <= filters.endDate)
    .filter((row) => !filters.selectedPlatform || row.platform === filters.selectedPlatform)
    .filter((row) => !normalizedBrandName || row.brandName.includes(normalizedBrandName))
    .sort((a, b) => {
      if (a.consumeDate !== b.consumeDate) return b.consumeDate.localeCompare(a.consumeDate);
      if (a.platform !== b.platform) return a.platform.localeCompare(b.platform);
      return b.nonGiftConsumption - a.nonGiftConsumption;
    });
};

export const RawDataView: React.FC<{
  filters: DateRangeFilters;
  onBack: () => void;
}> = ({ filters, onBack }) => {
  const [rawRows, setRawRows] = React.useState<RawSourceDataRow[]>(() => getRawSourceRows());
  const [selectedRowIds, setSelectedRowIds] = React.useState<Set<string>>(() => new Set());
  const [actionHint, setActionHint] = React.useState('请选择需要操作的原始数据记录');
  const [recordDialog, setRecordDialog] = React.useState<RecordDialogState>(null);
  const rows = React.useMemo(() => filterRawRows(rawRows, filters), [rawRows, filters]);
  const selectedCount = selectedRowIds.size;
  const allRowsSelected = rows.length > 0 && selectedCount === rows.length;
  const selectedRows = React.useMemo(() => rows.filter((row) => selectedRowIds.has(getRowId(row))), [rows, selectedRowIds]);

  React.useEffect(() => {
    setSelectedRowIds(new Set());
    setActionHint('筛选条件已更新，原始数据表变更已保留');
    setRecordDialog(null);
  }, [filters]);

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
    setRecordDialog({
      mode: 'create',
      values: createEmptyFormValues(filters.selectedPlatform),
    });
    setActionHint('新增记录：填写客户群、非赠款消耗、代理商账户名后保存');
  };

  const handleEdit = () => {
    if (selectedRows.length !== 1) {
      setActionHint(selectedRows.length === 0 ? '请先勾选一条要修改的记录' : '修改记录一次只能选择一条记录');
      return;
    }

    const row = selectedRows[0];
    setRecordDialog({
      mode: 'edit',
      rowId: getRowId(row),
      values: {
        customerGroup: row.customerGroup,
        nonGiftConsumption: String(row.nonGiftConsumption),
        agencyAccountName: row.agencyAccountName,
      },
    });
    setActionHint(`修改记录：正在编辑 ${row.customerAccountName}`);
  };

  const handleDelete = () => {
    if (selectedRows.length === 0) {
      setActionHint('请先勾选要删除的记录');
      return;
    }

    setRawRows((currentRows) =>
      currentRows.map((row) => {
        if (!selectedRowIds.has(getRowId(row))) return row;

        return {
          ...row,
          // 变更原因：删除在业务上等价于让记录不再命中“客户群包含代投”的基础筛选。
          customerGroup: row.customerGroup.replace(/代投/g, '') || '已删除记录',
        };
      }),
    );
    setActionHint(`删除记录：${selectedRows.length} 条记录已不再通过“代投”筛选`);
    setSelectedRowIds(new Set());
  };

  const closeRecordDialog = () => {
    setRecordDialog(null);
  };

  const updateFormValue = (field: keyof RecordFormValues, value: string) => {
    setRecordDialog((dialog) => {
      if (!dialog) return dialog;

      return {
        ...dialog,
        values: {
          ...dialog.values,
          [field]: value,
        },
      };
    });
  };

  const saveRecordDialog = () => {
    if (!recordDialog) return;

    const consumption = toNumber(recordDialog.values.nonGiftConsumption);
    if (!recordDialog.values.customerGroup.trim()) {
      setActionHint('客户群不能为空');
      return;
    }

    if (Number.isNaN(consumption) || consumption < 0) {
      setActionHint('非赠款消耗必须是大于等于 0 的数字');
      return;
    }

    const platform = normalizePlatform(recordDialog.values.agencyAccountName);

    if (recordDialog.mode === 'edit' && recordDialog.rowId) {
      const nextCustomerGroup = recordDialog.values.customerGroup.trim();
      setRawRows((currentRows) =>
        currentRows.map((row) =>
          getRowId(row) === recordDialog.rowId
            ? {
                ...row,
                customerGroup: nextCustomerGroup,
                nonGiftConsumption: Math.round(consumption * 100) / 100,
                agencyAccountName: recordDialog.values.agencyAccountName,
                platform,
              }
            : row,
        ),
      );
      setSelectedRowIds(new Set());
      setActionHint(nextCustomerGroup.includes('代投') ? '修改记录：已保存客户群、非赠款消耗、代理商账户名' : '修改记录：已保存，但该记录不再通过“代投”筛选');
      setRecordDialog(null);
      return;
    }

    const createdAt = Date.now();
    const newRow: RawSourceDataRow = {
      customerAccountId: `${filters.startDate.replace(/-/g, '')}${createdAt}`,
      customerAccountName: '沃虎-新增记录',
      brandName: filters.brandName || '新增记录',
      companyEntity: '杭州沃虎科技有限公司',
      agencyAccountName: recordDialog.values.agencyAccountName,
      customerGroup: recordDialog.values.customerGroup.trim(),
      nonGiftConsumption: Math.round(consumption * 100) / 100,
      brandAdGroup: 0,
      biddingAdGroup: 0,
      giftConsumption: 0,
      returnPointTotal: 1,
      returnPointCash: 1,
      remark: '新增记录',
      consumeDate: filters.startDate,
      platform,
    };

    setRawRows((currentRows) => [newRow, ...currentRows]);
    if (newRow.customerGroup.includes('代投')) {
      setSelectedRowIds(new Set([getRowId(newRow)]));
      setActionHint('新增记录：已新增并自动选中');
    } else {
      setSelectedRowIds(new Set());
      setActionHint('新增记录：已保存，但该记录不通过“代投”筛选');
    }
    setRecordDialog(null);
  };

  return (
    <main className="flex-1 overflow-hidden p-3 md:p-4 2xl:p-6">
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

        {recordDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
            <div className="w-full max-w-[560px] rounded-md bg-white text-slate-900 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between px-5 py-4">
                <h3 className="text-base font-medium text-slate-800">
                  {recordDialog.mode === 'create' ? '消耗记录新增' : '消耗记录修改'}
                </h3>
                <button
                  type="button"
                  aria-label="关闭弹窗"
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  onClick={closeRecordDialog}
                >
                  ×
                </button>
              </div>

              <div className="space-y-5 px-9 py-5">
                <label className="grid grid-cols-[84px_1fr] items-center gap-4 text-sm">
                  <span className="text-right font-semibold text-slate-600">客户群</span>
                  <input
                    value={recordDialog.values.customerGroup}
                    onChange={(event) => updateFormValue('customerGroup', event.target.value)}
                    className="h-9 rounded border border-slate-300 px-3 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="请输入客户群，包含代投才会通过筛选"
                  />
                </label>

                <label className="grid grid-cols-[84px_1fr] items-center gap-4 text-sm">
                  <span className="text-right font-semibold text-slate-600">非赠款消耗</span>
                  <input
                    value={recordDialog.values.nonGiftConsumption}
                    onChange={(event) => updateFormValue('nonGiftConsumption', event.target.value)}
                    className="h-9 rounded border border-slate-300 px-3 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="请输入非赠款消耗"
                    inputMode="decimal"
                  />
                </label>

                <label className="grid grid-cols-[84px_1fr] items-center gap-4 text-sm">
                  <span className="text-right font-semibold text-slate-600">代理商账户</span>
                  <select
                    value={recordDialog.values.agencyAccountName}
                    onChange={(event) => updateFormValue('agencyAccountName', event.target.value)}
                    className="h-9 rounded border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {agencyAccountOptions.map((agencyAccountName) => (
                      <option key={agencyAccountName} value={agencyAccountName}>
                        {agencyAccountName}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="pl-[100px] text-xs text-slate-500">
                  平台字段不在原始数据中填写，将按代理商账户名自动映射为：{normalizePlatform(recordDialog.values.agencyAccountName)}
                </div>
              </div>

              <div className="flex justify-end gap-3 px-9 pb-6 pt-4">
                <Button
                  type="button"
                  className="h-9 bg-blue-600 px-5 text-sm text-white hover:bg-blue-500"
                  onClick={saveRecordDialog}
                >
                  确定
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 border-slate-300 bg-white px-5 text-sm text-slate-600 hover:bg-slate-50"
                  onClick={closeRecordDialog}
                >
                  取消
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};
