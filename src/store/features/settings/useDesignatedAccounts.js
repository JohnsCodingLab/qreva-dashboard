import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../../api/settings-api';

export const useDesignatedAccountUseCases = () => {
  return useQuery({
    queryKey: ['designated-account-use-cases'],
    queryFn: () => settingsApi.listDesignatedAccountUseCases(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useDesignatedAccounts = (params) => {
  return useQuery({
    queryKey: ['designated-accounts', params],
    queryFn: () => settingsApi.listDesignatedAccounts(params),
  });
};

export const useDesignatedAccount = (id) => {
  return useQuery({
    queryKey: ['designated-account', id],
    queryFn: () => settingsApi.getDesignatedAccount(id),
    enabled: !!id,
  });
};

export const useCreateDesignatedAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.createDesignatedAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designated-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['designated-account-use-cases'] });
    },
  });
};

export const useUpdateDesignatedAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.updateDesignatedAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designated-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['designated-account-use-cases'] });
    },
  });
};

export const useDeleteDesignatedAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.deleteDesignatedAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designated-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['designated-account-use-cases'] });
    },
  });
};
