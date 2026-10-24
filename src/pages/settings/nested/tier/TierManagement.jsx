import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from "@/components/tables/DataTable";
import { TIER_COLUMNS, TIER_ACTIONS } from './constants';
import TierViewDetailsModal from './TierViewDetailsModal';
import { useTiers, useDeleteTier } from '@/store/features/settings/useTiers';
import { handleError } from '@/store/utils/handleError';
import { handleSuccess } from '@/store/utils/handleSuccess';

const TierManagement = () => {
    const navigate = useNavigate();
    const [viewTier, setViewTier] = useState(null);
    const { data: tiersResponse, isLoading } = useTiers();
    const deleteTier = useDeleteTier();

    const tiers = tiersResponse?.data || [];

    const getTierId = (row) => row.id ?? row.tierId ?? row._id;

    const handleAction = (action, row) => {
        if (action.label === 'Edit Details') {
            navigate(`/settings/tier/edit/${getTierId(row)}`);
        } else if (action.label === 'View Details') {
            setViewTier(row);
        } else if (action.label === 'Delete Tier') {
            deleteTier.mutate(getTierId(row), {
                onSuccess: () => handleSuccess('Tier deleted successfully'),
                onError: (error) => handleError(error),
            });
        }
    };

    // Map actions to include handler
    const actionsWithHandler = TIER_ACTIONS.map(action => ({
        ...action,
        onClick: (row) => handleAction(action, row)
    }));

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#1E1E1E]">Tier Management</h1>
                    <p className="text-[#808C91] mt-1">View all the full information about KYC tiers on the platform</p>
                </div>
            </div>

            <DataTable
                data={tiers}
                columns={TIER_COLUMNS}
                title="KYC Tiers"
                actions={actionsWithHandler}
                showSearch={true}
                showCheckbox={true}
                loading={isLoading}
            />

            {/* View Details Modal */}
            <TierViewDetailsModal
                isOpen={!!viewTier}
                tier={viewTier}
                onClose={() => setViewTier(null)}
            />
        </div>
    );
};

export default TierManagement;

