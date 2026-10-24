import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const resolveName = (c) =>
  c.name || c.clientName || c.fullName || c.userName || c.username ||
  c.agentName || c.customerName || c.accountName ||
  [c.firstName, c.lastName].filter(Boolean).join(' ') || '-';

const resolveAmount = (c) =>
  c.amount ?? c.totalAmount ?? c.totalVolume ?? c.transactionVolume ??
  c.transactionValue ?? c.volume ?? c.totalTransactions ?? 0;

const resolveSubtitle = (c) =>
  c.provider || c.agentCategory || c.category || c.tier ||
  c.role || c.accountType || null;

const resolveAvatar = (c) =>
  c.avatar || c.profileImage || c.image || c.profilePicture || null;

const CustomerRow = ({ customer: c, idx, getRankBadgeStyle }) => {
  const name = resolveName(c);
  const amount = resolveAmount(c);
  const subtitle = resolveSubtitle(c);
  const avatar = resolveAvatar(c);
  const initials = name !== '-' ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';

  return (
    <div className="flex items-center justify-between py-1 border border-[#E9F1F3] rounded-lg p-2 bg-[#FCFDFE]">
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-urbanist font-bold ${getRankBadgeStyle(idx)}`}>
          {c.rank || idx + 1}
        </div>
        <div className="w-6 h-6 bg-[#FFE8DC] rounded-full flex items-center justify-center overflow-hidden">
          {avatar
            ? <img src={avatar} alt={name} className="w-6 h-6 rounded-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
            : <span className="text-[8px] font-bold text-[#FF5B04]">{initials}</span>
          }
        </div>
        <div>
          <div className="text-sm font-general text-[#1E1E1E]">{name}</div>
          {subtitle && <div className="text-xs text-[#084059]">{subtitle}</div>}
        </div>
      </div>
      <div className="text-sm font-general font-semibold text-[#084059]">
        ₦{Number(amount).toLocaleString()}
      </div>
    </div>
  );
};

const TopCustomersCard = ({
  data = [],
  agentsData = [],
  title = "Top Customers",
  showAgentToggle = true,
}) => {
  const [selectedType, setSelectedType] = useState("personal"); // 'agents' or 'personal'

  const displayData = selectedType === "agents" ? agentsData : data;
  const displayTitle = showAgentToggle
    ? selectedType === "agents" ? "Top Performing Agents" : "Top Performing Customers"
    : title;

  // Handle empty data
  if (!displayData || displayData.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-urbanist font-semibold text-[#1E1E1E]">
              {displayTitle}
            </CardTitle>
            {showAgentToggle && (
              <div className="inline-flex rounded-lg bg-[#F5F6F7] p-1">
                <button
                  onClick={() => setSelectedType("agents")}
                  className={`px-3 py-1.5 text-xs font-general font-medium rounded-md transition-all duration-200 ${selectedType === "agents" ? "bg-white text-[#FF5B04] shadow-sm" : "text-[#084059] hover:text-[#1E1E1E]"}`}
                >
                  <span className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${selectedType === "agents" ? "bg-[#FF5B04]" : "bg-[#B0B7C3]"}`}></div>
                    Agents
                  </span>
                </button>
                <button
                  onClick={() => setSelectedType("personal")}
                  className={`px-3 py-1.5 text-xs font-general font-medium rounded-md transition-all duration-200 ${selectedType === "personal" ? "bg-white text-[#FF5B04] shadow-sm" : "text-[#084059] hover:text-[#1E1E1E]"}`}
                >
                  <span className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${selectedType === "personal" ? "bg-[#FF5B04]" : "bg-[#B0B7C3]"}`}></div>
                    Personal Accounts
                  </span>
                </button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-qreva-navy text-center py-4">
            No {selectedType === "agents" ? "agent" : "customer"} data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get rank badge styling
  const getRankBadgeStyle = (index) => {
    switch (index) {
      case 0: // 1st place - Gold
        return "bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-white shadow-md";
      case 1: // 2nd place - Silver
        return "bg-gradient-to-br from-[#C0C0C0] to-[#A8A8A8] text-white shadow-md";
      case 2: // 3rd place - Bronze
        return "bg-gradient-to-br from-[#CD7F32] to-[#B87333] text-white shadow-md";
      default: // Rest - Neutral
        return "bg-[#E8EBED] text-[#084059]";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-urbanist font-semibold text-[#1E1E1E]">
            {displayTitle}
          </CardTitle>
          {showAgentToggle && (
            <div className="inline-flex w-full rounded-lg bg-[#F5F6F7] p-1 sm:w-auto">
              <button
                onClick={() => setSelectedType("agents")}
                className={`flex-1 px-3 py-1.5 text-xs font-general font-medium rounded-md transition-all duration-200 sm:flex-none ${selectedType === "agents" ? "bg-white text-[#FF5B04] shadow-sm" : "text-[#084059] hover:text-[#1E1E1E]"}`}
              >
                <span className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${selectedType === "agents" ? "bg-[#FF5B04]" : "bg-[#B0B7C3]"}`}></div>
                  Agents
                </span>
              </button>
              <button
                onClick={() => setSelectedType("personal")}
                className={`flex-1 px-3 py-1.5 text-xs font-general font-medium rounded-md transition-all duration-200 sm:flex-none ${selectedType === "personal" ? "bg-white text-[#FF5B04] shadow-sm" : "text-[#084059] hover:text-[#1E1E1E]"}`}
              >
                <span className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${selectedType === "personal" ? "bg-[#FF5B04]" : "bg-[#B0B7C3]"}`}></div>
                  Personal Accounts
                </span>
              </button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`flex flex-col gap-3 ${displayData.length > 5 ? 'xl:flex-row xl:gap-x-8' : ''}`}>
          {/* First column: first 5 */}
          <div className="flex flex-col gap-y-2 flex-1">
            {displayData.slice(0, 5).map((customer, idx) => (
              <CustomerRow key={customer._id || customer.id || idx} customer={customer} idx={idx} getRankBadgeStyle={getRankBadgeStyle} />
            ))}
          </div>
          {/* Second column: rest */}
          {displayData.length > 5 && (
            <div className="flex flex-col gap-y-2 flex-1">
              {displayData.slice(5).map((customer, idx) => (
                <CustomerRow key={customer._id || customer.id || idx + 5} customer={customer} idx={idx + 5} getRankBadgeStyle={getRankBadgeStyle} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopCustomersCard;
