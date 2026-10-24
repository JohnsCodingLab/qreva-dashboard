import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { smartSavingsApi } from '../../api/smart-savings-api';

/**
 * Query hooks for the Smart Savings scheme.
 *
 * One cache key root — `['smartSavings', ...]` — so a mutation anywhere in the
 * area can invalidate the whole of it without having to know which screens are
 * currently mounted. Approving a withdrawal moves a member's balance, the
 * pool position and the planner's capacity all at once, and a hook that
 * invalidated only its own list would leave two of those three stale.
 */

const root = 'smartSavings';

export const savingsKeys = {
  overview: [root, 'overview'],
  queueCounts: [root, 'queueCounts'],
  pool: [root, 'pool'],
  config: [root, 'config'],
  members: (params) => [root, 'members', params],
  member: (memberId) => [root, 'member', memberId],
  eligibility: (memberId) => [root, 'eligibility', memberId],
  contributions: (params) => [root, 'contributions', params],
  marketers: (params) => [root, 'marketers', params],
  marketer: (marketerId) => [root, 'marketer', marketerId],
  invites: (params) => [root, 'invites', params],
  withdrawals: (params) => [root, 'withdrawals', params],
  planner: (params) => [root, 'planner', params],
  offers: (params) => [root, 'offers', params],
  broadcasts: [root, 'broadcasts'],
};

/** Invalidates everything under the savings root. */
const invalidateAll = (queryClient) => () =>
  queryClient.invalidateQueries({ queryKey: [root] });

// ── Overview ──────────────────────────────────────────────────────

export const useSavingsOverview = () =>
  useQuery({ queryKey: savingsKeys.overview, queryFn: smartSavingsApi.getOverview });

export const useSavingsQueueCounts = () =>
  useQuery({
    queryKey: savingsKeys.queueCounts,
    queryFn: smartSavingsApi.getQueueCounts,
    // Drives the sidebar badges, so it refreshes on its own while an admin
    // works through a queue in another tab.
    refetchInterval: 60_000,
  });

export const useSavingsPool = () =>
  useQuery({ queryKey: savingsKeys.pool, queryFn: smartSavingsApi.getPool });

// ── Configuration ─────────────────────────────────────────────────

export const useSavingsConfig = () =>
  useQuery({ queryKey: savingsKeys.config, queryFn: smartSavingsApi.getConfig });

export const useUpdateSavingsConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smartSavingsApi.updateConfig,
    // A rate change moves the planner's arithmetic as well as the config
    // screen's own figures.
    onSuccess: invalidateAll(queryClient),
  });
};

// ── Members ───────────────────────────────────────────────────────

export const useSavingsMembers = (params) =>
  useQuery({
    queryKey: savingsKeys.members(params),
    queryFn: () => smartSavingsApi.listMembers(params),
    placeholderData: (previous) => previous,
  });

export const useSavingsMember = (memberId) =>
  useQuery({
    queryKey: savingsKeys.member(memberId),
    queryFn: () => smartSavingsApi.getMember(memberId),
    enabled: !!memberId,
  });

export const useSavingsMemberEligibility = (memberId) =>
  useQuery({
    queryKey: savingsKeys.eligibility(memberId),
    queryFn: () => smartSavingsApi.getMemberEligibility(memberId),
    enabled: !!memberId,
  });

export const useAssignMarketer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smartSavingsApi.assignMarketer,
    onSuccess: invalidateAll(queryClient),
  });
};

export const useSuspendMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smartSavingsApi.suspendMember,
    onSuccess: invalidateAll(queryClient),
  });
};

export const useReinstateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smartSavingsApi.reinstateMember,
    onSuccess: invalidateAll(queryClient),
  });
};

// ── Entries ───────────────────────────────────────────────────────

export const useSavingsContributions = (params) =>
  useQuery({
    queryKey: savingsKeys.contributions(params),
    queryFn: () => smartSavingsApi.listContributions(params),
    placeholderData: (previous) => previous,
  });

export const useReverseContribution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smartSavingsApi.reverseContribution,
    onSuccess: invalidateAll(queryClient),
  });
};

// ── Marketers ─────────────────────────────────────────────────────

export const useSavingsMarketers = (params) =>
  useQuery({
    queryKey: savingsKeys.marketers(params),
    queryFn: () => smartSavingsApi.listMarketers(params),
    placeholderData: (previous) => previous,
  });

export const useSavingsMarketer = (marketerId) =>
  useQuery({
    queryKey: savingsKeys.marketer(marketerId),
    queryFn: () => smartSavingsApi.getMarketer(marketerId),
    enabled: !!marketerId,
  });

export const useSavingsInvites = (params) =>
  useQuery({
    queryKey: savingsKeys.invites(params),
    queryFn: () => smartSavingsApi.listInvites(params),
  });

export const useInviteMarketers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smartSavingsApi.inviteMarketers,
    onSuccess: invalidateAll(queryClient),
  });
};

export const useResendInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smartSavingsApi.resendInvite,
    onSuccess: invalidateAll(queryClient),
  });
};

export const useRevokeInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smartSavingsApi.revokeInvite,
    onSuccess: invalidateAll(queryClient),
  });
};

export const useUpdateMarketer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smartSavingsApi.updateMarketer,
    onSuccess: invalidateAll(queryClient),
  });
};

export const useBlockMarketer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smartSavingsApi.blockMarketer,
    onSuccess: invalidateAll(queryClient),
  });
};

export const useUnblockMarketer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smartSavingsApi.unblockMarketer,
    onSuccess: invalidateAll(queryClient),
  });
};

// ── Withdrawals ───────────────────────────────────────────────────

export const useSavingsWithdrawals = (params) =>
  useQuery({
    queryKey: savingsKeys.withdrawals(params),
    queryFn: () => smartSavingsApi.listWithdrawals(params),
    placeholderData: (previous) => previous,
  });

export const useApproveSavingsWithdrawal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smartSavingsApi.approveWithdrawal,
    onSuccess: invalidateAll(queryClient),
  });
};

export const useRejectSavingsWithdrawal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smartSavingsApi.rejectWithdrawal,
    onSuccess: invalidateAll(queryClient),
  });
};

export const useMarkSavingsWithdrawalPaid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smartSavingsApi.markWithdrawalPaid,
    onSuccess: invalidateAll(queryClient),
  });
};

// ── Loan planner ──────────────────────────────────────────────────

export const useSavingsPlanner = (params) =>
  useQuery({
    queryKey: savingsKeys.planner(params),
    queryFn: () => smartSavingsApi.getPlanner(params),
    // Recomputed server-side on every call against the live pool, so it is
    // never served stale: an admin acting on last week's capacity is the one
    // failure this screen exists to prevent.
    staleTime: 0,
  });

export const useSavingsOffers = (params) =>
  useQuery({
    queryKey: savingsKeys.offers(params),
    queryFn: () => smartSavingsApi.listOffers(params),
  });

export const useGenerateSuggestions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smartSavingsApi.generateSuggestions,
    onSuccess: invalidateAll(queryClient),
  });
};

export const useCreateSavingsOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smartSavingsApi.createOffer,
    onSuccess: invalidateAll(queryClient),
  });
};

export const useReleaseSavingsOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smartSavingsApi.releaseOffer,
    onSuccess: invalidateAll(queryClient),
  });
};

export const useMarkOfferDisbursed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smartSavingsApi.markOfferDisbursed,
    onSuccess: invalidateAll(queryClient),
  });
};

export const useWithdrawSavingsOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smartSavingsApi.withdrawOffer,
    onSuccess: invalidateAll(queryClient),
  });
};

// ── Broadcasts ────────────────────────────────────────────────────

export const useSavingsBroadcasts = () =>
  useQuery({ queryKey: savingsKeys.broadcasts, queryFn: smartSavingsApi.listBroadcasts });

export const useSendSavingsBroadcast = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smartSavingsApi.sendBroadcast,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: savingsKeys.broadcasts }),
  });
};

export const useRemoveSavingsBroadcast = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smartSavingsApi.removeBroadcast,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: savingsKeys.broadcasts }),
  });
};
