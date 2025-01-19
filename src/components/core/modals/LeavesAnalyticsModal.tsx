import { DateTime } from 'luxon';
import GenericModal from './GenericModal';
import CustomPieChart from '../charts/CustomPieChart';
import MultipleLinesChart from '../charts/MultipleLinesChart';
import { ChartType } from '@/constraints/enums/core-enums';
import { useCoreStore } from '@/stores/core-store';
import { formatLeavesForChart } from '@/utils/parsing-utils';
import { Calendar, Mail } from 'lucide-react';
import { PieChartDataType, LineChartDataType } from '@/constraints/types/chart-types';
import { Leave } from '@/constraints/types/core-types';
import { formatEpochToHumanReadable } from '@/utils/date-utils';
import { stringToColour } from '@/utils/miscellaneous-utils';
import { dateToEpoch } from '@/utils/date-utils';
import { useState } from 'react';

export default function LeavesAnalyticsModal(props: LeavesAnalyticsModalProps) {
  const { isOpen, onClose } = props;
  const leaves = useCoreStore((state) => state.leaves);
  const profileEmail = useCoreStore((state) => state.profileEmail);
  const [showAllLeaves, setShowAllLeaves] = useState(false);

  if (!profileEmail) return null;

  const lineChartData = formatLeavesForChart(leaves, { chartType: ChartType.MultipleLines, email: profileEmail });
  const pieChartData = formatLeavesForChart(leaves, { chartType: ChartType.Pie, email: profileEmail });

  const isLineChartData = (data: ReturnType<typeof formatLeavesForChart>): data is LineChartDataType => {
    return (
      'config' in data &&
      'data' in data &&
      Array.isArray(data.data) &&
      data.data.every((item) => 'month' in item && 'personal' in item && 'sick' in item && 'others' in item)
    );
  };

  const isPieChartData = (data: ReturnType<typeof formatLeavesForChart>): data is PieChartDataType => {
    return Array.isArray(data);
  };

  const isPieChartEmpty = isPieChartData(pieChartData) && pieChartData.every((item) => item.value === 0);
  const isLineChartEmpty =
    isLineChartData(lineChartData) &&
    lineChartData.data.every((item) => item.personal === 0 && item.sick === 0 && item.others === 0);

  const userLeaves = formatLeavesForChart(leaves, { email: profileEmail });
  const displayedLeaves = showAllLeaves ? userLeaves : (userLeaves as Leave[]).slice(0, 6);

  return (
    <GenericModal
      className="w-full sm:max-w-fit outline-none bg-white dark:bg-zinc-900"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="p-4 sm:py-10 sm:px-12 overflow-y-auto overflow-x-hidden max-h-[90vh]">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Leaves Analytics - {DateTime.now().year}</h1>
          <div className="mt-2 flex items-center gap-x-2 text-muted-foreground">
            <Mail className="size-4" />
            <span className="text-sm font-medium">{profileEmail}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">View analytics about leaves taken</p>
        </div>
        {isPieChartEmpty && isLineChartEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="rounded-full bg-gray-100 dark:bg-zinc-800 p-6 mb-4">
              <Calendar className="size-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Leave Data Available</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
              There are no recorded leaves for this period. New leaves will appear here once they are submitted.
            </p>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-y-6">
            {isLineChartData(lineChartData) && (
              <MultipleLinesChart
                chartData={lineChartData.data}
                chartConfig={{
                  personal: { label: 'Personal Leave', color: lineChartData.config.personal.theme.light },
                  sick: { label: 'Sick Leave', color: lineChartData.config.sick.theme.light },
                  others: { label: 'Others', color: lineChartData.config.others.theme.light },
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
            <div className="w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Leaves</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(displayedLeaves as Leave[]).map((leave: Leave) => (
                  <div
                    key={leave.id}
                    className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{leave.leaveType}</div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {leave.startDate.getTime() === leave.endDate.getTime()
                            ? formatEpochToHumanReadable(dateToEpoch(leave.startDate))
                            : `${formatEpochToHumanReadable(dateToEpoch(leave.startDate))} - ${formatEpochToHumanReadable(dateToEpoch(leave.endDate))}`}
                        </div>
                      </div>
                      {leave.leaveCategory && (
                        <div
                          className="text-xs font-medium text-white px-2 py-1 rounded-full whitespace-nowrap"
                          style={{ backgroundColor: stringToColour(leave.leaveCategory) }}
                        >
                          {leave.leaveCategory}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2">{leave.leaveReason}</div>
                  </div>
                ))}
              </div>
              {(userLeaves as Leave[]).length > 6 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setShowAllLeaves(!showAllLeaves)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    {showAllLeaves ? 'Show Less' : 'View All Leave History'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </GenericModal>
  );
}

type LeavesAnalyticsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
