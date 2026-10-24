import React from 'react';
import { Link } from 'react-router-dom';

const ENDPOINT_LABELS = {
  KYC_NIN_BASIC: 'NIN Basic',
  KYC_NIN_STANDARD: 'NIN Standard',
  KYC_NIN_PREMIUM: 'NIN Premium',
  KYC_NIN_PERSONAL_INFO: 'NIN Personal Info',
  KYC_BVN_LOOKUP: 'BVN Lookup',
  KYC_BVN_VALIDATE: 'BVN Validate',
  BVN_VALIDATE: 'BVN Validate',
};

const ENDPOINT_COLORS = {
  KYC_NIN_BASIC: 'bg-teal-50 text-teal-700',
  KYC_NIN_STANDARD: 'bg-indigo-50 text-indigo-700',
  KYC_NIN_PREMIUM: 'bg-orange-50 text-orange-700',
  KYC_NIN_PERSONAL_INFO: 'bg-cyan-50 text-cyan-700',
  KYC_BVN_LOOKUP: 'bg-blue-50 text-blue-700',
  KYC_BVN_VALIDATE: 'bg-purple-50 text-purple-700',
  BVN_VALIDATE: 'bg-purple-50 text-purple-700',
};

const OUTCOME_STYLES = {
  success: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
  provider_error: 'bg-orange-50 text-orange-700',
  pending: 'bg-yellow-50 text-yellow-700',
};

const OUTCOME_LABELS = {
  success: 'Success',
  rejected: 'Rejected',
  provider_error: 'Provider Error',
  pending: 'Pending',
};

const BILLING_STYLES = {
  charged: 'bg-green-50 text-green-700',
  refunded: 'bg-blue-50 text-blue-700',
  unbilled: 'bg-gray-100 text-gray-600',
};

export const formatNaira = (amount) => {
  if (amount == null) return '—';
  return `₦${Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const VerificationTypeBadge = ({ code }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${ENDPOINT_COLORS[code] || 'bg-gray-100 text-gray-600'}`}>
    {ENDPOINT_LABELS[code] || code || '—'}
  </span>
);

export const OutcomeBadge = ({ outcome }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${OUTCOME_STYLES[outcome] || 'bg-gray-100 text-gray-600'}`}>
    {OUTCOME_LABELS[outcome] || outcome || '—'}
  </span>
);

export const BillingBadge = ({ status }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${BILLING_STYLES[status] || 'bg-gray-100 text-gray-600'}`}>
    {status ? status.charAt(0).toUpperCase() + status.slice(1) : '—'}
  </span>
);

export const makeColumns = (partnerNameMap) => [
  {
    field: 'partner',
    headerName: 'Partner',
    flex: 1.5,
    sortable: false,
    renderCell: (params) => {
      const { partnerId } = params.row;
      const name = partnerNameMap?.[partnerId];
      return (
        <div className="flex flex-col justify-center h-full py-1">
          {name && <span className="text-sm font-medium text-[#1E1E1E]">{name}</span>}
          <Link
            to={`/partners/${partnerId}`}
            className="text-xs text-[#F57C00] hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {partnerId}
          </Link>
        </div>
      );
    },
  },
  {
    field: 'endpointCode',
    headerName: 'Verification Type',
    flex: 1.2,
    renderCell: (params) => (
      <span className="flex items-center h-full">
        <VerificationTypeBadge code={params.row.endpointCode} />
      </span>
    ),
  },
  {
    field: 'outcome',
    headerName: 'Outcome',
    flex: 0.9,
    renderCell: (params) => (
      <span className="flex items-center h-full">
        <OutcomeBadge outcome={params.row.outcome} />
      </span>
    ),
  },
  {
    field: 'amount',
    headerName: 'Charge',
    flex: 0.85,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full font-medium">
        {formatNaira(params.row.amount)}
      </span>
    ),
  },
  {
    field: 'status',
    headerName: 'Billing',
    flex: 0.8,
    renderCell: (params) => (
      <span className="flex items-center h-full">
        <BillingBadge status={params.row.status} />
      </span>
    ),
  },
  {
    field: 'reference',
    headerName: 'Reference',
    flex: 1,
    sortable: false,
    renderCell: (params) => (
      <span className="text-xs text-[#505C61] flex items-center h-full font-mono truncate max-w-full">
        {params.row.reference || '—'}
      </span>
    ),
  },
  {
    field: 'createdAt',
    headerName: 'Date',
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">
        {params.row.createdAt ? new Date(params.row.createdAt).toLocaleString() : '—'}
      </span>
    ),
  },
];

export const ROW_ACTIONS = [{ label: 'View Details', icon: 'view' }];

export const OUTCOME_OPTIONS = [
  { value: '', label: 'All outcomes' },
  { value: 'success', label: 'Success' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'provider_error', label: 'Provider Error' },
  { value: 'pending', label: 'Pending' },
];
