import React, { useMemo } from 'react';
import TabsWithChart from './ChartTabs';
import { AreaChart, XAxis, YAxis, CartesianGrid, Area } from 'recharts';
import ChartLayout from './ChartLayout';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../ui/chart';
import { ILineChartProps } from '@/constraints/types/chart-types';

const CustomLineChart: React.FC<ILineChartProps> = ({
  tabs = [],
  chartData = [],
  chartConfig = {},
  selectOptions = [],
  isTabVisible = false,
  isDonutChart = false,
  handleSelect = () => {},
  chartTitle = 'Line Chart',
  handleTabChange = () => {},
  showPercentageInTab = false,
}) => {
  const XAxisKey = useMemo(() => {
    if (!chartData.length) return '';
    const firstDataRow = chartData[0];
    const keys = Object.keys(firstDataRow).filter((key) => !Object.keys(chartConfig).includes(key));
    return keys[0] || '';
  }, [chartData, chartConfig]);

  const gradients = useMemo(() => {
    return Object.keys(chartConfig).map((chart) => ({
      id: `${chartConfig[chart].label}-${chart}`,
      color: chartConfig[chart].color,
    }));
  }, [chartConfig]);

  return (
    <ChartLayout title={chartTitle} selectOptions={selectOptions} handleSelect={handleSelect}>
      <div className="w-full">
        {isTabVisible && (
          <TabsWithChart
            onTabChange={handleTabChange}
            tabs={tabs}
            isDonut={isDonutChart}
            showPercentage={showPercentageInTab}
          />
        )}
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full pt-5">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey={XAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => value}
              className="text-gray-500 text-xs"
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={10} className="text-gray-500 text-sm" />
            <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
            <defs>
              {gradients.map(({ id, color }) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            {Object.keys(chartConfig).map((chart) => (
              <Area
                key={chart}
                dataKey={chart}
                type="monotone"
                stroke={chartConfig[chart].color}
                fill={`url(#${chartConfig[chart].label}-${chart})`}
                fillOpacity={1}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </div>
    </ChartLayout>
  );
};

export default CustomLineChart;
