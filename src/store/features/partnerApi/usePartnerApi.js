import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { partnerApiApi } from '../../api/partner-api';

export const usePartnerPricing = (partnerId) =>
  useQuery({
    queryKey: ['partner-api', 'pricing', partnerId || null],
    queryFn: () => partnerApiApi.listPricing(partnerId ? { partnerId } : undefined),
  });

/// The partners list. Kept keyed on the filters so paging and searching do not
/// serve each other's cached results.
export const usePartners = (params) =>
  useQuery({
    queryKey: ['partner-api', 'partners', params],
    queryFn: () => partnerApiApi.listPartners(params),
    // The previous page stays on screen while the next one loads, instead of
    // the table emptying and the layout jumping on every keystroke.
    placeholderData: (previous) => previous,
  });

export const usePartner = (partnerId) =>
  useQuery({
    queryKey: ['partner-api', 'partner', partnerId],
    queryFn: () => partnerApiApi.getPartner(partnerId),
    enabled: Boolean(partnerId),
  });

export const usePartnerBilling = () =>
  useQuery({
    queryKey: ['partner-api', 'billing'],
    queryFn: () => partnerApiApi.listBilling(),
  });

export const usePartnerUsage = (params) =>
  useQuery({
    queryKey: ['partner-api', 'usage', params],
    queryFn: () => partnerApiApi.getUsage(params),
  });

// Pricing changes take effect on the next partner call, so the table must not
// keep showing the old figure - every mutation invalidates the whole namespace.
const invalidatePartnerApi = (queryClient) => () =>
  queryClient.invalidateQueries({ queryKey: ['partner-api'] });

export const useUpsertPartnerPricing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: partnerApiApi.upsertPricing,
    onSuccess: invalidatePartnerApi(queryClient),
  });
};

export const useDeletePartnerPricingOverride = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: partnerApiApi.deletePricingOverride,
    onSuccess: invalidatePartnerApi(queryClient),
  });
};




export const useServiceProviders = () =>
  useQuery({
    queryKey: ['partner-api', 'service-providers'],
    queryFn: () => partnerApiApi.listServiceProviders(),
  });

export const useCreateServiceProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: partnerApiApi.createServiceProvider,
    onSuccess: invalidatePartnerApi(queryClient),
  });
};

export const useGenerateServiceProviderCredentials = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: partnerApiApi.generateServiceProviderCredentials,
    onSuccess: invalidatePartnerApi(queryClient),
  });
};

export const usePartnerKybQueue = (kybStatus) =>
  useQuery({
    queryKey: ['partner-api', 'kyb-queue', kybStatus || 'submitted'],
    queryFn: () => partnerApiApi.kybQueue(kybStatus ? { kybStatus } : undefined),
  });

export const useApproveKyb = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: partnerApiApi.approveKyb, onSuccess: invalidatePartnerApi(queryClient) });
};

export const useRejectKyb = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: partnerApiApi.rejectKyb, onSuccess: invalidatePartnerApi(queryClient) });
};

export const useBlockPartner = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: partnerApiApi.blockPartner, onSuccess: invalidatePartnerApi(queryClient) });
};

export const useUnblockPartner = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: partnerApiApi.unblockPartner, onSuccess: invalidatePartnerApi(queryClient) });
};

export const useAgents = (status) =>
  useQuery({
    queryKey: ['partner-api', 'agents', status || 'all'],
    queryFn: () => partnerApiApi.listAgents(status ? { status } : undefined),
  });

export const useAgentInvites = () =>
  useQuery({ queryKey: ['partner-api', 'agent-invites'], queryFn: partnerApiApi.listAgentInvites });

export const useInviteAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: partnerApiApi.inviteAgent, onSuccess: invalidatePartnerApi(queryClient) });
};

export const useRevokeAgentInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: partnerApiApi.revokeAgentInvite, onSuccess: invalidatePartnerApi(queryClient) });
};

export const useBlockAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: partnerApiApi.blockAgent, onSuccess: invalidatePartnerApi(queryClient) });
};

export const useUnblockAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: partnerApiApi.unblockAgent, onSuccess: invalidatePartnerApi(queryClient) });
};

export const useAgentEarnings = (agentId) =>
  useQuery({
    queryKey: ['partner-api', 'agent-earnings', agentId],
    queryFn: () => partnerApiApi.agentEarnings(agentId),
    enabled: Boolean(agentId),
  });

export const useMarkEarningPaid = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: partnerApiApi.markEarningPaid, onSuccess: invalidatePartnerApi(queryClient) });
};

export const useUpsertPartnerBilling = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: partnerApiApi.upsertBilling,
    onSuccess: invalidatePartnerApi(queryClient),
  });
};
