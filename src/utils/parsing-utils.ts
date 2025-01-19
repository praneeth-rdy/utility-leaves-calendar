import { ChartType, LeaveType } from '@/constraints/enums/core-enums';
import { LeaveCategory } from '@/constraints/enums/core-enums';
import { Leave, PublicHoliday } from '@/constraints/types/core-types';
import { DateTime } from 'luxon';
import { stringToColour } from './miscellaneous-utils';

/**
 * Parses raw leave data into typed Leave objects
 * @param leaves - Array of raw leave data
 * @returns Array of parsed Leave objects
 */
export const parseLeaves = (leaves: any[]): Leave[] => {
  return leaves.map((leave, index: number) => ({
    id: index.toString(),
    name: leave.name,
    email: leave.email,
    department: leave.department,
    role: leave.role,
    leaveReason: leave['reason for leave'],
    leaveType: leave['leave type'],
    leaveCategory: leave['leave category'],
    startDate: DateTime.fromISO(leave['leave start date']).toJSDate(),
    endDate: DateTime.fromISO(leave['leave end date']).startOf('day').toJSDate(),
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
    endDate: DateTime.fromISO(holiday['holiday end date']).startOf('day').toJSDate(),
  }));
};

/**
 * Calculates number of days between two dates, accounting for leave type
 */
const calculateLeaveDays = (startDate: Date, endDate: Date, leaveType: LeaveType): number => {
  if (leaveType === LeaveType.HalfDayMorning || leaveType === LeaveType.HalfDayAfternoon) {
    return 0.5;
  }

  const start = DateTime.fromJSDate(startDate);
  const end = DateTime.fromJSDate(endDate).startOf('day');
  const days = end.diff(start, 'days').days;
  return Math.max(1, Math.ceil(days)); // No need to add 1 since end date is start of day
};

/**
 * Filters leaves data for a specific year and calculates partial days for leaves spanning multiple years
 * @param leaves - Array of leave records
 * @param year - Year to filter for (optional, defaults to current year)
 * @returns Filtered array of leaves with adjusted dates for the specified year
 */
const filterLeavesByYear = (leaves: Leave[], year?: number): Leave[] => {
  const targetYear = year || DateTime.now().year;
  const yearStart = DateTime.fromObject({ year: targetYear }).startOf('year');
  const yearEnd = DateTime.fromObject({ year: targetYear }).endOf('year');

  return leaves.reduce((filtered: Leave[], leave) => {
    const leaveStart = DateTime.fromJSDate(leave.startDate);
    const leaveEnd = DateTime.fromJSDate(leave.endDate).startOf('day');

    // Skip if leave is completely outside target year
    if (leaveEnd < yearStart || leaveStart > yearEnd) {
      return filtered;
    }

    // Adjust dates if leave spans across years
    const adjustedStart = leaveStart < yearStart ? yearStart.toJSDate() : leave.startDate;
    const adjustedEnd = leaveEnd > yearEnd ? yearEnd.toJSDate() : leave.endDate;

    filtered.push({
      ...leave,
      startDate: adjustedStart,
      endDate: adjustedEnd
    });

    return filtered;
  }, []);
};

/**
 * Filters leaves data for a specific email
 * @param leaves - Array of leave records
 * @param email - Email to filter for
 * @returns Filtered array of leaves for the specified email
 */
const filterLeavesByEmail = (leaves: Leave[], email: string): Leave[] => {
  return leaves.filter((leave) => leave.email === email);
};

/**
 * Formats leave data for pie chart visualization
 * @param leaves - Array of leave records
 * @returns Formatted data for pie chart
 */
const formatLeavesForPieChart = (leaves: Leave[]) => {
  const categoryCount = leaves.reduce(
    (acc, leave) => {
      const days = calculateLeaveDays(leave.startDate, leave.endDate, leave.leaveType);

      if (leave.leaveCategory === LeaveCategory.PersonalLeave) {
        acc.personal = (acc.personal || 0) + days;
      } else if (leave.leaveCategory === LeaveCategory.SickLeave) {
        acc.sick = (acc.sick || 0) + days;
      } else {
        acc.others = (acc.others || 0) + days;
      }
      return acc;
    },
    {} as { personal: number; sick: number; others: number },
  );

  const total = Object.values(categoryCount).reduce((sum, count) => sum + count, 0);

  return [
    {
      name: LeaveCategory.PersonalLeave,
      value: Math.round((categoryCount.personal || 0) * 10) / 10,
      percentage: `${Math.round(((categoryCount.personal || 0) / total) * 100)}%`,
      color: stringToColour(LeaveCategory.PersonalLeave),
    },
    {
      name: LeaveCategory.SickLeave,
      value: Math.round((categoryCount.sick || 0) * 10) / 10,
      percentage: `${Math.round(((categoryCount.sick || 0) / total) * 100)}%`,
      color: stringToColour(LeaveCategory.SickLeave),
    },
    {
      name: 'Others',
      value: Math.round((categoryCount.others || 0) * 10) / 10,
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
    const monthStart = DateTime.fromObject({ month: index + 1 }).startOf('month');
    const monthEnd = monthStart.endOf('month');

    const monthLeaves = leaves.filter((leave) => {
      const leaveStart = DateTime.fromJSDate(leave.startDate);
      const leaveEnd = DateTime.fromJSDate(leave.endDate).startOf('day');
      return !(leaveEnd < monthStart || leaveStart > monthEnd);
    });

    const calculateMonthlyLeaveDays = (filteredLeaves: Leave[]) => {
      return filteredLeaves.reduce((total, leave) => {
        const start = DateTime.fromJSDate(leave.startDate) < monthStart ? monthStart : DateTime.fromJSDate(leave.startDate);
        const end = DateTime.fromJSDate(leave.endDate).startOf('day') > monthEnd ? monthEnd : DateTime.fromJSDate(leave.endDate).startOf('day');
        return total + calculateLeaveDays(start.toJSDate(), end.toJSDate(), leave.leaveType);
      }, 0);
    };

    return {
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index],
      personal: calculateMonthlyLeaveDays(
        monthLeaves.filter((leave) => leave.leaveCategory === LeaveCategory.PersonalLeave),
      ),
      sick: calculateMonthlyLeaveDays(monthLeaves.filter((leave) => leave.leaveCategory === LeaveCategory.SickLeave)),
      others: calculateMonthlyLeaveDays(
        monthLeaves.filter(
          (leave) => ![LeaveCategory.PersonalLeave, LeaveCategory.SickLeave].includes(leave.leaveCategory),
        ),
      ),
    };
  });

  return {
    config: {
      personal: {
        label: 'Personal Leave',
        theme: {
          light: stringToColour(LeaveCategory.PersonalLeave),
          dark: stringToColour(LeaveCategory.PersonalLeave),
        },
      },
      sick: {
        label: 'Sick Leave',
        theme: {
          light: stringToColour(LeaveCategory.SickLeave),
          dark: stringToColour(LeaveCategory.SickLeave),
        },
      },
      others: {
        label: 'Others',
        theme: {
          light: '#7367F0',
          dark: '#7367F0',
        },
      },
    },
    data: monthlyData,
  };
};

/**
 * Formats leave data for different chart types
 * @param leaves - Array of leave records
 * @param chartType - Type of chart to format data for
 * @param options - Optional configuration including year filter and email filter
 * @returns Formatted data based on chart type
 */
export const formatLeavesForChart = (
  leaves: Leave[],
  options?: { chartType?: ChartType; year?: number; email?: string },
) => {
  let filteredLeaves = leaves;

  filteredLeaves = filterLeavesByYear(filteredLeaves, options?.year);

  if (options?.email) {
    filteredLeaves = filterLeavesByEmail(filteredLeaves, options.email);
  }

  switch (options?.chartType) {
    case ChartType.Pie:
      return formatLeavesForPieChart(filteredLeaves);
    case ChartType.MultipleLines:
      return formatLeavesForLineChart(filteredLeaves);
    default:
      return filteredLeaves;
  }
};
