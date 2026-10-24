import React from 'react';
import { useParams } from 'react-router-dom';
import { useCommission } from '@/store/features/settings/useCommissions';

const ViewCommissionDetails = () => {
    const { id } = useParams();
    const { data: commissionResponse, isLoading } = useCommission(id);
    const commission = commissionResponse?.data || {};

    if (isLoading) {
        return (
            <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
                <div className="flex items-center justify-center h-64">
                    <p className="text-[#808C91]">Loading...</p>
                </div>
            </div>
        );
    }

    const feeValue = commission.feeType === 'Percentage'
        ? `${commission.percentageFee}%`
        : `₦${commission.flatFee}`;

    const splits = (commission.commissionSplits || []).map(split => ({
        role: split.role,
        commission: commission.feeType === 'Percentage'
            ? `${split.value}%`
            : `₦${split.value}`,
    }));

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#1E1E1E]">View Details</h1>
                <p className="text-[#808C91] mt-1">Kindly view the info about this commission</p>
            </div>

            {/* Summary Cards */}
            <div className="bg-white p-6 rounded-xl border border-[#EFF2F3] mb-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    <div>
                        <p className="text-[10px] text-[#808C91] mb-1">User Account</p>
                        <p className="text-sm font-medium text-[#1E1E1E]">{commission.userAccountType || '-'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-[#808C91] mb-1">Transaction Type</p>
                        <p className="text-sm font-medium text-[#1E1E1E]">{commission.transactionType || '-'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-[#808C91] mb-1">Fee Type</p>
                        <p className="text-sm font-medium text-[#1E1E1E]">{commission.feeType || '-'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-[#808C91] mb-1">Fee Value</p>
                        <p className="text-sm font-medium text-[#1E1E1E]">{feeValue}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-[#808C91] mb-1">Applied To</p>
                        <p className="text-sm font-medium text-[#1E1E1E]">{(commission.appliesTo || []).join(', ') || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Commission Breakdown */}
            {splits.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-sm font-medium text-[#808C91]">Commission Breakdown</h2>
                    <div className="bg-white p-6 rounded-xl border border-[#EFF2F3]">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {splits.map((split, index) => (
                                <div key={index}>
                                    <p className="text-[10px] text-[#808C91] mb-1">{split.role}</p>
                                    <p className="text-sm font-medium text-[#1E1E1E]">{split.commission}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewCommissionDetails;

