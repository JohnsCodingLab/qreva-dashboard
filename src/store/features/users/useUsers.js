import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../api/users-api';
import { handleError } from '../../utils/handleError';
import { handleSuccess } from '../../utils/handleSuccess';

export const useUsers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getUsers(params),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useUserMetrics = (params = {}) => {
  return useQuery({
    queryKey: ['user-metrics', params],
    queryFn: () => usersApi.getUserMetrics(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserById = (userId, userType = 'users') => {
  return useQuery({
    queryKey: ['user', userType, userId],
    queryFn: () => usersApi.getUserById(userId, userType),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserTransactions = (userId, userType = 'users', params = {}) => {
  return useQuery({
    queryKey: ['user-transactions', userType, userId, params],
    queryFn: () => usersApi.getUserTransactions(userId, userType, params),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => usersApi.suspendUser(userId),
    onSuccess: () => {
      handleSuccess('User suspended successfully.');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      handleError(error, 'Failed to suspend user.');
    },
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => usersApi.activateUser(userId),
    onSuccess: () => {
      handleSuccess('User activated successfully.');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      handleError(error, 'Failed to activate user.');
    },
  });
};

export const useRetryUserAccountCreation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, userType }) => usersApi.retryUserAccountCreation(userId, userType),
    onSuccess: (response, variables) => {
      handleSuccess(response?.message || 'Account creation retry started successfully.');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (variables?.userId) {
        queryClient.invalidateQueries({ queryKey: ['user', variables.userType || 'users', variables.userId] });
        queryClient.invalidateQueries({ queryKey: ['user-transactions', variables.userType || 'users', variables.userId] });
      }
    },
    onError: (error) => {
      handleError(error, 'Failed to retry account creation.');
    },
  });
};

export const useDebitUserAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, userType, payload }) => usersApi.debitUserAccount(userId, userType, payload),
    onSuccess: (response, variables) => {
      handleSuccess(response?.message || 'Account debited.');
      // The balance on the page is now stale, and so is the statement behind
      // the transactions tab. Both are refetched rather than patched, because
      // a manual debit is exactly where a guessed local balance would mislead.
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (variables?.userId) {
        queryClient.invalidateQueries({ queryKey: ['user', variables.userType || 'users', variables.userId] });
        queryClient.invalidateQueries({ queryKey: ['user-transactions', variables.userType || 'users', variables.userId] });
      }
    },
    onError: (error) => {
      handleError(error, 'Failed to debit the account.');
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, userType, payload }) => usersApi.updateUserProfile(userId, userType, payload),
    onSuccess: (response, variables) => {
      handleSuccess(response?.message || 'User profile updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (variables?.userId) {
        queryClient.invalidateQueries({ queryKey: ['user', variables.userType || 'users', variables.userId] });
        queryClient.invalidateQueries({ queryKey: ['user-transactions', variables.userType || 'users', variables.userId] });
      }
    },
    onError: (error) => {
      handleError(error, 'Failed to update user profile.');
    },
  });
};

export const useUpdateUserTransactionLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, payload }) => usersApi.updateUserTransactionLevel(userId, payload),
    onSuccess: (response, variables) => {
      handleSuccess(response?.message || 'Transaction level updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (variables?.userId) {
        queryClient.invalidateQueries({ queryKey: ['user', 'agents', variables.userId] });
        queryClient.invalidateQueries({ queryKey: ['user', 'users', variables.userId] });
      }
    },
    onError: (error) => {
      handleError(error, 'Failed to update transaction level.');
    },
  });
};

export const useAggregatorReferralLink = (options = {}) => {
  return useQuery({
    queryKey: ['aggregator-referral-link'],
    queryFn: () => usersApi.getAggregatorReferralLink(),
    staleTime: 0,
    gcTime: 0,
    retry: false,
    ...options,
  });
};

export const useInviteAggregator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => usersApi.inviteAggregator(payload),
    onSuccess: (response) => {
      handleSuccess(response?.message || 'Invite sent successfully.');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      handleError(error, 'Failed to send invite.');
    },
  });
};

export const useResolveAggregatorInvitee = () => {
  return useMutation({
    mutationFn: (payload) => usersApi.resolveAggregatorInvitee(payload),
    onError: (error) => {
      handleError(error, 'Unable to resolve invitee.');
    },
  });
};

export const useAggregatorNetwork = (ownerUserId, params = {}, options = {}) => {
  return useQuery({
    queryKey: ['aggregator-network', ownerUserId, params],
    queryFn: () => usersApi.getAggregatorNetwork(ownerUserId, params),
    enabled: !!ownerUserId && (options.enabled ?? true),
    staleTime: 60 * 1000,
    ...options,
  });
};

export const useResolveAggregatorNetworkCandidate = () => {
  return useMutation({
    mutationFn: ({ ownerUserId, email }) => usersApi.resolveAggregatorNetworkCandidate(ownerUserId, email),
    onError: (error) => {
      handleError(error, 'Unable to verify this email.');
    },
  });
};

export const useAssignAggregatorNetworkMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ownerUserId, payload }) => usersApi.assignAggregatorNetworkMember(ownerUserId, payload),
    onSuccess: (response, variables) => {
      handleSuccess(response?.message || 'Member assigned successfully.');
      queryClient.invalidateQueries({ queryKey: ['aggregator-network', variables.ownerUserId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      handleError(error, 'Failed to assign member.');
    },
  });
};

export const useRemoveAggregatorNetworkMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ownerUserId, memberUserId }) => usersApi.removeAggregatorNetworkMember(ownerUserId, memberUserId),
    onSuccess: (response, variables) => {
      handleSuccess(response?.message || 'Member removed successfully.');
      queryClient.invalidateQueries({ queryKey: ['aggregator-network', variables.ownerUserId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      handleError(error, 'Failed to remove member.');
    },
  });
};
