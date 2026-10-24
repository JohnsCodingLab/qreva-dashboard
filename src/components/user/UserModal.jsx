import ConfirmDialog from '@/components/modals/ConfirmDialogComponent';

const UserModals = ({ modals, setters, selectedUser, onSuspendUser }) => {
  return (
    <ConfirmDialog
      isOpen={modals.showSuspendModal}
      onClose={() => setters.setShowSuspendModal(false)}
      onConfirm={onSuspendUser}
      title="Suspend User"
      message={`Are you sure you want to suspend ${selectedUser?.name}?`}
      confirmText="Yes, suspend"
      confirmStyle="danger"
    />
  );
};

export default UserModals;