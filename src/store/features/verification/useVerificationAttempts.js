import { useQuery } from '@tanstack/react-query';
import { verificationApi } from '../../api/verification-api';

export const useVerificationAttempts = (params = {}) => {
  return useQuery({
    queryKey: ['verificationAttempts', params],
    queryFn: () => verificationApi.listAttempts(params),
    staleTime: 60 * 1000,
  });
};

export const useVerificationAttempt = (id) => {
  return useQuery({
    queryKey: ['verificationAttempt', id],
    queryFn: () => verificationApi.getAttempt(id),
    enabled: Boolean(id),
  });
};
