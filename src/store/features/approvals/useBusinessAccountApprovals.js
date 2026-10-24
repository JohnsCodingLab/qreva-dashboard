import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { approvalsApi } from '../../api/approvals-api';

export const useBusinessAccountApprovals = (params) => {
  return useQuery({
    queryKey: ['businessAccountApprovals', params],
    queryFn: () => approvalsApi.listBusinessAccountApprovals(params),
  });
};

export const useBusinessAccountApprovalDetails = (userId) => {
  return useQuery({
    queryKey: ['businessAccountApproval', userId],
    queryFn: () => approvalsApi.getBusinessAccountApprovalDetails(userId),
    enabled: !!userId,
  });
};

export const useApproveBusinessAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approvalsApi.approveBusinessAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessAccountApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['businessAccountApproval'] });
    },
  });
};

export const useDeclineBusinessAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approvalsApi.declineBusinessAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessAccountApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['businessAccountApproval'] });
    },
  });
};
