import { useState } from 'react';

export const useAggregatorModals = () => {
  const [showAddAggregatorModal, setShowAddAggregatorModal] = useState(false);
  const [showAggregatorAddedModal, setShowAggregatorAddedModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedAggregator, setSelectedAggregator] = useState(null);

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
    selectedAggregator,
    setSelectedAggregator,
  };
};