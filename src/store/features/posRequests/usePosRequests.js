import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { posRequestsApi } from '../../api/pos-requests-api';
import { handleError } from '../../utils/handleError';
import { handleSuccess } from '../../utils/handleSuccess';

const invalidate = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: ['pos-requests'] });
  // The cards and the Awaiting badge are a backlog count, so they have to
  // move the moment something is approved or declined.
  queryClient.invalidateQueries({ queryKey: ['pos-request-metrics'] });
};

export const usePosRequests = (params = {}) => {
  return useQuery({
    queryKey: ['pos-requests', params],
    // Approvals are acted on from this list, so a stale row is a decision
    // made against the wrong state. Shorter than the two minutes used for
    // read-only tables elsewhere.
    staleTime: 30 * 1000,
    queryFn: () => posRequestsApi.getRequests(params),
  });
};

export const usePosRequestMetrics = (params = {}) => {
  return useQuery({
    queryKey: ['pos-request-metrics', params],
    queryFn: () => posRequestsApi.getMetrics(params),
    staleTime: 30 * 1000,
  });
};

export const usePosRequest = (id) => {
  return useQuery({
    queryKey: ['pos-request', id],
    queryFn: () => posRequestsApi.getRequest(id),
    enabled: Boolean(id),
  });
};

export const useApprovePosRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: posRequestsApi.approveRequest,
    onSuccess: () => {
      handleSuccess('POS request approved. Terminals have been assigned.');
      invalidate(queryClient);
    },
    // Short stock comes back as a 400 from here, which is a normal answer
    // rather than a fault: requests are taken as backorders, so the message
    // is what the admin needs to see.
    onError: (error) => handleError(error, 'Could not approve the POS request.'),
  });
};

export const useDeclinePosRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: posRequestsApi.declineRequest,
    onSuccess: () => {
      // Named explicitly. Declining leaves the customer charged, and an
      // admin who reads "declined" as "done" is how someone ends up paying
      // for a terminal they were refused.
      handleSuccess('POS request declined. It still needs refunding.');
      invalidate(queryClient);
    },
    onError: (error) => handleError(error, 'Could not decline the POS request.'),
  });
};

export const useRefundPosRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: posRequestsApi.refundRequest,
    onSuccess: () => {
      handleSuccess('POS request refunded.');
      invalidate(queryClient);
    },
    onError: (error) => handleError(error, 'Could not refund the POS request.'),
  });
};
