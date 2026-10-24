import React, { useState } from 'react';
import CommissionForm from './CommissionForm';
import ActionSuccessModal from '@/components/modals/ActionSuccessModal';
import { useNavigate } from 'react-router-dom';
import { useCreateCommission } from '@/store/features/settings/useCommissions';
import { handleError } from '@/store/utils/handleError';

const CreateCommission = () => {
    const navigate = useNavigate();
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const createCommission = useCreateCommission();

    const handleSubmit = (payload) => {
        createCommission.mutate(payload, {
            onSuccess: () => setIsSuccessModalOpen(true),
            onError: (error) => handleError(error),
        });
    };

    const handleCloseSuccess = () => {
        setIsSuccessModalOpen(false);
        navigate('/settings/commission-management');
    };

    return (
        <div className="p-6 md:p-8 max-w-[1200px] mx-auto">
            <CommissionForm
                onSubmit={handleSubmit}
                isSubmitting={createCommission.isPending}
            />

            <ActionSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleCloseSuccess}
                title="New Commission Created"
                message="You have successfully created a new commission for your platform"
            />
        </div>
    );
};

export default CreateCommission;

