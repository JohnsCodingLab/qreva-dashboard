import { useState } from 'react';

export const useManagerModals = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);

  return {
    modals: {
      showAddModal,
      showSuccessModal,
      showSuspendModal,
      showProfileModal,
    },
    setters: {
      setShowAddModal,
      setShowSuccessModal,
      setShowSuspendModal,
      setShowProfileModal,
    },
    selectedManager,
    setSelectedManager,
  };
};
