import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../../api/settings-api';

export const useAgencyCategories = (params) => {
  return useQuery({
    queryKey: ['agencyCategories', params],
    queryFn: () => settingsApi.listAgencyCategories(params),
  });
};

export const useAgencyCategory = (agencyCategoryId) => {
  return useQuery({
    queryKey: ['agencyCategory', agencyCategoryId],
    queryFn: () => settingsApi.getAgencyCategory(agencyCategoryId),
    enabled: !!agencyCategoryId,
  });
};

export const useCreateAgencyCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.createAgencyCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agencyCategories'] });
    },
  });
};

export const useUpdateAgencyCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.updateAgencyCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agencyCategories'] });
      queryClient.invalidateQueries({ queryKey: ['agencyCategory'] });
    },
  });
};
