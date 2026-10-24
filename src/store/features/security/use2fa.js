import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { twoFactorApi } from '../../api/security-api';
import { handleError } from '../../utils/handleError';
import { handleSuccess } from '../../utils/handleSuccess';

const QUERY_KEY = ['2fa-status'];

export const use2faStatus = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: twoFactorApi.getStatus,
    staleTime: 30 * 1000,
  });

export const use2faBeginSetup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: twoFactorApi.beginSetup,
    onError: handleError,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

export const use2faVerifySetup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: twoFactorApi.verifySetup,
    onError: handleError,
    onSuccess: (res) => {
      handleSuccess(res?.message || 'Two-factor authentication enabled');
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const use2faDisable = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: twoFactorApi.disable,
    onError: handleError,
    onSuccess: (res) => {
      handleSuccess(res?.message || 'Two-factor authentication disabled');
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
