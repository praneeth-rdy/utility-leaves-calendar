import { ChartType } from '@/constraints/enums/core-enums';
import { LeaveCategory } from '@/constraints/enums/core-enums';
import { Leave, PublicHoliday } from '@/constraints/types/core-types';
import { DateTime } from 'luxon';

/**
 * Parses raw leave data into typed Leave objects
 * @param leaves - Array of raw leave data
 * @returns Array of parsed Leave objects
 */
export const parseLeaves = (leaves: any[]): Leave[] => {
  return leaves.map((leave, index: number) => ({
    id: index.toString(),
    name: leave.name,
    department: leave.department,
    role: leave.role,
    leaveReason: leave['reason for leave'],
    leaveType: leave['leave type'],
    leaveCategory: leave['leave category'],
    startDate: DateTime.fromISO(leave['leave start date']).toJSDate(),
    endDate: DateTime.fromISO(leave['leave end date']).toJSDate(),
  }));
};

/**
 * Parses raw holiday data into typed PublicHoliday objects
 * @param holidays - Array of raw holiday data
 * @returns Array of parsed PublicHoliday objects
 */
export const parseHolidays = (holidays: any[]): PublicHoliday[] => {
  return holidays.map((holiday, index: number) => ({
    id: index.toString(),
    name: holiday.name,
    startDate: DateTime.fromISO(holiday['holiday start date']).toJSDate(),
    endDate: DateTime.fromISO(holiday['holiday end date']).toJSDate(),
  }));
};

/**
 * Filters leaves data for a specific year
 * @param leaves - Array of leave records
 * @param year - Year to filter for (optional, defaults to current year)
 * @returns Filtered array of leaves for the specified year
 */
const filterLeavesByYear = (leaves: Leave[], year?: number): Leave[] => {
  const targetYear = year || DateTime.now().year;
  console.log('leaves before filter', leaves);
  return leaves.filter(leave => DateTime.fromJSDate(leave.startDate).year === targetYear);
};

/**
 * Formats leave data for pie chart visualization
 * @param leaves - Array of leave records
 * @returns Formatted data for pie chart
 */
const formatLeavesForPieChart = (leaves: Leave[]) => {
  const categoryCount = leaves.reduce((acc, leave) => {
    if (leave.leaveCategory === LeaveCategory.PersonalLeave) {
      acc.personal = (acc.personal || 0) + 1;
    } else if (leave.leaveCategory === LeaveCategory.SickLeave) {
      acc.sick = (acc.sick || 0) + 1;
    } else {
      acc.others = (acc.others || 0) + 1;
    }
    return acc;
  }, {} as { personal: number; sick: number; others: number });

  const total = Object.values(categoryCount).reduce((sum, count) => sum + count, 0);

  return [
    {
      name: LeaveCategory.PersonalLeave,
      value: categoryCount.personal || 0,
      percentage: `${Math.round(((categoryCount.personal || 0) / total) * 100)}%`,
      color: '#FF9F43',
    },
    {
      name: LeaveCategory.SickLeave,
      value: categoryCount.sick || 0,
      percentage: `${Math.round(((categoryCount.sick || 0) / total) * 100)}%`,
      color: '#28C76F',
    },
    {
      name: 'Others',
      value: categoryCount.others || 0,
      percentage: `${Math.round(((categoryCount.others || 0) / total) * 100)}%`,
      color: '#7367F0',
    },
  ];
};

/**
 * Formats leave data for multiple line chart visualization
 * @param leaves - Array of leave records
 * @returns Formatted data for multiple line chart
 */
const formatLeavesForLineChart = (leaves: Leave[]) => {
  const monthlyData = new Array(12).fill(null).map((_, index) => {
    const monthLeaves = leaves.filter(leave => DateTime.fromJSDate(leave.startDate).month === index + 1);
    
    return {
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index],
      personal: monthLeaves.filter(leave => leave.leaveCategory === LeaveCategory.PersonalLeave).length,
      sick: monthLeaves.filter(leave => leave.leaveCategory === LeaveCategory.SickLeave).length,
      others: monthLeaves.filter(leave => 
        ![LeaveCategory.PersonalLeave, LeaveCategory.SickLeave].includes(leave.leaveCategory)
      ).length,
    };
  });

  return {
    config: {
      personal: {
        label: 'Personal Leave',
        theme: {
          light: '#FF9F43',
          dark: '#FF9F43'
        }
      },
      sick: {
        label: 'Sick Leave',
        theme: {
          light: '#28C76F',
          dark: '#28C76F'
        }
      },
      others: {
        label: 'Others',
        theme: {
          light: '#7367F0',
          dark: '#7367F0'
        }
      }
    },
    data: monthlyData
  };
};

/**
 * Formats leave data for different chart types
 * @param leaves - Array of leave records
 * @param chartType - Type of chart to format data for
 * @param options - Optional configuration including year filter
 * @returns Formatted data based on chart type
 */
export const formatLeavesForChart = (leaves: Leave[], chartType: ChartType, options?: {year?: number}) => {
  const filteredLeaves = filterLeavesByYear(leaves, options?.year);
  console.log('filteredLeaves', filteredLeaves);
  
  switch (chartType) {
    case ChartType.Pie:
      return formatLeavesForPieChart(filteredLeaves);
    case ChartType.MultipleLines:
      return formatLeavesForLineChart(filteredLeaves);
    default:
      return [];
  }
};