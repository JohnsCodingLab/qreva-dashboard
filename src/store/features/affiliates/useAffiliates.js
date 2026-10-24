import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { affiliatesApi } from '../../api/affiliates-api';

export const useAffiliates = (params) =>
  useQuery({
    queryKey: ['affiliates', params],
    queryFn: () => affiliatesApi.listAffiliates(params),
  });

export const useAffiliateReferrals = ({ affiliateId, page = 1 }) =>
  useQuery({
    queryKey: ['affiliates', affiliateId, 'referrals', page],
    queryFn: () => affiliatesApi.listReferrals({ affiliateId, page }),
    enabled: !!affiliateId,
  });

export const useCreateAffiliate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: affiliatesApi.createAffiliate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['affiliates'] }),
  });
};

export const useBlockAffiliate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: affiliatesApi.blockAffiliate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['affiliates'] }),
  });
};

export const useUnblockAffiliate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: affiliatesApi.unblockAffiliate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['affiliates'] }),
  });
};
