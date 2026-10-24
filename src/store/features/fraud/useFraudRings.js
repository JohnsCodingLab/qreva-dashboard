import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fraudApi } from '../../api/fraud-api';

export const useFraudRings = (params) => {
  return useQuery({
    queryKey: ['fraudRings', params],
    queryFn: () => fraudApi.listFraudRings(params),
  });
};

export const useReviewFraudRing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fraudApi.reviewFraudRing,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fraudRings'] }),
  });
};
