'use client';

import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { useEffect, useState } from 'react';
import { TooltipProps } from 'recharts';

import { Card, CardContent } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { isEmpty } from 'lodash';
import ChartLayout from './ChartLayout';

interface MultipleLinesChartProps {
  maxYAxis?: number;
  chartData: Array<{
    [key: string]: string | number;
  }>;
  chartConfig: ChartConfig;
  showFilters?: boolean;
  hasGradient?: boolean;
  XAxisDataKey: string;
  customTooltipContent?: React.ComponentType<TooltipProps<any, any>>;
  chartTitle?: string;
  showInfoIcon?: boolean;
  showDownloadIcon?: boolean;
}

export default function MultipleLinesChart(props: MultipleLinesChartProps) {
  const CustomTooltipContent = ({ active, payload, label }: TooltipProps<any, any>) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-white w-[200px] max-w-1/2 p-[8px_12px] border rounded-[6px] shadow-lg">
        <p className="font-montserrat text-[10px] font-semibold leading-[16px] text-[#838889] uppercase">
          {label}
        </p>
        {payload.map((entry) => {
          const dataKey = entry.dataKey as keyof typeof chartConfig;
          const isSelected = showAll || selectedMetrics.includes(dataKey);
          return (
            <div key={dataKey} className="flex justify-between items-center">
              <span className="font-montserrat text-[12px] font-normal leading-[20px] text-[#394042] flex items-center gap-2">
                <div
                  style={{
                    backgroundColor: chartConfig[dataKey].color,
                    opacity: !isSelected ? 0.12 : 1,
                  }}
                  className="flex w-[12px] h-[12px] rounded-[2px]"
                ></div>
                <div>{chartConfig[dataKey].label}</div>
              </span>
              <span className="font-montserrat text-[12px] font-semibold leading-[20px] text-[#394042]">
                {entry.value}{maxYAxis && `/${maxYAxis}`}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const {
    maxYAxis,
    chartData,
    chartConfig,
    showFilters,
    hasGradient,
    XAxisDataKey,
    customTooltipContent: CustomContent,
    chartTitle = 'Line Chart',
    showInfoIcon,
    showDownloadIcon = false,
  } = props;

  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [showAll, setShowAll] = useState<boolean>(true);

  const toggleMetric = (metric: string) => {
    setShowAll(false);

    if (isEmpty(selectedMetrics)) {
      setSelectedMetrics([metric]);
    } else {
      setSelectedMetrics((prev) => (prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]));
    }
  };

  const toggleAll = () => {
    setSelectedMetrics([]);
  };

  const getAverage = (data: any[], metric: string) => {
    return Math.round(data.reduce((acc, curr) => acc + curr[metric], 0) / data.length);
  };

  useEffect(() => {
    if (isEmpty(selectedMetrics)) {
      setShowAll(true);
    }
  }, [selectedMetrics]);

  return (
    <ChartLayout
      title={chartTitle}
      showInfoIcon={showInfoIcon}
      showDownloadIcon={showDownloadIcon}
    >
      <div>
        {showFilters && (
          <div className="flex flex-wrap gap-[20px] bg-white rounded-t-[10px] p-[24px]">
            <div
              onClick={toggleAll}
              className={`flex flex-col justify-center items-start gap-1 p-3 flex-[1_0_0] rounded-lg border cursor-pointer ${
                showAll ? 'border border-[#0185E4] bg-[#0185E41F]' : 'border-[#E6E7E7]'
              }`}
            >
              <div className="">
                <span className="font-montserrat text-[18px] font-semibold leading-[26px] text-[#071013] text-center">
                  {Object.keys(chartConfig).length}{' '}
                </span>
                <span className="font-montserrat text-[14px] font-normal leading-[22px] text-[#838889] text-center">
                  Metrics
                </span>
              </div>
              <div className="font-montserrat text-[14px] font-medium leading-[22px] text-[#394042]">All</div>
            </div>

            {chartConfig &&
              Object.entries(chartConfig).map(([key, { label, color }]) => (
                <div
                  onClick={() => toggleMetric(key)}
                  className={`flex flex-col justify-center items-start gap-1 p-3 flex-[1_0_0] rounded-lg border cursor-pointer ${
                    selectedMetrics.includes(key) ? 'border border-[#0185E4] bg-[#0185E41F]' : 'border-[#E6E7E7]'
                  }`}
                >
                  <div>
                    <span className="font-montserrat text-[18px] font-semibold leading-[26px] text-[#071013] text-center">
                      {getAverage(chartData, key)}
                    </span>
                    <span className="font-montserrat text-[14px] font-normal leading-[22px] text-[#838889] text-center">
                      {maxYAxis && `/${maxYAxis}`}
                    </span>
                  </div>
                  <div className="font-montserrat text-[14px] font-medium leading-[22px] text-[#394042] whitespace-nowrap">{label}</div>
                  <div className="flex w-full h-[4px] rounded-full z-10" style={{ backgroundColor: color }}></div>
                </div>
              ))}
          </div>
        )}
        <Card className="flex flex-col max-h-[300px] bg-white border-none shadow-none rounded-t-none">
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] max-h-full w-full mt-10">
              {hasGradient ? (
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: -20,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="4 12" />
                  <XAxis dataKey={XAxisDataKey} tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => (value < 10 ? `0${value}` : `${value}`)}
                    // tickCount={6}
                  />
                  <ChartTooltip cursor={false} content={CustomContent ? <CustomContent /> : <CustomTooltipContent />} />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0185E4" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#0185E4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  {Object.entries(chartConfig).map(([key]) => (
                    <Area
                      key={key}
                      dataKey={key}
                      type="natural"
                      fill="url(#gradient)"
                      fillOpacity={0.4}
                      activeDot={{
                        r: 4,
                        className:
                          'stroke-[#FFF] stroke-[1px] drop-shadow-[0px_0px_4px_rgba(0,_0,_0,_0.34)] backdrop-blur-[8px] w-[16px] h-[16px] flex-shrink-0',
                      }}
                      style={{ transition: 'opacity 0.2s ease-in-out' }}
                    />
                  ))}
                </AreaChart>
              ) : (
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: -20,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="4 12" />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => (value < 10 ? `0${value}` : `${value}`)}
                    // tickCount={6}
                  />
                  <XAxis
                    dataKey={XAxisDataKey}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    // tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip cursor={false} content={CustomContent ? <CustomContent /> : <CustomTooltipContent />} />
                  {showAll
                    ? Object.entries(chartConfig).map(([key, { color }]) => (
                        <Line
                          key={key}
                          dataKey={key}
                          type="monotone"
                          stroke={color}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{
                            r: 4,
                            className:
                              'stroke-[#FFF] stroke-[1px] drop-shadow-[0px_0px_4px_rgba(0,_0,_0,_0.34)] backdrop-blur-[8px] w-[16px] h-[16px] flex-shrink-0',
                          }}
                          style={{ transition: 'opacity 0.2s ease-in-out' }}
                        />
                      ))
                    : Object.entries(chartConfig).map(([key, { color }]) => (
                        <Line
                          key={key}
                          dataKey={key}
                          type="monotone"
                          stroke={color}
                          strokeWidth={2}
                          dot={false}
                          activeDot={
                            selectedMetrics.includes(key)
                              ? {
                                  r: 4,
                                  className: 'drop-shadow-md',
                                }
                              : false
                          }
                          opacity={selectedMetrics.includes(key) ? 1 : 0.12}
                          style={{ transition: 'opacity 0.2s ease-in-out' }}
                        />
                      ))}
                </LineChart>
              )}
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </ChartLayout>
  );
}
