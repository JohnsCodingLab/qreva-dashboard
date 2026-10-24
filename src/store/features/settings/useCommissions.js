import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../../api/settings-api';

export const useCommissions = (params) => {
  return useQuery({
    queryKey: ['commissions', params],
    queryFn: () => settingsApi.listCommissions(params),
  });
};

export const useCommission = (commissionRuleId) => {
  return useQuery({
    queryKey: ['commission', commissionRuleId],
    queryFn: () => settingsApi.getCommission(commissionRuleId),
    enabled: !!commissionRuleId,
  });
};

export const useCreateCommission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.createCommission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
    },
  });
};

export const useUpdateCommission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.updateCommission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      queryClient.invalidateQueries({ queryKey: ['commission'] });
    },
  });
};

export const useDuplicateCommission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.duplicateCommission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
    },
  });
};

export const useDeleteCommission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.deleteCommission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
    },
  });
};
