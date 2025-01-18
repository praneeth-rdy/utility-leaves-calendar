import { cn } from '@/lib/utils';
import React from 'react';
import DynamicSelect from '../dynamic-select/DynamicSelect';
import downloadIcon from '@/assets/downloadIcon.svg';
import { IChartLayoutProps } from '@/constraints/types/chart-types';
import { InfoCircledIcon } from '@radix-ui/react-icons';

const ChartLayout: React.FC<IChartLayoutProps> = ({
  title,
  selectOptions,
  defaultSelectedValue,
  handleSelect,
  children,
  isDonutChart = false,
  showDownloadIcon = true,
  showInfoIcon,
}) => (
  <ChartLayoutWrapper className={`${isDonutChart ? 'w-[350px]' : 'w-[770px]'}`}>
    <ChartLayoutHeader>
      <div className={`w-full flex items-center ${showDownloadIcon || showInfoIcon ? 'gap-3' : 'justify-between'}`}>
        <ChartLayoutTitle>{title}</ChartLayoutTitle>
        {showInfoIcon && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600">
              <InfoCircledIcon />
            </span>
          </div>
        )}
        {handleSelect && selectOptions && (
          <DynamicSelect
            onChange={handleSelect}
            selectOptions={selectOptions}
            defaultSelectedValue={defaultSelectedValue}
          />
        )}
      </div>
      {showDownloadIcon && (
        <div className="flex items-center space-x-2">
          <button className="text-gray-500 hover:text-gray-800">
            <img src={downloadIcon} alt="download icon" />
          </button>
        </div>
      )}
    </ChartLayoutHeader>
    <ChartLayoutContent>{children}</ChartLayoutContent>
  </ChartLayoutWrapper>
);

export default ChartLayout;

const ChartLayoutWrapper = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(`bg-white shadow rounded-lg h-auto`, className)} {...props} />
  ),
);
ChartLayoutWrapper.displayName = 'ChartLayoutWrapper';

const ChartLayoutHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('w-full flex items-center justify-between gap-2 border-b border-gray-200 py-4 px-6', className)}
      {...props}
    />
  ),
);
ChartLayoutHeader.displayName = 'ChartLayoutHeader';

const ChartLayoutTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-lg font-semibold text-center', className)} {...props} />
  ),
);
ChartLayoutTitle.displayName = 'ChartLayoutTitle';

const ChartLayoutContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col items-start justify-center text-center gap-1 px-6 pb-4', className)}
      {...props}
    />
  ),
);
ChartLayoutContent.displayName = 'ChartLayoutContent';
