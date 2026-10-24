import React from 'react';
import BaseModal from './BaseModal';

const ProcessingModal = ({ isOpen, onClose }) => {
  return (
    // Use maxWidth='max-w-sm' for a smaller modal, remove title/close button from BaseModal
    <BaseModal isOpen={isOpen} onClose={onClose} title={null} hasCloseButton={true} maxWidth="max-w-sm">
      <div className="p-2 text-center relative">
        <div className="w-16 h-16 border-4 border-[#FF5B04] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium text-[#1E1E1E]">Processing Payment......</p>
      </div>
    </BaseModal>
  );
};

export default ProcessingModal;