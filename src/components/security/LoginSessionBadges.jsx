const RISK_STYLES = {
  allow: 'bg-[#E8F8EE] text-[#1BA860]',
  monitor: 'bg-[#EAF3FF] text-[#2F6FE0]',
  verify: 'bg-[#FFF6E5] text-[#B8860B]',
  review: 'bg-[#FFF1E5] text-[#FF5B04]',
  block: 'bg-[#FDEAEA] text-[#D92D20]',
};

const ACCOUNT_TYPE_STYLES = {
  User: 'bg-[#EAF3FF] text-[#2F6FE0]',
  AdminUser: 'bg-[#F2E8FD] text-[#7C3AED]',
};

export const RiskBadge = ({ action }) => {
  if (!action) return <span className="text-[#808C91] text-sm">—</span>;
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${RISK_STYLES[action] || 'bg-[#F2F3F4] text-[#808C91]'}`}>
      {action}
    </span>
  );
};

export const AccountTypeBadge = ({ type }) => (
  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ACCOUNT_TYPE_STYLES[type] || 'bg-[#F2F3F4] text-[#808C91]'}`}>
    {type === 'AdminUser' ? 'Admin/Console' : 'Customer App'}
  </span>
);
