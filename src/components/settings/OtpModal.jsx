import React, { useState, useRef, useEffect } from 'react';
import BaseModal from '../modals/BaseModal';
import { Button } from "@/components/ui/button";

const OtpModal = ({ isOpen, onClose, onSubmit, phoneNumber = "08012345678" }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputsRef = useRef([]);

    useEffect(() => {
        if (isOpen) {
            setOtp(['', '', '', '', '', '']);
            setTimeout(() => inputsRef.current[0]?.focus(), 100);
        }
    }, [isOpen]);

    const handleChange = (index, value) => {
        if (isNaN(Number(value))) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split('').forEach((char, index) => {
            if (index < 6) newOtp[index] = char;
        });
        setOtp(newOtp);
        inputsRef.current[Math.min(pastedData.length, 5)].focus();
    };

    const isComplete = otp.every(digit => digit !== '');

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="OTP Verification"
            maxWidth="max-w-md"
        >
            <div className="mt-2 text-center">
                <p className="text-sm text-qreva-navy mb-8">
                    Kindly input the OTP code sent to <span className="text-[#0FB5C9] font-medium">{phoneNumber}</span>
                </p>

                <div className="flex justify-center gap-3 mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => inputsRef.current[index] = el}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="w-12 h-12 sm:w-14 sm:h-14 border border-gray-300 rounded-lg text-center text-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5B04] transition-all"
                        />
                    ))}
                </div>

                <div className="text-center mb-8">
                    <p className="text-xs text-qreva-navy font-medium">
                        Didn't get the code? <span className="text-[#808C91]">Resend in 09:00s</span>
                    </p>
                </div>

                <Button
                    className="w-full h-12 bg-[#E8EBED] text-[#808C91] hover:bg-[#d5d8db] hover:text-[#505C61] font-medium text-base mb-2 disabled:opacity-50"
                    onClick={() => {
                        if (onSubmit) {
                            onSubmit(otp.join(''));
                        } else {
                            onClose();
                        }
                    }}
                    disabled={!isComplete}
                    style={{ backgroundColor: isComplete ? '#FF5B04' : undefined, color: isComplete ? 'white' : undefined }}
                >
                    Enter OTP
                </Button>
            </div>
        </BaseModal>
    );
};

export default OtpModal;
