import React from 'react';
import { DashboardHeader } from '../components/DashboardHeader';
import { FilterPanel } from '../components/FilterPanel';
import { TaskCompletionPanel } from '../components/TaskCompletionPanel';
import { CustomerDetailsPanel } from '../components/CustomerDetailsPanel';
import { SevenDayTrendPanel } from '../components/SevenDayTrendPanel';
import { RawDataView } from '../components/RawDataView';
import { buildDashboardData, buildSevenDayTrendData } from '../lib/mock-data';

const getDateKey = (offsetDays: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Dashboard: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<'dashboard' | 'raw'>('dashboard');
  const [filters, setFilters] = React.useState({
    rankCount: 15,
    selectedPlatform: '',
    brandName: '',
    startDate: getDateKey(0),
    endDate: getDateKey(0),
    previousStartDate: getDateKey(-1),
    previousEndDate: getDateKey(-1),
  });
  const dashboardData = React.useMemo(() => buildDashboardData(filters), [filters]);
  const trendData = React.useMemo(() => buildSevenDayTrendData(filters), [filters]);
  const isFocusedDashboard = Boolean(filters.selectedPlatform || filters.brandName.trim());
  const updateFilterValue = React.useCallback((nextFilters: Partial<typeof filters>) => {
    setViewMode('dashboard');
    setFilters((currentFilters) => ({
      ...currentFilters,
      ...nextFilters,
    }));
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0a0a1a] text-slate-50 overflow-hidden">
      <DashboardHeader />
      <FilterPanel
        filters={filters}
        onApplyFilters={setFilters}
        onOpenRawData={() => setViewMode('raw')}
      />

      {viewMode === 'raw' ? (
        <RawDataView filters={filters} onBack={() => setViewMode('dashboard')} />
      ) : (
        <main className="flex-1 overflow-y-auto p-3 md:p-4 2xl:p-6 no-scrollbar">
          <div className="grid h-full w-full grid-cols-1 gap-4 lg:grid-cols-12 2xl:gap-6">
            {/* Left Column - Task Completion */}
            <div className="lg:col-span-3">
              <TaskCompletionPanel data={dashboardData} />
            </div>

            {isFocusedDashboard && (
              <div className="min-h-[420px] lg:col-span-6">
                <SevenDayTrendPanel
                  data={trendData}
                  endDate={filters.endDate}
                  selectedPlatform={filters.selectedPlatform}
                  brandName={filters.brandName}
                />
              </div>
            )}

            {/* Right Column - Customer Details */}
            <div className={`h-full min-h-[600px] ${isFocusedDashboard ? 'lg:col-span-3' : 'lg:col-span-9'}`}>
              <CustomerDetailsPanel
                rankCount={filters.rankCount}
                selectedPlatform={filters.selectedPlatform}
                brandName={filters.brandName}
                data={dashboardData}
                compact={isFocusedDashboard}
                onPlatformSelect={(platformName) => updateFilterValue({ selectedPlatform: platformName })}
                onBrandSelect={(nextBrandName) => updateFilterValue({ brandName: nextBrandName })}
              />
            </div>
          </div>
        </main>
      )}

      {/* Footer / Status Bar */}
      <footer className="h-8 bg-[#0d0d1d] border-t border-slate-800 flex items-center justify-between px-6 text-[10px] text-slate-500 shrink-0">
        <div className="flex gap-4">
          <span>系统状态: 运行中</span>
          <span>数据更新: 2026-06-14 12:38:58</span>
        </div>
        <div>
          © 2026 杭州沃虎科技有限公司 版权所有
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
