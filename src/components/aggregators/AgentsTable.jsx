import { DataGrid } from '@mui/x-data-grid';
import { Card, CardContent } from '@/components/ui/card';
import { agentColumns } from '@/pages/aggregator/constants';

const AgentsTable = ({ agents, onActionClick }) => {
  const columnsWithActions = [
    ...agentColumns,
    {
      field: 'actions',
      headerName: '',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <button
          className="text-[#084059] hover:text-[#1E1E1E]"
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            onActionClick(params.row, rect);
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      )
    }
  ];

  return (
    <Card>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-urbanist font-semibold text-[#1E1E1E]">Agents</h2>
      </div>
      <CardContent>
        <DataGrid
          rows={agents}
          columns={columnsWithActions}
          getRowId={(row) => row._id || row.id || row.userId || row.clientId}
          checkboxSelection
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          sx={{
            border: 0,
            '& .MuiDataGrid-cell': { borderBottom: '1px solid #f0f0f0' },
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#fafafa', borderBottom: '1px solid #e0e0e0' },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default AgentsTable;