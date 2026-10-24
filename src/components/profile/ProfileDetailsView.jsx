import { useState } from 'react';
import PersonalDetailsCard from '@/components/cards/PersonalDetailsCard';
import TierDetailsCard from '@/components/cards/TierDetailsCard';
import BusinessDetailsCard from '@/components/cards/BusinessDetailsCard';
import AccountCreationIssueCard from '@/components/cards/AccountCreationIssueCard';
import WalletBalanceCard from '@/components/cards/WalletBalanceCard';
import DebitAccountModal from '@/components/modals/DebitAccountModal';
import { useDebitUserAccount } from '@/store/features/users/useUsers';

const ProfileDetailsView = ({
  userData,
  userType = 'users',
  showBusinessDetails = false,
  onRetryAccountCreation,
  isRetryingAccountCreation = false,
  canRetryAccountCreation = false,
  canDebitAccount = true,
}) => {
  // The modal lives here rather than in each profile page: four pages render
  // this view, and four copies of the same state is four places for them to
  // drift apart.
  const [debitTarget, setDebitTarget] = useState(null);
  const [debitError, setDebitError] = useState('');
  const debit = useDebitUserAccount();

  const submitDebit = async (payload) => {
    setDebitError('');
    try {
      await debit.mutateAsync({ userId: userData?._id, userType, payload });
      setDebitTarget(null);
    } catch (error) {
      // Kept in the modal as well as the toast. The operator needs to see why
      // it was refused next to the amount they typed, so they can correct it
      // rather than start again.
      setDebitError(
        error?.response?.data?.message || error?.message || 'The account could not be debited.',
      );
    }
  };

  return (
    <>
      <AccountCreationIssueCard
        accountCreation={userData?.accountCreation}
        onRetry={onRetryAccountCreation}
        isRetrying={isRetryingAccountCreation}
        canRetry={canRetryAccountCreation}
      />
      <WalletBalanceCard
        wallet={userData?.wallet}
        accounts={userData?.accounts}
        onDebit={canDebitAccount && userData?._id ? setDebitTarget : undefined}
      />
      <PersonalDetailsCard user={userData} />

      {showBusinessDetails && userData.businessDetails && (
        <BusinessDetailsCard business={userData.businessDetails} />
      )}

      {userData.tier1 && <TierDetailsCard tier={1} data={userData.tier1} />}
      {userData.tier2 && <TierDetailsCard tier={2} data={userData.tier2} />}
      {userData.tier3 && <TierDetailsCard tier={3} data={userData.tier3} />}

      <DebitAccountModal
        isOpen={Boolean(debitTarget)}
        account={debitTarget}
        onClose={() => {
          setDebitTarget(null);
          setDebitError('');
        }}
        onSubmit={submitDebit}
        isSubmitting={debit.isPending}
        error={debitError}
      />
    </>
  );
};

export default ProfileDetailsView;
