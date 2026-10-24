export const usersData = [
  { 
    id: 1, 
    name: 'Rejoice Regina Rose', 
    email: 'emailaddress@gmail.com', 
    accountType: 'Personal Account', 
    status: 'Active', 
    totalTransactions: 100, 
    totalVolume: 40000, 
    joinedDate: '10:00 AM | 25th March, 2025',
    firstName: 'Rejoice',
    middleName: 'Regina',
    lastName: 'Rose',
    phone: '08012345678',
    tier: 'Tier 1'
  },
  { 
    id: 2, 
    name: 'John Smith', 
    email: 'john.smith@gmail.com', 
    accountType: 'Agent', 
    status: 'Suspended', 
    totalTransactions: 100, 
    totalVolume: 5000000, 
    joinedDate: '10:00 AM | 25th March, 2025',
    firstName: 'John',
    middleName: '',
    lastName: 'Smith',
    phone: '08012345679',
    tier: 'Tier 2'
  },
  { 
    id: 3, 
    name: 'Mary Johnson', 
    email: 'mary.j@gmail.com', 
    accountType: 'Aggregator', 
    status: 'Active', 
    totalTransactions: 100, 
    totalVolume: 200000, 
    joinedDate: '10:00 AM | 25th March, 2025',
    firstName: 'Mary',
    middleName: '',
    lastName: 'Johnson',
    phone: '08012345680',
    tier: 'Tier 3'
  },
  { 
    id: 4, 
    name: 'David Brown', 
    email: 'david.b@gmail.com', 
    accountType: 'Aggregator Manager', 
    status: 'Deactivated', 
    totalTransactions: 100, 
    totalVolume: 40000000, 
    joinedDate: '10:00 AM | 25th March, 2025',
    firstName: 'David',
    middleName: '',
    lastName: 'Brown',
    phone: '08012345681',
    tier: 'Tier 2'
  },
  { 
    id: 5, 
    name: 'Sarah Williams', 
    email: 'sarah.w@gmail.com', 
    accountType: 'Merchant', 
    status: 'Active', 
    totalTransactions: 100, 
    totalVolume: 20000, 
    joinedDate: '10:00 AM | 25th March, 2025',
    firstName: 'Sarah',
    middleName: '',
    lastName: 'Williams',
    phone: '08012345682',
    tier: 'Tier 1'
  }
];

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
    status: 'Successful', 
    type: 'Credit', 
    category: 'Airtime', 
    desc: 'Transfer from Victor mba to ', 
    revenue: 100, 
    amount: 4000, 
    date: '10:00 AM | 25th March, 2025', 
    location: 'Lagos' 
  },
  { 
    id: 2, 
    title: mockUser.name, 
    acc: mockUser.phone, 
    status: 'Successful', 
    type: 'Debit', 
    category: 'Transfer', 
    desc: 'Transfer to victor from ade', 
    revenue: 100, 
    amount: 5000, 
    date: '10:00 AM | 25th March, 2025', 
    location: 'Lagos' 
  },
  { 
    id: 3, 
    title: mockUser.name, 
    acc: mockUser.phone, 
    status: 'Successful', 
    type: 'Credit', 
    category: 'Data', 
    desc: 'GoTv Subscription', 
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
      status: 'Successful', 
      type: 'Credit', 
      category: 'Airtime', 
      desc: 'Transfer from Victor mba to ', 
      revenue: 100, 
      amount: 4000, 
      date: '10:00 AM | 25th March, 2025', 
      location: 'Lagos' 
    },
    { 
      id: 2, 
      title: user.name, 
      acc: user.phone, 
      status: 'Successful', 
      type: 'Debit', 
      category: 'Transfer', 
      desc: 'Transfer to victor from ade', 
      revenue: 100, 
      amount: 5000, 
      date: '10:00 AM | 25th March, 2025', 
      location: 'Lagos' 
    },
    { 
      id: 3, 
      title: user.name, 
      acc: user.phone, 
      status: 'Successful', 
      type: 'Credit', 
      category: 'Data', 
      desc: 'GoTv Subscription', 
      revenue: 100, 
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
  getUserTransactions
};