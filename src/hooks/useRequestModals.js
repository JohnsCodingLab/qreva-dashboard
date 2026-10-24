import { useState } from 'react';

export const useRequestModals = () => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const openDetailsModal = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedRequest(null);
  };

  return {
    showDetailsModal,
    selectedRequest,
    openDetailsModal,
    closeDetailsModal
  };
};