import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import RoleForm from './RoleForm';
import ActionSuccessModal from '@/components/modals/ActionSuccessModal';
import { useCreateRole } from '@/store/features/settings/useRbac';
import { handleError } from '@/store/utils/handleError';

const CreateRole = () => {
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const createRole = useCreateRole();
    const collectDataRef = useRef(null);

    const handleCreate = () => {
        if (collectDataRef.current) {
            const payload = collectDataRef.current();
            createRole.mutate(payload, {
                onSuccess: () => setShowSuccess(true),
                onError: (error) => handleError(error),
            });
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#1E1E1E]">Create New Role</h1>
                    <p className="text-[#808C91] mt-1">Kindly input the info about this new role</p>
                </div>
                <Button
                    className="bg-[#FF5B04] hover:bg-[#E54F03] text-white"
                    onClick={handleCreate}
                    disabled={createRole.isPending}
                >
                    {createRole.isPending ? 'Creating...' : 'Create Role'}
                </Button>
            </div>

            <RoleForm onCollectData={(fn) => { collectDataRef.current = fn; }} />

            <ActionSuccessModal
                isOpen={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                    navigate('/settings/rbac');
                }}
                title="New Role Permission Created"
                message="You have successfully created a new role permission for your platform"
                buttonText="Dismiss"
            />
        </div>
    );
};

export default CreateRole;

