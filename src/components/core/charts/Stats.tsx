import { IStatsProps } from '@/constraints/types/chart-types';
import { cn } from '@/lib/utils';
import React from 'react';

const Stats: React.FC<{ statsData: IStatsProps[] }> = ({ statsData }) => {
  return (
    <div className="flex items-center gap-5 justify-center w-full">
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        {statsData.map(({ color, label, value, percentage }: IStatsProps, ind) => (
          <div key={ind} className="flex items-center gap-2">
            <div className={cn(`h-12 w-1 rounded-lg`)} style={{ backgroundColor: color }} />
            <div className="flex flex-col">
              <span className="text-xs text-start font-medium text-gray-700">{label}</span>
              <div className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <span>{value}</span>
                <div className="border-r border-gray-300 rounded-lg h-5" />
                <span>{percentage}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
