import React from 'react';
import { mockDashboardData } from '../lib/mock-data';

export const DashboardHeader: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-[#0d0d1d] border-b border-slate-800 gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
          W
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          {mockDashboardData.companyName}
        </h1>
      </div>
    </header>
  );
};
