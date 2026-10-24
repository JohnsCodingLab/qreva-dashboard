
export const ROUTES = {
  // Main routes
  DASHBOARD: {
    path: '/dashboard',
    label: 'Dashboard',
    parent: null,
    icon: 'dashboard',
    permission: 'dashboard:view',
  },
  BALANCES: {
    path: '/balances',
    label: 'Balances',
    parent: null,
    icon: 'balances',
    permission: 'balances:view',
  },

  // Partners, promoted out of Settings. Managing the businesses on the platform
  // is its own job, done by different people from the ones configuring pricing
  // and service providers - which is why those stay where they are.
  PARTNERS: {
    path: '/partners',
    label: 'Partners',
    parent: null,
    icon: 'users',
    permission: 'partnerApi.billing.view',
  },
  PARTNER_DETAILS: {
    path: '/partners/:partnerId',
    label: 'Partner',
    parent: 'PARTNERS',
    // Reached from the list rather than the sidebar, so it is deliberately not
    // in the navigation registry below.
    hidden: true,
    permission: 'partnerApi.billing.view',
  },
  PARTNER_VERIFICATIONS: {
    path: '/partners/verifications',
    label: 'Verifications',
    parent: null,
    icon: 'kyc',
    permission: 'partnerApi.billing.view',
  },


  // Transaction routes
  INSIGHTS: {
    path: '/insights',
    label: 'Insights & Analytics',
    icon: 'dashboard',
    permission: 'dashboard:view',
  },
  AIRTIME: {
    path: '/airtime',
    label: 'Airtime Purchase',
    icon: 'airtime',
    permission: 'airtime:view',
  },
  DATA: {
    path: '/data',
    label: 'Data Purchase',
    icon: 'data',
    permission: 'data:view',
  },
  BILLS: {
    path: '/bills',
    label: 'Bills Payment',
    icon: 'bills',
    permission: 'bills:view',
  },
  REQUEST: {
    path: '/request',
    label: 'Request',
    icon: 'request',
    permission: 'request:view',
  },
  TRANSFERS: {
    path: '/transfers',
    label: 'Transfers',
    icon: 'transfers',
    permission: 'transfers:view',
  },
  OUTWARD_TRANSFERS: {
    path: '/transfers/outward',
    label: 'Outward Transfer',
    icon: 'transfers',
    permission: 'transfers:view',
  },
  INWARD_TRANSFERS: {
    path: '/transfers/inward',
    label: 'Inward Transfer',
    icon: 'transfers',
    permission: 'transfers:view',
  },
  POS_MANAGEMENT: {
    path: '/pos-management',
    label: 'Hardware POS',
    icon: 'pos',
    permission: 'softpos:view',
  },
  POS_REQUESTS: {
    path: '/pos-requests',
    label: 'POS Requests',
    icon: 'pos',
    // approvals:view, not softpos:view. Every role carries softpos:view —
    // agents and merchants included — and this page assigns hardware and
    // triggers refunds. approvals:view is the same authority already used
    // for account approvals and stops at Operations, Support and the
    // state/super admins.
    permission: 'approvals:view',
  },
  SOFTPOS: {
    path: '/softpos',
    label: 'SoftPOS',
    icon: 'softpos',
    permission: 'softpos:view',
  },
  KYC: {
    path: '/kyc',
    label: 'KYC Verification',
    icon: 'kyc',
    permission: 'kyc:view',
  },
  EARNINGS: {
    path: '/earnings',
    label: 'My Earnings',
    icon: 'earnings',
    permission: 'earnings:view',
  },

  // Account routes
  USERS: {
    path: '/users',
    label: 'Users',
    icon: 'users',
    permission: 'users:view',
  },
  AGENTS: {
    path: '/agents',
    label: 'Agents',
    icon: 'agents',
    permission: 'agents:view',
  },
  MERCHANTS: {
    path: '/merchants',
    label: 'Merchants',
    icon: 'users',
    permission: 'users:view',
  },
  AGGREGATOR: {
    path: '/aggregators',
    label: 'Aggregators',
    icon: 'aggregator',
    permission: 'aggregator:view',
  },
  AGGREGATOR_MANAGER: {
    path: '/aggregator-manager',
    label: 'Aggregator Managers',
    icon: 'aggregatorManager',
    permission: 'aggManager:view',
  },
  REGIONAL_MANAGER_PROFILE: {
    path: '/regional-manager/:id',
    label: 'Regional Manager Profile',
    parent: null,
    permission: 'regionalManager:view',
    dynamic: true,
  },
  REGIONAL_MANAGER: {
    path: '/regional-manager',
    label: 'Regional Managers',
    icon: 'aggregatorManager',
    permission: 'regionalManager:view',
  },
  STATE_MANAGER_PROFILE: {
    path: '/state-manager/:id',
    label: 'State Manager Profile',
    parent: null,
    permission: 'stateManager:view',
    dynamic: true,
  },
  STATE_MANAGER: {
    path: '/state-manager',
    label: 'State Managers',
    icon: 'aggregatorManager',
    permission: 'stateManager:view',
  },

  // Approval routes
  ACCOUNTS_APPROVALS: {
    path: '/account-approvals',
    label: 'Account Approvals',
    icon: 'accountsApprovals',
    permission: 'approvals:view',
  },
  BUSINESS_ACCOUNT_APPROVALS: {
    path: '/business-account-approvals',
    label: 'Business Account Approvals',
    icon: 'accountsApprovals',
    permission: 'approvals:view',
  },

   DISPUTED_TRANSACTIONS: {
    path: '/disputed-transactions',
    label: 'Disputed Transactions',
    parent: null,
    icon: 'disputed',
    permission: 'disputes:view',
    dynamic: true,
  },

  // People recruited to bring personal customers in. Beside Promotions
  // rather than under Accounts: both are growth levers an admin runs, and
  // neither is an account you administer.
  AFFILIATES: {
    path: '/affiliates',
    label: 'Affiliates',
    parent: null,
    icon: 'affiliates',
    permission: 'affiliates.view',
  },
  // Sponsored banners on the mobile dashboard. Its own entry rather than a
  // Settings page: pausing a live advert is an operational act, and it should
  // not be three clicks deep behind configuration.
  PROMOTIONS: {
    path: '/promotions',
    label: 'Promotions',
    parent: null,
    icon: 'megaphone',
    permission: 'promotions.view',
  },
  // Qreva Smart Savings — the Empowerment Foundation's passbook scheme.
  // Its own section rather than a Settings page: the scheme has its own
  // members, its own field team and its own money, and an admin working a
  // withdrawal queue should not have to go through configuration to reach it.
  SMART_SAVINGS: {
    path: '/smart-savings',
    label: 'Overview',
    parent: null,
    icon: 'savings',
    permission: 'smartSavings.view',
  },
  SMART_SAVINGS_MEMBERS: {
    path: '/smart-savings/members',
    label: 'Members',
    parent: '/smart-savings',
    icon: 'savings',
    permission: 'smartSavings.view',
  },
  SMART_SAVINGS_MARKETERS: {
    path: '/smart-savings/marketers',
    label: 'Marketers',
    parent: '/smart-savings',
    icon: 'savings',
    permission: 'smartSavings.view',
  },
  SMART_SAVINGS_ENTRIES: {
    path: '/smart-savings/entries',
    label: 'Entries',
    parent: '/smart-savings',
    icon: 'savings',
    permission: 'smartSavings.view',
  },
  SMART_SAVINGS_WITHDRAWALS: {
    path: '/smart-savings/withdrawals',
    label: 'Withdrawals',
    parent: '/smart-savings',
    icon: 'savings',
    permission: 'smartSavings.view',
  },
  SMART_SAVINGS_PLANNER: {
    path: '/smart-savings/planner',
    label: 'Loan planner',
    parent: '/smart-savings',
    icon: 'savings',
    permission: 'smartSavings.loans.plan',
  },
  SMART_SAVINGS_SETTINGS: {
    path: '/smart-savings/settings',
    label: 'Scheme settings',
    parent: '/smart-savings',
    icon: 'savings',
    permission: 'smartSavings.view',
  },
  SETTINGS: {
    path: '/settings',
    label: 'Settings',
    icon: 'settings',
    permission: 'settings:view',
    parent: '/dashboard',
  },
  SETTINGS_PROFILE: {
    path: '/settings/profile',
    label: 'My Profile',
    icon: 'settings',
    permission: 'settings:view',
    parent: null
  },
  SETTINGS_RBAC: {
    path: '/settings/rbac',
    label: 'Admin Management',
    icon: 'settings',
    permission: 'admins:view',
    parent: null
  },
  SETTINGS_CREATE_ROLE: {
    path: '/settings/rbac/create',
    label: 'Add Admin',
    icon: 'settings',
    permission: 'admins:manage',
    parent: null
  },
  SETTINGS_EDIT_ROLE: {
    path: '/settings/rbac/edit/:id',
    label: 'Edit Admin',
    icon: 'settings',
    permission: 'admins:manage',
    parent: '/settings/rbac',
    dynamic: true,
  },
  SETTINGS_VIEW_ROLE: {
    path: '/settings/rbac/view/:id',
    label: 'View Details',
    icon: 'settings',
    permission: 'admins:view',
    parent: '/settings/rbac',
    dynamic: true,
  },
  SETTINGS_AGENT_CATEGORY: {
    path: '/settings/agent-category',
    label: 'Agent Category',
    icon: 'settings',
    permission: 'settings:view',
    parent: null
  },
  SETTINGS_CREATE_AGENT_CATEGORY: {
    path: '/settings/agent-category/create',
    label: 'Create Agent Category',
    icon: 'settings',
    permission: 'settings:create',
    parent: null
  },
  SETTINGS_EDIT_AGENT_CATEGORY: {
    path: '/settings/agent-category/edit/:id',
    label: 'Edit Details',
    icon: 'settings',
    permission: 'settings:create',
    parent: '/settings/agent-category',
    dynamic: true,
  },
  SETTINGS_VIEW_AGENT_CATEGORY: {
    path: '/settings/agent-category/view/:id',
    label: 'View Details',
    icon: 'settings',
    permission: 'settings:view',
    parent: '/settings/agent-category',
    dynamic: true,
  },
  SETTINGS_ACTIVITY_LOGS: {
    path: '/settings/activity-logs',
    label: 'Activity Logs',
    icon: 'settings',
    permission: 'settings:logs:view',
    parent: null
  },
  SETTINGS_TIER: {
    path: '/settings/tier',
    label: 'Tier Management',
    icon: 'settings',
    permission: 'settings:view',
    parent: null
  },
  SETTINGS_EDIT_TIER: {
    path: '/settings/tier/edit/:id',
    label: 'Edit Details',
    icon: 'settings',
    permission: 'settings:create',
    parent: '/settings/tier',
    dynamic: true,
  },
  SETTINGS_COMMISSION: {
    path: '/settings/commission-management',
    label: 'Commission Management',
    icon: 'settings',
    permission: 'settings:view',
    parent: null
  },
  SETTINGS_PARTNER_API: {
    path: '/settings/partner-api',
    label: 'Partner API',
    icon: 'settings',
    permission: 'settings:view',
    parent: null
  },
  SETTINGS_CONTRACT: {
    path: '/settings/contracts',
    label: 'Contract Management',
    icon: 'settings',
    permission: 'settings:view',
    parent: null
  },
  SETTINGS_2FA: {
    path: '/settings/2fa',
    label: 'Two-Factor Authentication',
    icon: 'settings',
    permission: 'settings:view',
    parent: null,
  },
  SETTINGS_DESIGNATED_ACCOUNTS: {
    path: '/settings/designated-accounts',
    label: 'Designated Accounts',
    icon: 'settings',
    permission: 'settings:view',
    parent: null,
  },
  SETTINGS_CREATE_COMMISSION: {
    path: '/settings/commission-management/create',
    label: 'Create Commission',
    icon: 'settings',
    permission: 'settings:create',
    parent: null
  },
  SETTINGS_EDIT_COMMISSION: {
    path: '/settings/commission-management/edit/:id',
    label: 'Edit Details',
    icon: 'settings',
    permission: 'settings:create',
    parent: '/settings/commission-management',
    dynamic: true,
  },
  SETTINGS_VIEW_COMMISSION: {
    path: '/settings/commission-management/view/:id',
    label: 'View Details',
    icon: 'settings',
    permission: 'settings:view',
    parent: '/settings/commission-management',
    dynamic: true,
  },


  USER_DETAILS: {
    path: '/users/:id',
    label: 'User Details',
    parent: '/users',
    icon: null,
    permission: 'accounts',
    dynamic: true,
  },
  AGENT_DETAILS: {
    path: '/agents/:id',
    label: 'Agent Details',
    parent: '/agents',
    icon: null,
    permission: 'accounts',
    dynamic: true,
  },
  AGGREGATOR_DETAILS: {
    path: '/aggregators/:id',
    label: 'Aggregator Details',
    parent: '/aggregators',
    icon: null,
    permission: 'accounts',
    dynamic: true,
  },
  AGGREGATOR_MANAGER_DETAILS: {
    path: '/aggregator-managers/:id',
    label: 'Aggregator Manager Details',
    parent: '/aggregator-manager',
    icon: null,
    permission: 'accounts',
    dynamic: true,
  },
  TRANSACTION_DETAILS: {
    path: '/transactions/:id',
    label: 'Transaction Details',
    parent: '/dashboard',
    icon: null,
    permission: 'transactions',
    dynamic: true,
  },
  DASHBOARD_DETAILS: {
    path: '/dashboard/details/:type/:id',
    label: 'View Details',
    parent: '/dashboard',
    icon: null,
    permission: 'dashboard:view',
    dynamic: true,
  },
  AIRTIME_DETAILS: {
    path: '/airtime/details/:type/:id',
    label: 'View Details',
    parent: '/airtime',
    icon: null,
    permission: 'transactions',
    dynamic: true,
  },
  DATA_DETAILS: {
    path: '/data/details/:type/:id',
    label: 'View Details',
    parent: '/data',
    icon: null,
    permission: 'transactions',
    dynamic: true,
  },
  BILLS_DETAILS: {
    path: '/bills/details/:type/:id',
    label: 'View Details',
    parent: '/bills',
    icon: null,
    permission: 'transactions',
    dynamic: true,
  },
  TRANSFER_DETAILS: {
    path: '/transfers/details/:type/:id',
    label: 'View Details',
    parent: '/transfers',
    icon: null,
    permission: 'transactions',
    dynamic: true,
  },
  OUTWARD_TRANSFER_DETAILS: {
    path: '/transfers/outward/details/:type/:id',
    label: 'View Details',
    parent: '/transfers/outward',
    icon: null,
    permission: 'transactions',
    dynamic: true,
  },
  INWARD_TRANSFER_DETAILS: {
    path: '/transfers/inward/details/:type/:id',
    label: 'View Details',
    parent: '/transfers/inward',
    icon: null,
    permission: 'transactions',
    dynamic: true,
  },
  SOFTPOS_DETAILS: {
    path: '/softpos/details/:type/:id',
    label: 'View Details',
    parent: '/softpos',
    icon: null,
    permission: 'transactions',
    dynamic: true,
  },
  KYC_DETAILS: {
    path: '/kyc/details/:type/:id',
    label: 'View Details',
    parent: '/kyc',
    icon: null,
    permission: 'transactions',
    dynamic: true,
  },
  ACCOUNTS_APPROVALS_DETAILS: {
    path: '/account-approvals/:type/:id',
    label: 'View Details',
    parent: '/account-approvals',
    icon: null,
    permission: 'approvals',
    dynamic: true,
  },
  BUSINESS_ACCOUNT_APPROVALS_DETAILS: {
    path: '/business-account-approvals/:type/:id',
    label: 'View Details',
    parent: '/business-account-approvals',
    icon: null,
    permission: 'approvals',
    dynamic: true,
  },
  DISPUTED_TRANSACTIONS_DETAILS: {
    path: '/disputed-transactions/:id',
    label: 'View Details',
    parent: null,
    icon: null,
    permission: 'disputes',
    dynamic: true,
  },

  // Fraud detection admin surface — proxied through the NestJS backend to
  // the Python fraud-detection service (see admin/admin-fraud.controller.ts).
  // Rules/score bands/blacklist are configuration; audit log/review
  // queue/rings are monitoring.
  FRAUD_RULES: {
    path: '/fraud/rules',
    label: 'Rules',
    icon: 'fraud',
    permission: 'fraud:view',
    parent: null,
  },
  FRAUD_SCORE_BANDS: {
    path: '/fraud/score-bands',
    label: 'Score Bands',
    icon: 'fraud',
    permission: 'fraud:view',
    parent: null,
  },
  FRAUD_AUDIT_LOG: {
    path: '/fraud/audit-log',
    label: 'Audit Log',
    icon: 'fraud',
    permission: 'fraud:view',
    parent: null,
  },
  FRAUD_REVIEW_QUEUE: {
    path: '/fraud/review-queue',
    label: 'Review Queue',
    icon: 'fraud',
    permission: 'fraud:view',
    parent: null,
  },
  FRAUD_BLACKLIST: {
    path: '/fraud/blacklist',
    label: 'Blacklist',
    icon: 'fraud',
    permission: 'fraud:view',
    parent: null,
  },
  FRAUD_RINGS: {
    path: '/fraud/rings',
    label: 'Fraud Rings',
    icon: 'fraud',
    permission: 'fraud:view',
    parent: null,
  },

  // Security monitoring - every successful sign-in, customer app and
  // admin/console both (see backend/src/admin/admin-security.controller.ts).
  // Uses the real RBAC permission key directly ('users.view', dot-form)
  // rather than a colon-form alias, so it resolves correctly for custom
  // RBAC roles too, not just the legacy static roles.
  LOGIN_SESSIONS: {
    path: '/security/login-sessions',
    label: 'Login Sessions',
    icon: 'security',
    permission: 'users.view',
    parent: null,
  },

  // Facial-verification capture review - every attempt (registration,
  // login step-up, and the transaction-verification preview) with its 3
  // saved captures, for support/security to review if something looks
  // wrong. Uses the real RBAC permission key directly ('verification.view',
  // dot-form), same reasoning as LOGIN_SESSIONS above.
  VERIFICATION_ATTEMPTS: {
    path: '/security/verification-attempts',
    label: 'Verification Reviews',
    icon: 'security',
    permission: 'verification.view',
    parent: null,
  },

  // "Users Under Investigation" watchlist - monitoring only, access is
  // never affected and the user is never told (see
  // backend/src/investigations/schemas/investigation.schema.ts).
  USERS_UNDER_INVESTIGATION: {
    path: '/security/investigations',
    label: 'Under Investigation',
    icon: 'security',
    permission: 'investigations.view',
    parent: null,
  },
};

// Helper function to get route config by path
export const getRouteConfig = (pathname) => {
  // Create a map for quick lookup
  const routeMap = Object.values(ROUTES).reduce((acc, route) => {
    acc[route.path] = route;
    return acc;
  }, {});

  // Check for exact match first
  if (routeMap[pathname]) {
    return routeMap[pathname];
  }

  // Check for dynamic routes
  for (const route of Object.values(ROUTES)) {
    if (route.dynamic) {
      const pattern = route.path.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(pathname)) {
        return route;
      }
    }
  }

  // Default to dashboard
  return ROUTES.DASHBOARD;
};

// Helper to get all routes as array
export const getAllRoutes = () => Object.values(ROUTES);

// Helper to get routes by permission
export const getRoutesByPermission = (permission) => {
  return Object.values(ROUTES).filter(route => route.permission === permission);
};

// Menu structure for sidebar
export const MENU_STRUCTURE = [
  {
    id: 'dashboard',
    type: 'item',
    routeKey: 'DASHBOARD',
  },
  {
    id: 'balances',
    type: 'item',
    routeKey: 'BALANCES',
  },
  {
    id: 'affiliates',
    type: 'item',
    routeKey: 'AFFILIATES',
  },
  {
    id: 'promotions',
    type: 'item',
    routeKey: 'PROMOTIONS',
  },
  {
    id: 'smartSavings',
    type: 'section',
    label: 'SMART SAVINGS',
    permission: 'smartSavings.view',
    items: [
      { routeKey: 'SMART_SAVINGS' },
      { routeKey: 'SMART_SAVINGS_MEMBERS' },
      { routeKey: 'SMART_SAVINGS_MARKETERS' },
      { routeKey: 'SMART_SAVINGS_ENTRIES' },
      { routeKey: 'SMART_SAVINGS_WITHDRAWALS' },
      { routeKey: 'SMART_SAVINGS_PLANNER' },
      { routeKey: 'SMART_SAVINGS_SETTINGS' },
    ],
  },
  {
    id: 'partners',
    type: 'section',
    label: 'PARTNERS',
    permission: 'partnerApi.billing.view',
    items: [
      { routeKey: 'PARTNERS' },
      { routeKey: 'PARTNER_VERIFICATIONS' },
    ],
  },
  {
    id: 'transactions',
    type: 'section',
    label: 'TRANSACTIONS',
    permission: 'section:transactions',
    items: [
      { routeKey: 'INSIGHTS' },
      { routeKey: 'AIRTIME' },
      { routeKey: 'DATA' },
      { routeKey: 'BILLS' },
      { routeKey: 'REQUEST' },
      { routeKey: 'OUTWARD_TRANSFERS' },
      { routeKey: 'INWARD_TRANSFERS' },
      { routeKey: 'POS_MANAGEMENT' },
      { routeKey: 'POS_REQUESTS' },
      { routeKey: 'SOFTPOS' },
      { routeKey: 'KYC' },
      { routeKey: 'EARNINGS' },
    ],
  },
  {
    id: 'accounts',
    type: 'section',
    label: 'ACCOUNTS',
    permission: 'section:accounts',
    items: [
      { routeKey: 'USERS' },
      { routeKey: 'AGENTS' },
      { routeKey: 'MERCHANTS' },
      { routeKey: 'AGGREGATOR' },
      { routeKey: 'AGGREGATOR_MANAGER' },
      { routeKey: 'STATE_MANAGER' },
      { routeKey: 'REGIONAL_MANAGER' },
    ],
  },
  {
    id: 'approvals',
    type: 'section',
    label: 'APPROVALS',
    permission: 'section:approvals',
    items: [
      { routeKey: 'ACCOUNTS_APPROVALS' },
      { routeKey: 'BUSINESS_ACCOUNT_APPROVALS' },
      { routeKey: 'DISPUTED_TRANSACTIONS' },
    ],
  },
  {
    id: 'fraud',
    type: 'section',
    label: 'FRAUD DETECTION',
    permission: 'section:fraud',
    items: [
      { routeKey: 'FRAUD_REVIEW_QUEUE' },
      { routeKey: 'FRAUD_AUDIT_LOG' },
      { routeKey: 'FRAUD_RINGS' },
      { routeKey: 'FRAUD_BLACKLIST' },
      { routeKey: 'FRAUD_RULES' },
      { routeKey: 'FRAUD_SCORE_BANDS' },
    ],
  },
  {
    id: 'security',
    type: 'section',
    label: 'SECURITY',
    permission: 'section:security',
    items: [
      { routeKey: 'LOGIN_SESSIONS' },
      { routeKey: 'VERIFICATION_ATTEMPTS' },
      { routeKey: 'USERS_UNDER_INVESTIGATION' },
    ],
  },
];
