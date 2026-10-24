import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fraudApi } from '../../api/fraud-api';

export const useFraudScoreBands = () => {
  return useQuery({
    queryKey: ['fraudScoreBands'],
    queryFn: fraudApi.listScoreBands,
  });
};

export const useCreateFraudScoreBand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fraudApi.createScoreBand,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fraudScoreBands'] }),
  });
};
