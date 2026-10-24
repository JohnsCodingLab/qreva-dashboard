import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataGrid } from "@mui/x-data-grid";
import { MoreVertical, Download, Search } from "lucide-react";
import CustomPagination from "../common/Pagination";
import { Skeleton, Box } from "@mui/material";
import { GridOverlay } from "@mui/x-data-grid";
import ExportReportModal from "../modals/ExportReportModal";

const DataTable = ({
  data = [],
  columns = [],
  title = "Data Table",
  actions = [], // Array of action objects: [{ label, icon, onClick }]
  onSearch,
  onFilter,
  filterGroups,
  onExport,
  showSearch = true,
  showFilter,
  showCheckbox = true,
  showExport = false,
  exportType = "all",
  exportText = "Download Report",
  // 5 rows made date/time ranges impossible to read on profile transaction
  // tables - reviewers had to page repeatedly to see a single day. 25 fits a
  // screen; the larger options exist for pulling a period in one view.
  pageSize = 25,
  pageSizeOptions = [10, 25, 50, 100],
  getRowId,
  // Extract pagination props so they don't conflict via {...rest}
  pagination,
  onPageChange,
  paginationMode,
  paginationModel: externalPaginationModel,
  onPaginationModelChange,
  rowCount,
  // Sorting, extracted for the same reason as pagination
  sortModel,
  onSortChange,
  sortingMode,
  ...rest
}) => {
  const [dropdown, setDropdown] = useState({
    open: false,
    anchor: null,
    row: null,
    x: 0,
    y: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const filterRef = useRef(null);
  const searchDebounceRef = useRef(null);

  const defaultFilterGroups = [
    {
      key: "status",
      label: "Status",
      options: ["Completed", "Pending", "Failed"].map((status) => ({
        label: status,
        value: status,
      })),
    },
  ];
  const resolvedFilterGroups = filterGroups?.length
    ? filterGroups
    : defaultFilterGroups;
  const shouldShowFilter = showFilter ?? !!onFilter;
  const isActiveFilterValue = (val) => {
    if (val == null || val === "") return false;
    if (typeof val === "object") return Boolean(val.from || val.to);
    return true;
  };
  const activeFilterCount = Object.values(selectedFilters).filter(isActiveFilterValue).length;

  // CSV Export utility via Modal API
  const handleExport = useCallback(() => {
    if (onExport) {
      onExport(data);
      return;
    }
    setExportModalOpen(true);
  }, [data, onExport]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClick(e) {
      if (
        dropdown.open &&
        dropdown.anchor &&
        !dropdown.anchor.contains(e.target)
      ) {
        setDropdown({ open: false, anchor: null, row: null, x: 0, y: 0 });
      }
    }
    if (dropdown.open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdown]);

  const handleAction = (action, row) => {
    if (action.onClick) {
      action.onClick(row);
    }
    setDropdown({ open: false, anchor: null, row: null, x: 0, y: 0 });
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      if (onSearch) onSearch(value);
    }, 400);
  };

  const handleFilterSelect = (groupKey, value) => {
    const nextFilters = {
      ...selectedFilters,
      [groupKey]: value,
    };

    if (!value) {
      delete nextFilters[groupKey];
    }

    setSelectedFilters(nextFilters);
    if (onFilter) onFilter(nextFilters);
  };

  const clearFilters = () => {
    setSelectedFilters({});
    setFilterOpen(false);
    if (onFilter) onFilter({});
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    if (filterOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpen]);

  // A server-paginated table can only be sorted by the server: sorting the ten
  // rows already fetched would reorder the visible page while claiming to have
  // ordered all hundred-and-something of them. When the page hasn't supplied a
  // sort handler, the columns simply don't offer sorting rather than offering
  // one that lies.
  const isServerPaginated = Boolean(pagination) || paginationMode === "server";
  const resolvedSortingMode =
    sortingMode || (isServerPaginated ? "server" : "client");
  const sortingDisabled = resolvedSortingMode === "server" && !onSortChange;

  // --- Infinite-loop guard for controlled sortModel ---
  // MUI DataGrid fires onSortModelChange whenever the `sortModel` prop
  // reference changes — even when the *values* are identical. Because
  // useTableControls returns a fresh array after every setSortModel call,
  // the cycle becomes: onSortModelChange → setSortModel → new array ref →
  // DataGrid detects prop change → onSortModelChange → …
  // We break the loop by comparing the incoming model to the last one we
  // forwarded, by value, and swallowing duplicates.
  const lastForwardedSortRef = useRef(null);
  const stableSortChangeHandler = useMemo(() => {
    if (!onSortChange) return undefined;
    return (model) => {
      const next = JSON.stringify(model ?? []);
      if (next === lastForwardedSortRef.current) return; // same value — skip
      lastForwardedSortRef.current = next;
      onSortChange(model);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSortChange]);

  // --- Infinite-loop guard and stabilization for paginationModel ---
  // If externalPaginationModel or pagination is provided, the table is controlled.
  // Otherwise, use internal state so MUI DataGrid does not receive a freshly
  // allocated object on every render, which triggers infinite [Violation] 'setTimeout'
  // handlers and table flickering.
  const [internalPaginationModel, setInternalPaginationModel] = useState({
    page: 0,
    pageSize,
  });

  useEffect(() => {
    setInternalPaginationModel((prev) =>
      prev.pageSize === pageSize ? prev : { ...prev, pageSize }
    );
  }, [pageSize]);

  const controlledPaginationModel = useMemo(() => {
    if (externalPaginationModel) return externalPaginationModel;
    if (pagination) {
      return {
        page: (pagination.page || 1) - 1,
        pageSize: pagination.limit || pageSize,
      };
    }
    return undefined;
  }, [externalPaginationModel, pagination?.page, pagination?.limit, pageSize]);

  const activePaginationModel = controlledPaginationModel || internalPaginationModel;

  const handlePaginationModelChange = useCallback((model) => {
    if (onPaginationModelChange) {
      onPaginationModelChange(model);
    } else if (onPageChange) {
      onPageChange(model.page + 1);
    } else {
      setInternalPaginationModel(model);
    }
  }, [onPaginationModelChange, onPageChange]);

  // Add actions column if actions are provided
  const baseColumns = sortingDisabled
    ? columns.map((column) => ({ ...column, sortable: false }))
    : columns;

  const gridColumns =
    actions.length > 0
      ? [
          ...baseColumns,
          {
            field: "actions",
            headerName: "",
            width: 80,
            sortable: false,
            renderCell: (params) => (
              <button
                className="text-[#084059] hover:text-[#1E1E1E] flex items-center cursor-pointer border border-[#E4E7EC] p-2 rounded h-full"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setDropdown({
                    open: true,
                    anchor: e.currentTarget,
                    row: params.row,
                    x: rect.right - 192,
                    y: rect.bottom + 4,
                  });
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <MoreVertical size={16} />
              </button>
            ),
          },
        ]
      : columns;

  const CustomLoadingOverlay = () => (
    <GridOverlay>
      <Box
        sx={{
          width: "100%",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {[...Array(5)].map((_, i) => (
          <Box key={i} sx={{ display: "flex", gap: 2, width: "100%" }}>
            <Skeleton variant="rectangular" width="30%" height={20} />
            <Skeleton variant="rectangular" width="40%" height={20} />
            <Skeleton variant="rectangular" width="15%" height={20} />
            <Skeleton variant="rectangular" width="15%" height={20} />
          </Box>
        ))}
      </Box>
    </GridOverlay>
  );

  const isLoading = rest.loading || rest.isLoading;
  const estimatedTableMinWidth = Math.max(
    720,
    gridColumns.reduce((total, column) => total + (column.width || 160), 0),
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-lg font-urbanist font-semibold text-[#1E1E1E]">
              {title}
            </CardTitle>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto lg:justify-end">
              {showSearch && (
                <div className="flex w-full gap-2 items-center sm:w-auto">
                  <div className="relative w-full sm:w-52">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search here..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full rounded-lg border border-[#E8EBED] bg-white py-2 pl-10 pr-3 text-sm font-general outline-none focus:border-[#84C4CF]"
                    />
                  </div>
                  {shouldShowFilter && (
                  <div className="relative" ref={filterRef}>
                    <button
                      onClick={() => setFilterOpen((v) => !v)}
                      className={`flex items-center gap-2 px-3 py-2 text-sm font-general border rounded-lg transition-colors ${filterOpen || activeFilterCount > 0 ? "border-[#FF5B04] text-[#FF5B04] bg-[#FFF4EE]" : "border-[#E8EBED] text-[#98A2B3] bg-white hover:bg-[#F5F6F7]"}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 5.83337H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path opacity="0.4" d="M2.5 14.1666H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M15 14.1666H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path opacity="0.4" d="M12.5 5.83337H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M5 5.83337C5 5.05681 5 4.66852 5.12687 4.36223C5.29602 3.95386 5.62048 3.6294 6.02886 3.46024C6.33515 3.33337 6.72343 3.33337 7.5 3.33337C8.27657 3.33337 8.66483 3.33337 8.97117 3.46024C9.3795 3.6294 9.704 3.95386 9.87317 4.36223C10 4.66852 10 5.05681 10 5.83337C10 6.60994 10 6.99822 9.87317 7.30452C9.704 7.71289 9.3795 8.03735 8.97117 8.20651C8.66483 8.33337 8.27657 8.33337 7.5 8.33337C6.72343 8.33337 6.33515 8.33337 6.02886 8.20651C5.62048 8.03735 5.29602 7.71289 5.12687 7.30452C5 6.99822 5 6.60994 5 5.83337Z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M10 14.1666C10 13.39 10 13.0018 10.1268 12.6955C10.296 12.2871 10.6205 11.9626 11.0288 11.7935C11.3352 11.6666 11.7234 11.6666 12.5 11.6666C13.2766 11.6666 13.6648 11.6666 13.9712 11.7935C14.3795 11.9626 14.704 12.2871 14.8732 12.6955C15 13.0018 15 13.39 15 14.1666C15 14.9432 15 15.3315 14.8732 15.6378C14.704 16.0461 14.3795 16.3706 13.9712 16.5398C13.6648 16.6666 13.2766 16.6666 12.5 16.6666C11.7234 16.6666 11.3352 16.6666 11.0288 16.5398C10.6205 16.3706 10.296 16.0461 10.1268 15.6378C10 15.3315 10 14.9432 10 14.1666Z" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                      Filter
                      {activeFilterCount > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#FF5B04] text-white rounded-full">{activeFilterCount}</span>
                      )}
                    </button>
                    {filterOpen && (
                      <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-[#E8EBED] rounded-lg shadow-lg py-2 w-64 max-h-96 overflow-y-auto">
                        <div className="flex items-center justify-between px-3 pb-2 border-b border-[#F0F3F4]">
                          <p className="text-xs font-urbanist font-semibold text-[#084059] uppercase tracking-wide">Filters</p>
                          {activeFilterCount > 0 && (
                            <button
                              onClick={clearFilters}
                              className="text-xs font-general font-medium text-[#FF5B04] hover:text-[#E54F03]"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        {resolvedFilterGroups.map((group) => {
                          if (group.type === "dateRange") {
                            const range = selectedFilters[group.key] || {};
                            return (
                              <div key={group.key} className="py-2 px-3 border-b border-[#F0F3F4] last:border-b-0 space-y-2">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-urbanist font-semibold text-[#084059] uppercase tracking-wide">
                                    {group.label}
                                  </p>
                                  {(range.from || range.to) && (
                                    <button
                                      type="button"
                                      onClick={() => handleFilterSelect(group.key, "")}
                                      className="text-xs font-general text-[#FF5B04] hover:text-[#E54F03]"
                                    >
                                      Reset
                                    </button>
                                  )}
                                </div>
                                <label className="block">
                                  <span className="block text-xs text-[#808C91] mb-1">From</span>
                                  <input
                                    type="date"
                                    value={range.from || ""}
                                    max={range.to || undefined}
                                    onChange={(e) =>
                                      handleFilterSelect(group.key, { ...range, from: e.target.value })
                                    }
                                    className="w-full px-2 py-1.5 text-sm font-general border border-[#E8EBED] rounded-md outline-none focus:border-[#84C4CF]"
                                  />
                                </label>
                                <label className="block">
                                  <span className="block text-xs text-[#808C91] mb-1">To</span>
                                  <input
                                    type="date"
                                    value={range.to || ""}
                                    min={range.from || undefined}
                                    onChange={(e) =>
                                      handleFilterSelect(group.key, { ...range, to: e.target.value })
                                    }
                                    className="w-full px-2 py-1.5 text-sm font-general border border-[#E8EBED] rounded-md outline-none focus:border-[#84C4CF]"
                                  />
                                </label>
                              </div>
                            );
                          }

                          return (
                            <div key={group.key} className="py-2 border-b border-[#F0F3F4] last:border-b-0">
                              <p className="px-3 py-1 text-xs font-urbanist font-semibold text-[#084059] uppercase tracking-wide">
                                {group.label}
                              </p>
                              <button
                                onClick={() => handleFilterSelect(group.key, "")}
                                className={`w-full text-left px-3 py-2 text-sm font-general transition-colors flex items-center justify-between ${!selectedFilters[group.key] ? "text-[#FF5B04] bg-[#FFF4EE] font-medium" : "text-[#1E1E1E] hover:bg-[#F5F6F7]"}`}
                              >
                                All
                                {!selectedFilters[group.key] && (
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                )}
                              </button>
                              {(group.options || []).map((option) => (
                                <button
                                  key={`${group.key}-${option.value}`}
                                  onClick={() => handleFilterSelect(group.key, option.value)}
                                  className={`w-full text-left px-3 py-2 text-sm font-general transition-colors flex items-center justify-between ${selectedFilters[group.key] === option.value ? "text-[#FF5B04] bg-[#FFF4EE] font-medium" : "text-[#1E1E1E] hover:bg-[#F5F6F7]"}`}
                                >
                                  <span className="truncate">{option.label}</span>
                                  {selectedFilters[group.key] === option.value && (
                                    <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                  )}
                                </button>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  )}
                </div>
              )}
              {showExport && (
                <button
                  onClick={handleExport}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E8EBED] bg-white px-4 py-2 text-sm font-general font-medium text-[#1E1E1E] transition-colors hover:bg-[#F5F6F7] sm:w-auto"
                  title={exportText}
                >
                  <Download size={16} className="text-[#084059]" />
                  <span className="hidden sm:inline">{exportText}</span>
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-full px-0">
          <div className="overflow-x-auto">
            <div style={{ minWidth: `${estimatedTableMinWidth}px` }}>
              <DataGrid
                className="w-full"
                rows={data}
                columns={gridColumns}
                getRowId={
                  getRowId ||
                  ((row) => row._id || row.id || row.userId || row.clientId)
                }
                checkboxSelection={showCheckbox}
                disableRowSelectionOnClick
                disableColumnResize
                columnBufferPx={0}
                paginationMode={
                  paginationMode || (pagination ? "server" : "client")
                }
                // Was destructured but never passed to the grid, so the row-count
                // selector fell back to MUI's defaults and the configured options
                // had no effect.
                pageSizeOptions={pageSizeOptions}
                {...((paginationMode || (pagination ? "server" : "client")) === "server"
                  ? { rowCount: rowCount ?? pagination?.total ?? data.length }
                  : {})}
                loading={isLoading}
                paginationModel={activePaginationModel}
                onPaginationModelChange={handlePaginationModelChange}
                sortingMode={resolvedSortingMode}
                {...(sortModel ? { sortModel } : {})}
                {...(stableSortChangeHandler ? { onSortModelChange: stableSortChangeHandler } : {})}
                {...rest}
                sx={{
                  border: 0,
                  width: "100%",
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "transparent !important",
                  },
                  "& .MuiDataGrid-cell:hover": {
                    backgroundColor: "transparent !important",
                  },
                  "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                    outline: "none !important",
                  },
                  "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
                    {
                      outline: "none !important",
                    },
                  "& .MuiDataGrid-row.Mui-selected": {
                    backgroundColor: "transparent !important",
                  },
                  "& .MuiDataGrid-row.Mui-selected:hover": {
                    backgroundColor: "transparent !important",
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #f0f0f0",
                    padding: "12px 16px",
                    margin: "12px 0px",
                    fontSize: "14px",
                    fontFamily: "General Sans, sans-serif",
                    color: "#1E1E1E",
                    display: "flex",
                    alignItems: "center",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "transparent",
                    borderBottom: "1px solid #E8EBED",
                    minHeight: "48px !important",
                    maxHeight: "48px !important",
                    lineHeight: "48px !important",
                  },
                  "& .MuiDataGrid-columnHeader": {
                    padding: "12px 0px",
                    backgroundColor: "#F9FAFB",
                    "&:focus": {
                      outline: "none",
                    },
                    "&:focus-within": {
                      outline: "none",
                    },
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontSize: "12px",
                    marginLeft: "16px",
                    fontWeight: 600,
                    fontFamily: "Urbanist, sans-serif",
                    color: "#344054",
                    textTransform: "none",
                  },
                }}
                slots={{
                  pagination: CustomPagination,
                  loadingOverlay: CustomLoadingOverlay,
                }}
                slotProps={{
                  pagination: {
                    currentPage: externalPaginationModel
                      ? externalPaginationModel.page + 1
                      : pagination?.page || 1,
                    totalPages: externalPaginationModel
                      ? Math.ceil(
                          (rowCount || data.length) /
                            (externalPaginationModel.pageSize || pageSize),
                        )
                      : pagination?.totalPages ||
                        Math.ceil(
                          (pagination?.total || data.length) /
                            (pagination?.limit || pageSize),
                        ),
                    onPageChange: externalPaginationModel
                      ? (page) =>
                          onPaginationModelChange?.({
                            ...externalPaginationModel,
                            page: page - 1,
                          })
                      : onPageChange,
                    totalItems: rowCount ?? pagination?.total ?? data.length,
                    itemsPerPage:
                      externalPaginationModel?.pageSize ||
                      pagination?.limit ||
                      pageSize,
                  },
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Dropdown menu */}
      {dropdown.open && actions.length > 0 && (
        <div
          style={{
            position: "fixed",
            top: dropdown.y,
            left: dropdown.x,
            zIndex: 9999,
          }}
          className="bg-white rounded-lg shadow-lg border border-[#E8EBED] py-2 w-48"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {actions
            .filter((action) => (typeof action.isVisible === 'function' ? action.isVisible(dropdown.row) : true))
            .map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => handleAction(action, dropdown.row)}
                className="w-full px-4 py-2 text-left text-sm font-general text-[#1E1E1E] hover:bg-[#F5F6F7] flex items-center gap-2"
              >
                {Icon && <Icon size={16} />}
                {action.label}
              </button>
            );
          })}
        </div>
      )}
      
      <ExportReportModal 
        isOpen={exportModalOpen} 
        onClose={() => setExportModalOpen(false)} 
        exportType={exportType}
        title={exportText}
      />
    </>
  );
};

export default DataTable;

