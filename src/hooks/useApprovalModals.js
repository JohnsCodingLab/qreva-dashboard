import { useState } from 'react';

export const useApprovalModals = () => {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [feedbackType, setFeedbackType] = useState(null);

  return {
    modals: {
      showAcceptModal,
      showDeclineModal,
      showSuccessModal,
      showGuidelinesModal
    },
    setters: {
      setShowAcceptModal,
      setShowDeclineModal,
      setShowSuccessModal,
      setShowGuidelinesModal
    },
    selectedUser,
    setSelectedUser,
    declineReason,
    setDeclineReason,
    feedbackType,
    setFeedbackType
  };
};