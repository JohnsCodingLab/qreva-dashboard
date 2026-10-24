import TransactionDetailsModal from '@/components/modals/TransactionDetailsModal';
import ShareReceiptModal from '@/components/modals/ShareReceiptModal';
import ConfirmDialog from '@/components/modals/ConfirmDialogComponent';
import AssignRoleModal from '@/components/modals/AssignRoleModal';

const ProfileModals = ({
  modals,
  setters,
  selectedTransaction,
  onSuspend,
  onPromote,
  onAssignRole,
  promotionType,
  currentRoleId,
  isAssigningRole,
  suspendTitle = 'Suspend User',
  suspendMessage = 'Are you sure you want to suspend this user?'
}) => {
  return (
    <>
      <TransactionDetailsModal
        isOpen={modals.showDetailsModal}
        onClose={() => setters.setShowDetailsModal(false)}
        transaction={selectedTransaction}
      />

      <ShareReceiptModal
        isOpen={modals.showShareModal}
        onClose={() => setters.setShowShareModal(false)}
        transaction={selectedTransaction}
      />

      <ConfirmDialog
        isOpen={modals.showSuspendModal}
        onClose={() => setters.setShowSuspendModal(false)}
        onConfirm={onSuspend}
        title={suspendTitle}
        message={suspendMessage}
        confirmText="Yes, suspend"
        confirmStyle="danger"
      />

      {modals.showPromoteModal && (
        <ConfirmDialog
          isOpen={modals.showPromoteModal}
          onClose={() => setters.setShowPromoteModal(false)}
          onConfirm={onPromote}
          title={`Promote to ${promotionType}`}
          message={`Are you sure you want to promote this user to ${promotionType}?`}
          confirmText="Yes, promote"
          confirmStyle="primary"
        />
      )}

      <AssignRoleModal
        isOpen={!!modals.showAssignRoleModal}
        onClose={() => setters.setShowAssignRoleModal(false)}
        onAssign={onAssignRole}
        currentRoleId={currentRoleId}
        isSubmitting={isAssigningRole}
      />
    </>
  );
};

export default ProfileModals;