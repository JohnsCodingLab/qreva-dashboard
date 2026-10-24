import React from 'react';

const CustomPagination = ({
  currentPage = 1,
  totalPages = 30,
  onPageChange = () => { },
  totalItems,
  itemsPerPage
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-between w-full px-4">
      <span className="text-sm font-general text-[#084059] font-semibold">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' ? onPageChange(page) : null}
            className={`px-3 py-1.5 text-sm font-general rounded-md transition-colors ${page === currentPage
                ? 'text-[#FF5B04] bg-[#FFEFE6] border border-[#FFEFE6]'
                : typeof page === 'number'
                  ? 'text-[#084059] hover:bg-[#F5F6F7]'
                  : 'text-[#B0B7C3] cursor-default'
              }`}
            disabled={typeof page !== 'number'}
          >
            {page}
          </button>
        ))}

      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-general text-[#084059] border border-[#E8EBED] rounded-md hover:bg-[#F5F6F7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.4" d="M8.33203 10H16.6654" stroke="#98A2B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.51049 11.3355L5.31585 11.9699C6.62068 12.9979 7.2731 13.5118 7.80256 13.2774C8.33201 13.0429 8.33201 12.2401 8.33201 10.6344V9.3656C8.33201 7.75995 8.33201 6.95713 7.80256 6.7227C7.2731 6.48827 6.62068 7.00222 5.31586 8.03012L4.51049 8.66452C3.72485 9.28344 3.33203 9.59294 3.33203 10C3.33203 10.4071 3.72485 10.7166 4.51049 11.3355Z" stroke="#98A2B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Previous
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-general text-[#084059] border border-[#E8EBED] rounded-md hover:bg-[#F5F6F7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.4" d="M11.6654 10H3.33203" stroke="#98A2B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.4896 11.3355L14.6841 11.9699C13.3793 12.9979 12.7269 13.5118 12.1975 13.2774C11.668 13.0429 11.668 12.2401 11.668 10.6344V9.3656C11.668 7.75995 11.668 6.95713 12.1975 6.7227C12.7269 6.48827 13.3793 7.00222 14.6841 8.03012L15.4895 8.66452C16.2751 9.28344 16.668 9.59294 16.668 10C16.668 10.4071 16.2751 10.7166 15.4896 11.3355Z" stroke="#98A2B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CustomPagination;