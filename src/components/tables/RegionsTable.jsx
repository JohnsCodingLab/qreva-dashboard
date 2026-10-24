import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataGrid } from "@mui/x-data-grid";
import SearchFilterBar from "../common/SearchFilterBar";
import CustomPagination from "../common/Pagination";

const getRegionName = (row) =>
  row.location || row.region || row.name || row.state || row._id || row.id || '';

const buildSearchHaystack = (row) =>
  [
    row.location,
    row.region,
    row.name,
    row.state,
    row.lga,
    row.country,
    row._id,
    row.id,
    row.totalTransactions != null ? String(row.totalTransactions) : '',
    row.totalRevenue != null ? String(row.totalRevenue) : '',
    row.totalTransactionVolume != null ? String(row.totalTransactionVolume) : '',
    row.successRate != null ? String(row.successRate) : '',
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

const RegionsTable = ({
  data = [],
  columns = [],
  title = "Top Regions",
  onViewDetails,
}) => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(null);

  const filteredData = useMemo(() => {
    let rows = Array.isArray(data) ? [...data] : [];
    if (search) {
      const q = search.trim().toLowerCase();
      if (q) {
        rows = rows.filter((row) => buildSearchHaystack(row).includes(q));
      }
    }
    if (sortKey === "transactions") {
      rows.sort((a, b) => (b.totalTransactions || 0) - (a.totalTransactions || 0));
    } else if (sortKey === "revenue") {
      rows.sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0));
    } else if (sortKey === "volume") {
      rows.sort(
        (a, b) =>
          (b.totalTransactionVolume || 0) - (a.totalTransactionVolume || 0),
      );
    } else if (sortKey === "successRate") {
      rows.sort((a, b) => (b.successRate || 0) - (a.successRate || 0));
    }
    return rows;
  }, [data, search, sortKey]);

  const handleViewDetails = (region) => {
    if (onViewDetails) {
      onViewDetails(region._id || region.id || region.location || region.region || region.name || region.state);
    }
  };

  const defaultColumns = [
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span className="font-general text-sm flex items-center gap-3">
          <p className="bg-[#F7FAFA] rounded-full w-6 h-6 flex items-center justify-center text-[#808C91] text-center border-2 border-[#E9F1F3]">
            {params.api.getRowIndexRelativeToVisibleRows(params.id) + 1}
          </p>{" "}
          <p className="font-medium leading-[148%] text-[#1E1E1E]">
            {params.row.location || params.row.region || params.row.name || params.row.state || '-'}
          </p>
        </span>
      ),
    },
    {
      field: "total",
      headerName: "Total Transaction Volume",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <span className="font-general text-sm text-[#1E1E1E] flex items-center leading-[156%]">
          {params.row.totalTransactions?.toLocaleString() ||
            params.value?.toLocaleString() ||
            0}
        </span>
      ),
    },
    {
      field: "revenue",
      headerName: "Total Revenue (₦)",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <span className="font-general text-sm text-[#1E1E1E] flex items-center font-medium">
          {params.row.totalRevenue?.toLocaleString() ||
            params.value?.toLocaleString()}
        </span>
      ),
    },
    {
      field: "volume",
      headerName: "Total Transaction Value (₦)",
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <span className="font-general text-sm text-[#1E1E1E] flex items-center font-medium">
          {params.row.totalTransactionVolume?.toLocaleString() ||
            params.value?.toLocaleString()}
        </span>
      ),
    },
    {
      field: "rate",
      headerName: "Success Rate (%)",
      flex: 0.8,
      minWidth: 150,
      renderCell: (params) => (
        <span className="font-general text-sm text-[#1E1E1E] flex items-center">
          {params.row.successRate || params.value}%
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <button
          onClick={() => handleViewDetails(params.row)}
          className="font-general flex items-center text-sm text-[#26C8B9] underline underline-offset-2 cursor-pointer font-semibold"
        >
          View Details
        </button>
      ),
    },
  ];

  const tableColumns = columns.length > 0 ? columns : defaultColumns;

  return (
    <Card className="mb-6 px-0">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-urbanist leading-[145%] font-semibold text-[#1E1E1E]">
            {title}
          </CardTitle>
          <SearchFilterBar
            searchPlaceholder="Search by location..."
            onSearch={(value) => setSearch(value)}
            filterGroups={[
              {
                key: 'sort',
                label: 'Sort By',
                options: [
                  { label: 'Total Transactions', value: 'transactions' },
                  { label: 'Total Revenue', value: 'revenue' },
                  { label: 'Total Transaction Value', value: 'volume' },
                  { label: 'Success Rate', value: 'successRate' },
                ],
              },
            ]}
            onFilter={(filters) => setSortKey(filters?.sort || null)}
          />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-[#084059]">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#D0D5DD] flex items-center justify-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            </div>
            <p className="text-sm font-general">No region data available</p>
          </div>
        ) : (
          <DataGrid
            rows={filteredData}
            columns={tableColumns}
            getRowId={(row) =>
              row._id || row.id || row.location || row.region || row.name || row.state || Math.random()
            }
            disableRowSelectionOnClick
            disableColumnMenu
            hideFooterSelectedRowCount
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            sx={{
              border: "none",
              "& .MuiDataGrid-main": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #F5F6F7",
                padding: "16px",
                fontSize: "14px",
                fontFamily: "General Sans, sans-serif",
                color: "#1E1E1E",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "transparent",
                borderBottom: "1px solid #E8EBED",
                minHeight: "48px !important",
                maxHeight: "48px !important",
                lineHeight: "48px !important",
              },
              "& .MuiDataGrid-columnHeader": {
                padding: "12px 16px",
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
                fontWeight: 600,
                fontFamily: "Urbanist, sans-serif",
                color: "#344054",
                textTransform: "none",
              },
              "& .MuiDataGrid-row": {
                "&:hover": {
                  backgroundColor: "#FAFBFB",
                },
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                marginTop: "16px",
                minHeight: "56px",
              },
              "& .MuiTablePagination-root": {
                color: "#084059",
                fontFamily: "General Sans, sans-serif",
              },
              "& .MuiTablePagination-displayedRows": {
                fontSize: "14px",
                fontFamily: "General Sans, sans-serif",
                color: "#084059",
              },
              "& .MuiTablePagination-actions": {
                gap: "8px",
              },
              "& .MuiTablePagination-actions button": {
                padding: "8px 12px",
                border: "1px solid #E8EBED",
                borderRadius: "6px",
                color: "#084059",
                fontFamily: "General Sans, sans-serif",
                fontSize: "14px",
                "&:hover": {
                  backgroundColor: "#F5F6F7",
                },
                "&.Mui-disabled": {
                  opacity: 0.5,
                  border: "1px solid #E8EBED",
                },
              },
              "& .MuiDataGrid-virtualScroller": {
                marginTop: "48px !important",
              },
            }}
            slots={{
              pagination: CustomPagination,
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RegionsTable;
