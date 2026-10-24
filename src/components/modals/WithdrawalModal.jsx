import React from 'react';
import BaseModal from './BaseModal';
import { useBanks } from '@/store/features/earnings/useEarnings';

const WithdrawModal = ({
  isOpen,
  onClose,
  frequentBeneficiaries,
  setBankName,
  setAccountNumber,
  setAccountName,
  bankName,
  accountNumber,
  accountName,
  amount,
  formatAmount,
  handleAmountChange,
  handleWithdraw,
}) => {
  const { data: banksResponse, isLoading: isBanksLoading } = useBanks();
  const banks = banksResponse?.data || [];

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Withdraw Now">
      <p className="text-sm text-[#808C91] font-general font-medium mb-4">Kindly input the right info to perform this action</p>

      {/* Frequent Beneficiaries */}
      <div className="mb-4">
        <label className="text-xs text-[#808C91] mb-2 block  font-general">Frequent Beneficiaries</label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {frequentBeneficiaries.map((beneficiary, idx) => (
            <button
              key={beneficiary._id || idx}
              className="flex flex-col items-center min-w-[60px]"
              onClick={() => {
                setBankName(beneficiary.bankCode || beneficiary.bankName || '');
                setAccountNumber(beneficiary.accountNumber || '');
                setAccountName(beneficiary.accountName || '');
              }}
            >
              <div className="w-10 h-10 rounded-full bg-[#333333]/5 flex items-center justify-center text-[#FF9157] font-medium text-sm mb-1">
                {beneficiary.initial}
              </div>
              <span className="text-xs font-general text-[#1E1E1E]">{beneficiary.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bank Name Dropdown */}
      <div className="mb-4 relative">
        <select
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          className="w-full px-4 py-3 border border-[#E8EBED] rounded-lg text-sm font-general text-[#808C91] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 appearance-none pr-12"
        >
          <option value="">{isBanksLoading ? 'Loading banks...' : 'Bank Name'}</option>
          {banks.map((bank) => (
            <option key={bank.code || bank._id} value={bank.code || bank.name}>
              {bank.name}
            </option>
          ))}
        </select>
        {/* Custom Chevron */}
        <div className="pointer-events-none cursor-pointer absolute top-1/2 right-4 transform -translate-y-1/2 bg-[#333333]/5 rounded-full p-2 flex items-center justify-center">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5" stroke="#FF9157" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="w-full px-4 py-3 font-general border border-[#E8EBED] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
        />
        {accountNumber && (
          <div className="text-xs text-[#084059] mt-1 text-right">{accountName}</div>
        )}
      </div>

      {/* Amount */}
      <div className="mb-6">
        <div className="border-2 border-[#E8EBED] rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20">
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold text-[#1E1E1E] mr-1">₦</span>
            <input
              type="text"
              value={formatAmount(amount)}
              onChange={handleAmountChange}
              placeholder="100 - 50,000"
              className="text-3xl font-semibold text-[#1E1E1E] focus:outline-none flex-1"
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-[#808C91]">Transfer Amount (Min. 200)</span>
            <span className="text-xs text-[#1E1E1E] font-general">Your Earnings: <span className="font-semibold">3,000,000</span></span>
          </div>
        </div>
      </div>

      <button
        onClick={handleWithdraw}
        disabled={!bankName || !accountNumber || !amount}
        className="w-full py-3 bg-[#FF5B04] text-white rounded-lg font-medium hover:bg-[#E54F03] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Withdraw
      </button>
    </BaseModal>
  );
};

export default WithdrawModal;