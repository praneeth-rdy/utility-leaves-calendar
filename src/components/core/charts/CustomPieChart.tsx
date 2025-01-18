import { Cell, Pie, PieChart, ResponsiveContainer, Sector, SectorProps, Tooltip } from 'recharts';
import ChartLayout from './ChartLayout';
import CustomTooltip from './CustomTooltip';
import { ChartLabelProps, CustomPieChartProps } from '@/constraints/types/chart-types';
import { useState, useMemo } from 'react';

const CustomPieChart: React.FC<CustomPieChartProps> = ({
  chartData = [],
  chartTitle = 'Pie Chart',
  isDonutChart = false,
  showInfoIcon,
  showDownloadIcon = false,
}) => {
  const [_activeIndex, setActiveIndex] = useState<number | null>(null);

  const normalizedData = useMemo(
    () =>
      chartData.map((entry) => ({
        ...entry,
        normalizedValue: parseFloat(entry.percentage.replace('%', '')) || 0,
      })),
    [chartData],
  );

  const renderCustomLabel = useMemo(
    () =>
      ({ cx = 0, cy = 0, midAngle, innerRadius = 0, outerRadius = 0, index }: ChartLabelProps): JSX.Element | null => {
        if (index === undefined || index < 0 || index >= normalizedData.length) return null;

        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) / 2;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
          <text
            x={x}
            y={y}
            fill={normalizedData[index].color}
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            className="text-center text-xl font-semibold"
          >
            {normalizedData[index].percentage}
          </text>
        );
      },
    [normalizedData],
  );

  const renderActiveShape = useMemo(
    () =>
      ({
        cx = 0,
        cy = 0,
        innerRadius = 0,
        outerRadius = 0,
        startAngle = 0,
        endAngle = 0,
        fill = 'transparent',
      }: SectorProps): JSX.Element =>
        (
          <g>
            <Sector
              cx={cx}
              cy={cy}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              startAngle={startAngle}
              endAngle={endAngle}
              fill={fill}
              style={{ opacity: 0.2 }}
            />
            <Sector
              cx={cx}
              cy={cy}
              innerRadius={outerRadius + 2}
              outerRadius={outerRadius + 5}
              startAngle={startAngle}
              endAngle={endAngle}
              fill={fill}
            />
          </g>
        ),
    [],
  );

  const Legend = useMemo(
    () => (
      <div className="flex flex-col gap-3 w-[240px]">
        {chartData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2 flex-[1_0_0]">
              <div className="flex gap-2">
                <div className={`w-1 rounded align-self-stretch`} style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm font-medium text-grey-700">{entry.name}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-sm font-semibold text-center text-text-dark">{entry.value}</span>
                <div className="w-[1px] h-5 rounded-10 bg-grey-50"></div>
                <span className="text-sm font-semibold text-center text-text-dark">{entry.percentage}</span>
              </div>
            </div>
            {index !== chartData.length - 1 && <div className="border-b border-b-grey-border w-[240px]"></div>}
          </div>
        ))}
      </div>
    ),
    [chartData],
  );

  return (
    <ChartLayout
      title={chartTitle}
      isDonutChart={isDonutChart}
      showDownloadIcon={showDownloadIcon}
      showInfoIcon={showInfoIcon}
    >
      <div className="flex items-center justify-between gap-4 flex-col md:flex-row">
        <ResponsiveContainer width={360} height={326}>
          <PieChart>
            <Pie
              data={normalizedData}
              dataKey="normalizedValue"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              labelLine={false}
              startAngle={150}
              endAngle={520}
              label={renderCustomLabel}
              activeShape={renderActiveShape}
              onMouseEnter={(_event, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {normalizedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} style={{ opacity: 0.2 }} strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="md:w-[1px] md:h-[326px] bg-grey-border md:mx-4 "></div>
        {Legend}
      </div>
    </ChartLayout>
  );
};

export default CustomPieChart;
