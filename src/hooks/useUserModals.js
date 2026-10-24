import { useState } from 'react';

export const useUserModals = () => {
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  return {
    modals: {
      showSuspendModal,
    },
    setters: {
      setShowSuspendModal,
    },
    selectedUser,
    setSelectedUser,
  };
};