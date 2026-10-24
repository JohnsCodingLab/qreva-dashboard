import React, { useState } from 'react';
import BaseModal from './BaseModal';
import { Button } from '@/components/ui/button';

const DeclineReasonModal = ({ isOpen, onClose, onDecline }) => {
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        onDecline(reason);
        setReason(''); // Reset after submit
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Reason for Declining" hasCloseButton={true} maxWidth="max-w-md">
            <div className="mt-2">
                <p className="text-qreva-navy text-sm mb-4">
                    Kindly write down your reason for declining this dispute
                </p>
                
                <div className="mb-6">
                    <textarea 
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-qreva-orange min-h-[100px] resize-none"
                        placeholder="Reason For Declining"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>

                <Button 
                    className="w-full bg-[#FF5B04] hover:bg-[#e54f03] text-white h-12 rounded-lg font-medium"
                    onClick={handleSubmit}
                    disabled={!reason.trim()}
                >
                    Decline Dispute
                </Button>
            </div>
        </BaseModal>
    );
};

export default DeclineReasonModal;
