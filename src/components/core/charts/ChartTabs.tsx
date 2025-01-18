import { IChartTabsProps } from '@/constraints/types/chart-types';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import React, { useState } from 'react';

const ChartTabs: React.FC<IChartTabsProps> = ({ isDonut = false, showPercentage = false, tabs, onTabChange }) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]?.label);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    onTabChange(value);
  };

  return (
    <div className="flex items-center justify-around w-full">
      {tabs.map((tab) => (
        <button
          key={tab.percentage}
          onClick={() => handleTabChange(tab.label)}
          className={`w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-start focus:outline-none transition-colors rounded-b-md ${
            selectedTab === tab.label ? 'bg-blue-50 border-t-2 border-blue-500' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <div className={`flex flex-col ${isDonut ? 'items-center' : 'items-start'}`}>
            <span className="text-xs text-gray-500 font-medium flex gap-1">
              {tab.label}
              {tab.showInfoIcon && <InfoCircledIcon />}
            </span>
            <span
              className={`text-lg font-semibold ${
                selectedTab === tab.label ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.percentage}
              {showPercentage && '%'}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ChartTabs;
