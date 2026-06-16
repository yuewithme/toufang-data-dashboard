import React from 'react';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Database, RefreshCcw } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const mockBrands = ['星河科技', '云启教育', '蓝海医美', '智达家居', '华耀电商', '新锐汽车', '明德教育'];
const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

type CalendarDay = {
  date: Date;
  dateKey: string;
  day: number;
  isCurrentMonth: boolean;
};

const pad2 = (value: number) => String(value).padStart(2, '0');

const toDateKey = (date: Date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

const getTodayDateKey = () => toDateKey(new Date());

const getCurrentMonthRange = () => {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  return {
    start: toDateKey(monthStart),
    end: toDateKey(today),
  };
};

const initialStartDate = getTodayDateKey();
const initialEndDate = initialStartDate;

const fromDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const addDays = (date: Date, amount: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

const addMonths = (date: Date, amount: number) => new Date(date.getFullYear(), date.getMonth() + amount, 1);

const getMonthGrid = (monthDate: Date): CalendarDay[] => {
  const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const gridStart = addDays(monthStart, -monthStart.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);
    return {
      date,
      dateKey: toDateKey(date),
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === monthStart.getMonth(),
    };
  });
};

const getPreviousRange = (startDate: string, endDate: string) => {
  const start = fromDateKey(startDate);
  const end = fromDateKey(endDate);
  const dayMs = 24 * 60 * 60 * 1000;
  const durationDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / dayMs) + 1);
  const previousEnd = addDays(start, -1);
  const previousStart = addDays(previousEnd, -(durationDays - 1));

  return {
    start: toDateKey(previousStart),
    end: toDateKey(previousEnd),
  };
};

const getMonthTitle = (date: Date) => `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`;

const isBetween = (dateKey: string, startDate: string, endDate: string) => dateKey > startDate && dateKey < endDate;

const DateRangeCalendar: React.FC<{
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
  onClose: () => void;
}> = ({ startDate, endDate, onChange, onClose }) => {
  const [visibleMonth, setVisibleMonth] = React.useState(() => new Date(fromDateKey(startDate).getFullYear(), fromDateKey(startDate).getMonth(), 1));
  const [draftStartDate, setDraftStartDate] = React.useState(startDate);
  const [draftEndDate, setDraftEndDate] = React.useState(endDate);
  const [selectingEnd, setSelectingEnd] = React.useState(false);

  const leftMonth = visibleMonth;
  const rightMonth = addMonths(visibleMonth, 1);

  const commitRange = (nextStart: string, nextEnd: string) => {
    const normalizedStart = nextStart <= nextEnd ? nextStart : nextEnd;
    const normalizedEnd = nextStart <= nextEnd ? nextEnd : nextStart;
    setDraftStartDate(normalizedStart);
    setDraftEndDate(normalizedEnd);
    onChange(normalizedStart, normalizedEnd);
  };

  const selectDate = (dateKey: string) => {
    if (!selectingEnd) {
      setDraftStartDate(dateKey);
      setDraftEndDate(dateKey);
      setSelectingEnd(true);
      return;
    }

    commitRange(draftStartDate, dateKey);
    setSelectingEnd(false);
    onClose();
  };

  const applyShortcut = (shortcut: 'today' | 'last7Days' | 'currentMonth') => {
    const today = new Date();
    let nextStartDate = toDateKey(today);
    let nextEndDate = toDateKey(today);

    if (shortcut === 'last7Days') {
      nextStartDate = toDateKey(addDays(today, -6));
    }

    if (shortcut === 'currentMonth') {
      const monthRange = getCurrentMonthRange();
      nextStartDate = monthRange.start;
      nextEndDate = monthRange.end;
    }

    commitRange(nextStartDate, nextEndDate);
    setSelectingEnd(false);
    onClose();
  };

  const renderMonth = (monthDate: Date) => (
    <div className="w-[300px] px-4 py-3">
      <div className="mb-3 text-center text-base text-slate-700">{getMonthTitle(monthDate)}</div>
      <div className="mb-2 grid grid-cols-7 text-center text-xs text-slate-700">
        {weekDays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1 border-t border-slate-200 pt-2 text-center text-xs">
        {getMonthGrid(monthDate).map((day) => {
          const isStart = day.dateKey === draftStartDate;
          const isEnd = day.dateKey === draftEndDate;
          const inRange = isBetween(day.dateKey, draftStartDate, draftEndDate);

          return (
            <button
              key={day.dateKey}
              type="button"
              data-testid="calendar-day"
              data-date={day.dateKey}
              className={cn(
                'mx-auto h-8 w-8 rounded text-xs transition-colors',
                day.isCurrentMonth ? 'text-slate-700 hover:bg-blue-50' : 'text-slate-300 hover:bg-slate-50',
                inRange && 'bg-blue-50 text-blue-600',
                (isStart || isEnd) && 'bg-blue-600 font-semibold text-white hover:bg-blue-600',
              )}
              onClick={() => selectDate(day.dateKey)}
            >
              {day.day}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="absolute left-[72px] top-10 z-30 rounded border border-slate-200 bg-white text-slate-900 shadow-2xl shadow-black/30">
      <div className="absolute left-10 top-[-7px] h-3 w-3 rotate-45 border-l border-t border-slate-200 bg-white" />
      <button
        type="button"
        className="absolute left-5 top-5 rounded p-1 text-slate-500 hover:bg-slate-100"
        aria-label="上一年"
        onClick={() => setVisibleMonth((month) => addMonths(month, -12))}
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="absolute left-12 top-5 rounded p-1 text-slate-500 hover:bg-slate-100"
        aria-label="上一月"
        onClick={() => setVisibleMonth((month) => addMonths(month, -1))}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="absolute right-12 top-5 rounded p-1 text-slate-500 hover:bg-slate-100"
        aria-label="下一月"
        onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="absolute right-5 top-5 rounded p-1 text-slate-500 hover:bg-slate-100"
        aria-label="下一年"
        onClick={() => setVisibleMonth((month) => addMonths(month, 12))}
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
      <div className="flex">
        {renderMonth(leftMonth)}
        <div className="w-px bg-slate-200" />
        {renderMonth(rightMonth)}
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
        <button
          type="button"
          className="h-8 rounded border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          onClick={() => applyShortcut('today')}
        >
          当天
        </button>
        <button
          type="button"
          className="h-8 rounded border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          onClick={() => applyShortcut('last7Days')}
        >
          近七天
        </button>
        <button
          type="button"
          className="h-8 rounded border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          onClick={() => applyShortcut('currentMonth')}
        >
          本月
        </button>
      </div>
    </div>
  );
};

const BrandCombobox: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const filteredBrands = mockBrands.filter((brand) => brand.includes(value.trim()));
  const visibleBrands = value.trim() ? filteredBrands : mockBrands;

  return (
    <label className="relative flex items-center gap-2">
      <span className="font-semibold text-slate-200">品牌名称</span>
      <div className="relative">
        <input
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="请输入"
          className="h-8 w-[140px] rounded border border-slate-700 bg-[#0d1425] px-3 pr-8 text-slate-100 outline-none placeholder:text-slate-600 focus:border-blue-500"
        />
        <button
          type="button"
          aria-label="展开品牌选项"
          className="absolute right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          onClick={() => setIsOpen((open) => !open)}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>

        {isOpen && (
          <div className="absolute left-0 top-10 z-30 max-h-[220px] w-[220px] overflow-y-auto rounded-lg border border-blue-900/60 bg-[#101a2e] p-1 shadow-2xl shadow-black/40">
            {visibleBrands.length > 0 ? (
              visibleBrands.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  className={cn(
                    'flex h-9 w-full items-center rounded-md px-3 text-left text-xs font-semibold text-slate-200 hover:bg-blue-950/50',
                    value === brand && 'bg-blue-900/40 text-blue-200',
                  )}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onChange(brand);
                    setIsOpen(false);
                  }}
                >
                  {brand}
                </button>
              ))
            ) : (
              <div className="px-3 py-3 text-xs text-slate-500">暂无匹配品牌</div>
            )}
          </div>
        )}
      </div>
    </label>
  );
};

type FilterPanelProps = {
  filters: {
    rankCount: number;
    selectedPlatform: string;
    brandName: string;
    startDate: string;
    endDate: string;
    previousStartDate: string;
    previousEndDate: string;
  };
  onApplyFilters: (filters: {
    rankCount: number;
    selectedPlatform: string;
    brandName: string;
    startDate: string;
    endDate: string;
    previousStartDate: string;
    previousEndDate: string;
  }) => void;
  onOpenRawData: () => void;
};

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onApplyFilters,
  onOpenRawData,
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState(initialStartDate);
  const [endDate, setEndDate] = React.useState(initialEndDate);
  const [draftRankCount, setDraftRankCount] = React.useState(filters.rankCount);
  const [draftBrandName, setDraftBrandName] = React.useState(filters.brandName);
  const [draftSelectedPlatform, setDraftSelectedPlatform] = React.useState(filters.selectedPlatform);

  const previousRange = getPreviousRange(startDate, endDate);

  const applyFilterChanges = (nextFilters: Partial<typeof filters>) => {
    const nextStartDate = nextFilters.startDate ?? startDate;
    const nextEndDate = nextFilters.endDate ?? endDate;
    const nextPreviousRange = getPreviousRange(nextStartDate, nextEndDate);

    onApplyFilters({
      rankCount: nextFilters.rankCount ?? draftRankCount,
      selectedPlatform: nextFilters.selectedPlatform ?? draftSelectedPlatform,
      brandName: (nextFilters.brandName ?? draftBrandName).trim(),
      startDate: nextStartDate,
      endDate: nextEndDate,
      previousStartDate: nextPreviousRange.start,
      previousEndDate: nextPreviousRange.end,
    });
  };

  const resetFilters = () => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setDraftRankCount(15);
    setDraftBrandName('');
    setDraftSelectedPlatform('');
    onApplyFilters({
      rankCount: 15,
      selectedPlatform: '',
      brandName: '',
      startDate: initialStartDate,
      endDate: initialEndDate,
      previousStartDate: getPreviousRange(initialStartDate, initialEndDate).start,
      previousEndDate: getPreviousRange(initialStartDate, initialEndDate).end,
    });
    setIsDatePickerOpen(false);
  };

  return (
    <section className="mx-2 mt-3 shrink-0 rounded-lg border border-blue-900/50 bg-[#101a2e] shadow-lg shadow-black/10">
      {/* 变更原因：日期选择需要支持双月弹窗范围选择，并联动本期/上期时间范围。 */}
      <div className="flex flex-wrap items-center gap-4 px-4 py-3 text-xs">
        <div className="relative flex items-center gap-2">
          <span className="font-semibold text-slate-200">
            <span className="text-red-400">*</span> 消耗日期
          </span>
          <button
            type="button"
            data-testid="date-range-trigger"
            className="flex h-8 min-w-[270px] items-center gap-3 rounded border border-slate-700 bg-[#0d1425] px-3 text-left text-slate-100 outline-none hover:border-blue-500 focus:border-blue-500"
            onClick={() => setIsDatePickerOpen((open) => !open)}
          >
            <CalendarDays className="h-4 w-4 text-slate-400" />
            <span className="min-w-[84px] text-center text-slate-300">{startDate || '开始日期'}</span>
            <span className="text-slate-500">-</span>
            <span className="min-w-[84px] text-center text-slate-300">{endDate || '截止日期'}</span>
          </button>

          {isDatePickerOpen && (
            <DateRangeCalendar
              startDate={startDate}
              endDate={endDate}
              onChange={(nextStartDate, nextEndDate) => {
                setStartDate(nextStartDate);
                setEndDate(nextEndDate);
                applyFilterChanges({
                  startDate: nextStartDate,
                  endDate: nextEndDate,
                });
              }}
              onClose={() => setIsDatePickerOpen(false)}
            />
          )}
        </div>

        <label className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">排行数量</span>
          <select
            value={String(draftRankCount)}
            onChange={(event) => {
              const nextRankCount = Number(event.target.value);
              setDraftRankCount(nextRankCount);
              applyFilterChanges({ rankCount: nextRankCount });
            }}
            className="h-8 w-[86px] rounded border border-slate-700 bg-[#0d1425] px-3 text-slate-100 outline-none focus:border-blue-500"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
        </label>

        <BrandCombobox
          value={draftBrandName}
          onChange={(nextBrandName) => {
            setDraftBrandName(nextBrandName);
            applyFilterChanges({ brandName: nextBrandName });
          }}
        />

        <label className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">平台选择</span>
          <select
            value={draftSelectedPlatform}
            onChange={(event) => {
              const nextSelectedPlatform = event.target.value;
              setDraftSelectedPlatform(nextSelectedPlatform);
              applyFilterChanges({ selectedPlatform: nextSelectedPlatform });
            }}
            className="h-8 w-[108px] rounded border border-slate-700 bg-[#0d1425] px-3 text-slate-100 outline-none focus:border-blue-500"
          >
            <option value=""> </option>
            <option value="小红书">小红书</option>
            <option value="视频号">视频号</option>
            <option value="支付宝">支付宝</option>
          </select>
        </label>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 border-slate-700 bg-[#111b2f] px-4 text-xs text-slate-200 hover:bg-slate-800"
          onClick={resetFilters}
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          重置
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 border-blue-500/50 bg-blue-500/10 px-4 text-xs font-bold text-blue-100 hover:bg-blue-500/20"
          onClick={onOpenRawData}
        >
          <Database className="h-3.5 w-3.5" />
          原始数据
        </Button>
      </div>

      <div className="border-t border-blue-900/40 px-4 py-2 text-xs text-slate-400">
        本期：{startDate}至{endDate}，上期：{previousRange.start}至{previousRange.end}
      </div>
    </section>
  );
};
