import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from 'react-router-dom';
import AgentCategoryForm from './AgentCategoryForm';
import ActionSuccessModal from '@/components/modals/ActionSuccessModal';
import { useAgencyCategory, useUpdateAgencyCategory } from '@/store/features/settings/useAgencyCategories';
import { handleError } from '@/store/utils/handleError';

const EditAgentCategory = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [successModalOpen, setSuccessModalOpen] = useState(false);

    const { data: categoryResponse, isLoading } = useAgencyCategory(id);
    const updateCategory = useUpdateAgencyCategory();

    const category = categoryResponse?.data || {};

    const handleSave = (formData) => {
        updateCategory.mutate({ agencyCategoryId: id, ...formData }, {
            onSuccess: () => setSuccessModalOpen(true),
            onError: (error) => handleError(error),
        });
    };

    if (isLoading) {
        return (
            <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
                <div className="flex items-center justify-center h-64">
                    <p className="text-[#808C91]">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#1E1E1E]">Edit Details</h1>
                    <p className="text-[#808C91] mt-1">Kindly edit the info about this category</p>
                </div>
            </div>

            <AgentCategoryForm
                initialData={category}
                onSubmit={handleSave}
                submitLabel="Save Changes"
                isSubmitting={updateCategory.isPending}
            />

            <ActionSuccessModal
                isOpen={successModalOpen}
                onClose={() => {
                    setSuccessModalOpen(false);
                    navigate('/settings/agent-category');
                }}
                title="Agent Category Info Edited"
                message="You have successfully edited this agent category information"
                buttonText="Dismiss"
            />
        </div>
    );
};

export default EditAgentCategory;

