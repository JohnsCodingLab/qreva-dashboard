import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from 'react-router-dom';
import RoleForm from './RoleForm';
import ActionSuccessModal from '@/components/modals/ActionSuccessModal';
import { useRole, useUpdateRole } from '@/store/features/settings/useRbac';
import { handleError } from '@/store/utils/handleError';

const EditRole = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [showSuccess, setShowSuccess] = useState(false);
    const updateRole = useUpdateRole();
    const collectDataRef = useRef(null);

    const { data: roleResponse, isLoading } = useRole(id);
    const role = roleResponse?.data || {};

    const handleSave = () => {
        if (collectDataRef.current) {
            const payload = collectDataRef.current();
            updateRole.mutate({ rolePermissionId: id, ...payload }, {
                onSuccess: () => setShowSuccess(true),
                onError: (error) => handleError(error),
            });
        }
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
                    <p className="text-[#808C91] mt-1">Kindly edit the info about this permission</p>
                </div>
                <Button
                    className="bg-[#FF5B04] hover:bg-[#E54F03] text-white"
                    onClick={handleSave}
                    disabled={updateRole.isPending}
                >
                    {updateRole.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <RoleForm
                initialData={role}
                onCollectData={(fn) => { collectDataRef.current = fn; }}
            />

            <ActionSuccessModal
                isOpen={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                    navigate('/settings/rbac');
                }}
                title="Role Permission Edited"
                message="You have successfully edited this role permission for your platform"
                buttonText="Dismiss"
            />
        </div>
    );
};

export default EditRole;

