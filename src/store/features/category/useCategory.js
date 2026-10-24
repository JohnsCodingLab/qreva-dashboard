import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../../api/category-api';

export const useCategoryDetailMetrics = (category, params = {}) => {
  return useQuery({
    queryKey: ['category-detail-metrics', category, params],
    queryFn: () => categoryApi.getMetrics(category, params),
    staleTime: 2 * 60 * 1000,
    enabled: !!category,
  });
};

export const useKycBreakdown = (params = {}) => {
  return useQuery({
    queryKey: ['kyc-breakdown', params],
    queryFn: () => categoryApi.getKycBreakdown(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useSoftposBreakdown = (params = {}) => {
  return useQuery({
    queryKey: ['softpos-breakdown', params],
    queryFn: () => categoryApi.getSoftposBreakdown(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useTransfersBreakdown = (params = {}) => {
  return useQuery({
    queryKey: ['transfers-breakdown', params],
    queryFn: () => categoryApi.getTransfersBreakdown(params),
    staleTime: 2 * 60 * 1000,
  });
};
