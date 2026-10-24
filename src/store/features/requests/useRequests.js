import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsApi } from '../../api/requests-api';
import { handleError } from '../../utils/handleError';
import { handleSuccess } from '../../utils/handleSuccess';

export const useRequests = (params = {}) => {
  return useQuery({
    queryKey: ['requests', params],
    queryFn: () => requestsApi.getRequests(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useRequestMetrics = (params = {}) => {
  return useQuery({
    queryKey: ['request-metrics', params],
    queryFn: () => requestsApi.getMetrics(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => requestsApi.approveRequest(id),
    onSuccess: () => {
      handleSuccess('Request approved successfully.');
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['request-metrics'] });
    },
    onError: (error) => handleError(error, 'Failed to approve request.'),
  });
};

export const useRejectRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => requestsApi.rejectRequest(id, reason),
    onSuccess: () => {
      handleSuccess('Request rejected successfully.');
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['request-metrics'] });
    },
    onError: (error) => handleError(error, 'Failed to reject request.'),
  });
};
