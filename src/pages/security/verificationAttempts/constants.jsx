import { OutcomeBadge, PurposeBadge } from '@/components/verification/VerificationBadges';

const describeUser = (row) => {
  const user = row.userId;
  if (!user || typeof user !== 'object') return { name: '—', email: '—' };
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || '—';
  return { name, email: user.emailAddress || user.phoneNumber || '—' };
};

export const VERIFICATION_ATTEMPT_COLUMNS = [
  {
    field: 'user',
    headerName: 'User',
    flex: 1.3,
    sortable: false,
    renderCell: (params) => {
      const { name, email } = describeUser(params.row);
      return (
        <div className="flex flex-col justify-center h-full py-1">
          <span className="text-sm font-medium text-[#1E1E1E]">{name}</span>
          <span className="text-xs text-[#808C91]">{email}</span>
        </div>
      );
    },
  },
  {
    field: 'purpose',
    headerName: 'Flow',
    flex: 1,
    renderCell: (params) => (
      <span className="flex items-center h-full"><PurposeBadge purpose={params.row.purpose} /></span>
    ),
  },
  {
    field: 'captureUrls',
    headerName: 'Captures',
    flex: 0.6,
    sortable: false,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">
        {params.row.captureUrls?.length || 0}
      </span>
    ),
  },
  {
    field: 'outcome',
    headerName: 'Outcome',
    flex: 0.8,
    renderCell: (params) => (
      <span className="flex items-center h-full"><OutcomeBadge outcome={params.row.outcome} /></span>
    ),
  },
  {
    field: 'createdAt',
    headerName: 'Attempted',
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">
        {params.row.createdAt ? new Date(params.row.createdAt).toLocaleString() : '—'}
      </span>
    ),
  },
];

export const VERIFICATION_ATTEMPT_ACTIONS = [{ label: 'View Captures' }];

export const PURPOSE_OPTIONS = [
  { value: '', label: 'All flows' },
  { value: 'Registration', label: 'Registration' },
  { value: 'LoginStepUp', label: 'Login Step-Up' },
  { value: 'TransactionVerification', label: 'Transaction (preview)' },
];

export const OUTCOME_OPTIONS = [
  { value: '', label: 'All outcomes' },
  { value: 'success', label: 'Success' },
  { value: 'captured', label: 'Captured' },
  { value: 'failed', label: 'Failed' },
];
