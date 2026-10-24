import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataGrid } from "@mui/x-data-grid";
import SearchFilterBar from "../common/SearchFilterBar";
import CustomPagination from "../common/Pagination";

const TransferRegionsTable = ({
  data = [],
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
        rows = rows.filter((row) =>
          [row.location, row.region, row.name, row.state]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(q),
        );
      }
    }
    if (sortKey === "transactions") {
      rows.sort((a, b) => (b.value || 0) - (a.value || 0));
    } else if (sortKey === "revenue") {
      rows.sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
    } else if (sortKey === "volume") {
      rows.sort((a, b) => (b.volume || 0) - (a.volume || 0));
    } else if (sortKey === "successRate") {
      rows.sort((a, b) => (b.successRate || 0) - (a.successRate || 0));
    }
    return rows;
  }, [data, search, sortKey]);

  const handleViewDetails = (region) => {
    // If parent provides handler, use it (for navigation)
    if (onViewDetails) {
      onViewDetails(region.id);
    }
  };

  const columns = [
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span className="font-general text-sm text-[#1E1E1E]">
          {params.row.id}. {params.row.location}
        </span>
      ),
    },
    {
      field: "totalTransfers",
      headerName: "Total Transfers",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <span className="font-general text-sm text-[#1E1E1E]">
          {params.row.value?.toLocaleString()}
        </span>
      ),
    },
    {
      field: "volume",
      headerName: "Volume (₦)",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <span className="font-general text-sm text-[#1E1E1E]">
          {params.value?.toLocaleString()}
        </span>
      ),
    },
    {
      field: "revenue",
      headerName: "Revenue (₦)",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <span className="font-general text-sm text-[#1E1E1E]">
          {params.value?.toLocaleString()}
        </span>
      ),
    },
    {
      field: "successRate",
      headerName: "Success Rate (%)",
      flex: 0.8,
      minWidth: 150,
      renderCell: (params) => (
        <span className="font-general text-sm text-[#1E1E1E]">
          {params.value}%
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
          className="font-general text-sm text-[#06b6d4] hover:text-[#0891b2] font-medium transition-colors"
        >
          View Details
        </button>
      ),
    },
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-urbanist font-semibold text-[#1E1E1E]">
            {title}
          </CardTitle>
          <SearchFilterBar
            searchPlaceholder="Search by location..."
            onSearch={(value) => setSearch(value)}
            filterGroups={[
              {
                key: "sort",
                label: "Sort By",
                options: [
                  { label: "Total Transfers", value: "transactions" },
                  { label: "Volume", value: "volume" },
                  { label: "Revenue", value: "revenue" },
                  { label: "Success Rate", value: "successRate" },
                ],
              },
            ]}
            onFilter={(filters) => setSortKey(filters?.sort || null)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <DataGrid
          rows={filteredData}
          columns={columns}
          getRowId={(row) =>
            row._id || row.id || row.location || row.name || Math.random()
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
              "&:focus": {
                outline: "none",
              },
              "&:focus-within": {
                outline: "none",
              },
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontSize: "12px",
              fontWeight: 500,
              fontFamily: "General Sans, sans-serif",
              color: "#084059",
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
      </CardContent>
    </Card>
  );
};

export default TransferRegionsTable;
