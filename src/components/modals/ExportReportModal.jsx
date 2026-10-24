import React, { useState } from 'react';
import BaseModal from './BaseModal';
import { useDownloadFinancialReport } from '../../store/features/reports/useReports';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ExportReportModal = ({ isOpen, onClose, exportType = 'all', title = "Download Report" }) => {
  const [date, setDate] = useState({
    from: undefined,
    to: undefined,
  });

  const { mutate: downloadReport, isPending } = useDownloadFinancialReport();

  const handleDownload = () => {
    const fromDate = date?.from ? format(date.from, 'yyyy-MM-dd') : '';
    const toDate = date?.to ? format(date.to, 'yyyy-MM-dd') : '';

    downloadReport(
      { from: fromDate, to: toDate, type: exportType },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-6 font-general mt-2">
        <p className="text-sm text-[#084059]">
          Please select the time frame for the report you want to download.
        </p>
        
        <div className="grid gap-2">
          <label className="block text-sm font-medium text-[#1E1E1E]">Date Range</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal py-5 border-[#E8EBED] text-[#1E1E1E]",
                  !date?.from && "text-[#084059]"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-[#084059]" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span className="text-[#084059]">Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-9999" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-[#E8EBED] mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-[#E8EBED] rounded-lg text-[#1E1E1E] font-medium hover:bg-[#F5F6F7] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={isPending || !date?.from || !date?.to}
            className="px-5 py-2 bg-[#FF5B04] text-white font-medium rounded-lg hover:bg-[#E54F03] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? 'Generating...' : 'Download CSV'}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ExportReportModal;
