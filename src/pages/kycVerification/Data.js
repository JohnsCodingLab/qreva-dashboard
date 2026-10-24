const kycRegionsData = [
    { id: 1, location: 'Lagos', totalKYC: 500000, totalSum: 40000, revenue: 40000, commission: 40000 },
    { id: 2, location: 'Abuja', totalKYC: 50000, totalSum: 50000, revenue: 20000, commission: 20000 },
    { id: 3, location: 'Enugu', totalKYC: 20000, totalSum: 20000, revenue: 10000, commission: 10000 },
    { id: 4, location: 'Rivers', totalKYC: 50000, totalSum: 4000, revenue: 10000, commission: 10000 },
    { id: 5, location: 'Cross Rivers', totalKYC: 100000, totalSum: 20000, revenue: 40000, commission: 40000 }
];

const allKYCTransactions = [
    { id: 1, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', agentName: 'Rejoice Regina Rose', phoneNumber: '+234 801 234 5678', email: 'emailaddress@...om', type: 'NIN', status: 'First Time', category: 'KYC', desc: 'NIN Verification', location: 'Lagos', commission: 200, revenue: 100, amount: 4000, date: '10:00 AM | 25th March, 2025' },
    { id: 2, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', agentName: 'Rejoice Regina Rose', phoneNumber: '+234 801 234 5678', email: 'emailaddress@...om', type: 'BVN', status: 'Repeat Buyer', category: 'KYC', desc: 'BVN Verification', location: 'Lagos', commission: 200, revenue: 100, amount: 5000, date: '10:00 AM | 25th March, 2025' },
    { id: 3, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', agentName: 'Rejoice Regina Rose', phoneNumber: '+234 801 234 5678', email: 'emailaddress@...om', type: 'NIN', status: 'First Time', category: 'KYC', desc: 'NIN Verification', location: 'Abia', commission: 200, revenue: 100, amount: 200, date: '10:00 AM | 25th March, 2025' },
    { id: 4, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', agentName: 'Rejoice Regina Rose', phoneNumber: '+234 801 234 5678', email: 'emailaddress@...om', type: 'NIN', status: 'Repeat Buyer', category: 'KYC', desc: 'NIN Verification', location: 'Enugu', commission: 200, revenue: 100, amount: 400, date: '10:00 AM | 25th March, 2025' },
    { id: 5, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', agentName: 'Rejoice Regina Rose', phoneNumber: '+234 801 234 5678', email: 'emailaddress@...om', type: 'BVN', status: 'First Time', category: 'KYC', desc: 'BVN Verification', location: 'Abuja', commission: 200, revenue: 100, amount: 20000, date: '10:00 AM | 25th March, 2025' }
];


const bvnVsNinData = [
    { id: 0, value: 30, label: 'NIN Verifications', color: '#FF5B04' },
    { id: 1, value: 70, label: 'BVN Verification', color: '#06b6d4' }
];

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

 const chartSeries = [
    { data: multiLineData.map(d => d.bvn), color: '#06b6d4', label: 'BVN' },
    { data: multiLineData.map(d => d.nin), color: '#FF5B04', label: 'NIN' }
  ];

  

  const kycTransactions = [
    { id: 1, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', agentName: 'Rejoice Regina Rose', phoneNumber: '+234 801 234 5678', email: 'emailaddress@...om', type: 'NIN', status: 'First Time', category: 'KYC', desc: 'NIN Verification', location: 'Lagos', commission: 200, revenue: 100, amount: 4000, date: '10:00 AM | 25th March, 2025' },
    { id: 2, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', agentName: 'Rejoice Regina Rose', phoneNumber: '+234 801 234 5678', email: 'emailaddress@...om', type: 'BVN', status: 'Repeat Buyer', category: 'KYC', desc: 'BVN Verification', location: 'Lagos', commission: 200, revenue: 100, amount: 5000, date: '10:00 AM | 25th March, 2025' },
    { id: 3, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', agentName: 'Rejoice Regina Rose', phoneNumber: '+234 801 234 5678', email: 'emailaddress@...om', type: 'NIN', status: 'First Time', category: 'KYC', desc: 'NIN Verification', location: 'Abia', commission: 200, revenue: 100, amount: 200, date: '10:00 AM | 25th March, 2025' },
    { id: 4, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', agentName: 'Rejoice Regina Rose', phoneNumber: '+234 801 234 5678', email: 'emailaddress@...om', type: 'NIN', status: 'Repeat Buyer', category: 'KYC', desc: 'NIN Verification', location: 'Enugu', commission: 200, revenue: 100, amount: 400, date: '10:00 AM | 25th March, 2025' },
    { id: 5, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', agentName: 'Rejoice Regina Rose', phoneNumber: '+234 801 234 5678', email: 'emailaddress@...om', type: 'BVN', status: 'First Time', category: 'KYC', desc: 'BVN Verification', location: 'Abuja', commission: 200, revenue: 100, amount: 20000, date: '10:00 AM | 25th March, 2025' }
  ];

  
export { kycRegionsData, allKYCTransactions, bvnVsNinData, multiLineData, chartSeries, kycTransactions };