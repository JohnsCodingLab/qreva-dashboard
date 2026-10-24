import ActionSuccessModal from './ActionSuccessModal';

// TODO: Wire to real API when backend endpoint for adding agents is ready. Currently uses mock data.
const AgentAddedModal = ({ isOpen, onClose }) => {
  return (
    <ActionSuccessModal
      isOpen={isOpen}
      onClose={onClose}
      title="Agent added"
      message="This agent has been sent an invitation link to the email just registered and can go ahead to onboard on the app!"
      buttonText="Dismiss"
    />
  );
};

export default AgentAddedModal;
