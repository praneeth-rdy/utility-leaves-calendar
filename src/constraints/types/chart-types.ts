import { ChartConfig } from '@/components/ui/chart';

export interface IChartLayoutProps {
  title: string;
  selectOptions?: { label: string; value: string }[];
  defaultSelectedValue?: string;
  handleSelect?: (value: string) => void;
  children: React.ReactNode;
  showDownloadIcon?: boolean;
  isDonutChart?: boolean;
  showInfoIcon?: boolean;
}

export interface IChartTabsType {
  label: string;
  percentage: string;
  showInfoIcon: boolean;
}

export interface IChartTabsProps {
  tabs: IChartTabsType[];
  onTabChange: (value: string) => void;
  isDonut: boolean;
  showPercentage: boolean;
}

export interface IStatsProps {
  color: string;
  label: string;
  value: number;
  percentage: string;
}

export interface IDonutChartProps extends IBaseChartProps {
  tabs?: IChartTabsType[];
  statsData: IStatsProps[];
  totalRadialData: number;
  isDonutChart: boolean;
  showDownloadIcon: boolean;
  radialDataText: string;
}

export interface ILineChartProps extends IBaseChartProps {
  tabs?: IChartTabsType[];
  isDonutChart?: boolean;
}

export interface IBarChartProps extends IBaseChartProps {
  layout: 'vertical' | 'horizontal';
}
export interface IBaseChartProps {
  chartConfig: ChartConfig;
  chartData: any[];
  selectOptions: { label: string; value: string }[];
  chartTitle: string;
  isTabVisible?: boolean;
  showPercentageInTab?: boolean;
  handleSelect: (value: string | number) => void;
  handleTabChange?: (value: string) => void;
}

export interface CustomPieChartProps extends IChartLayoutProps {
  chartData: Array<{
    name: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  chartTitle?: string;
  isDonutChart?: boolean;
  showInfoIcon?: boolean;
}

type PayloadItem = {
  payload: {
    name: string;
    value: number | string;
    percentage: number | string;
    color: string;
  };
};

export type CustomTooltipProps = {
  active?: boolean;
  payload?: PayloadItem[];
};

export interface ChartLabelProps {
  cx?: number;
  cy?: number;
  midAngle: number;
  innerRadius?: number;
  outerRadius?: number;
  index?: number;
}

export type LineChartDataType = {
  config: {
    personal: { label: string; theme: { light: string; dark: string } };
    sick: { label: string; theme: { light: string; dark: string } };
    others: { label: string; theme: { light: string; dark: string } };
  };
  data: Array<{
    month: string;
    personal: number;
    sick: number;
    others: number;
  }>;
};

export type PieChartDataType = Array<{
  name: string;
  value: number;
  percentage: string;
  color: string;
}>;