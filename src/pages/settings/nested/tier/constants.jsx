import { Eye, Edit, Trash } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export const TIERS_DATA = [
  {
    id: 1,
    name: "Tier 1",
    requirements: "Personal Details, NIN/BVN",
    dailyLimit: "50,000",
    singleLimit: "50,000",
    balanceLimit: "300,000",
    active: true,
  },
  {
    id: 2,
    name: "Tier 2",
    requirements: "NIN, BVN, Upload NIN Photo",
    dailyLimit: "200,000",
    singleLimit: "50,000",
    balanceLimit: "500,000",
    active: true,
  },
  {
    id: 3,
    name: "Tier 3",
    requirements: "Face Recognition, Proof of Address",
    dailyLimit: "5,000,000",
    singleLimit: "1,000,000",
    balanceLimit: "Unlimited",
    active: false,
  },
];

export const TIER_COLUMNS = [
  {
    field: "name",
    headerName: "Tier Name",
    width: 150,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm font-medium text-[#1E1E1E] flex items-center h-full">
        {params.row.tierName || params.tierDescription}
      </span>
    ),
  },
  {
    field: "requirements",
    headerName: "Requirements",
    width: 250,
    flex: 2,
    renderCell: (params) => (
      <span className="text-sm text-[#505C61] flex items-center h-full">
        {params.value?.join(", ")}
      </span>
    ),
  },
  {
    field: "dailyLimit",
    headerName: "Daily Limit (N)",
    width: 150,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm font-medium text-[#1E1E1E] flex items-center h-full">
        {params.row.dailyTransactionLimit}
      </span>
    ),
  },
  {
    field: "singleLimit",
    headerName: "Single Trans. Limit (N)",
    width: 180,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm font-medium text-[#1E1E1E] flex items-center h-full">
        {params.row.singleTransactionLimit}
      </span>
    ),
  },
  {
    field: "balanceLimit",
    headerName: "Balance Limit (N)",
    width: 150,
    flex: 1,
    renderCell: (params) => (
      <span className="text-sm font-medium text-[#1E1E1E] flex items-center h-full">
        {params.value}
      </span>
    ),
  },
  {
    field: "active",
    headerName: "Active Status",
    width: 120,
    flex: 0.8,
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

export const REQUIRED_DOCUMENTS = [
  { id: "personal", label: "Personal Details" },
  { id: "bvn", label: "BVN" },
  { id: "nin", label: "NIN" },
  { id: "nin_bvn", label: "NIN/BVN" },
  { id: "upload_nin", label: "Upload NIN Photo" },
  { id: "face", label: "Face Recognition" },
  { id: "proof", label: "Proof of Address" },
  { id: "cac", label: "CAC Incorporation Certificate" },
  { id: "cac2", label: "CAC 2 (Board of Directors)" },
];

export const TIER_ACTIONS = [
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
  {
    label: "Delete Tier",
    icon: Trash,
    onClick: (row) => console.log("Delete:", row),
  },
];

