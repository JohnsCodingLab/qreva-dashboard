import DateRangePicker from './DateRangePicker';

const PageHeader = ({ 
  title, 
  subtitle, 
  timeFilter, 
  onTimeFilterChange,
  actionButton, 
  hidden 
}) => {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <h1 className="text-[24px] font-urbanist font-bold leading-[120%] sm:text-[28px]">{title}</h1>
        <p className="text-sm font-general font-medium leading-[148%] text-[#808C91]">
          {subtitle}
        </p>
      </div>
      
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end lg:w-auto">
        {!hidden && onTimeFilterChange && (
          <DateRangePicker value={timeFilter} onChange={onTimeFilterChange} />
        )}

        {actionButton && <div className="mt-2 sm:mt-0">{actionButton}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
