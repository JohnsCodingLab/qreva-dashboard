import React from 'react';
import BaseModal from './BaseModal';
import { Button } from '@/components/ui/button';

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[500px]">
      <div className="flex flex-col items-center text-center p-4">
        {/* SVG Icon */}
        <div className="mb-6">
          <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.1318 18.3347C18.332 21.1539 18.332 24.8008 18.332 32.0947V77.9003C18.332 85.1938 18.332 88.8407 20.1318 91.6599C20.4532 92.1636 20.8134 92.6412 21.2093 93.0886C23.4261 95.5929 26.9334 96.5948 33.9479 98.5986C40.9801 100.608 44.4963 101.612 47.042 100.105C47.4839 99.8439 47.8945 99.5341 48.2672 99.1816C50.4154 97.148 50.4154 93.4919 50.4154 86.1796V23.8152C50.4154 16.503 50.4154 12.8468 48.2672 10.8132C47.8945 10.4606 47.4839 10.1507 47.042 9.88945C44.4963 8.38287 40.9801 9.38726 33.9479 11.3961C26.9334 13.3999 23.4261 14.4018 21.2093 16.9064C20.8134 17.3537 20.4532 17.8313 20.1318 18.3347Z" fill="#FF544A" stroke="#FF544A" stroke-width="6.875" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M50.418 18.3359H59.663C68.3791 18.3359 72.737 18.3359 75.4448 21.0208C76.9546 22.5177 77.6223 24.5232 77.918 27.5026M50.418 91.6693H59.663C68.3791 91.6693 72.737 91.6693 75.4448 88.9844C76.9546 87.4874 77.6223 85.4822 77.918 82.5026" stroke="#FF544A" stroke-width="6.875" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M96.2513 54.9977H64.168M89.3763 43.5391C89.3763 43.5391 100.835 51.9782 100.835 54.9977C100.835 58.0172 89.3763 66.4555 89.3763 66.4555" stroke="#FF544A" stroke-width="6.875" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        {/* Text Coverage */}
        <h2 className="text-2xl font-bold font-urbanist text-[#1E1E1E] mb-2">Log Out Now?</h2>
        <p className="text-[#808C91] font-general mb-8">You are about to log out of your account</p>

        {/* Action Buttons */}
        <div className="flex flex-col w-full gap-3">
          <Button 
            onClick={onConfirm}
            className="w-full h-12 bg-[#FF544A] hover:bg-[#E54B42] text-white font-bold text-base rounded-xl"
          >
            Yes, Log Out
          </Button>
          <Button 
            onClick={onClose}
            variant="outline"
            className="w-full h-12 bg-[#FFF5F2] border-[#FFE6DE] text-[#FF5B04] hover:bg-[#FFE6DE] font-bold text-base rounded-xl"
          >
            No, Cancel
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default LogoutConfirmationModal;
