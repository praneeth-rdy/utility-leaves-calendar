import { ToastType } from '@/constraints/enums/core-enums';
import { toast, ToastPosition } from 'react-hot-toast';
import { dateToEpoch, formatEpochToHumanReadable } from '@/utils/date-utils';
import { PublicHoliday } from '@/constraints/types/core-types';

/**
 * Checks if a given date falls within any of the provided public holidays
 * @param date - The date to check
 * @param holidays - Array of public holidays to check against
 * @returns The name of the holiday if date falls within one, undefined otherwise
 */
export const isHoliday = (date: Date, holidays: PublicHoliday[]): string | undefined => {
  const holiday = holidays.find((holiday) => {
    const holidayStart = new Date(holiday.startDate);
    const holidayEnd = new Date(holiday.endDate);
    return date >= holidayStart && date <= holidayEnd;
  });
  return holiday?.name;
};

/**
 * Shows a toast notification with the given type and message
 * @param type - The type of toast (success/error)
 * @param message - The message to display
 */
export const showToast = (type: ToastType, message: string) => {
  const options = {
    duration: 3000,
    position: 'top-center' as ToastPosition,
  };

  switch (type) {
    case ToastType.Success:
      toast.success(message, options);
      break;
    case ToastType.Error:
      toast.error(message, options);
      break;
  }
};

/**
 * Generates an Adaptive Card for leave details
 * @param formData - The form data containing leave details
 * @returns An Adaptive Card object
 */
export const generateAdaptiveCard = (formData: any) => {
  const startDate = formatEpochToHumanReadable(dateToEpoch(formData.leaveStartDate));
  const endDate = formatEpochToHumanReadable(dateToEpoch(formData.leaveEndDate));

  return {
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    type: 'AdaptiveCard',
    version: '1.4',
    body: [
      {
        type: 'TextBlock',
        text: `Leave on ${startDate}`,
        weight: 'bolder',
        size: 'large',
        spacing: 'medium',
      },
      {
        type: 'Container',
        items: [
          {
            type: 'TextBlock',
            text: formData.name,
            weight: 'bolder',
            size: 'medium',
          },
          {
            type: 'FactSet',
            facts: [
              {
                title: 'Department:',
                value: formData.department === 'Other' ? formData.customDepartment : formData.department,
              },
              {
                title: 'Role:',
                value: formData.role,
              },
              {
                title: 'Duration:',
                value:
                  formData.leaveStartDate.getTime() === formData.leaveEndDate.getTime()
                    ? startDate
                    : `${startDate} - ${endDate}`,
              },
              {
                title: 'Type:',
                value: formData.leaveType,
              },
              {
                title: 'Category:',
                value: formData.leaveCategory === 'Other' ? formData.customCategory : formData.leaveCategory,
              },
            ],
          },
          {
            type: 'TextBlock',
            text: 'Reason:',
            weight: 'bolder',
            spacing: 'medium',
          },
          {
            type: 'TextBlock',
            text: formData.reasonForLeave,
            wrap: true,
          },
        ],
        spacing: 'medium',
        style: 'emphasis',
        bleed: false,
      },
    ],
    actions: [],
  };
};
