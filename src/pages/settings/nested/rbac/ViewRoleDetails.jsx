import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from 'react-router-dom';
import RoleForm from './RoleForm';
import { useRole } from '@/store/features/settings/useRbac';

const ViewRoleDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: roleResponse, isLoading } = useRole(id);
    const role = roleResponse?.data || {};

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
                    <h1 className="text-2xl font-bold text-[#1E1E1E]">View Details</h1>
                    <p className="text-[#808C91] mt-1">Kindly view the info about this permission</p>
                </div>
                <Button
                    variant="outline"
                    className="border-[#FF5B04] text-[#FF5B04] hover:bg-[#E4EEF0]"
                    onClick={() => navigate(`/settings/rbac/edit/${id}`)}
                >
                    Edit Role
                </Button>
            </div>

            <RoleForm initialData={role} readOnly={true} />
        </div>
    );
};

export default ViewRoleDetails;

