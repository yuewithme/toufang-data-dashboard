import React from 'react';
import { TopListItem } from '../lib/mock-data';
import { cn } from '../lib/utils';
import { ArrowDownIcon, ArrowUpIcon, TrendingUp, TrendingDown, Users, Plus, Star } from 'lucide-react';

interface ScrollingListProps {
  title: string;
  subtitle: string;
  items: TopListItem[];
  className?: string;
}

export const ScrollingList: React.FC<ScrollingListProps> = ({ title, subtitle, items, className }) => {
  const getIcon = (title: string) => {
    if (title.includes('消耗')) return <TrendingUp className="w-4 h-4 text-blue-400" />;
    if (title.includes('增量')) return <Plus className="w-4 h-4 text-green-400" />;
    if (title.includes('掉量')) return <TrendingDown className="w-4 h-4 text-red-400" />;
    if (title.includes('新增')) return <Star className="w-4 h-4 text-yellow-400" />;
    return <Users className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-slate-800/50 rounded-lg">
          {getIcon(title)}
        </div>
        <div>
          <h3 className="text-white font-bold text-sm leading-tight">{title}</h3>
          <p className="text-slate-500 text-[10px]">{subtitle}</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="space-y-2">
          {items.slice(0, 10).map((item) => (
            <div 
              key={`${item.rank}-${item.name}`}
              className="group flex items-center justify-between p-2 rounded-md hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={cn(
                  "text-[10px] font-bold w-4 text-center",
                  item.rank <= 3 ? "text-yellow-500" : "text-slate-500"
                )}>
                  {item.rank}
                </span>
                <span className="text-slate-200 text-xs font-medium truncate max-w-[120px]">
                  {item.name}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-white text-xs font-bold tabular-nums">{item.value}</span>
                <div className={cn(
                  "flex items-center text-[9px] font-medium",
                  item.isUp ? "text-green-500" : "text-red-500"
                )}>
                  {item.isUp ? (
                    <ArrowUpIcon className="w-2 h-2 mr-0.5" />
                  ) : (
                    <ArrowDownIcon className="w-2 h-2 mr-0.5" />
                  )}
                  {item.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
