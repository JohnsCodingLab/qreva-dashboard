import AddAggregatorModal from '@/components/modals/AddAggregatorModal';
import AggregatorAddedModal from '@/components/modals/AggregatorAddedModal';
import ConfirmDialog from '@/components/modals/ConfirmDialogComponent';

const AggregatorManagerModals = ({
  modals,
  setters,
  selectedManager,
  onAddAggregator,
  onResolveInvitee,
  isResolvingInvitee,
  isSubmittingInvite,
  onSuspendManager
}) => {
  return (
    <>
      <AddAggregatorModal
        isOpen={modals.showAddAggregatorModal}
        onClose={() => setters.setShowAddAggregatorModal(false)}
        onSubmit={onAddAggregator}
        onResolveInvitee={onResolveInvitee}
        isResolvingInvitee={isResolvingInvitee}
        inviteTypeLabel="Aggregator Manager"
        isSubmitting={isSubmittingInvite}
      />

      <AggregatorAddedModal
        isOpen={modals.showAggregatorAddedModal}
        onClose={() => setters.setShowAggregatorAddedModal(false)}
        roleLabel="Aggregator Manager"
      />

      <ConfirmDialog
        isOpen={modals.showSuspendModal}
        onClose={() => setters.setShowSuspendModal(false)}
        onConfirm={onSuspendManager}
        title="Suspend Aggregator Manager"
        message={`Are you sure you want to suspend ${selectedManager?.name}?`}
        confirmText="Yes, suspend"
        confirmStyle="danger"
      />
    </>
  );
};

export default AggregatorManagerModals;
