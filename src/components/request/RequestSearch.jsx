import { useRef, useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const RequestsSearch = ({ searchQuery, onSearchChange, onFilter }) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [type, setType] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    if (filterOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [filterOpen]);

  const hasActiveFilter = type || from || to;

  const handleApply = () => {
    if (onFilter) onFilter({ type, from, to });
    setFilterOpen(false);
  };

  const handleClear = () => {
    setType('');
    setFrom('');
    setTo('');
    if (onFilter) onFilter({ type: '', from: '', to: '' });
    setFilterOpen(false);
  };

  return (
    <div className="flex gap-3 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search here..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm font-general focus:outline-none focus:ring-2 focus:ring-[#FF5B04] focus:border-transparent"
        />
      </div>

      <div className="relative" ref={filterRef}>
        <button
          onClick={() => setFilterOpen((v) => !v)}
          className={`px-4 py-2.5 border rounded-lg flex items-center gap-2 text-sm font-general transition-colors ${hasActiveFilter || filterOpen ? 'border-[#084059] text-[#084059] bg-[#F0F8FA]' : 'border-gray-200 text-[#475367] hover:bg-qreva-ash'}`}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M2.5 5.83H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path opacity=".4" d="M2.5 14.17H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M15 14.17H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path opacity=".4" d="M12.5 5.83H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M5 5.83C5 5.06 5 4.67 5.13 4.36C5.3 3.95 5.62 3.63 6.03 3.46C6.34 3.33 6.72 3.33 7.5 3.33C8.28 3.33 8.66 3.33 8.97 3.46C9.38 3.63 9.7 3.95 9.87 4.36C10 4.67 10 5.06 10 5.83C10 6.61 10 7 9.87 7.3C9.7 7.71 9.38 8.04 8.97 8.21C8.66 8.33 8.28 8.33 7.5 8.33C6.72 8.33 6.34 8.33 6.03 8.21C5.62 8.04 5.3 7.71 5.13 7.3C5 7 5 6.61 5 5.83Z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 14.17C10 13.39 10 13 10.13 12.7C10.3 12.29 10.62 11.96 11.03 11.79C11.34 11.67 11.72 11.67 12.5 11.67C13.28 11.67 13.66 11.67 13.97 11.79C14.38 11.96 14.7 12.29 14.87 12.7C15 13 15 13.39 15 14.17C15 14.94 15 15.33 14.87 15.64C14.7 16.05 14.38 16.37 13.97 16.54C13.66 16.67 13.28 16.67 12.5 16.67C11.72 16.67 11.34 16.67 11.03 16.54C10.62 16.37 10.3 16.05 10.13 15.64C10 15.33 10 14.94 10 14.17Z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          Filter
          {hasActiveFilter && (
            <span className="w-2 h-2 rounded-full bg-[#FF5B04]" />
          )}
        </button>

        {filterOpen && (
          <div className="fixed z-50 bg-white border border-[#E8EBED] rounded-lg shadow-lg p-4 w-72"
            style={{ top: filterRef.current ? filterRef.current.getBoundingClientRect().bottom + 4 : 'auto', right: window.innerWidth - (filterRef.current ? filterRef.current.getBoundingClientRect().right : 0) }}
          >
            <p className="text-sm font-urbanist font-semibold text-[#1E1E1E] mb-4">Filter Requests</p>

            {/* Type */}
            <div className="mb-4">
              <label className="text-xs font-general text-[#808C91] mb-1.5 block">Request Type</label>
              <input
                type="text"
                placeholder="e.g. Payment Request"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 text-sm font-general border border-[#E8EBED] rounded-lg outline-none focus:border-[#084059]"
              />
            </div>

            {/* Date range */}
            <div className="mb-4">
              <label className="text-xs font-general text-[#808C91] mb-1.5 block">Date Range</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <p className="text-xs font-general text-[#808C91] mb-1">From</p>
                  <input
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-general border border-[#E8EBED] rounded-lg outline-none focus:border-[#084059]"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-general text-[#808C91] mb-1">To</p>
                  <input
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-general border border-[#E8EBED] rounded-lg outline-none focus:border-[#084059]"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleClear}
                className="flex-1 py-2 text-sm font-general border border-[#E8EBED] rounded-lg text-[#475367] hover:bg-[#F5F6F7] transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleApply}
                className="flex-1 py-2 text-sm font-general bg-[#FF5B04] text-white rounded-lg hover:bg-[#E54F03] transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsSearch;
