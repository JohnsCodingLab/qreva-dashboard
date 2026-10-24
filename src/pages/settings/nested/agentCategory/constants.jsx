import { Eye, Edit } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export const AGENT_CATEGORIES_DATA = [
  {
    id: 1,
    name: "Starter",
    volume: "New Sign Up",
    count: "New Sign up",
    appliesTo: "Agents, Aggregat... etc",
    updated: "10:00 AM | 25th March, 2025",
    active: true,
    commissionType: "Flat Commission",
    agentCommission: "0%",
    aggregatorCommission: "0%",
    aggManagerCommission: "0%",
    adminCommission: "0%",
    userAccount: "Agents/Merchants",
    description: "",
    appliesToAll: true,
    appliesToAggregators: true,
    appliesToAggManager: true,
  },
  {
    id: 2,
    name: "Bronze",
    volume: "5,000,000",
    count: "10",
    appliesTo: "Agents, Aggregat... etc",
    updated: "10:00 AM | 25th March, 2025",
    active: true,
    commissionType: "Percentage Commission",
    agentCommission: "0.6%",
    aggregatorCommission: "10%",
    aggManagerCommission: "10%",
    adminCommission: "10%",
    userAccount: "Agents/Merchants",
    description: "",
    appliesToAll: true,
    appliesToAggregators: true,
    appliesToAggManager: true,
  },
  {
    id: 3,
    name: "Silver",
    volume: "7,000,000",
    count: "15",
    appliesTo: "Agents, Aggregat... etc",
    updated: "10:00 AM | 25th March, 2025",
    active: true,
    commissionType: "Percentage Commission",
    agentCommission: "0.6%",
    aggregatorCommission: "10%",
    aggManagerCommission: "10%",
    adminCommission: "10%",
    userAccount: "Agents/Merchants",
    description: "",
    appliesToAll: true,
    appliesToAggregators: true,
    appliesToAggManager: true,
  },
  {
    id: 4,
    name: "Gold",
    volume: "10,000,000",
    count: "20",
    appliesTo: "Agents, Aggregat... etc",
    updated: "10:00 AM | 25th March, 2025",
    active: true,
    commissionType: "Percentage Commission",
    agentCommission: "0.6%",
    aggregatorCommission: "10%",
    aggManagerCommission: "10%",
    adminCommission: "10%",
    userAccount: "Agents/Merchants",
    description: "",
    appliesToAll: true,
    appliesToAggregators: true,
    appliesToAggManager: true,
  },
];

export const AGENT_CATEGORY_COLUMNS = [
  {
    field: "name",
    headerName: "Category Name",
    width: 150,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm font-medium text-[#1E1E1E] flex items-center h-full">
        {params.value}
      </span>
    ),
  },
  {
    field: "volume",
    headerName: "Monthly Trans. Volume (N)",
    width: 180,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">
        {params.row.monthlyTransactionVolume}
      </span>
    ),
  },
  {
    field: "count",
    headerName: "Daily Transaction Counts",
    width: 180,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">
        {params.row.dailyTransactionCount}
      </span>
    ),
  },
  {
    field: "appliesTo",
    headerName: "Applies To",
    width: 200,
    flex: 1.5,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">
        {(params.row.appliesTo || []).join(", ") || '-'}
      </span>
    ),
  },
  {
    field: "updatedAt",
    headerName: "Last Updated",
    width: 200,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">
        {params.row.updatedAt
          ? new Date(params.row.updatedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
          : '-'}
      </span>
    ),
  },
  {
    field: "active",
    headerName: "Active Status",
    width: 120,
    flex: 1,
    renderCell: (params) => (
      <div className="flex items-center h-full">
        <Switch
          checked={params.value}
          className="data-[state=checked]:bg-qreva-blue"
        />
      </div>
    ),
  },
];

export const AGENT_CATEGORY_ACTIONS = [
  {
    label: "View Details",
    icon: Eye,
    onClick: (row) => console.log("View:", row),
  },
  {
    label: "Edit Details",
    icon: Edit,
    onClick: (row) => console.log("Edit:", row),
  },
];

