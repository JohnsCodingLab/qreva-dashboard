import { useQuery } from '@tanstack/react-query';
import { securityApi } from '../../api/security-api';

export const useLoginSessions = (params = {}) => {
  return useQuery({
    queryKey: ['loginSessions', params],
    queryFn: () => securityApi.listLoginSessions(params),
    staleTime: 60 * 1000,
  });
};
