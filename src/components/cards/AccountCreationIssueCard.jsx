const formatDateTime = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString();
};

const formatLabel = (value) =>
  String(value || '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const renderPrimitive = (value) => {
  if (value === null || value === undefined || value === '') return 'N/A';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
};

const AccountCreationIssueCard = ({
  accountCreation,
  onRetry,
  isRetrying = false,
  canRetry = false,
}) => {
  const issue = accountCreation?.issue;
  
  if (!accountCreation || accountCreation.hasAccount) {
    return null;
  }

  const details =
    issue?.details && typeof issue.details === 'object'
      ? Object.entries(issue.details).filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value))
      : [];

  return (
    <div className="mb-6 rounded-2xl border border-[#F4C7B5] bg-[#FFF8F5] p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-[#A85A35]">Account Creation Status</p>
            <h3 className="mt-1 text-lg font-semibold text-[#2C3134]">
              Account not created
            </h3>
          </div>

          <p className="text-sm leading-6 text-[#505C61]">
            We could not create this customer account yet. Retry after confirming the customer data.
          </p>

          {issue && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-xl border border-[#F0D7CC] bg-white p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-[#808C91]">Provider</p>
                <p className="mt-1 text-sm font-semibold text-[#2C3134]">{issue.provider || 'SafeHaven'}</p>
              </div>
              <div className="rounded-xl border border-[#F0D7CC] bg-white p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-[#808C91]">Stage</p>
                <p className="mt-1 text-sm font-semibold text-[#2C3134]">{formatLabel(issue.stage || 'Unknown')}</p>
              </div>
              <div className="rounded-xl border border-[#F0D7CC] bg-white p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-[#808C91]">Last Attempt</p>
                <p className="mt-1 text-sm font-semibold text-[#2C3134]">{formatDateTime(issue.lastAttemptedAt)}</p>
              </div>
              <div className="rounded-xl border border-[#F0D7CC] bg-white p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-[#808C91]">Identity</p>
                <p className="mt-1 text-sm font-semibold text-[#2C3134]">
                  {[issue.identityType, issue.identityNumber].filter(Boolean).join(' ') || 'N/A'}
                </p>
              </div>
              <div className="rounded-xl border border-[#F0D7CC] bg-white p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-[#808C91]">Retry Count</p>
                <p className="mt-1 text-sm font-semibold text-[#2C3134]">{issue.retryCount ?? 0}</p>
              </div>
              <div className="rounded-xl border border-[#F0D7CC] bg-white p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-[#808C91]">Last Retry</p>
                <p className="mt-1 text-sm font-semibold text-[#2C3134]">{formatDateTime(issue.lastRetryAt)}</p>
              </div>
            </div>
          )}

          {details.length > 0 && (
            <div className="rounded-xl border border-[#F0D7CC] bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[#808C91]">Additional Details</p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {details.map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs font-medium text-[#808C91]">{formatLabel(key)}</p>
                    <p className="mt-1 break-words text-sm text-[#2C3134]">{renderPrimitive(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {canRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[#FF5B04] px-5 text-sm font-semibold text-white transition hover:bg-[#E54F03] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRetrying ? 'Retrying...' : 'Retry Account Creation'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AccountCreationIssueCard;
