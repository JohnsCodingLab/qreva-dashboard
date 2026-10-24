import React from 'react';
import BaseModal from './BaseModal';
import confetti from '../../assets/images/confetti.png';

const TransferSuccessModal = ({ isOpen, onClose, handleSaveBeneficiary }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={null} hasCloseButton={true} maxWidth="max-w-md">
      <div className="p-2 text-center relative">
        
        {/* Confetti effect & Success Icon */}
        <div className="relative mb-0">
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
          {/* Confetti dots (retaining original style) */}
          <style>{`
            @keyframes confetti-fall {
                0% { transform: translateY(-50vh) rotate(0deg); opacity: 1; }
                100% { transform: translateY(50vh) rotate(360deg); opacity: 0; }
            }
          `}</style>
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full opacity-70"
                style={{
                  backgroundColor: ['#FF5B04', '#17B4A5', '#FFC107', '#E91E63'][i % 4],
                  left: `${50 + (Math.cos(i * 18 * Math.PI / 180) * 60)}%`,
                  top: `${50 + (Math.sin(i * 18 * Math.PI / 180) * 60)}%`,
                  animation: `confetti-fall ${Math.random() * 2 + 1}s linear infinite ${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        <h3 className="text-2xl font-urbanist font-bold text-[#1E1E1E] mb-2">Transfer Successful</h3>
        <p className="text-sm text-[#808C91] mb-6 font-general">Transaction ID: 12345FGTRI567</p>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={handleSaveBeneficiary}
            className="flex flex-col items-center justify-center p-4 border bg-[#F7FAFA] border-[#E8EBED] rounded-lg hover:bg-qreva-ash cursor-pointer"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z" fill="#333333" fill-opacity="0.05"/>
            <path d="M22.5 16C22.5 13.2386 20.2614 11 17.5 11C14.7386 11 12.5 13.2386 12.5 16C12.5 18.7614 14.7386 21 17.5 21C20.2614 21 22.5 18.7614 22.5 16Z" stroke="#B0B7C3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.5 28C10.5 24.134 13.634 21 17.5 21C18.5736 21 19.5907 21.2417 20.5 21.6736" stroke="#B0B7C3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M25.5 30C25.5 30 29.5 28.1471 29.5 25.1389C29.5 23.9576 28.6579 23 27.5 23C26.5526 23 25.9211 23.4118 25.5 24.2353C25.0789 23.4118 24.4474 23 23.5 23C22.3421 23 21.5 23.9576 21.5 25.1389C21.5 28.1471 25.5 30 25.5 30Z" stroke="#B0B7C3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span className="text-sm text-[#1E1E1E] font-general">Save Beneficiary</span>
          </button>
          <button
            className="flex flex-col items-center justify-center p-4 border bg-[#F7FAFA] border-[#E8EBED] rounded-lg hover:bg-qreva-ash cursor-pointer"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z" fill="#333333" fill-opacity="0.05"/>
            <path d="M16 15C16 15 18.1958 12.2839 19.4044 11.2389C19.5987 11.0709 19.8169 10.9915 20.0337 11.0007C20.2282 11.009 20.4215 11.0884 20.5958 11.2391C21.8041 12.2843 24 15 24 15M20.0337 12V23" stroke="#B0B7C3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 19C14.5999 19 13.8998 19 13.365 19.2725C12.8946 19.5122 12.5122 19.8946 12.2725 20.365C12 20.8998 12 21.5999 12 23V24C12 26.357 12 27.5355 12.7322 28.2678C13.4645 29 14.643 29 17 29H23C25.357 29 26.5355 29 27.2678 28.2678C28 27.5355 28 26.357 28 24V23C28 21.5999 28 20.8998 27.7275 20.365C27.4878 19.8946 27.1054 19.5122 26.635 19.2725C26.1002 19 25.4001 19 24 19" stroke="#B0B7C3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span className="text-sm text-[#1E1E1E] font-general">Download Receipt</span>
          </button>
        </div>

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

export default TransferSuccessModal;
