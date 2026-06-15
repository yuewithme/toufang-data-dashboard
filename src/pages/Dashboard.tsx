import React from 'react';
import { DashboardHeader } from '../components/DashboardHeader';
import { FilterPanel } from '../components/FilterPanel';
import { TaskCompletionPanel } from '../components/TaskCompletionPanel';
import { CustomerDetailsPanel } from '../components/CustomerDetailsPanel';

const Dashboard: React.FC = () => {
  const [filters, setFilters] = React.useState({
    rankCount: 15,
    selectedPlatform: '',
    brandName: '',
  });

  return (
    <div className="flex flex-col h-screen bg-[#0a0a1a] text-slate-50 overflow-hidden">
      <DashboardHeader />
      <FilterPanel
        filters={filters}
        onApplyFilters={setFilters}
      />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar">
        <div className="grid h-full w-full grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column - Task Completion */}
          <div className="lg:col-span-5 xl:col-span-4">
            <TaskCompletionPanel />
          </div>

          {/* Right Column - Customer Details */}
          <div className="lg:col-span-7 xl:col-span-8 h-full min-h-[600px]">
            <CustomerDetailsPanel
              rankCount={filters.rankCount}
              selectedPlatform={filters.selectedPlatform}
              brandName={filters.brandName}
            />
          </div>
        </div>
      </main>

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
