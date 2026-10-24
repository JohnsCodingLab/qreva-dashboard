import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { earningsApi } from '../../api/earnings-api';
import { handleError } from '../../utils/handleError';
import { handleSuccess } from '../../utils/handleSuccess';

export const useEarnings = (options = {}) => {
  return useQuery({
    queryKey: ['earnings'],
    queryFn: () => earningsApi.getEarnings(),
    staleTime: 2 * 60 * 1000,
    enabled: options.enabled ?? true,
  });
};

export const useWithdrawals = (params = {}) => {
  return useQuery({
    queryKey: ['withdrawals', params],
    queryFn: () => earningsApi.getWithdrawals(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => earningsApi.createWithdrawal(data),
    onSuccess: () => {
      handleSuccess('Withdrawal initiated successfully.');
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['earnings'] });
    },
    onError: (error) => handleError(error, 'Failed to initiate withdrawal.'),
  });
};

export const useBeneficiaries = () => {
  return useQuery({
    queryKey: ['beneficiaries'],
    queryFn: () => earningsApi.getBeneficiaries(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateBeneficiary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => earningsApi.createBeneficiary(data),
    onSuccess: () => {
      handleSuccess('Beneficiary saved successfully.');
      queryClient.invalidateQueries({ queryKey: ['beneficiaries'] });
    },
    onError: (error) => handleError(error, 'Failed to save beneficiary.'),
  });
};

export const useDeleteBeneficiary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => earningsApi.deleteBeneficiary(id),
    onSuccess: () => {
      handleSuccess('Beneficiary removed.');
      queryClient.invalidateQueries({ queryKey: ['beneficiaries'] });
    },
    onError: (error) => handleError(error, 'Failed to remove beneficiary.'),
  });
};

export const useBanks = (params = {}) => {
  return useQuery({
    queryKey: ['banks', params],
    queryFn: () => earningsApi.getBanks(params),
    staleTime: 30 * 60 * 1000, // banks rarely change
  });
};

export const useResolveAccount = () => {
  return useMutation({
    mutationFn: (data) => earningsApi.resolveAccount(data),
    onError: (error) => handleError(error, 'Failed to resolve account.'),
  });
};
