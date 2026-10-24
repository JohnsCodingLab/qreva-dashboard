import ActionSuccessModal from './ActionSuccessModal';

const AdminInviteSuccessModal = ({ isOpen, onClose, roleLabel = 'Admin' }) => {
  return (
    <ActionSuccessModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${roleLabel} invite sent`}
      message={`The invite has been sent successfully. The user will receive an email with instructions to set up their account and login.`}
      buttonText="Dismiss"
    />
  );
};

export default AdminInviteSuccessModal;
