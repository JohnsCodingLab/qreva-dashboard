import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAgencyCategory } from '@/store/features/settings/useAgencyCategories';

const ViewAgentCategoryDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: categoryResponse, isLoading } = useAgencyCategory(id);
    const category = categoryResponse?.data || {};

    const commissions = (category.commissionSplits || []).map((split) => ({
        role: split.role,
        value: category.commissionType === 'Percentage'
            ? `${split.value}%`
            : `₦${split.value}`,
    }));

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
                    <p className="text-[#808C91] mt-1">Kindly view the info about this category</p>
                </div>
                <Button
                    variant="outline"
                    className="border-[#FF5B04] text-[#FF5B04] hover:bg-[#E4EEF0]"
                    onClick={() => navigate(`/settings/agent-category/edit/${id}`)}
                >
                    Edit Category
                </Button>
            </div>

            {/* Summary Card */}
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div>
                            <p className="text-xs text-[#808C91] mb-1">User Account</p>
                            <p className="font-semibold text-[#1E1E1E]">{category.userAccountType || '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[#808C91] mb-1">Category Name</p>
                            <p className="font-semibold text-[#1E1E1E]">{category.name || '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[#808C91] mb-1">Commission Type</p>
                            <p className="font-semibold text-[#1E1E1E]">{category.commissionType || '-'}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-[#808C91] mb-1">Description</p>
                        <p className="font-semibold text-[#1E1E1E]">{category.description || '-'}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Commission Breakdown */}
            {commissions.length > 0 && (
                <div className="mb-2">
                    <h3 className="text-base font-semibold text-[#1E1E1E] mb-4">Commission Breakdown</h3>
                    <Card>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {commissions.map((item, index) => (
                                    <div key={index}>
                                        <p className="text-xs text-[#808C91] mb-1">{item.role}</p>
                                        <p className="text-lg font-bold text-[#1E1E1E]">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ViewAgentCategoryDetails;

