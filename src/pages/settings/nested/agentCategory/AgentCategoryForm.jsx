import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

// A reusable Radio component with green styling
const GreenRadio = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer" onClick={onChange}>
    <div
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${checked ? "border-qreva-blue" : "border-gray-300"}`}
    >
      {checked && <div className="w-2.5 h-2.5 rounded-full bg-qreva-blue" />}
    </div>
    <span className="text-sm font-medium text-[#1E1E1E]">{label}</span>
  </label>
);

// A reusable green Checkbox
const GreenCheckbox = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer" onClick={onChange}>
    <div
      className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${checked ? "bg-qreva-blue" : "border-2 border-gray-300 bg-white"}`}
    >
      {checked && <Check className="w-3.5 h-3.5 text-white" />}
    </div>
    <span className="text-sm font-medium text-[#1E1E1E]">{label}</span>
  </label>
);

const COMMISSION_ROLES = [
  { key: "Agent", label: "Agent" },
  { key: "Aggregator", label: "Aggregators" },
  { key: "Aggregator Manager", label: "Aggregator Manager" },
  { key: "Admin", label: "Admin" },
];

const APPLIES_TO_OPTIONS = [
  { key: "All Agents", label: "All Agents" },
  { key: "Aggregators", label: "Aggregators" },
  { key: "Aggregator Manager", label: "Aggregator Manager" },
];

const AgentCategoryForm = ({
  initialData = {},
  onSubmit,
  submitLabel = "Create Category",
  isSubmitting = false,
}) => {
  const [userAccountType, setUserAccountType] = useState(
    initialData.userAccountType || "PersonalAccount",
  );
  const [categoryName, setCategoryName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [monthlyVolume, setMonthlyVolume] = useState(
    initialData.monthlyTransactionVolume != null
      ? String(initialData.monthlyTransactionVolume)
      : "",
  );
  const [dailyCount, setDailyCount] = useState(
    initialData.dailyTransactionCount != null
      ? String(initialData.dailyTransactionCount)
      : "",
  );
  const [commissionType, setCommissionType] = useState(
    initialData.commissionType || "Percentage",
  );

  // Build initial commission splits state from API data
  const buildInitialSplits = () => {
    const splits = {};
    COMMISSION_ROLES.forEach((role) => {
      const existing = (initialData.commissionSplits || []).find(
        (s) => s.role === role.key,
      );
      splits[role.key] = {
        enabled: existing ? existing.active : true,
        value: existing ? String(existing.value) : "",
      };
    });
    return splits;
  };

  const [commissionRoles, setCommissionRoles] = useState(buildInitialSplits);

  // Build initial appliesTo state from API data
  const buildInitialAppliesTo = () => {
    const result = {};
    APPLIES_TO_OPTIONS.forEach((opt) => {
      result[opt.key] = (initialData.appliesTo || []).includes(opt.key);
    });
    return result;
  };

  const [appliesTo, setAppliesTo] = useState(buildInitialAppliesTo);

  const toggleRole = (key) => {
    setCommissionRoles((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  };

  const updateCommission = (key, value) => {
    setCommissionRoles((prev) => ({
      ...prev,
      [key]: { ...prev[key], value },
    }));
  };

  const handleSubmit = () => {
    const payload = {
      name: categoryName,
      description,
      active: true,
      userAccountType,
      monthlyTransactionVolume:
        Number(monthlyVolume.replace(/[^0-9]/g, "")) || 0,
      dailyTransactionCount: Number(dailyCount.replace(/[^0-9]/g, "")) || 0,
      commissionType,
      appliesTo: Object.entries(appliesTo)
        .filter(([, checked]) => checked)
        .map(([key]) => key),
      commissionSplits: COMMISSION_ROLES.map((role) => ({
        role: role.key,
        value:
          Number(commissionRoles[role.key].value.replace(/[^0-9.]/g, "")) || 0,
        active: commissionRoles[role.key].enabled,
      })),
    };
    onSubmit && onSubmit(payload);
  };

  return (
    <div className="space-y-6">
      {/* Submit button at top */}
      <div className="flex justify-end">
        <Button
          className="bg-[#FF5B04] hover:bg-[#E54F03] text-white"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>

      {/* User Account */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold text-[#1E1E1E] mb-6">User Account</h3>
          <div className="flex gap-8">
            <GreenRadio
              checked={userAccountType === "PersonalAccount"}
              onChange={() => setUserAccountType("PersonalAccount")}
              label="Agents/Merchants"
            />
            {/* <GreenRadio
                            checked={userAccountType === 'Agent'}
                            onChange={() => setUserAccountType('Agent')}
                            label="Agents/Merchants"
                        /> */}
          </div>
        </CardContent>
      </Card>

      {/* Basic Details */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold text-[#1E1E1E] mb-6">Basic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-[#808C91] mb-1 block">
                Category Name
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category Name"
                className="w-full px-4 py-3 border border-[#E8EBED] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5B04]"
              />
            </div>
            <div>
              <label className="text-xs text-[#808C91] mb-1 block">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (Optional)"
                className="w-full px-4 py-3 border border-[#E8EBED] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5B04]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold text-[#1E1E1E] mb-6">Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-[#808C91] mb-1 block">
                Monthly Transaction Volume (N)
              </label>
              <input
                type="text"
                value={monthlyVolume}
                onChange={(e) => setMonthlyVolume(e.target.value)}
                placeholder="e.g. 10,000,000"
                className="w-full px-4 py-3 border border-[#E8EBED] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5B04]"
              />
            </div>
            <div>
              <label className="text-xs text-[#808C91] mb-1 block">
                Daily Transaction Counts
              </label>
              <input
                type="text"
                value={dailyCount}
                onChange={(e) => setDailyCount(e.target.value)}
                placeholder="e.g. 20"
                className="w-full px-4 py-3 border border-[#E8EBED] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5B04]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commission Split */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#1E1E1E]">Set Commission Split</h3>
            <div className="flex gap-6">
              <GreenRadio
                checked={commissionType === "Flat"}
                onChange={() => setCommissionType("Flat")}
                label="Flat Commission"
              />
              <GreenRadio
                checked={commissionType === "Percentage"}
                onChange={() => setCommissionType("Percentage")}
                label="Percentage Commission"
              />
            </div>
          </div>

          {/* Header row */}
          <div className="grid grid-cols-12 gap-4 px-4 mb-2">
            <div className="col-span-1" />
            <div className="col-span-5">
              <p className="text-xs text-[#808C91] font-medium">Roles</p>
            </div>
            <div className="col-span-6">
              <p className="text-xs text-[#808C91] font-medium">Commission</p>
            </div>
          </div>

          <div className="space-y-3">
            {COMMISSION_ROLES.map((role) => (
              <div
                key={role.key}
                className="grid grid-cols-12 gap-4 items-center bg-[#F8FAFC] p-4 rounded-lg"
              >
                <div className="col-span-1">
                  <Switch
                    checked={commissionRoles[role.key].enabled}
                    onCheckedChange={() => toggleRole(role.key)}
                    className="data-[state=checked]:bg-qreva-blue"
                  />
                </div>
                <div className="col-span-5">
                  <p className="text-xs text-[#808C91] mb-1">User Account</p>
                  <p className="font-medium text-sm text-[#1E1E1E]">
                    {role.label}
                  </p>
                </div>
                <div className="col-span-6">
                  <p className="text-xs text-[#808C91] mb-1">Commission</p>
                  <input
                    type="text"
                    value={commissionRoles[role.key].value}
                    onChange={(e) => updateCommission(role.key, e.target.value)}
                    disabled={!commissionRoles[role.key].enabled}
                    className="font-medium text-sm text-[#1E1E1E] bg-transparent focus:outline-none focus:border-b focus:border-[#FF5B04] w-32 disabled:opacity-40"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Applies To */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold text-[#1E1E1E] mb-6">Applies To</h3>
          <div className="flex gap-8 flex-wrap">
            {APPLIES_TO_OPTIONS.map((opt) => (
              <GreenCheckbox
                key={opt.key}
                checked={appliesTo[opt.key] || false}
                onChange={() =>
                  setAppliesTo((p) => ({ ...p, [opt.key]: !p[opt.key] }))
                }
                label={opt.label}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { GreenRadio, GreenCheckbox };
export default AgentCategoryForm;

