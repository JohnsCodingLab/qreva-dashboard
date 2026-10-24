import { useState } from 'react';

export const useAggregatorProfileModals = () => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  return {
    modals: {
      showDetailsModal,
      showShareModal,
      showSuspendModal,
      showActionsMenu,
    },
    setters: {
      setShowDetailsModal,
      setShowShareModal,
      setShowSuspendModal,
      setShowActionsMenu,
    },
    selectedTransaction,
    setSelectedTransaction,
  };
};