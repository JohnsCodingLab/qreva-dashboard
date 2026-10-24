import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../api/dashboard-api';
import { handleError } from '../../utils/handleError';

// Dashboard (all categories)
export const useDashboardMetrics = (params = {}) => {
  return useQuery({
    queryKey: ['dashboard-metrics', params],
    queryFn: () => dashboardApi.getMetrics(params),
    staleTime: 2 * 60 * 1000,
  });
};

// Airtime Purchase
export const useAirtimePurchaseMetrics = (params = {}) => {
  return useQuery({
    queryKey: ['airtime-purchase-metrics', params],
    queryFn: () => dashboardApi.getMetrics({ ...params, category: 'airtime' }),
    staleTime: 2 * 60 * 1000,
  });
};

// Data Purchase
export const useDataPurchaseMetrics = (params = {}) => {
  return useQuery({
    queryKey: ['data-purchase-metrics', params],
    queryFn: () => dashboardApi.getMetrics({ ...params, category: 'data' }),
    staleTime: 2 * 60 * 1000,
  });
};

// Electricity Bills
export const useElectricityMetrics = (params = {}) => {
  return useQuery({
    queryKey: ['electricity-metrics', params],
    queryFn: () => dashboardApi.getMetrics({ ...params, category: 'electricity' }),
    staleTime: 2 * 60 * 1000,
  });
};

// Cable TV Bills
export const useCableTVMetrics = (params = {}) => {
  return useQuery({
    queryKey: ['cabletv-metrics', params],
    queryFn: () => dashboardApi.getMetrics({ ...params, category: 'cabletv' }),
    staleTime: 2 * 60 * 1000,
  });
};

// Transfers
export const useTransferMetrics = (params = {}) => {
  return useQuery({
    queryKey: ['transfer-metrics', params],
    queryFn: () => dashboardApi.getMetrics({ ...params, category: 'transfer' }),
    staleTime: 2 * 60 * 1000,
  });
};

// Scan to Pay
export const useScanToPayMetrics = (params = {}) => {
  return useQuery({
    queryKey: ['scantopay-metrics', params],
    queryFn: () => dashboardApi.getMetrics({ ...params, category: 'scantopay' }),
    staleTime: 2 * 60 * 1000,
  });
};

// Funding
export const useFundingMetrics = (params = {}) => {
  return useQuery({
    queryKey: ['funding-metrics', params],
    queryFn: () => dashboardApi.getMetrics({ ...params, category: 'funding' }),
    staleTime: 2 * 60 * 1000,
  });
};

// Generic hook for any category
export const useCategoryMetrics = (category, params = {}) => {
  return useQuery({
    queryKey: [`${category}-metrics`, params],
    queryFn: () => dashboardApi.getMetrics({ ...params, category }),
    staleTime: 2 * 60 * 1000,
    enabled: !!category,
  });
};

export const useBalancesSummary = (params = {}) => {
  return useQuery({
    queryKey: ['dashboard-balances-summary', params],
    queryFn: () => dashboardApi.getBalancesSummary(params),
    staleTime: 2 * 60 * 1000,
  });
};
