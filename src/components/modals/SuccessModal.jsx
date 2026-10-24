import React from 'react';
import BaseModal from './BaseModal';
import confetti from '../../assets/images/confetti.png';

const SuccessModal = ({ isOpen, onClose, beneficiaryName }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={null} hasCloseButton={false} maxWidth="max-w-sm">
      <div className="p-2 text-center relative">
        <div className="relative mb-6">
         <div className="relative mb-0 w-full h-56 flex justify-center items-center">
          <svg width="117" height="117" viewBox="0 0 117 117" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="58.5" cy="58.5" r="58.5" fill="#BAEDCD"/>
          <ellipse cx="58.452" cy="58.1487" rx="50.616" ry="49.1096" fill="#99E4B5"/>
          <path d="M94.8771 58.5011C94.8771 78.5716 78.6068 94.842 58.5362 94.842C38.4657 94.842 22.1953 78.5716 22.1953 58.5011C22.1953 38.4305 38.4657 22.1602 58.5362 22.1602C78.6068 22.1602 94.8771 38.4305 94.8771 58.5011Z" fill="white"/>
          <path d="M58.499 15.9531C81.996 15.9534 101.044 35.002 101.044 58.499C101.044 81.9959 81.9959 101.044 58.499 101.044C35.002 101.044 15.9534 81.996 15.9531 58.499C15.9531 35.0018 35.0018 15.9531 58.499 15.9531ZM80.4365 40.6846C78.431 39.0134 75.4497 39.2847 73.7783 41.29L56.7705 61.7002C55.1317 63.6668 54.2092 64.7556 53.4736 65.4248C53.4647 65.4329 53.455 65.4405 53.4463 65.4482C53.4367 65.4411 53.4259 65.4352 53.416 65.4277C52.6228 64.8279 51.6062 63.8269 49.7959 62.0166L42.9346 55.1553C41.0885 53.3095 38.0951 53.3095 36.249 55.1553C34.403 57.0013 34.4032 59.9947 36.249 61.8408L43.1104 68.7021C44.7229 70.3147 46.274 71.8807 47.7129 72.9688C49.1637 74.0658 51.0359 75.1018 53.4043 75.1299L53.8848 75.1221L54.3633 75.0859C56.7194 74.8436 58.4904 73.6429 59.8359 72.4189C61.1704 71.2051 62.5733 69.5048 64.0332 67.7529L81.042 47.3428C82.713 45.3371 82.4421 42.3559 80.4365 40.6846Z" fill="#22C55E"/>
          </svg>

          
          {/* Confetti dots */}
          <div>
            <img src={confetti} alt="Confetti" className="absolute top-5 left-0 w-full h-full " />
          </div>
        </div>
        </div>
        
        <h3 className="text-xl font-urbanist font-semibold text-[#1E1E1E] mb-2">Beneficiary Saved!</h3>
        <p className="text-sm text-[#808C91] mb-6 font-general">You can now easily select **{beneficiaryName}** for future withdrawals.</p>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#FF5B04] text-white rounded-lg font-medium hover:bg-[#E54F03] transition-colors cursor-pointer"
        >
          Dismiss
        </button>
      </div>
    </BaseModal>
  );
};

export default SuccessModal;