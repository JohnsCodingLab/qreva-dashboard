const OUTCOME_STYLES = {
  success: 'bg-[#E8F8EE] text-[#1BA860]',
  captured: 'bg-[#EAF3FF] text-[#2F6FE0]',
  failed: 'bg-[#FDEAEA] text-[#D92D20]',
};

const PURPOSE_LABELS = {
  Registration: 'Registration',
  LoginStepUp: 'Login Step-Up',
  TransactionVerification: 'Transaction (preview)',
};

export const OutcomeBadge = ({ outcome }) => {
  if (!outcome) return <span className="text-[#808C91] text-sm">—</span>;
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${OUTCOME_STYLES[outcome] || 'bg-[#F2F3F4] text-[#808C91]'}`}>
      {outcome}
    </span>
  );
};

export const PurposeBadge = ({ purpose }) => (
  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#F2F3F4] text-[#505C61]">
    {PURPOSE_LABELS[purpose] || purpose}
  </span>
);
