export const agentsData = [
  { 
    id: 1, 
    name: 'Rejoice Regina Rose', 
    email: 'emailaddress@gmail.com',
    totalTransactions: 100, 
    totalVolume: 40000,
    totalRevenue: 40000,
    totalCommission: 40000,
    joinedDate: '10:00 AM | 25th March, 2025'
  },
  { 
    id: 2, 
    name: 'John Smith', 
    email: 'john.smith@gmail.com',
    totalTransactions: 150, 
    totalVolume: 5000000,
    totalRevenue: 5000000,
    totalCommission: 5000000,
    joinedDate: '10:00 AM | 24th March, 2025'
  },
  { 
    id: 3, 
    name: 'Mary Johnson', 
    email: 'mary.j@gmail.com',
    totalTransactions: 200, 
    totalVolume: 200000,
    totalRevenue: 200000,
    totalCommission: 200000,
    joinedDate: '10:00 AM | 23rd March, 2025'
  },
  { 
    id: 4, 
    name: 'David Brown', 
    email: 'david.b@gmail.com',
    totalTransactions: 300, 
    totalVolume: 40000000,
    totalRevenue: 40000000,
    totalCommission: 40000000,
    joinedDate: '10:00 AM | 22nd March, 2025'
  },
  { 
    id: 5, 
    name: 'Sarah Williams', 
    email: 'sarah.w@gmail.com',
    totalTransactions: 80, 
    totalVolume: 20000,
    totalRevenue: 20000,
    totalCommission: 20000,
    joinedDate: '10:00 AM | 21st March, 2025'
  }
];

// Mock Users Base Data
const mockUsers = {
  '1': {
    id: '1',
    name: 'Rejoice Regina Rose',
    email: 'emailaddress@gmail.com',
    tier: 'Tier 1',
    accountType: 'Personal Account',
    firstName: 'Rejoice',
    middleName: 'Regina',
    lastName: 'Rose',
    phone: '08012345678'
  },
  '2': {
    id: '2',
    name: 'John Smith',
    email: 'john.smith@gmail.com',
    tier: 'Tier 2',
    accountType: 'Agent',
    firstName: 'John',
    middleName: '',
    lastName: 'Smith',
    phone: '08012345679'
  },
  '3': {
    id: '3',
    name: 'Mary Johnson',
    email: 'mary.j@gmail.com',
    tier: 'Tier 3',
    accountType: 'Aggregator',
    firstName: 'Mary',
    middleName: '',
    lastName: 'Johnson',
    phone: '08012345680'
  },
  '4': {
    id: '4',
    name: 'David Brown',
    email: 'david.b@gmail.com',
    tier: 'Tier 2',
    accountType: 'Aggregator Manager',
    firstName: 'David',
    middleName: '',
    lastName: 'Brown',
    phone: '08012345681'
  },
  '5': {
    id: '5',
    name: 'Sarah Williams',
    email: 'sarah.w@gmail.com',
    tier: 'Tier 1',
    accountType: 'Merchant',
    firstName: 'Sarah',
    middleName: '',
    lastName: 'Williams',
    phone: '08012345682'
  }
};

// Complete mock user with all details
const mockUser = {
  // Base user info
  id: '1',
  name: 'Rejoice Regina Rose',
  email: 'emailaddress@gmail.com',
  tier: 'Tier 1',
  accountType: 'Personal Account',
  firstName: 'Rejoice',
  middleName: 'Regina',
  lastName: 'Rose',
  phone: '08012345678',
  
  // Personal Account KYC Data
  tier1: {
    validId: 'BVN',
    bvnNumber: '2018****190'
  },
  tier2: {
    validId: 'BVN',
    bvnNumber: '2018****190',
    validId2: 'NIN',
    ninNumber: '2018****190',
    photo: '/path/to/nin-card.jpg'
  },
  tier3: {
    state: 'Lagos',
    lga: 'Alimosho',
    address: 'A Fijma Street, Ladepo',
    documentType: 'Electricity Bill',
    document: '/path/to/electricity-bill.jpg'
  },
  
  // Business Account Data (if accountType is Agent/Aggregator/Merchant)
  businessDetails: {
    businessName: 'Rejoice Enterprises',
    businessEmail: 'business@gmail.com',
    businessPhone: '08012345679',
    businessAddress: 'A Fijma Street, Ladepo'
  },
  
  // Transaction stats
  stats: [
    { label: 'Total Transaction Volume', value: '45,823', change: '+20%', subtext: '50,000 in last 24 hours' },
    { label: 'Total Transaction Value', value: '₦4,005,823', change: '-10%', subtext: '₦50,000 in last 24 hours' },
    { label: 'Total Revenue', value: '₦1,070,823', change: '-10%', subtext: '₦80,000 in last 24 hours' },
    { label: 'Success Rate', value: '90%', change: '+2%', subtext: '2% in last 24 hours' }
  ],
  
  // Terminals (for Merchants/Agents)
  terminals: [
    { id: 'A', name: 'Terminal A', transactions: 45823, volume: 4005823, revenue: 1070823, commission: 100000 },
    { id: 'B', name: 'Terminal B', transactions: 25000, volume: 2000000, revenue: 500000, commission: 50000 }
  ],
  
  // Agents (for Aggregators)
  agents: [
    { 
      id: '1', 
      name: 'Rejoice Regina Rose', 
      email: 'emailaddress@gmail.com',
      totalTransactions: 100,
      totalVolume: 40000,
      totalRevenue: 40000,
      totalCommission: 40000,
      joinedDate: '10:00 AM | 25th March, 2025'
    }
  ]
};

// Transaction data - now properly referencing mockUser
const userTransactions = [
  { 
    id: 1, 
    title: mockUser.name, 
    acc: mockUser.phone, 
    status: 'First Time', 
    type: 'Credit', 
    category: 'Airtime', 
    desc: 'Airtel Nigeria', 
    revenue: 100, 
    amount: 4000, 
    date: '10:00 AM | 25th March, 2025', 
    location: 'Lagos' 
  },
  { 
    id: 2, 
    title: mockUser.name, 
    acc: mockUser.phone, 
    status: 'Repeat Buyer', 
    type: 'Debit', 
    category: 'Transfer', 
    desc: 'Bank Transfer', 
    revenue: 100, 
    amount: 5000, 
    date: '10:00 AM | 25th March, 2025', 
    location: 'Lagos' 
  },
  { 
    id: 3, 
    title: mockUser.name, 
    acc: mockUser.phone, 
    status: 'First Time', 
    type: 'Credit', 
    category: 'Data', 
    desc: 'MTN Data', 
    revenue: 100, 
    amount: 200, 
    date: '10:00 AM | 25th March, 2025', 
    location: 'Lagos' 
  }
];

// Helper function to get user by ID with full details
const getUserById = (id) => {
  const baseUser = mockUsers[id];
  if (!baseUser) return null;

  // Return full user object with KYC and other details
  return {
    ...baseUser,
    tier1: mockUser.tier1,
    tier2: mockUser.tier2,
    tier3: mockUser.tier3,
    businessDetails: baseUser.accountType !== 'Personal Account' ? mockUser.businessDetails : null,
    stats: mockUser.stats,
    terminals: ['Agent', 'Merchant'].includes(baseUser.accountType) ? mockUser.terminals : [],
    agents: baseUser.accountType === 'Aggregator' ? mockUser.agents : []
  };
};

// Helper function to get transactions for a specific user
const getUserTransactions = (userId) => {
  const user = mockUsers[userId] || mockUser;
  
  return [
    { 
      id: 1, 
      title: user.name, 
      acc: user.phone, 
      status: 'First Time', 
      type: 'Credit', 
      category: 'Airtime', 
      desc: 'Airtel Nigeria', 
      revenue: 100, 
      amount: 4000, 
      date: '10:00 AM | 25th March, 2025', 
      location: 'Lagos' 
    },
    { 
      id: 2, 
      title: user.name, 
      acc: user.phone, 
      status: 'Repeat Buyer', 
      type: 'Debit', 
      category: 'Transfer', 
      desc: 'Bank Transfer', 
      revenue: 100, 
      amount: 5000, 
      date: '10:00 AM | 25th March, 2025', 
      location: 'Lagos' 
    },
    { 
      id: 3, 
      title: user.name, 
      acc: user.phone, 
      status: 'First Time', 
      type: 'Credit', 
      category: 'Data', 
      desc: 'MTN Data', 
      revenue: 100, 
      amount: 200, 
      date: '10:00 AM | 25th March, 2025', 
      location: 'Lagos' 
    }
  ];
};

// Mock Agent Data
const mockAgent = {
  id: '1',
  name: 'Rejoice Regina Rose',
  email: 'emailaddress@gmail.com',
  tier: 'Tier 3',
  accountType: 'Agent Account',
  firstName: 'Rejoice',
  middleName: 'Regina',
  lastName: 'Rose',
  phone: '08012345678',
  address: '9, Figma Street, Ladipo',
  status: 'Pending', // or 'Active', 'Suspended'
  
  // KYC Data
  tier1: {
    validId: 'BVN',
    bvnNumber: '2018****190'
  },
  tier2: {
    validId: 'BVN',
    bvnNumber: '2018****190',
    validId2: 'NIN',
    ninNumber: '2018****190',
    photo: '/path/to/nin-card.jpg'
  },
  tier3: {
    state: 'Lagos',
    lga: 'Alimosho',
    address: 'A Fijma Street, Ladepo',
    documentType: 'Electricity Bill',
    document: '/path/to/electricity-bill.jpg'
  },
  
  // Transaction stats
  stats: [
    { label: 'Total SoftPOS Transactions', value: '45,823', change: '10%', subtext: '50,000 in last 24 hours' },
    { label: 'Total Transaction Value', value: '₦4,005,823', change: '10%', subtext: '₦50,000 in last 24 hours' },
    { label: 'Your Commission', value: '₦1,070,823', change: '10%', subtext: '₦60,000 in last 24 hours' },
    { label: 'Total Agent Commission', value: '₦570,823', change: '10%', subtext: '₦100,000 in last 24 hours' }
  ],
  
  // Additional stats for card/QR breakdown
  cardQRStats: [
    { label: 'Total Card Payments', value: '45,823', change: '10%', subtext: '1,000 in last 24 hours' },
    { label: 'Total Card Payments Volume', value: '₦452,823', change: '10%', subtext: '₦10,000 in last 24 hours' },
    { label: 'Total QR Payment', value: '5,823', change: '10%', subtext: '200 in last 24 hours' },
    { label: 'Total QR Payment Volume', value: '₦50,823', change: '10%', subtext: '₦20,000 in last 24 hours' }
  ],
  
  // Chart data
  chartData: [
    { date: 'Today', cardPayments: 600, qrPayments: 400 },
    { date: 'Yesterday', cardPayments: 500, qrPayments: 350 },
    { date: '2 Days Ago', cardPayments: 450, qrPayments: 300 },
    { date: '3 Days Ago', cardPayments: 550, qrPayments: 380 },
    { date: '4 Days Ago', cardPayments: 520, qrPayments: 420 },
    { date: '5 Days Ago', cardPayments: 480, qrPayments: 360 },
    { date: '6 Days Ago', cardPayments: 580, qrPayments: 440 },
    { date: '7 Days Ago', cardPayments: 490, qrPayments: 370 },
    { date: 'Week Ago', cardPayments: 510, qrPayments: 390 },
    { date: '2 Weeks Ago', cardPayments: 530, qrPayments: 410 },
    { date: '3 Weeks Ago', cardPayments: 560, qrPayments: 430 },
    { date: '4 Weeks Ago', cardPayments: 540, qrPayments: 400 }
  ]
};

// Agent transactions - now properly referencing mockAgent
const agentTransactions = [
  { 
    id: 1, 
    title: mockAgent.name, 
    acc: mockAgent.phone, 
    status: 'Successful', 
    type: 'Credit', 
    category: 'Airtime', 
    desc: 'Airtel Nigeria', 
    amount: 4000, 
    date: '10:00 AM | 25th March, 2025', 
    location: 'Lagos' 
  },
  { 
    id: 2, 
    title: mockAgent.name, 
    acc: mockAgent.phone, 
    status: 'Successful', 
    type: 'Debit', 
    category: 'Transfer', 
    desc: 'Bank Transfer', 
    amount: 5000, 
    date: '10:00 AM | 25th March, 2025', 
    location: 'Lagos' 
  },
  { 
    id: 3, 
    title: mockAgent.name, 
    acc: mockAgent.phone, 
    status: 'Successful', 
    type: 'Credit', 
    category: 'Data', 
    desc: 'MTN Data', 
    amount: 200, 
    date: '10:00 AM | 25th March, 2025', 
    location: 'Lagos' 
  }
];

// Multi-line chart data
const multiLineData = [
  { day: 'Today', bvn: 14500, nin: 14200 },
  { day: 'Yesterday', bvn: 14200, nin: 14800 },
  { day: '2 Days Ago', bvn: 14800, nin: 14600 },
  { day: '3 Days Ago', bvn: 14600, nin: 15200 },
  { day: '4 Days Ago', bvn: 15200, nin: 15800 },
  { day: '5 Days Ago', bvn: 15800, nin: 16200 },
  { day: '6 Days Ago', bvn: 16200, nin: 15600 },
  { day: '7 Days Ago', bvn: 15600, nin: 16800 },
  { day: 'Week Ago', bvn: 16800, nin: 16200 },
  { day: '2 Weeks Ago', bvn: 16200, nin: 13800 },
  { day: '3 Weeks Ago', bvn: 13800, nin: 17200 },
  { day: '4 Weeks Ago', bvn: 17200, nin: 18000 }
];

// Helper function to get agent by ID with full details
const getAgentById = (id) => {
  // In a real app, you'd fetch from an API or database
  // For now, return mockAgent with the requested ID
  return {
    ...mockAgent,
    id: id
  };
};

// Helper function to get transactions for a specific agent
const getAgentTransactions = (agentId) => {
  const agent = getAgentById(agentId);
  
  return [
    { 
      id: 1, 
      title: agent.name, 
      acc: agent.phone, 
      status: 'Successful', 
      type: 'Credit', 
      category: 'Airtime', 
      desc: 'Airtel Nigeria', 
      amount: 4000, 
      date: '10:00 AM | 25th March, 2025', 
      location: 'Lagos' 
    },
    { 
      id: 2, 
      title: agent.name, 
      acc: agent.phone, 
      status: 'Successful', 
      type: 'Debit', 
      category: 'Transfer', 
      desc: 'Bank Transfer', 
      amount: 5000, 
      date: '10:00 AM | 25th March, 2025', 
      location: 'Lagos' 
    },
    { 
      id: 3, 
      title: agent.name, 
      acc: agent.phone, 
      status: 'Successful', 
      type: 'Credit', 
      category: 'Data', 
      desc: 'MTN Data', 
      amount: 200, 
      date: '10:00 AM | 25th March, 2025', 
      location: 'Lagos' 
    }
  ];
};

export { 
  mockUsers, 
  mockUser, 
  userTransactions,
  getUserById,
  getUserTransactions,
  mockAgent,
  agentTransactions,
  multiLineData,
  getAgentById,
  getAgentTransactions
};