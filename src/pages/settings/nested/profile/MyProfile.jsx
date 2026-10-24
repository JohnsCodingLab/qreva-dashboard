import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Copy } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

const MyProfile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const { user } = useAuth();

    // Build profile from auth context + localStorage
    const userName = user?.username || localStorage.getItem('userName') || '';
    const userEmail = user?.email || localStorage.getItem('userEmail') || '';
    const userRole = user?.role || localStorage.getItem('userRole') || '';

    const nameParts = userName.split(' ');
    const firstName = nameParts[0] || '';
    const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold font-urbanist text-[#1E1E1E]">My Profile</h1>
                <p className="text-[#808C91] font-general mt-1">View all the full information about your profile</p>
            </div>

            {/* User Info Card */}
            <Card className="mb-8 bg-[#F8FAFC]/50 border-[#E8EBED]">
                <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-[#D1F1F5] flex items-center justify-center text-[#0FB5C9] text-xl font-bold font-urbanist">
                            {initials}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-xl font-bold font-urbanist text-[#1E1E1E]">{userName}</h2>
                            </div>
                            <p className="text-[#808C91] font-general">{userEmail}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="bg-[#F0F0F0] text-[#505C61] text-xs font-general px-3 py-1 rounded-full border border-[#E8EBED]">
                            {userRole}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <div className="border-b border-[#E8EBED] mb-8">
                <div className="flex gap-8">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`pb-3 text-sm font-medium font-general transition-colors relative ${activeTab === 'profile'
                                ? 'text-[#FF5B04] border-b-2 border-[#FF5B04]'
                                : 'text-[#808C91] hover:text-[#505C61]'
                            }`}
                    >
                        Profile Details
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <Card>
                <CardContent className="p-6 md:p-8">
                    <div className="space-y-8">
                        {/* Personal Details */}
                        <section>
                            <h3 className="font-bold font-urbanist text-[#1E1E1E] mb-6">Personal Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="text-xs text-[#808C91] font-general block mb-1">First Name</label>
                                    <p className="font-medium font-general text-[#1E1E1E]">{firstName || '-'}</p>
                                </div>
                                {middleName && (
                                    <div>
                                        <label className="text-xs text-[#808C91] font-general block mb-1">Middle Name</label>
                                        <p className="font-medium font-general text-[#1E1E1E]">{middleName}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-xs text-[#808C91] font-general block mb-1">Last Name</label>
                                    <p className="font-medium font-general text-[#1E1E1E]">{lastName || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-[#808C91] font-general block mb-1">Email Address</label>
                                    <p className="font-medium font-general text-[#1E1E1E]">{userEmail || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-[#808C91] font-general block mb-1">Role</label>
                                    <p className="font-medium font-general text-[#1E1E1E]">{userRole || '-'}</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MyProfile;

