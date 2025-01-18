import { DateTime } from 'luxon';
import GenericModal from './GenericModal';
import CustomPieChart from '../charts/CustomPieChart';
import MultipleLinesChart, { MultipleLinesChartProps } from '../charts/MultipleLinesChart';
import { ChartType, LeaveCategory } from '@/constraints/enums/core-enums';
import { useCoreStore } from '@/stores/core-store';
import { formatLeavesForChart } from '@/utils/parsing-utils';
import { CustomPieChartProps } from '@/constraints/types/chart-types';
import { ChartConfig } from '@/components/ui/chart';

type LineChartDataType = {
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

type PieChartDataType = Array<{
  name: string;
  value: number;
  percentage: string;
  color: string;
}>;

export default function LeavesAnalyticsModal(props: LeavesAnalyticsModalProps) {
  const { isOpen, onClose } = props;
  const leaves = useCoreStore((state) => state.leaves);

  const lineChartData = formatLeavesForChart(leaves, ChartType.MultipleLines);
  const pieChartData = formatLeavesForChart(leaves, ChartType.Pie);

  const isLineChartData = (data: ReturnType<typeof formatLeavesForChart>): data is LineChartDataType => {
    return 'config' in data && 
      'data' in data && 
      Array.isArray(data.data) &&
      data.data.every(item => 
        'month' in item && 
        'personal' in item && 
        'sick' in item && 
        'others' in item
      );
  };

  const isPieChartData = (data: ReturnType<typeof formatLeavesForChart>): data is PieChartDataType => {
    return Array.isArray(data);
  };

  return (
    <GenericModal
      className="w-full sm:max-w-fit outline-none bg-white dark:bg-zinc-900"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="p-4 sm:py-10 sm:px-12 overflow-y-auto overflow-x-hidden max-h-[90vh]">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Leaves Analytics - {DateTime.now().year}</h1>
          <p className="mt-2 text-sm text-muted-foreground">View analytics about leaves taken</p>
        </div>
        <div className="flex flex-col justify-center items-center gap-y-6">
          {isLineChartData(lineChartData) && (
            <MultipleLinesChart
              chartData={lineChartData.data}
              chartConfig={{
                personal: { label: 'Personal Leave', color: lineChartData.config.personal.theme.light },
                sick: { label: 'Sick Leave', color: lineChartData.config.sick.theme.light },
                others: { label: 'Others', color: lineChartData.config.others.theme.light }
              }}
              XAxisDataKey="month"
              showFilters={true}
              chartTitle="Leave Trends"
              showInfoIcon={false}
              showDownloadIcon={false}
            />
          )}
          {isPieChartData(pieChartData) && (
            <CustomPieChart
              chartData={pieChartData}
              chartTitle="Leaves Distribution"
              title="Leaves Distribution"
              showDownloadIcon={false}
              isDonutChart={false}
            >
              <div />
            </CustomPieChart>
          )}
        </div>
      </div>
    </GenericModal>
  );
}

type LeavesAnalyticsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
