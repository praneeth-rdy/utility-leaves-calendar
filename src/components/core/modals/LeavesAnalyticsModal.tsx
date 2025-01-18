import { DateTime } from 'luxon';
import GenericModal from './GenericModal';
import CustomPieChart from '../charts/CustomPieChart';
import MultipleLinesChart from '../charts/MultipleLinesChart';

export default function LeavesAnalyticsModal(props: LeavesAnalyticsModalProps) {
  const { isOpen, onClose } = props;

  const sampleChartData = [
    {
      name: 'Sick Leave',
      value: 5,
      percentage: '25%',
      color: '#FF9F43'
    },
    {
      name: 'Casual Leave', 
      value: 8,
      percentage: '40%',
      color: '#28C76F'
    },
    {
      name: 'Earned Leave',
      value: 7, 
      percentage: '35%',
      color: '#7367F0'
    }
  ];

  const lineChartData = [
    { month: 'Jan', sick: 2, casual: 1, earned: 0 },
    { month: 'Feb', sick: 1, casual: 2, earned: 1 },
    { month: 'Mar', sick: 0, casual: 1, earned: 2 },
    { month: 'Apr', sick: 1, casual: 2, earned: 1 },
    { month: 'May', sick: 1, casual: 2, earned: 3 }
  ];

  const lineChartConfig = {
    sick: {
      label: 'Sick Leave',
      color: '#FF9F43'
    },
    casual: {
      label: 'Casual Leave',
      color: '#28C76F'  
    },
    earned: {
      label: 'Earned Leave',
      color: '#7367F0'
    }
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
        <div className='flex flex-col justify-center items-center gap-y-6'>
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
            <div/>
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
