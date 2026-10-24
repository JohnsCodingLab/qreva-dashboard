import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import AgentCategoryForm from './AgentCategoryForm';
import ActionSuccessModal from '@/components/modals/ActionSuccessModal';
import { useCreateAgencyCategory } from '@/store/features/settings/useAgencyCategories';
import { handleError } from '@/store/utils/handleError';

const CreateAgentCategory = () => {
    const navigate = useNavigate();
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const createCategory = useCreateAgencyCategory();

    const handleCreate = (formData) => {
        createCategory.mutate(formData, {
            onSuccess: () => setSuccessModalOpen(true),
            onError: (error) => handleError(error),
        });
    };

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#1E1E1E]">Create New Category</h1>
                    <p className="text-[#808C91] mt-1">Kindly input the info about this new category</p>
                </div>
            </div>

            <AgentCategoryForm
                onSubmit={handleCreate}
                submitLabel="Create Category"
                isSubmitting={createCategory.isPending}
            />

            <ActionSuccessModal
                isOpen={successModalOpen}
                onClose={() => {
                    setSuccessModalOpen(false);
                    navigate('/settings/agent-category');
                }}
                title="New Agent Category Created"
                message="You have successfully created a new agent category for your platform"
                buttonText="Dismiss"
            />
        </div>
    );
};

export default CreateAgentCategory;

