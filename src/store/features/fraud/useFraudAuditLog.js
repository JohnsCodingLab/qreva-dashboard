import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fraudApi } from '../../api/fraud-api';

export const useFraudAuditLog = (params) => {
  return useQuery({
    queryKey: ['fraudAuditLog', params],
    queryFn: () => fraudApi.listAuditLog(params),
  });
};

export const useFraudReviewQueue = (params) => {
  return useQuery({
    queryKey: ['fraudReviewQueue', params],
    queryFn: () => fraudApi.listReviewQueue(params),
  });
};

export const useLabelFraudAuditLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fraudApi.labelAuditLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fraudAuditLog'] });
      queryClient.invalidateQueries({ queryKey: ['fraudReviewQueue'] });
    },
  });
};
