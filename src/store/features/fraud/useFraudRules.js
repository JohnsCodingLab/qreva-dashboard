import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fraudApi } from '../../api/fraud-api';

export const useFraudRules = () => {
  return useQuery({
    queryKey: ['fraudRules'],
    queryFn: fraudApi.listRules,
  });
};

export const useCreateFraudRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fraudApi.createRule,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fraudRules'] }),
  });
};

export const useUpdateFraudRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fraudApi.updateRule,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fraudRules'] }),
  });
};

export const useDeactivateFraudRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fraudApi.deactivateRule,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fraudRules'] }),
  });
};
