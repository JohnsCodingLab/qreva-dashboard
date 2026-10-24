import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../../api/settings-api';
import { handleError } from '../../utils/handleError';
import { handleSuccess } from '../../utils/handleSuccess';

export const useRoles = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: () => settingsApi.listRoles(params),
    ...options,
  });
};

export const useRole = (rolePermissionId) => {
  return useQuery({
    queryKey: ['role', rolePermissionId],
    queryFn: () => settingsApi.getRole(rolePermissionId),
    enabled: !!rolePermissionId,
  });
};

export const usePermissionGroups = (options = {}) => {
  return useQuery({
    queryKey: ['permission-groups'],
    queryFn: () => settingsApi.listPermissionGroups(),
    ...options,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.updateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role'] });
    },
  });
};

export const useAssignRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.assignRole,
    onSuccess: () => {
      handleSuccess('Role assigned successfully.');
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      handleError(error, 'Failed to assign role.');
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};
