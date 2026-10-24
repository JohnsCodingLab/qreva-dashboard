import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { promotionsApi } from '../../api/promotions-api';

export const usePromotions = () =>
  useQuery({
    queryKey: ['promotions'],
    queryFn: promotionsApi.listPromotions,
  });

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: promotionsApi.createPromotion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['promotions'] }),
  });
};

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: promotionsApi.updatePromotion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['promotions'] }),
  });
};

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: promotionsApi.deletePromotion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['promotions'] }),
  });
};

export const useUploadPromotionImage = () =>
  useMutation({ mutationFn: promotionsApi.uploadImage });
