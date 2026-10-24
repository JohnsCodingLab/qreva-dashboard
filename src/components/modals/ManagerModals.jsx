import AddManagerModal from './AddManagerModal';
import AdminInviteSuccessModal from './AdminInviteSuccessModal';
import ConfirmDialog from './ConfirmDialogComponent';
import ViewAdminProfileModal from './ViewAdminProfileModal';

const ManagerModals = ({
  modals,
  setters,
  selectedManager,
  onAddManager,
  isSubmittingInvite,
  onSuspendManager,
  roleLabel = 'Regional Manager',
  roleType = 'RegionalManager',
}) => {
  return (
    <>
      <AddManagerModal
        isOpen={modals.showAddModal}
        onClose={() => setters.setShowAddModal(false)}
        onSubmit={onAddManager}
        inviteTypeLabel={roleLabel}
        roleType={roleType}
        isSubmitting={isSubmittingInvite}
      />

      <AdminInviteSuccessModal
        isOpen={modals.showSuccessModal}
        onClose={() => setters.setShowSuccessModal(false)}
        roleLabel={roleLabel}
      />

      <ConfirmDialog
        isOpen={modals.showSuspendModal}
        onClose={() => setters.setShowSuspendModal(false)}
        onConfirm={onSuspendManager}
        title={`Suspend ${roleLabel}`}
        message={`Are you sure you want to suspend ${selectedManager?.fullName}?`}
        confirmText="Yes, suspend"
        confirmStyle="danger"
      />

      <ViewAdminProfileModal
        isOpen={modals.showProfileModal}
        onClose={() => setters.setShowProfileModal(false)}
        manager={selectedManager}
        roleLabel={roleLabel}
      />
    </>
  );
};

export default ManagerModals;
