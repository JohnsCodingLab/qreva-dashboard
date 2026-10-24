import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { approvalsApi } from '../../api/approvals-api';

export const useDisputes = (params) => {
  return useQuery({
    queryKey: ['disputes', params],
    queryFn: () => approvalsApi.listDisputes(params),
  });
};

export const useDisputeDetails = (id) => {
  return useQuery({
    queryKey: ['dispute', id],
    queryFn: () => approvalsApi.getDisputeDetails(id),
    enabled: !!id,
  });
};

export const useRefundDispute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approvalsApi.refundDispute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disputes'] });
      queryClient.invalidateQueries({ queryKey: ['dispute'] });
    },
  });
};

export const useDeclineDispute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approvalsApi.declineDispute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disputes'] });
      queryClient.invalidateQueries({ queryKey: ['dispute'] });
    },
  });
};
