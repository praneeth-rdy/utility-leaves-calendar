import { CustomTooltipProps } from '@/constraints/types/chart-types';

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;

  const { name, value, percentage, color } = payload[0].payload;

  return (
    <div className="bg-[var(--Grey-0,#FFF)] flex flex-col items-start gap-1 py-2 px-3 rounded-5 shadow-custom-pieChart-shadow">
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-sm gap-[6px]`} style={{ backgroundColor: color }}></div>
        <p className="text-grey-700 font-[Montserrat] text-xs  font-normal leading-5">{name}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold  text-center text-text-dark leading-5.5">{value}</span>
        <div className="w-[1px] h-5 rounded-10 bg-grey-50"></div>
        <p className="text-sm font-semibold text-center text-text-dark">{percentage}</p>
      </div>
    </div>
  );
};

export default CustomTooltip;
