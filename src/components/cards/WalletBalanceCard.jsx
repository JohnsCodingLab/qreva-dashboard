const formatNaira = (value) => `₦${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

const ENTITY_LABELS = {
  Individual: 'Individual account',
  Corporate: 'Corporate account',
};

/**
 * Every account the customer holds, not one of them.
 *
 * The page used to show a single account picked by the database - so a customer
 * with both an individual and a corporate account showed an arbitrary one, and
 * nothing said which. Each is now labelled and listed, and anything an admin can
 * do to one they can do to the other.
 */
const WalletBalanceCard = ({ wallet, accounts, onDebit }) => {
  // accounts is the new shape; wallet is what the endpoint returned before.
  // Falling back keeps this working against an API that has not been deployed
  // yet, rather than showing a customer with no accounts at all.
  const list = accounts?.length ? accounts : wallet ? [wallet] : [];
  if (!list.length) return null;

  return (
    <div className="mb-6 space-y-4">
      {list.map((account) => (
        <div
          key={account.accountNumber || account._id}
          className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-[#808C91]">
                {ENTITY_LABELS[account.entityType] || 'Account'}
              </p>
              {account.status && account.status !== 'Active' && (
                <span className="rounded-full bg-[#FEF3F2] px-2 py-0.5 text-xs font-medium text-[#B42318]">
                  {account.status}
                </span>
              )}
              {/* Shown because it changes what a debit will do, and an operator
                  reconciling an account needs to know before they try. */}
              {account.postNoDebit && (
                <span className="rounded-full bg-[#FFFAEB] px-2 py-0.5 text-xs font-medium text-[#B54708]">
                  Post no debit
                </span>
              )}
            </div>

            {onDebit && (
              <button
                type="button"
                onClick={() => onDebit(account)}
                className="rounded-lg border border-[#E4E7EC] px-3 py-1.5 text-xs font-medium text-[#B42318] transition-colors hover:bg-[#FEF3F2]"
              >
                Debit account
              </button>
            )}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-[#E4E7EC] bg-[#F7FAFA] p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-[#808C91]">Available Balance</p>
              <p className="mt-1 text-lg font-semibold text-[#1E1E1E]">{formatNaira(account.availableBalance)}</p>
            </div>
            <div className="rounded-xl border border-[#E4E7EC] bg-[#F7FAFA] p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-[#808C91]">Book Balance</p>
              <p className="mt-1 text-lg font-semibold text-[#1E1E1E]">{formatNaira(account.bookBalance)}</p>
            </div>
            <div className="rounded-xl border border-[#E4E7EC] bg-[#F7FAFA] p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-[#808C91]">Account Number</p>
              <p className="mt-1 text-sm font-semibold text-[#2C3134]">{account.accountNumber || 'N/A'}</p>
            </div>
            <div className="rounded-xl border border-[#E4E7EC] bg-[#F7FAFA] p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-[#808C91]">Bank</p>
              <p className="mt-1 text-sm font-semibold text-[#2C3134]">{account.bankName || 'N/A'}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WalletBalanceCard;
