import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    USER_ACCOUNT_OPTIONS,
    TRANSACTION_TYPE_OPTIONS,
    FEE_TYPE_OPTIONS,
    ROLES_OPTIONS,
    APPLIES_TO_OPTIONS
} from './constants';

const CommissionForm = ({
    initialData = {},
    onSubmit,
    submitLabel = "Create Commission",
    title = "Create New Commission",
    subtitle = "Kindly input the info about this new commission",
    isSubmitting = false,
}) => {
    const [userAccountType, setUserAccountType] = useState(initialData.userAccountType || 'AgentMerchant');
    const [transactionType, setTransactionType] = useState(initialData.transactionType || 'SoftPOS');
    const [feeType, setFeeType] = useState(initialData.feeType || 'Percentage');
    const [percentageFee, setPercentageFee] = useState(
        initialData.percentageFee != null ? String(initialData.percentageFee) : ''
    );
    const [flatFee, setFlatFee] = useState(
        initialData.flatFee != null ? String(initialData.flatFee) : ''
    );

    // Commission splits
    const buildInitialSplits = () => {
        const splits = {};
        ROLES_OPTIONS.forEach(role => {
            const existing = (initialData.commissionSplits || []).find(s => s.role === role.id);
            splits[role.id] = {
                enabled: existing ? existing.active : true,
                value: existing ? String(existing.value) : '',
            };
        });
        return splits;
    };
    const [commissionSplits, setCommissionSplits] = useState(buildInitialSplits);

    // Applies to
    const buildInitialAppliesTo = () => {
        const result = {};
        APPLIES_TO_OPTIONS.forEach(opt => {
            result[opt.id] = (initialData.appliesTo || []).includes(opt.id);
        });
        return result;
    };
    const [appliesTo, setAppliesTo] = useState(buildInitialAppliesTo);

    const handleSubmit = () => {
        const payload = {
            transactionType,
            feeType,
            percentageFee: Number(percentageFee) || 0,
            flatFee: Number(flatFee) || 0,
            userAccountType,
            appliesTo: Object.entries(appliesTo)
                .filter(([, checked]) => checked)
                .map(([key]) => key),
            commissionSplits: ROLES_OPTIONS.map(role => ({
                role: role.id,
                value: Number(commissionSplits[role.id].value) || 0,
                active: commissionSplits[role.id].enabled,
            })),
            active: true,
        };
        onSubmit && onSubmit(payload);
    };

    // Map backend values to option IDs for radio selection
    const userAccountOptionId = USER_ACCOUNT_OPTIONS.find(o => o.value === userAccountType)?.id || 'agent';
    const transactionOptionId = TRANSACTION_TYPE_OPTIONS.find(
        o => o.label === transactionType || o.id === transactionType.toLowerCase().replace(/\s+&\s+/g, '_')
    )?.id || 'softpos';
    const feeTypeOptionId = feeType === 'Flat' ? 'flat' : 'percentage';

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#1E1E1E]">{title}</h1>
                    <p className="text-[#808C91] mt-1">{subtitle}</p>
                </div>
                <Button
                    className="bg-[#FF5B04] hover:bg-[#E54F03] text-white h-12 px-8 rounded-lg font-semibold"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : submitLabel}
                </Button>
            </div>

            {/* User Account Section */}
            <div className="bg-white p-6 rounded-xl border border-[#EFF2F3]">
                <h3 className="text-sm font-semibold text-[#1E1E1E] mb-6">User Account</h3>
                <div className="flex flex-wrap gap-8">
                    {USER_ACCOUNT_OPTIONS.map((option) => (
                        <div key={option.id} className="flex items-center space-x-3 cursor-pointer" onClick={() => setUserAccountType(option.value)}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${userAccountOptionId === option.id ? 'border-[#FF5B04]' : 'border-[#D1D5DB]'}`}>
                                {userAccountOptionId === option.id && <div className="w-2.5 h-2.5 rounded-full bg-[#FF5B04]" />}
                            </div>
                            <Label className="text-sm font-medium text-[#505C61] cursor-pointer">
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transaction Type Section */}
            <div className="bg-white p-6 rounded-xl border border-[#EFF2F3]">
                <h3 className="text-sm font-semibold text-[#1E1E1E] mb-6">Select Transaction Type</h3>
                <div className="flex flex-wrap gap-8">
                    {TRANSACTION_TYPE_OPTIONS.map((option) => (
                        <div key={option.id} className="flex items-center space-x-3 cursor-pointer" onClick={() => setTransactionType(option.label)}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${transactionOptionId === option.id ? 'border-[#FF5B04]' : 'border-[#D1D5DB]'}`}>
                                {transactionOptionId === option.id && <div className="w-2.5 h-2.5 rounded-full bg-[#FF5B04]" />}
                            </div>
                            <Label className="text-sm font-medium text-[#505C61] cursor-pointer">
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fee Type Section */}
            <div className="bg-white p-6 rounded-xl border border-[#EFF2F3]">
                <h3 className="text-sm font-semibold text-[#1E1E1E] mb-6">Select Fee Type ( Customer Pays)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    {FEE_TYPE_OPTIONS.map((option) => (
                        <div key={option.id} className="flex items-center space-x-3 cursor-pointer" onClick={() => setFeeType(option.id === 'flat' ? 'Flat' : 'Percentage')}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${feeTypeOptionId === option.id ? 'border-[#FF5B04]' : 'border-[#D1D5DB]'}`}>
                                {feeTypeOptionId === option.id && <div className="w-2.5 h-2.5 rounded-full bg-[#FF5B04]" />}
                            </div>
                            <Label className="text-sm font-medium text-[#505C61] cursor-pointer">
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-xs text-[#808C91]">Percentage Fee</Label>
                        <Input
                            placeholder="Percentage Fee"
                            className="bg-[#F8FAFB] border-[#EFF2F3] h-12"
                            value={percentageFee}
                            onChange={(e) => setPercentageFee(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs text-[#808C91]">Flat Fee</Label>
                        <Input
                            placeholder="Flat Fee"
                            className="bg-[#F8FAFB] border-[#EFF2F3] h-12"
                            value={flatFee}
                            onChange={(e) => setFlatFee(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Commission Split Section */}
            <div className="bg-white p-6 rounded-xl border border-[#EFF2F3]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-semibold text-[#1E1E1E]">Set Commission Split</h3>
                    <div className="flex items-center space-x-2">
                        <Switch className="data-[state=checked]:bg-qreva-blue" />
                        <span className="text-xs font-medium text-[#808C91]">Roles</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <span className="text-xs font-medium text-[#808C91]">Roles</span>
                    <span className="text-xs font-medium text-[#808C91]">Commission</span>
                </div>

                <div className="space-y-4">
                    {ROLES_OPTIONS.map((role) => (
                        <div key={role.id} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="flex items-center space-x-4">
                                <Switch
                                    checked={commissionSplits[role.id]?.enabled}
                                    onCheckedChange={() => setCommissionSplits(prev => ({
                                        ...prev,
                                        [role.id]: { ...prev[role.id], enabled: !prev[role.id].enabled }
                                    }))}
                                    className="data-[state=checked]:bg-qreva-blue"
                                />
                                <div className="bg-[#F8FAFB] border border-[#EFF2F3] rounded-lg p-3 flex-1">
                                    <p className="text-[10px] text-[#808C91]">User Account</p>
                                    <p className="text-sm font-medium text-[#1E1E1E]">{role.label}</p>
                                </div>
                            </div>
                            <div className="bg-[#F8FAFB] border border-[#EFF2F3] rounded-lg p-3">
                                <p className="text-[10px] text-[#808C91]">Commission</p>
                                <Input
                                    placeholder="Commission"
                                    className="bg-transparent border-none p-0 h-auto focus-visible:ring-0 text-sm font-medium"
                                    value={commissionSplits[role.id]?.value || ''}
                                    onChange={(e) => setCommissionSplits(prev => ({
                                        ...prev,
                                        [role.id]: { ...prev[role.id], value: e.target.value }
                                    }))}
                                    disabled={!commissionSplits[role.id]?.enabled}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Applies To Section */}
            <div className="bg-white p-6 rounded-xl border border-[#EFF2F3]">
                <h3 className="text-sm font-semibold text-[#1E1E1E] mb-6">Applies To</h3>
                <div className="flex flex-wrap gap-x-8 gap-y-6">
                    {APPLIES_TO_OPTIONS.map((option) => (
                        <div key={option.id} className="flex items-center space-x-3">
                            <Checkbox
                                id={option.id}
                                checked={appliesTo[option.id] || false}
                                onCheckedChange={() => setAppliesTo(prev => ({ ...prev, [option.id]: !prev[option.id] }))}
                                className="w-5 h-5 border-[#D1D5DB] data-[state=checked]:bg-qreva-blue data-[state=checked]:border-qreva-blue"
                            />
                            <Label
                                htmlFor={option.id}
                                className="text-sm font-medium text-[#505C61] cursor-pointer"
                            >
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommissionForm;

