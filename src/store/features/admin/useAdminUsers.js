import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/admin-api';

export const useAdminUsers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['admins', params],
    queryFn: () => adminApi.listAdmins(params),
    ...options,
  });
};

export const useInviteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.inviteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
};

export const useUpdateAdminStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.updateAdminStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
};

export const useResendAdminInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.resendAdminInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
};
