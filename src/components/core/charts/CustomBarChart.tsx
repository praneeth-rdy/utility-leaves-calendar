import React, { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import ChartLayout from './ChartLayout';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../ui/chart';
import { IBarChartProps } from '@/constraints/types/chart-types';

const CustomBarChart: React.FC<IBarChartProps> = ({
  chartData = [],
  chartTitle = 'Bar Chart',
  chartConfig = {},
  handleSelect = () => {},
  selectOptions = [],
  layout = 'vertical',
}) => {
  const valueKey = useMemo(() => Object.keys(chartConfig)[0], [chartConfig]);
  const categoryKey = useMemo(
    () => Object.keys(chartData[0] || {}).find((key) => key !== valueKey) || 'category',
    [chartData, valueKey],
  );

  const fillColor = chartConfig[valueKey]?.color || '#0185e4';
  const radius: [number, number, number, number] = layout === 'vertical' ? [0, 4, 4, 0] : [4, 4, 0, 0];
  const axisConfig: {
    xAxis: { type: 'number' | 'category'; dataKey: string; tickFormatter: (value: any) => string };
    yAxis: { type: 'number' | 'category'; dataKey: string; tickFormatter: (value: any) => string };
  } = useMemo(() => {
    const isVertical = layout === 'vertical';
    return {
      xAxis: {
        type: isVertical ? 'number' : 'category',
        dataKey: isVertical ? valueKey : categoryKey,
        tickFormatter: isVertical ? (value: number) => value.toString() : (value: any) => value.slice(0, 3),
      },
      yAxis: {
        type: isVertical ? 'category' : 'number',
        dataKey: isVertical ? categoryKey : valueKey,
        tickFormatter: isVertical ? (value: any) => value.slice(0, 3) : (value: number) => value.toString(),
      },
    };
  }, [layout, valueKey, categoryKey]);

  return (
    <ChartLayout title={chartTitle} selectOptions={selectOptions} handleSelect={handleSelect}>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full mt-8">
        <BarChart data={chartData} layout={layout}>
          <CartesianGrid strokeDasharray="5 5" horizontal={layout === 'horizontal'} vertical={layout === 'vertical'} />
          <XAxis
            type={axisConfig.xAxis.type}
            dataKey={axisConfig.xAxis.dataKey}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            className="text-xs text-gray-500"
            tickFormatter={axisConfig.xAxis.tickFormatter}
          />
          <YAxis
            type={axisConfig.yAxis.type}
            dataKey={axisConfig.yAxis.dataKey}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            className="text-xs text-gray-500"
            tickFormatter={axisConfig.yAxis.tickFormatter}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey={valueKey} fill={fillColor} radius={radius} />
        </BarChart>
      </ChartContainer>
    </ChartLayout>
  );
};

export default CustomBarChart;
