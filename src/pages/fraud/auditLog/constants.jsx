import { AuditActionBadge, AuditLabelBadge } from '@/components/fraud/AuditBadges';

export const AUDIT_LOG_COLUMNS = [
  {
    field: 'event_id',
    headerName: 'Event',
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm font-medium text-[#1E1E1E] flex items-center h-full">{params.row.event_type}</span>
    ),
  },
  {
    field: 'user_id',
    headerName: 'User ID',
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">{params.row.user_id}</span>
    ),
  },
  {
    field: 'final_score',
    headerName: 'Score',
    flex: 0.6,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">{params.row.final_score?.toFixed(1)}</span>
    ),
  },
  {
    field: 'final_action',
    headerName: 'Decision',
    flex: 0.7,
    renderCell: (params) => (
      <span className="flex items-center h-full">
        <AuditActionBadge action={params.row.final_action} />
      </span>
    ),
  },
  {
    field: 'outcome_label',
    headerName: 'Outcome',
    flex: 0.8,
    renderCell: (params) => (
      <span className="flex items-center h-full">
        <AuditLabelBadge label={params.row.outcome_label} />
      </span>
    ),
  },
  {
    field: 'created_at',
    headerName: 'Date',
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">
        {params.row.created_at ? new Date(params.row.created_at).toLocaleString() : '—'}
      </span>
    ),
  },
];

export const AUDIT_LOG_ACTIONS = [{ label: 'View / Label' }];

export const FINAL_ACTION_OPTIONS = ['allow', 'monitor', 'verify', 'review', 'block'];
