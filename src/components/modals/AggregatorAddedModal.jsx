import ActionSuccessModal from './ActionSuccessModal';

const AggregatorAddedModal = ({ isOpen, onClose, roleLabel = 'Aggregator' }) => {
  return (
    <ActionSuccessModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${roleLabel} invite sent`}
      message={`The user has been activated as ${roleLabel} and notified by email. They should login through the portal using their existing Agent credentials.`}
      buttonText="Dismiss"
    />
  );
};

export default AggregatorAddedModal;
