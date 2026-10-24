import React from 'react';
import BaseModal from "@/components/modals/BaseModal";
import { Button } from "@/components/ui/button";

const TierViewDetailsModal = ({ isOpen, tier, onClose }) => {
    if (!tier) return null;

    const isAgent = tier.accountType === 'AgentAccount';

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="View Details" maxWidth="max-w-lg" hasCloseButton={true}>
            <p className="text-sm text-[#808C91] mb-6 -mt-2">Here is the full detail about this tier</p>

            {/* Account Type Badge */}
            <div className="flex items-center gap-2 mb-6">
                <span className="text-xs text-[#808C91]">Account Type:</span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isAgent ? 'bg-[#EEF6FF] text-[#2D7DD2]' : 'bg-[#FFF5F2] text-[#FF5B04]'}`}>
                    {isAgent ? 'Agent Account' : 'Personal Account'}
                </span>
            </div>

            {/* Tier Details Card */}
            <div className="bg-[#F7FAFA] rounded-xl p-5 mb-6 relative overflow-hidden">
                {/* Background watermark */}
                <div className="absolute right-4 bottom-4 opacity-10">
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                        <circle cx="50" cy="50" r="40" stroke="#FF5B04" strokeWidth="8" fill="none" />
                    </svg>
                </div>

                <h4 className="font-semibold text-[#1E1E1E] mb-4">{tier.tierDescription || tier.level || tier.name}</h4>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-xs text-[#808C91] mb-1">Daily Transaction Limit</p>
                        <p className="text-lg font-bold text-[#1E1E1E]">
                            {tier.dailyTransactionUnlimited ? 'Unlimited' : `₦${(tier.dailyTransactionLimit ?? tier.dailyLimit ?? 0).toLocaleString()}`}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-[#808C91] mb-1">Single Transaction Limit</p>
                        <p className="text-lg font-bold text-[#1E1E1E]">
                            {tier.singleTransactionUnlimited ? 'Unlimited' : `₦${(tier.singleTransactionLimit ?? tier.singleLimit ?? 0).toLocaleString()}`}
                        </p>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-xs text-[#808C91] mb-1">Balance Limit</p>
                    <p className="text-lg font-bold text-[#1E1E1E]">
                        {tier.balanceUnlimited ? 'Unlimited' : `₦${(tier.balanceLimit ?? 0).toLocaleString()}`}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-[#808C91] mb-2">Requirements</p>
                    {(() => {
                        const reqs = Array.isArray(tier.requirements)
                            ? tier.requirements
                            : String(tier.requirements || '').split(',').filter(Boolean);
                        return reqs.length > 0 ? (
                            <ul className="space-y-1">
                                {reqs.map((req, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-[#1E1E1E]">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04] inline-block shrink-0" />
                                        {req.trim()}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-[#808C91]">No requirements specified</p>
                        );
                    })()}
                </div>
            </div>

            <Button
                onClick={onClose}
                className="w-full py-3 h-12 bg-[#FF5B04] text-white rounded-lg font-medium hover:bg-[#E54F03] transition-colors"
            >
                Dismiss
            </Button>
        </BaseModal>
    );
};

export default TierViewDetailsModal;

