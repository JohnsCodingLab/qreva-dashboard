import { useState } from 'react';

export const useAgentModals = () => {
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [showAgentAddedModal, setShowAgentAddedModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  return {
    modals: {
      showAddAgentModal,
      showAgentAddedModal,
      showSuspendModal,
    },
    setters: {
      setShowAddAgentModal,
      setShowAgentAddedModal,
      setShowSuspendModal,
    },
    selectedAgent,
    setSelectedAgent,
  };
};