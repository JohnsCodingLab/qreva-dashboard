import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from 'react-router-dom';
import { REQUIRED_DOCUMENTS } from './constants';
import ActionSuccessModal from "@/components/modals/ActionSuccessModal";
import { useTier, useUpdateTier } from '@/store/features/settings/useTiers';
import { handleError } from '@/store/utils/handleError';

// Format number with commas
const formatWithCommas = (value) => {
    const raw = String(value).replace(/[^0-9]/g, '');
    if (!raw) return '';
    return parseInt(raw, 10).toLocaleString();
};

const LimitInput = ({ labelStart, labelEnd, value, onChange, isUnlimited, onUnlimitedChange }) => (
    <div className="p-4 border border-[#E8EBED] rounded-lg w-full">
        <div className="flex flex-col gap-4">
            {/* Start side */}
            <div className="flex-1">
                <div className="flex items-center gap-1 mb-2">
                    <span className="text-[10px] text-[#808C91] font-bold">N</span>
                    <span className="text-2xl text-[#E2E8F0] font-bold">0</span>
                </div>
                <label className="text-xs text-[#808C91]">{labelStart}</label>
            </div>

            <div className="text-[#808C91]">→</div>

            {/* End side */}
            <div className="flex-1 border-t border-[#E8EBED] pt-4">
                <div className="flex items-center gap-1 mb-2 relative">
                    <span className="text-[10px] text-[#1E1E1E] font-bold">N</span>
                    <input
                        type="text"
                        placeholder="100"
                        value={isUnlimited ? 'Unlimited' : value}
                        onChange={(e) => {
                            if (!isUnlimited) onChange(formatWithCommas(e.target.value));
                        }}
                        readOnly={isUnlimited}
                        className="w-full text-2xl font-bold text-[#1E1E1E] placeholder:text-[#E2E8F0] focus:outline-none bg-transparent"
                    />
                    <div className="absolute right-0 top-1 w-px h-6 bg-[#0FB5C9] animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between">
                    <label className="text-xs text-[#808C91]">{labelEnd}</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id={`unlimited-${labelEnd}`}
                            checked={isUnlimited}
                            onChange={(e) => onUnlimitedChange(e.target.checked)}
                            className="w-4 h-4 accent-qreva-blue rounded border-gray-300 cursor-pointer"
                        />
                        <span className="text-xs text-[#808C91]">Unlimited</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const EditTier = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [showSuccess, setShowSuccess] = useState(false);

    const { data: tierResponse, isLoading } = useTier(id);
    const updateTier = useUpdateTier();
    const tier = tierResponse?.data ?? tierResponse ?? {};

    const [activeTab, setActiveTab] = useState('personal');
    const [tierName, setTierName] = useState('');
    const [tierDesc, setTierDesc] = useState('');
    const [selectedDocs, setSelectedDocs] = useState([]);
    const [limits, setLimits] = useState({
        daily: { value: '', unlimited: false },
        single: { value: '', unlimited: false },
        wallet: { value: '', unlimited: false },
    });

    // Populate form when tier data loads
    useEffect(() => {
        if (tier && tier.level) {
            setTierName(tier.level || '');
            setTierDesc(tier.tierDescription || '');
            setActiveTab(tier.accountType === 'AgentAccount' ? 'agent' : 'personal');
            setSelectedDocs(tier.requiredDocuments || tier.requirements || []);
            setLimits({
                daily: {
                    value: tier.dailyTransactionLimit ? formatWithCommas(String(tier.dailyTransactionLimit)) : '',
                    unlimited: tier.dailyTransactionUnlimited || false,
                },
                single: {
                    value: tier.singleTransactionLimit ? formatWithCommas(String(tier.singleTransactionLimit)) : '',
                    unlimited: tier.singleTransactionUnlimited || false,
                },
                wallet: {
                    value: tier.balanceLimit ? formatWithCommas(String(tier.balanceLimit)) : '',
                    unlimited: tier.balanceUnlimited || false,
                },
            });
        }
    }, [tier]);

    const updateLimit = (key, field, val) => {
        setLimits(prev => ({ ...prev, [key]: { ...prev[key], [field]: val } }));
    };

    const toggleDoc = (docId) => {
        setSelectedDocs(prev =>
            prev.includes(docId) ? prev.filter(d => d !== docId) : [...prev, docId]
        );
    };

    const parseLimit = (value) => {
        const num = Number(String(value).replace(/[^0-9]/g, ''));
        return num || 0;
    };

    const handleSave = () => {
        const payload = {
            tierId: tier.id ?? tier.tierId ?? id,
            level: tierName,
            accountType: activeTab === 'personal' ? 'PersonalAccount' : 'AgentAccount',
            tierDescription: tierDesc,
            dailyTransactionLimit: parseLimit(limits.daily.value),
            singleTransactionLimit: parseLimit(limits.single.value),
            balanceLimit: parseLimit(limits.wallet.value),
            requirements: selectedDocs,
            requiredDocuments: selectedDocs,
            dailyTransactionUnlimited: limits.daily.unlimited,
            singleTransactionUnlimited: limits.single.unlimited,
            balanceUnlimited: limits.wallet.unlimited,
            active: true,
        };

        updateTier.mutate(payload, {
            onSuccess: () => setShowSuccess(true),
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
                    <p className="text-[#808C91] mt-1">Kindly edit the info about this tier</p>
                </div>
                <Button
                    className="bg-[#FF5B04] hover:bg-[#E54F03] text-white"
                    onClick={handleSave}
                    disabled={updateTier.isPending}
                >
                    {updateTier.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            {/* Tabs */}
            <div className="border-b border-[#E8EBED] mb-8">
                <p className="text-xs text-[#808C91] mb-3">Select the account type this tier applies to</p>
                <div className="flex gap-8">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'personal'
                            ? 'text-[#FF5B04] border-b-2 border-[#FF5B04]'
                            : 'text-[#808C91] hover:text-[#505C61]'
                            }`}
                    >
                        Personal Account
                    </button>
                    <button
                        onClick={() => setActiveTab('agent')}
                        className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'agent'
                            ? 'text-[#FF5B04] border-b-2 border-[#FF5B04]'
                            : 'text-[#808C91] hover:text-[#505C61]'
                            }`}
                    >
                        Agent Account
                    </button>
                </div>
            </div>

            {/* General Information */}
            <Card className="mb-6">
                <CardContent className="p-6">
                    <h3 className="font-bold text-[#1E1E1E] mb-6">General Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs text-[#808C91] mb-1 block">Tier Name</label>
                            <input
                                type="text"
                                value={tierName}
                                onChange={(e) => setTierName(e.target.value)}
                                placeholder="Tier Name"
                                className="w-full px-4 py-3 border border-[#E8EBED] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5B04]"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-[#808C91] mb-1 block">Tier Description (Optional)</label>
                            <input
                                type="text"
                                value={tierDesc}
                                onChange={(e) => setTierDesc(e.target.value)}
                                placeholder="Tier Description (Optional)"
                                className="w-full px-4 py-3 border border-[#E8EBED] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5B04]"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Required Documents */}
            <Card className="mb-6">
                <CardContent className="p-6">
                    <h3 className="font-bold text-[#1E1E1E] mb-6">Required Documents</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {REQUIRED_DOCUMENTS.map((doc) => (
                            <div key={doc.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id={`edit-${doc.id}`}
                                    checked={selectedDocs.includes(doc.id)}
                                    onChange={() => toggleDoc(doc.id)}
                                    className="w-4 h-4 accent-qreva-blue rounded border-gray-300 cursor-pointer"
                                />
                                <label htmlFor={`edit-${doc.id}`} className="text-xs font-semibold text-[#1E1E1E] cursor-pointer">
                                    {doc.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Transaction Limit */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="font-bold text-[#1E1E1E] mb-6">Transaction Limit</h3>
                    <div className="flex flex-col gap-6">
                        <LimitInput
                            labelStart="Daily Limit Start"
                            labelEnd="Daily Limit End"
                            value={limits.daily.value}
                            onChange={(v) => updateLimit('daily', 'value', v)}
                            isUnlimited={limits.daily.unlimited}
                            onUnlimitedChange={(v) => updateLimit('daily', 'unlimited', v)}
                        />
                        <LimitInput
                            labelStart="Single Transaction Start"
                            labelEnd="Single Transaction End"
                            value={limits.single.value}
                            onChange={(v) => updateLimit('single', 'value', v)}
                            isUnlimited={limits.single.unlimited}
                            onUnlimitedChange={(v) => updateLimit('single', 'unlimited', v)}
                        />
                        <LimitInput
                            labelStart="Wallet Balance Start"
                            labelEnd="Wallet Balance End"
                            value={limits.wallet.value}
                            onChange={(v) => updateLimit('wallet', 'value', v)}
                            isUnlimited={limits.wallet.unlimited}
                            onUnlimitedChange={(v) => updateLimit('wallet', 'unlimited', v)}
                        />
                    </div>
                </CardContent>
            </Card>

            <ActionSuccessModal
                isOpen={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                    navigate('/settings/tier');
                }}
                title="Tier Info Edited"
                message="You have successfully edited this tier information"
                buttonText="Dismiss"
            />
        </div>
    );
};

export default EditTier;

