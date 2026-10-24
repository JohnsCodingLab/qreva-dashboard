import { useState } from 'react';

export const useAggregatorManagerModals = () => {
  const [showAddAggregatorModal, setShowAddAggregatorModal] = useState(false);
  const [showAggregatorAddedModal, setShowAggregatorAddedModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);

  return {
    modals: {
      showAddAggregatorModal,
      showAggregatorAddedModal,
      showSuspendModal,
    },
    setters: {
      setShowAddAggregatorModal,
      setShowAggregatorAddedModal,
      setShowSuspendModal,
    },
    selectedManager,
    setSelectedManager,
  };
};