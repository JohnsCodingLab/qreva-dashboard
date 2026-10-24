export const aggregatorsData = [
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


export const aggregatorStats = [
  { label: 'Total Aggregators', value: '8,000', change: '+10%', subtext: '2% in last 24 hours' },
  { label: 'Total Aggregators Transactions', value: '50,823', change: '-10%', subtext: '5,000 in last 24 hours' },
  { label: 'Total Aggregators Trans. Volume', value: '₦450,823', change: '-10%', subtext: '₦600 in last 24 hours' },
  { label: 'Total aggregator Commission', value: '₦115,823', change: '+10%', subtext: '₦6,000 in last 24 hours' }
];


export const mockAggregatorProfile = {
  id: '1',
  name: 'Rejoice Regina Rose',
  email: 'emailaddress@gmail.com',
  tier: 'Tier 3',
  accountType: 'Aggregator',
  firstName: 'Rejoice',
  middleName: 'Regina',
  lastName: 'Rose',
  phone: '08012345678',
  address: '9, Figma Street, Ladipo',
  
  businessDetails: {
    businessName: 'Rejoice Enterprises',
    businessEmail: 'business@gmail.com',
    businessPhone: '08012345679',
    businessAddress: 'A Fijma Street, Ladepo'
  },
  
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
  
  stats: [
    { label: 'Total Transaction Volume', value: '45,823', change: '10%', subtext: '50,000 in last 24 hours' },
    { label: 'Total Transaction Value', value: '₦4,005,823', change: '10%', subtext: '₦50,000 in last 24 hours' },
    { label: 'Total Revenue', value: '₦1,070,823', change: '10%', subtext: '₦60,000 in last 24 hours' },
    { label: 'Success Rate', value: '90%', change: '10%', subtext: '2% in last 24 hours' }
  ],
  
  agentStats: [
    { label: 'Total Agents', value: '8,000', change: '10%', subtext: '2% in last 24 hours' },
    { label: 'Total Agents Transactions', value: '50,823', change: '10%', subtext: '5,000 in last 24 hours' },
    { label: 'Total Agents Trans. Volume', value: '₦450,823', change: '10%', subtext: '₦600 in last 24 hours' },
    { label: 'Total Agents Commission', value: '₦115,823', change: '10%', subtext: '₦6,000 in last 24 hours' }
  ],
  
  agents: [
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
      totalTransactions: 100, 
      totalVolume: 5000000,
      totalRevenue: 5000000,
      totalCommission: 5000000,
      joinedDate: '10:00 AM | 25th March, 2025'
    }
  ],
  
  cardQRStats: [
    { label: 'Total SoftPOS Transactions', value: '45,823', change: '10%', subtext: '50,000 in last 24 hours' },
    { label: 'Total Transaction Value', value: '₦4,005,823', change: '10%', subtext: '₦50,000 in last 24 hours' },
    { label: 'Your Commission', value: '₦1,070,823', change: '10%', subtext: '₦60,000 in last 24 hours' },
    { label: 'Total Aggregator Commission', value: '₦570,823', change: '10%', subtext: '₦100,000 in last 24 hours' }
  ],
  
  cardQRBreakdown: [
    { label: 'Total Card Payments', value: '45,823', change: '10%', subtext: '1,000 in last 24 hours' },
    { label: 'Total Card Payments Volume', value: '₦452,823', change: '10%', subtext: '₦10,000 in last 24 hours' },
    { label: 'Total QR Payment', value: '5,823', change: '10%', subtext: '200 in last 24 hours' },
    { label: 'Total QR Payment Volume', value: '₦50,823', change: '10%', subtext: '₦20,000 in last 24 hours' }
  ],
  
  chartData: [
    { date: 'Today', cardPayments: 850, qrPayments: 700 },
    { date: 'Yesterday', cardPayments: 800, qrPayments: 650 },
    { date: '2 Days Ago', cardPayments: 750, qrPayments: 600 },
    { date: '3 Days Ago', cardPayments: 820, qrPayments: 680 },
    { date: '4 Days Ago', cardPayments: 780, qrPayments: 620 },
    { date: '5 Days Ago', cardPayments: 730, qrPayments: 590 },
    { date: '6 Days Ago', cardPayments: 880, qrPayments: 720 },
    { date: '7 Days Ago', cardPayments: 790, qrPayments: 640 },
    { date: 'Week Ago', cardPayments: 810, qrPayments: 670 },
    { date: '2 Weeks Ago', cardPayments: 830, qrPayments: 690 },
    { date: '3 Weeks Ago', cardPayments: 860, qrPayments: 710 },
    { date: '4 Weeks Ago', cardPayments: 840, qrPayments: 700 }
  ]
};

export const aggregatorTransactions = [
  { id: 1, title: 'Transfer from VI...', category: 'Transfer', status: 'Successful', type: 'Credit', amount: 40000, date: '10:00 AM | 25th March, 2025' },
  { id: 2, title: 'Transfer to Victo...', category: 'Transfer', status: 'Successful', type: 'Debit', amount: 5000000, date: '10:00 AM | 25th March, 2025' },
  { id: 3, title: 'GoTv Subscription', category: 'Bill Payment', status: 'Successful', type: 'Debit', amount: 200000, date: '10:00 AM | 25th March, 2025' },
  { id: 4, title: 'Airtime Purchase', category: 'Airtime', status: 'Successful', type: 'Debit', amount: 40000000, date: '10:00 AM | 25th March, 2025' },
  { id: 5, title: 'Data Purchase', category: 'Data', status: 'Successful', type: 'Debit', amount: 20000, date: '10:00 AM | 25th March, 2025' }
];

export const getAggregatorById = (id) => {
  return { ...mockAggregatorProfile, id };
};