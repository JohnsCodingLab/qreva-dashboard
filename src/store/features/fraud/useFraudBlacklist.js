import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fraudApi } from '../../api/fraud-api';

export const useFraudBlacklist = (params) => {
  return useQuery({
    queryKey: ['fraudBlacklist', params],
    queryFn: () => fraudApi.listBlacklist(params),
  });
};

export const useCreateFraudBlacklistEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fraudApi.createBlacklistEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fraudBlacklist'] }),
  });
};

export const useUpdateFraudBlacklistEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fraudApi.updateBlacklistEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fraudBlacklist'] }),
  });
};

export const useDeactivateFraudBlacklistEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fraudApi.deactivateBlacklistEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fraudBlacklist'] }),
  });
};
