import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PERMISSIONS_CATEGORIES } from './constants';

const RoleForm = ({ initialData = {}, readOnly = false, onCollectData }) => {
    const [roleName, setRoleName] = useState(initialData.roleName || initialData.name || '');
    const [description, setDescription] = useState(initialData.description || '');

    // Build initial permissions from API data (object of permission keys -> booleans)
    const apiPermissions = initialData.permissions || {};

    // Permission state: { [categoryIdx]: { master: bool, items: [bool, bool, ...] } }
    const [permissions, setPermissions] = useState(() =>
        PERMISSIONS_CATEGORIES.map((cat) => {
            const itemStates = cat.items.map((item) => {
                const permKey = `${cat.title}:${item.label}`;
                return apiPermissions[permKey] ?? (initialData.active ?? true);
            });
            return {
                master: itemStates.every(Boolean),
                items: itemStates,
            };
        })
    );

    // Collapsed state per category
    const [collapsed, setCollapsed] = useState(() =>
        PERMISSIONS_CATEGORIES.map(() => false)
    );

    const toggleMaster = (catIdx) => {
        if (readOnly) return;
        setPermissions(prev => {
            const newPerms = [...prev];
            const newMaster = !newPerms[catIdx].master;
            newPerms[catIdx] = {
                master: newMaster,
                items: newPerms[catIdx].items.map(() => newMaster),
            };
            return newPerms;
        });
    };

    const toggleItem = (catIdx, itemIdx) => {
        if (readOnly) return;
        setPermissions(prev => {
            const newPerms = [...prev];
            const newItems = [...newPerms[catIdx].items];
            newItems[itemIdx] = !newItems[itemIdx];
            newPerms[catIdx] = {
                ...newPerms[catIdx],
                items: newItems,
                master: newItems.every(Boolean),
            };
            return newPerms;
        });
    };

    const toggleCollapse = (catIdx) => {
        setCollapsed(prev => {
            const next = [...prev];
            next[catIdx] = !next[catIdx];
            return next;
        });
    };

    // Build permissions object for API payload
    const buildPermissionsPayload = () => {
        const result = {};
        PERMISSIONS_CATEGORIES.forEach((cat, catIdx) => {
            cat.items.forEach((item, itemIdx) => {
                const permKey = `${cat.title}:${item.label}`;
                result[permKey] = permissions[catIdx].items[itemIdx];
            });
        });
        return result;
    };

    // Expose data collection to parent via ref-like callback
    if (onCollectData) {
        onCollectData(() => ({
            roleName,
            description,
            permissions: buildPermissionsPayload(),
            active: true,
        }));
    }

    return (
        <div className="space-y-6">
            {/* Basic Details */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="font-bold text-[#1E1E1E] mb-6">Basic Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs text-[#808C91] mb-1 block">Role Name</label>
                            <input
                                type="text"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                placeholder="Role Name"
                                readOnly={readOnly}
                                className={`w-full px-4 py-3 border border-[#E8EBED] rounded-lg text-sm focus:outline-none ${readOnly ? 'bg-[#F8FAFC] text-[#1E1E1E] cursor-default' : 'focus:ring-1 focus:ring-[#FF5B04]'}`}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-[#808C91] mb-1 block">Description (Optional)</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description (Optional)"
                                readOnly={readOnly}
                                className={`w-full px-4 py-3 border border-[#E8EBED] rounded-lg text-sm focus:outline-none ${readOnly ? 'bg-[#F8FAFC] text-[#1E1E1E] cursor-default' : 'focus:ring-1 focus:ring-[#FF5B04]'}`}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Permissions */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="font-bold text-[#1E1E1E] mb-6">Permissions</h3>
                    <div className="space-y-0">
                        {PERMISSIONS_CATEGORIES.map((category, catIdx) => (
                            <div key={catIdx} className="border-b border-[#F0F0F0] last:border-0">
                                {/* Category header row */}
                                <div className="flex items-center justify-between py-4">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center flex-1 mr-4">
                                        <div className="font-medium text-sm text-[#1E1E1E]">
                                            {category.title}
                                        </div>
                                        {!collapsed[catIdx] && (
                                            <div className="col-span-3 flex flex-wrap gap-6">
                                                {category.items.map((item, itemIdx) => (
                                                    <div key={itemIdx} className="flex items-center gap-3">
                                                        <Switch
                                                            checked={permissions[catIdx].items[itemIdx]}
                                                            onCheckedChange={() => toggleItem(catIdx, itemIdx)}
                                                            disabled={readOnly}
                                                            className="data-[state=checked]:bg-qreva-blue"
                                                        />
                                                        <span className="text-xs text-[#505C61]">{item.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <Switch
                                            checked={permissions[catIdx].master}
                                            onCheckedChange={() => toggleMaster(catIdx)}
                                            disabled={readOnly}
                                            className="data-[state=checked]:bg-qreva-blue"
                                        />
                                        <button
                                            onClick={() => toggleCollapse(catIdx)}
                                            className="p-1 hover:bg-qreva-ash rounded transition-colors"
                                        >
                                            {collapsed[catIdx]
                                                ? <ChevronDown size={16} className="text-[#808C91]" />
                                                : <ChevronUp size={16} className="text-[#808C91]" />
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RoleForm;

