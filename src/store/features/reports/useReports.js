import { useMutation } from '@tanstack/react-query';
import { reportsApi } from '../../api/reports-api';
import { handleError } from '../../utils/handleError';
import { handleSuccess } from '../../utils/handleSuccess';

export const useDownloadFinancialReport = () => {
  return useMutation({
    mutationFn: async (params) => {
      // API expects type, from, to, format
      const response = await reportsApi.getFinancialReport({ ...params, format: 'json' });
      return response;
    },
    onSuccess: (data, variables) => {
      if (data?.success && data?.data?.transactions) {
        const transactions = data.data.transactions;
        if (transactions.length === 0) {
          handleSuccess('Report generated, but no transactions found for this period.');
          return;
        }

        // Generate CSV
        // Use keys of the first transaction as headers, or define fixed headers
        const exportColumns = ['_id', 'typeCategory', 'amount', 'fees', 'commission', 'status', 'createdAt'];
        
        const headers = exportColumns.join(',');
        const rows = transactions.map(row =>
          exportColumns.map(field => {
            const value = row[field];
            const strVal = value !== undefined && value !== null ? String(value) : '';
            return strVal.includes(',') || strVal.includes('"')
              ? `"${strVal.replace(/"/g, '""')}"`
              : strVal;
          }).join(',')
        );

        const csv = [headers, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const typeStr = variables.type || 'all';
        link.download = `financial_report_${typeStr}_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        handleSuccess('Report downloaded successfully.');
      } else {
        handleError(new Error('Invalid response format'), 'Failed to generate report.');
      }
    },
    onError: (error) => handleError(error, 'Failed to download report.'),
  });
};
