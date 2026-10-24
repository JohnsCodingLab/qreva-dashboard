import React, { useState } from 'react';
import BaseModal from '../modals/BaseModal';
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Check } from "lucide-react";

const ChangePasswordModal = ({ isOpen, onClose, onSubmit }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Validation rules
    const rules = {
        length: newPassword.length >= 8 && newPassword.length <= 12,
        special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
        upper: /[A-Z]/.test(newPassword),
        number: /[0-9]/.test(newPassword)
    };

    const isComplete = currentPassword.length > 0 && Object.values(rules).every(Boolean);

    const handleSubmit = () => {
        if (isComplete && onSubmit) {
            onSubmit({ currentPassword, newPassword });
        }
    };

    // Helper for validation chip rendering
    const ValidationChip = ({ isValid, text }) => (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs font-medium ${
            isValid 
                ? 'border-[#22C55E] text-[#22C55E] bg-[#22C55E]/5' 
                : 'border-dashed border-gray-300 text-gray-400'
        }`}>
            {isValid ? (
                <div className="w-4 h-4 rounded-full bg-[#22C55E] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                </div>
            ) : (
                <div className="w-4 h-4 rounded-full border border-dashed border-gray-300 flex items-center justify-center">
                    {/* Empty placeholder */}
                </div>
            )}
            {text}
        </div>
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Change Password"
            maxWidth="max-w-md"
        >
            <div className="mt-2 text-left">
                <p className="text-sm text-qreva-navy mb-6">
                    Change your login password
                </p>

                <div className="space-y-4 mb-6">
                    {/* Current Password Field */}
                    <div className="relative">
                         <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Current Password"
                            className="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5B04] transition-all"
                        />
                         <button 
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-qreva-navy focus:outline-none"
                        >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* New Password Field */}
                    <div className="relative">
                         <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password"
                            className="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5B04] transition-all"
                        />
                         <button 
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-qreva-navy focus:outline-none"
                        >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Validation Chips Grid */}
                <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <ValidationChip isValid={rules.length} text="8-12 characters" />
                    <ValidationChip isValid={rules.special} text="Special character(s)" />
                    <ValidationChip isValid={rules.upper} text="Upper case character" />
                    <ValidationChip isValid={rules.number} text="Numerical value" />
                </div>

                <Button
                    className="w-full h-12 bg-[#E8EBED] text-[#808C91] hover:bg-[#d5d8db] hover:text-[#505C61] font-medium text-base disabled:opacity-50 transition-colors"
                    onClick={handleSubmit}
                    disabled={!isComplete}
                    style={{ backgroundColor: isComplete ? '#FF5B04' : undefined, color: isComplete ? 'white' : undefined }}
                >
                    Change Password
                </Button>
            </div>
        </BaseModal>
    );
};

export default ChangePasswordModal;
