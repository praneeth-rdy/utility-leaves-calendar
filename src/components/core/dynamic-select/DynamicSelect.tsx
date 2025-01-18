import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectValue } from '../../ui/select';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

interface IDynamicSelectProps {
  selectOptions: { label: string; value: string }[];
  defaultSelectedValue?: string;
  onChange: (value: string) => void;
}

const DynamicSelect: React.FC<IDynamicSelectProps> = ({ selectOptions, defaultSelectedValue, onChange }) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(defaultSelectedValue);

  useEffect(() => {
    if (selectOptions?.length > 0 && !selectedValue) {
      const initialValue = defaultSelectedValue || selectOptions[0]?.value;

      if (selectedValue !== initialValue) {
        setSelectedValue(initialValue);
        onChange(initialValue);
      }
    }
  }, [defaultSelectedValue, selectOptions, onChange]);

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    onChange(value);
  };
  return (
    <Select value={selectedValue} onValueChange={handleValueChange}>
      <SelectTrigger className="text-xs font-medium text-gray-400 w-32">
        <SelectValue>{selectOptions?.find((option) => option.value === selectedValue)?.label ?? 'Select'}</SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white">
        {selectOptions?.length > 0 ? (
          selectOptions?.map((option, index) => (
            <SelectItem key={index} value={option.value}>
              {option.label}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="" disabled>
            No selectOptions available
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default DynamicSelect;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'h-5 flex items-center justify-start gap-1 whitespace-nowrap rounded-md bg-transparent placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDownIcon className="h-5 w-5" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
