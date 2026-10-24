import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../../api/settings-api';

export const useTiers = (params) => {
  return useQuery({
    queryKey: ['tiers', params],
    queryFn: () => settingsApi.listTiers(params),
  });
};

export const useTier = (tierId) => {
  return useQuery({
    queryKey: ['tier', tierId],
    queryFn: () => settingsApi.getTier(tierId),
    enabled: !!tierId,
  });
};

export const useCreateTier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.createTier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiers'] });
    },
  });
};

export const useUpdateTier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.updateTier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiers'] });
      queryClient.invalidateQueries({ queryKey: ['tier'] });
    },
  });
};

export const useDeleteTier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.deleteTier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiers'] });
    },
  });
};
