import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../../api/settings-api';

export const useActivityLogs = (params) => {
  return useQuery({
    queryKey: ['activityLogs', params],
    queryFn: () => settingsApi.listActivityLogs(params),
  });
};
