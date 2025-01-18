import { DateTime } from 'luxon';
import GenericModal from './GenericModal';
import CustomPieChart from '../charts/CustomPieChart';
import MultipleLinesChart from '../charts/MultipleLinesChart';
import { LeaveCategory } from '@/constraints/enums/core-enums';

export default function LeavesAnalyticsModal(props: LeavesAnalyticsModalProps) {
  const { isOpen, onClose } = props;

  const sampleChartData = [
    {
      name: LeaveCategory.PersonalLeave,
      value: 5,
      percentage: '35%',
      color: '#FF9F43',
    },
    {
      name: LeaveCategory.SickLeave,
      value: 6,
      percentage: '40%',
      color: '#28C76F',
    },
    {
      name: 'Others',
      value: 4,
      percentage: '25%',
      color: '#7367F0',
    },
  ];

  const lineChartData = [
    { month: 'Jan', personal: 2, sick: 1, others: 0 },
    { month: 'Feb', personal: 1, sick: 2, others: 1 },
    { month: 'Mar', personal: 0, sick: 1, others: 2 },
    { month: 'Apr', personal: 1, sick: 2, others: 1 },
    { month: 'May', personal: 1, sick: 0, others: 0 },
    { month: 'Jun', personal: 2, sick: 1, others: 1 },
    { month: 'Jul', personal: 1, sick: 2, others: 0 },
    { month: 'Aug', personal: 0, sick: 1, others: 1 },
    { month: 'Sep', personal: 1, sick: 0, others: 2 },
    { month: 'Oct', personal: 2, sick: 1, others: 1 },
    { month: 'Nov', personal: 1, sick: 2, others: 0 },
    { month: 'Dec', personal: 0, sick: 1, others: 1 }
  ];

  const lineChartConfig = {
    personal: {
      label: LeaveCategory.PersonalLeave,
      color: '#FF9F43',
    },
    sick: {
      label: LeaveCategory.SickLeave,
      color: '#28C76F',
    },
    others: {
      label: 'Others',
      color: '#7367F0',
    },
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
          <MultipleLinesChart
            chartData={lineChartData}
            chartConfig={lineChartConfig}
            XAxisDataKey="month"
            showFilters={true}
            chartTitle="Leave Trends"
            showInfoIcon={false}
            showDownloadIcon={false}
          />
          <CustomPieChart
            chartData={sampleChartData}
            chartTitle="Leaves Distribution"
            title="Leaves Distribution"
            showDownloadIcon={false}
            isDonutChart={false}
          >
            <div />
          </CustomPieChart>
        </div>
      </div>
    </GenericModal>
  );
}

type LeavesAnalyticsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
