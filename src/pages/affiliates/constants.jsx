import ReferralCodeCell from '@/components/affiliates/ReferralCodeCell';
import CustomEye from '@/components/icons/CustomEye';
import CustomUser from '@/components/icons/CustomUser';

const STATUS_STYLES = {
  Active: 'border border-[#4ED17E] bg-[#E9F9EF] text-[#1B7D3C]',
  Invited: 'border border-[#FFC535] bg-[#FFF8E6] text-[#B58202]',
  Blocked: 'border border-[#F87171] bg-[#FEE2E2] text-[#B91C1C]',
};

/**
 * "Invited" is spelled out because it reads as "not working yet", and the
 * opposite is true: the referral code is live from the moment the affiliate
 * is created and already earns points. Only the portal password is missing.
 */
const STATUS_LABELS = {
  Active: 'Active',
  Invited: 'Code live · no login',
  Blocked: 'Blocked',
};

export const affiliateColumns = (onCopyLink, onCopyCode) => [
  {
    field: 'firstName',
    headerName: 'Affiliate',
    width: 240,
    flex: 1,
    renderCell: (params) => (
      <div className="flex flex-col justify-center h-full">
        <div className="text-sm font-general font-medium">
          {params.row.firstName} {params.row.lastName}
        </div>
        <div className="text-xs text-qreva-navy">{params.row.emailAddress}</div>
      </div>
    ),
  },
  {
    field: 'referralCode',
    headerName: 'Referral code',
    width: 220,
    sortable: false,
    renderCell: (params) => (
      <ReferralCodeCell
        code={params.value}
        onCopyCode={onCopyCode}
        onCopyLink={() => onCopyLink(params.row)}
      />
    ),
  },
  {
    field: 'points',
    headerName: 'Points',
    width: 100,
    renderCell: (params) => (
      <span className="flex h-full items-center text-sm font-general font-semibold text-[#1E1E1E] tabular-nums">
        {params.value ?? 0}
      </span>
    ),
  },
  {
    field: 'totalReferrals',
    headerName: 'Signups',
    width: 110,
    renderCell: (params) => (
      <span className="flex h-full items-center text-sm font-general text-[#1E1E1E] tabular-nums">
        {params.value ?? 0}
      </span>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 170,
    renderCell: (params) => (
      <div className="flex h-full items-center">
        <span
          className={`rounded-full px-3 py-1 text-xs font-general font-medium ${
            STATUS_STYLES[params.value] || STATUS_STYLES.Invited
          }`}
        >
          {STATUS_LABELS[params.value] || params.value}
        </span>
      </div>
    ),
  },
];

export const createAffiliateActions = (onViewSignups, onToggleBlock) => [
  {
    label: 'View signups',
    icon: CustomEye,
    onClick: (row) => onViewSignups(row),
  },
  {
    label: 'Block / unblock',
    icon: CustomUser,
    onClick: (row) => onToggleBlock(row),
  },
];
