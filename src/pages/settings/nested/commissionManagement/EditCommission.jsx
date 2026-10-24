import React, { useState } from 'react';
import CommissionForm from './CommissionForm';
import { useNavigate, useParams } from 'react-router-dom';
import ActionSuccessModal from '@/components/modals/ActionSuccessModal';
import { useCommission, useUpdateCommission } from '@/store/features/settings/useCommissions';
import { handleError } from '@/store/utils/handleError';

const EditCommission = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const { data: commissionResponse, isLoading } = useCommission(id);
    const updateCommission = useUpdateCommission();
    const commission = commissionResponse?.data || {};

    const handleSubmit = (payload) => {
        updateCommission.mutate({ commissionRuleId: id, ...payload }, {
            onSuccess: () => setIsSuccessModalOpen(true),
            onError: (error) => handleError(error),
        });
    };

    const handleCloseSuccess = () => {
        setIsSuccessModalOpen(false);
        navigate('/settings/commission-management');
    };

    if (isLoading) {
        return (
            <div className="p-6 md:p-8 max-w-[1200px] mx-auto">
                <div className="flex items-center justify-center h-64">
                    <p className="text-[#808C91]">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-[1200px] mx-auto">
            <CommissionForm
                initialData={commission}
                onSubmit={handleSubmit}
                submitLabel="Save Changes"
                title="Edit Details"
                subtitle="Kindly edit the info about this commission"
                isSubmitting={updateCommission.isPending}
            />

            <ActionSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleCloseSuccess}
                title="Commission Info Edited"
                message="You have successfully edited this commission information"
            />
        </div>
    );
};

export default EditCommission;

