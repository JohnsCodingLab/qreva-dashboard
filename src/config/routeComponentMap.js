import RegionalManagerProfile from "@/pages/regionalManagers/RegionalManagerProfile";
import StateManagerProfile from "@/pages/stateManagers/StateManagerProfile";
// ===== Import All Page Components Here =====
import DashboardContent from "@/pages/dashboard/DashboardContent";
import AirtimePurchase from "@/pages/airtimePurchase/AirtimePurchase";
import DataPurchase from "@/pages/dataPurchase/DataPurchase";
import KYCVerification from "@/pages/kycVerification/KYCVerification";
import BillsPayment from "@/pages/billsPayment/BillsPayment";
import SoftPOS from "@/pages/softPOS/SoftPOS";
import Transfers from "@/pages/transfers/Tranfers";
import TransactionInsightsPage from "@/pages/insights/TransactionInsightsPage";

import Users from "@/pages/users/Users";
import Agents from "@/pages/agents/Agents";
import Merchants from "@/pages/merchants/Merchants";
import Aggregators from "@/pages/aggregator/Aggregators";
import AggregatorManagers from "@/pages/aggregatorManager/AggregatorManager";
import MyEarnings from "@/pages/myearnings/MyEarnings";
import PosManagement from "@/pages/posManagement/PosManagement";
import PosRequests from "@/pages/posRequests/PosRequests";
import AccountApprovals from "@/pages/accountApprovals/AccountApprovals";
import BusinessAccountApprovals from "@/pages/businessAccountApprovals/BusinessAccountApprovals";
import DisputedTransactions from "@/pages/disputedTransactions/DisputedTransactions";
import Request from "@/pages/request/Request";
import Settings from "@/pages/settings/Settings";
import Balances from "@/pages/balances/Balances";
import Promotions from "@/pages/promotions/Promotions";
import Affiliates from "@/pages/affiliates/Affiliates";

// Smart Savings
import SmartSavingsOverview from "@/pages/smartSavings/SmartSavingsOverview";
import SmartSavingsMembers from "@/pages/smartSavings/SmartSavingsMembers";
import SmartSavingsMarketers from "@/pages/smartSavings/SmartSavingsMarketers";
import SmartSavingsEntries from "@/pages/smartSavings/SmartSavingsEntries";
import SmartSavingsWithdrawals from "@/pages/smartSavings/SmartSavingsWithdrawals";
import SmartSavingsPlanner from "@/pages/smartSavings/SmartSavingsPlanner";
import SmartSavingsSettings from "@/pages/smartSavings/SmartSavingsSettings";

// Settings
import MyProfile from "@/pages/settings/nested/profile/MyProfile";
import RBAC from "@/pages/settings/nested/rbac/RBAC";
import AgentCategory from "@/pages/settings/nested/agentCategory/AgentCategory";
import CreateAgentCategory from "@/pages/settings/nested/agentCategory/CreateAgentCategory";
import EditAgentCategory from "@/pages/settings/nested/agentCategory/EditAgentCategory";
import ViewAgentCategoryDetails from "@/pages/settings/nested/agentCategory/ViewAgentCategoryDetails";
import ActivityLogs from "@/pages/settings/nested/activityLogs/ActivityLogs";
import TierManagement from "@/pages/settings/nested/tier/TierManagement";
import EditTier from "@/pages/settings/nested/tier/EditTier";
import CommissionManagement from "@/pages/settings/nested/commissionManagement/CommissionManagement";
import Contracts from "@/pages/settings/nested/contracts/Contracts";
import PartnerApi from "@/pages/settings/nested/partnerApi/PartnerApi";
import TwoFactorSetup from "@/pages/settings/nested/twoFactor/TwoFactorSetup";
import CreateCommission from "@/pages/settings/nested/commissionManagement/CreateCommission";
import EditCommission from "@/pages/settings/nested/commissionManagement/EditCommission";
import ViewCommissionDetails from "@/pages/settings/nested/commissionManagement/ViewCommissionDetails";
import DesignatedAccounts from "@/pages/settings/nested/designatedAccounts/DesignatedAccounts";

//Nested Details Pages
import DashboardRegionDetails from "@/pages/dashboard/nested/DashboardRegionDetails";
import AirtimeDetails from "@/pages/airtimePurchase/nested/AirTimeDetails";
import DataDetails from "@/pages/dataPurchase/nested/DataDetails";
import BillsDetails from "@/pages/billsPayment/nested/BillsDetails";
import TransferDetails from "@/pages/transfers/nested/TransferDetails";
import SoftPOSDetails from "@/pages/softPOS/nested/SoftPOSDetails";
import KYCDetails from "@/pages/kycVerification/nested/KYCDetails";
import UserProfileDetails from "@/pages/users/nested/UserProfileDetails";
import AgentProfileDetails from "@/pages/agents/nested/AgentProfileDetails";
import AggregatorProfileDetails from "@/pages/aggregator/nested/AggregatorProfileDetails";
import AggregatorManagerProfileDetails from "@/pages/aggregatorManager/nested/AggregatorManagerProfileDetails";
import AccountApprovalDetails from "@/pages/accountApprovals/nested/AccountApprovalDetails";
import BusinessAccountApprovalDetails from "@/pages/businessAccountApprovals/nested/BusinessAccountApprovalDetails";
import DisputedTransactionDetails from "@/pages/disputedTransactions/DisputedTransactionDetails";
import Partners from '../pages/partners/Partners';
import PartnerDetails from '../pages/partners/PartnerDetails';
import PartnerVerifications from '../pages/partners/PartnerVerifications';

// Fraud detection admin surface
import FraudRules from '../pages/fraud/rules/FraudRules';
import FraudScoreBands from '../pages/fraud/scoreBands/FraudScoreBands';
import FraudAuditLog from '../pages/fraud/auditLog/FraudAuditLog';
import FraudReviewQueue from '../pages/fraud/reviewQueue/FraudReviewQueue';
import FraudBlacklist from '../pages/fraud/blacklist/FraudBlacklist';
import FraudRings from '../pages/fraud/rings/FraudRings';
import LoginSessions from '../pages/security/loginSessions/LoginSessions';
import VerificationAttempts from '../pages/security/verificationAttempts/VerificationAttempts';
import Investigations from '../pages/security/investigations/Investigations';
import RegionalManagers from "@/pages/regionalManagers/RegionalManagers";
import StateManagers from "@/pages/stateManagers/StateManagers";

// Disputed Transactions

// ===== Component Mapper by ROUTES Key =====
export const RouteComponentMap = {
  DASHBOARD: DashboardContent,
  BALANCES: Balances,
  PROMOTIONS: Promotions,
  AFFILIATES: Affiliates,
  SMART_SAVINGS: SmartSavingsOverview,
  SMART_SAVINGS_MEMBERS: SmartSavingsMembers,
  SMART_SAVINGS_MARKETERS: SmartSavingsMarketers,
  SMART_SAVINGS_ENTRIES: SmartSavingsEntries,
  SMART_SAVINGS_WITHDRAWALS: SmartSavingsWithdrawals,
  SMART_SAVINGS_PLANNER: SmartSavingsPlanner,
  SMART_SAVINGS_SETTINGS: SmartSavingsSettings,
  PARTNERS: Partners,
  PARTNER_DETAILS: PartnerDetails,
  PARTNER_VERIFICATIONS: PartnerVerifications,
  INSIGHTS: TransactionInsightsPage,
  AIRTIME: AirtimePurchase,
  DATA: DataPurchase,
  KYC: KYCVerification,
  BILLS: BillsPayment,
  SOFTPOS: SoftPOS,
  POS_MANAGEMENT: PosManagement,
  POS_REQUESTS: PosRequests,
  TRANSFERS: Transfers,
  OUTWARD_TRANSFERS: Transfers,
  INWARD_TRANSFERS: Transfers,
  USERS: Users,
  AGENTS: Agents,
  MERCHANTS: Merchants,
  AGGREGATOR: Aggregators,
  AGGREGATOR_MANAGER: AggregatorManagers,
  REGIONAL_MANAGER_PROFILE: RegionalManagerProfile,
  REGIONAL_MANAGER: RegionalManagers,
  STATE_MANAGER_PROFILE: StateManagerProfile,
  STATE_MANAGER: StateManagers,
  EARNINGS: MyEarnings,
  ACCOUNTS_APPROVALS: AccountApprovals,
  BUSINESS_ACCOUNT_APPROVALS: BusinessAccountApprovals,
  DISPUTED_TRANSACTIONS: DisputedTransactions,
  REQUEST: Request,
  SETTINGS: Settings,

  // Fraud detection
  FRAUD_RULES: FraudRules,
  FRAUD_SCORE_BANDS: FraudScoreBands,
  FRAUD_AUDIT_LOG: FraudAuditLog,
  FRAUD_REVIEW_QUEUE: FraudReviewQueue,
  FRAUD_BLACKLIST: FraudBlacklist,
  FRAUD_RINGS: FraudRings,

  // Security
  LOGIN_SESSIONS: LoginSessions,
  VERIFICATION_ATTEMPTS: VerificationAttempts,
  USERS_UNDER_INVESTIGATION: Investigations,

  // Nested Details Pages
  DASHBOARD_DETAILS: DashboardRegionDetails,
  AIRTIME_DETAILS: AirtimeDetails,
  DATA_DETAILS: DataDetails,
  BILLS_DETAILS: BillsDetails,
  TRANSFER_DETAILS: TransferDetails,
  OUTWARD_TRANSFER_DETAILS: TransferDetails,
  INWARD_TRANSFER_DETAILS: TransferDetails,
  SOFTPOS_DETAILS: SoftPOSDetails,
  KYC_DETAILS: KYCDetails,
  USER_DETAILS: UserProfileDetails,
  AGENT_DETAILS: AgentProfileDetails,
  AGGREGATOR_DETAILS: AggregatorProfileDetails,
  AGGREGATOR_MANAGER_DETAILS: AggregatorManagerProfileDetails,
  ACCOUNTS_APPROVALS_DETAILS: AccountApprovalDetails,
  BUSINESS_ACCOUNT_APPROVALS_DETAILS: BusinessAccountApprovalDetails,
  DISPUTED_TRANSACTIONS_DETAILS: DisputedTransactionDetails,

  // Settings
  SETTINGS_PROFILE: MyProfile,
  SETTINGS_RBAC: RBAC,
  SETTINGS_CREATE_ROLE: RBAC,
  SETTINGS_EDIT_ROLE: RBAC,
  SETTINGS_VIEW_ROLE: RBAC,
  SETTINGS_AGENT_CATEGORY: AgentCategory,
  SETTINGS_CREATE_AGENT_CATEGORY: CreateAgentCategory,
  SETTINGS_EDIT_AGENT_CATEGORY: EditAgentCategory,
  SETTINGS_VIEW_AGENT_CATEGORY: ViewAgentCategoryDetails,
  SETTINGS_ACTIVITY_LOGS: ActivityLogs,
  SETTINGS_TIER: TierManagement,
  SETTINGS_EDIT_TIER: EditTier,
  SETTINGS_COMMISSION: CommissionManagement,
  SETTINGS_CONTRACT: Contracts,
  SETTINGS_PARTNER_API: PartnerApi,
  SETTINGS_2FA: TwoFactorSetup,
  SETTINGS_DESIGNATED_ACCOUNTS: DesignatedAccounts,
  SETTINGS_CREATE_COMMISSION: CreateCommission,
  SETTINGS_EDIT_COMMISSION: EditCommission,
  SETTINGS_VIEW_COMMISSION: ViewCommissionDetails,
};
