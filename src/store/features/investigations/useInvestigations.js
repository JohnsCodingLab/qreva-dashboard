import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { investigationsApi } from '../../api/investigations-api';

export const useInvestigations = (params) => {
  return useQuery({
    queryKey: ['investigations', params],
    queryFn: () => investigationsApi.list(params),
    staleTime: 30 * 1000,
  });
};

export const useAddInvestigation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: investigationsApi.add,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['investigations'] }),
  });
};

export const useRemoveInvestigation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: investigationsApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['investigations'] }),
  });
};
