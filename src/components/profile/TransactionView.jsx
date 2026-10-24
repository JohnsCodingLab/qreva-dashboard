import DashboardStats from '@/components/base/DashboardStats';
import DataTable from '../tables/DataTable';

const TransactionView = ({ 
  stats, 
  transactions, 
  title = 'Transactions',
  actions,
  columns,
  setSearchQuery,
  loading,
  paginationMode,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  pagination,
  children 
}) => {
  return (
    <>
      {stats && <DashboardStats stats={stats} />}
      
      {children}
      
      <DataTable
          className="font-general"
          data={transactions}
          columns={columns}
          title={title}
          actions={actions}
          onSearch={setSearchQuery}
          onFilter={() => console.log('Filter clicked')}
          showExport={true}
          loading={loading}
          paginationMode={paginationMode}
          rowCount={rowCount}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          pagination={pagination}
        />
    </>
  );
};

export default TransactionView;
