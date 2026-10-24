import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, startOfQuarter, endOfQuarter, startOfYear, endOfYear, parseISO, isSameDay } from "date-fns";

export const getRangeDates = (type = "today") => {
  const today = new Date();
  switch (type) {
    case "today":
      return { from: format(today, "yyyy-MM-dd"), to: format(today, "yyyy-MM-dd"), label: format(today, "dd MMM yyyy") };
    case "yesterday": {
      const yesterday = subDays(today, 1);
      return { from: format(yesterday, "yyyy-MM-dd"), to: format(yesterday, "yyyy-MM-dd"), label: format(yesterday, "dd MMM yyyy") };
    }
    case "current_week": {
      const start = startOfWeek(today, { weekStartsOn: 1 });
      const end = endOfWeek(today, { weekStartsOn: 1 });
      return { from: format(start, "yyyy-MM-dd"), to: format(end, "yyyy-MM-dd"), label: `${format(start, "dd MMM yyyy")} - ${format(end, "dd MMM yyyy")}` };
    }
    case "current_month": {
      const start = startOfMonth(today);
      const end = endOfMonth(today);
      return { from: format(start, "yyyy-MM-dd"), to: format(end, "yyyy-MM-dd"), label: `${format(start, "dd MMM yyyy")} - ${format(end, "dd MMM yyyy")}` };
    }
    case "previous_month": {
      const prev = subMonths(today, 1);
      const start = startOfMonth(prev);
      const end = endOfMonth(prev);
      return { from: format(start, "yyyy-MM-dd"), to: format(end, "yyyy-MM-dd"), label: `${format(start, "dd MMM yyyy")} - ${format(end, "dd MMM yyyy")}` };
    }
    case "quarter": {
      const start = startOfQuarter(today);
      const end = endOfQuarter(today);
      return { from: format(start, "yyyy-MM-dd"), to: format(end, "yyyy-MM-dd"), label: `${format(start, "dd MMM yyyy")} - ${format(end, "dd MMM yyyy")}` };
    }
    case "year": {
      const start = startOfYear(today);
      const end = endOfYear(today);
      return { from: format(start, "yyyy-MM-dd"), to: format(end, "yyyy-MM-dd"), label: `${format(start, "dd MMM yyyy")} - ${format(end, "dd MMM yyyy")}` };
    }
    default:
      return null;
  }
};

export const getDefaultDateRange = (preset = "today") => {
  const dates = getRangeDates(preset);
  return {
    range: preset,
    from: dates?.from,
    to: dates?.to,
    label: dates?.label || "Today",
  };
};

const DateRangePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const presetRanges = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Current Week", value: "current_week" },
    { label: "Current Month", value: "current_month" },
    { label: "Previous Month", value: "previous_month" },
    { label: "Quarter", value: "quarter" },
    { label: "Year", value: "year" },
    { label: "Custom Date Range", value: "custom" },
  ];

  const handleSelectPreset = (preset) => {
    if (preset === "custom") {
      setCustomMode(true);
      return;
    }
    const dates = getRangeDates(preset);
    if (dates) {
      onChange({ range: preset, from: dates.from, to: dates.to, label: dates.label });
      setIsOpen(false);
      setCustomMode(false);
    }
  };

  const [customMode, setCustomMode] = useState(false);
  const [customFrom, setCustomFrom] = useState(format(new Date(), "yyyy-MM-dd"));
  const [customTo, setCustomTo] = useState(format(new Date(), "yyyy-MM-dd"));

  const handleApplyCustom = () => {
    const start = parseISO(customFrom);
    const end = parseISO(customTo);
    const label = isSameDay(start, end) 
      ? format(start, "dd MMM yyyy")
      : `${format(start, "dd MMM yyyy")} - ${format(end, "dd MMM yyyy")}`;
    
    onChange({ range: "custom", from: customFrom, to: customTo, label });
    setIsOpen(false);
    setCustomMode(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setCustomMode(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayLabel = value?.label || (typeof value === 'string' ? value : "Select Date Range");

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="capitalize">{displayLabel}</span>
        </div>
        <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 w-64 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {!customMode ? (
              presetRanges.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handleSelectPreset(preset.value)}
                  className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                    value?.range === preset.value ? "bg-blue-50 text-qreva-blue font-semibold" : "text-gray-700"
                  }`}
                >
                  {preset.label}
                </button>
              ))
            ) : (
              <div className="p-4">
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-qreva-blue"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-qreva-blue"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setCustomMode(false)}
                    className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyCustom}
                    className="px-3 py-1 text-sm text-white bg-qreva-blue rounded hover:bg-blue-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
