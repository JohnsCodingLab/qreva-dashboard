const ACTION_STYLES = {
  allow: 'bg-[#E8F8EE] text-[#1BA860]',
  monitor: 'bg-[#EAF3FF] text-[#2F6FE0]',
  verify: 'bg-[#FFF6E5] text-[#B8860B]',
  review: 'bg-[#FFF1E5] text-[#FF5B04]',
  block: 'bg-[#FDEAEA] text-[#D92D20]',
};

const LABEL_STYLES = {
  confirmed_fraud: 'bg-[#FDEAEA] text-[#D92D20]',
  confirmed_legit: 'bg-[#E8F8EE] text-[#1BA860]',
};

export const AuditActionBadge = ({ action }) => (
  <span
    className={`text-xs font-medium px-2.5 py-1 rounded-full ${ACTION_STYLES[action] || 'bg-[#F2F3F4] text-[#808C91]'}`}
  >
    {action}
  </span>
);

export const AuditLabelBadge = ({ label }) => (
  <span
    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
      LABEL_STYLES[label] || 'bg-[#F2F3F4] text-[#808C91]'
    }`}
  >
    {label ? label.replace('confirmed_', '') : 'unlabeled'}
  </span>
);
