import { RiskBadge, AccountTypeBadge } from '@/components/security/LoginSessionBadges';

// A mobile login carries the app's own deviceContext (platform/model/OS
// version); an admin/console login has no such thing and falls back to the
// browser/OS/device-type resolved server-side from the User-Agent header
// (see RequestContextService on the backend).
const describeDevice = (row) => {
  const dc = row.deviceContext;
  if (dc?.model || dc?.platform) {
    return [dc.model, dc.platform, dc.osVersion ? `(${dc.osVersion})` : null].filter(Boolean).join(' ');
  }
  if (row.browser || row.os) {
    return [row.browser, row.os, row.deviceType ? `· ${row.deviceType}` : null].filter(Boolean).join(' ');
  }
  return row.userAgent ? row.userAgent.slice(0, 40) : '—';
};

// GPS-derived location (customer mobile app, with the person's permission)
// beats best-effort proxy/CDN geo headers (admin/console), which beat
// nothing at all.
const describeLocation = (row) => {
  const lc = row.locationContext;
  if (lc?.city || lc?.country) {
    return [lc.city, lc.country].filter(Boolean).join(', ');
  }
  return row.headerLocation || '—';
};

export const LOGIN_SESSION_COLUMNS = [
  {
    field: 'accountName',
    headerName: 'User',
    flex: 1.3,
    renderCell: (params) => (
      <div className="flex flex-col justify-center h-full py-1">
        <span className="text-sm font-medium text-[#1E1E1E]">{params.row.accountName || '—'}</span>
        <span className="text-xs text-[#808C91]">{params.row.accountEmail || '—'}</span>
      </div>
    ),
  },
  {
    field: 'accountType',
    headerName: 'Account',
    flex: 1,
    renderCell: (params) => (
      <div className="flex flex-col gap-1 justify-center h-full">
        <span className="flex items-center h-full"><AccountTypeBadge type={params.row.accountType} /></span>
        {params.row.accountRole && <span className="text-xs text-[#808C91]">{params.row.accountRole}</span>}
      </div>
    ),
  },
  {
    field: 'device',
    headerName: 'Device',
    flex: 1.4,
    sortable: false,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">{describeDevice(params.row)}</span>
    ),
  },
  {
    field: 'location',
    headerName: 'Location',
    flex: 1,
    sortable: false,
    renderCell: (params) => (
      <div className="flex flex-col justify-center h-full py-1">
        <span className="text-sm text-[#505C61]">{describeLocation(params.row)}</span>
        <span className="text-xs text-[#808C91]">{params.row.ipAddress || '—'}</span>
      </div>
    ),
  },
  {
    field: 'riskAction',
    headerName: 'Risk',
    flex: 0.7,
    renderCell: (params) => (
      <span className="flex items-center h-full gap-1.5">
        <RiskBadge action={params.row.riskAction} />
        {params.row.isNewDevice && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#FFF6E5] text-[#B8860B]">new device</span>
        )}
      </span>
    ),
  },
  {
    field: 'loginAt',
    headerName: 'Signed in',
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">
        {params.row.loginAt ? new Date(params.row.loginAt).toLocaleString() : '—'}
      </span>
    ),
  },
];

export const ACCOUNT_TYPE_OPTIONS = [
  { value: '', label: 'All accounts' },
  { value: 'User', label: 'Customer app' },
  { value: 'AdminUser', label: 'Admin/Console' },
];
