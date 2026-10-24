import AddAggregatorModal from '@/components/modals/AddAggregatorModal';
import AggregatorAddedModal from '@/components/modals/AggregatorAddedModal';
import ConfirmDialog from '@/components/modals/ConfirmDialogComponent';

const AggregatorModals = ({
  modals,
  setters,
  selectedAggregator,
  onAddAggregator,
  onResolveInvitee,
  isResolvingInvitee,
  isSubmittingInvite,
  onSuspendAggregator
}) => {
  return (
    <>
      <AddAggregatorModal
        isOpen={modals.showAddAggregatorModal}
        onClose={() => setters.setShowAddAggregatorModal(false)}
        onSubmit={onAddAggregator}
        onResolveInvitee={onResolveInvitee}
        isResolvingInvitee={isResolvingInvitee}
        inviteTypeLabel="Aggregator"
        isSubmitting={isSubmittingInvite}
      />

      <AggregatorAddedModal
        isOpen={modals.showAggregatorAddedModal}
        onClose={() => setters.setShowAggregatorAddedModal(false)}
        roleLabel="Aggregator"
      />

      <ConfirmDialog
        isOpen={modals.showSuspendModal}
        onClose={() => setters.setShowSuspendModal(false)}
        onConfirm={onSuspendAggregator}
        title="Suspend Aggregator"
        message={`Are you sure you want to suspend ${selectedAggregator?.name}?`}
        confirmText="Yes, suspend"
        confirmStyle="danger"
      />
    </>
  );
};

export default AggregatorModals;
