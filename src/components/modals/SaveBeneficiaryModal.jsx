import React from 'react';
import BaseModal from './BaseModal';

const SaveBeneficiaryModal = ({
  isOpen,
  onClose,
  accountName,
  accountNumber,
  bankName,
  beneficiaryName,
  setBeneficiaryName,
  confirmSaveBeneficiary,
}) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Save Beneficiary">
      <p className="text-sm text-[#808C91] mb-4 font-general font-medium">Kindly input what you would love to save as name</p>

      {/* Current Account Details (Read-only) */}
      <div className="bg-qreva-ash border border-gray-200 p-4 rounded-lg mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-[#808C91]">Account Name:</span>
          <span className="font-medium text-[#1E1E1E]">{accountName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#808C91]">Account/Bank:</span>
          <span className="font-medium text-[#1E1E1E]">{accountNumber} ({bankName})</span>
        </div>
      </div>

      {/* Beneficiary Nickname Input */}
      <div className="mb-6">
        <label className="text-sm text-[#808C91] mb-1 block">Beneficiary Nickname</label>
        <input
          type="text"
          placeholder="e.g., Mom's Account, Secondary Bank"
          value={beneficiaryName}
          onChange={(e) => setBeneficiaryName(e.target.value)}
          className="w-full px-4 py-3 border font-general border-[#E8EBED] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
        />
      </div>

      <button
        onClick={confirmSaveBeneficiary}
        disabled={!beneficiaryName}
        className="w-full py-3 bg-[#FF5B04] text-white rounded-lg font-medium cursor-pointer transition-colors disabled:bg-[#9A9A9A] disabled:cursor-not-allowed"
      >
        Save as Beneficiary
      </button>
    </BaseModal>
  );
};

export default SaveBeneficiaryModal;