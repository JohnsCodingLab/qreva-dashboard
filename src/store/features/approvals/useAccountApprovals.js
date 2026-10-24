import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { approvalsApi } from '../../api/approvals-api';

export const useAccountApprovals = (params) => {
  return useQuery({
    queryKey: ['accountApprovals', params],
    queryFn: () => approvalsApi.listAccountApprovals(params),
  });
};

export const useAccountApprovalDetails = (userId) => {
  return useQuery({
    queryKey: ['accountApproval', userId],
    queryFn: () => approvalsApi.getAccountApprovalDetails(userId),
    enabled: !!userId,
  });
};

export const useApproveAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approvalsApi.approveAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['accountApproval'] });
    },
  });
};

export const useDeclineAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approvalsApi.declineAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['accountApproval'] });
    },
  });
};
