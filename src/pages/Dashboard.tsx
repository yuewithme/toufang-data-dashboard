import React from 'react';
import { DashboardHeader } from '../components/DashboardHeader';
import { FilterPanel } from '../components/FilterPanel';
import { TaskCompletionPanel } from '../components/TaskCompletionPanel';
import { CustomerDetailsPanel } from '../components/CustomerDetailsPanel';
import { RawDataView } from '../components/RawDataView';
import { buildDashboardData } from '../lib/mock-data';

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
    startDate: getDateKey(-1),
    endDate: getDateKey(-1),
    previousStartDate: getDateKey(-2),
    previousEndDate: getDateKey(-2),
  });
  const dashboardData = React.useMemo(() => buildDashboardData(filters), [filters]);

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
        <main className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar">
          <div className="grid h-full w-full grid-cols-1 gap-4 lg:grid-cols-12 xl:gap-6">
            {/* Left Column - Task Completion */}
            <div className="lg:col-span-3">
              <TaskCompletionPanel data={dashboardData} />
            </div>

            {/* Right Column - Customer Details */}
            <div className="h-full min-h-[600px] lg:col-span-9">
              <CustomerDetailsPanel
                rankCount={filters.rankCount}
                selectedPlatform={filters.selectedPlatform}
                brandName={filters.brandName}
                data={dashboardData}
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
