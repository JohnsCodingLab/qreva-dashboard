const SoftPOSRegionsData = [
    { id: 1, location: 'Lagos', totalSoftPOSTransactions: 500000, totalTansactionVolume: 40000, revenue: 40000, commission: 40000 },
    { id: 2, location: 'Abuja', totalSoftPOSTransactions: 50000, totalTansactionVolume: 50000, revenue: 20000, commission: 20000 },
    { id: 3, location: 'Enugu', totalSoftPOSTransactions: 20000, totalTansactionVolume: 20000, revenue: 10000, commission: 10000 },
    { id: 4, location: 'Rivers', totalSoftPOSTransactions: 50000, totalTansactionVolume: 4000, revenue: 10000, commission: 10000 },
    { id: 5, location: 'Cross Rivers', totalSoftPOSTransactions: 100000, totalTansactionVolume: 20000, revenue: 40000, commission: 40000 }
];

const SoftPOSTransactions = [
    { id: 1, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', agentName: 'Rejoice Regina Rose', phoneNumber: '+234 801 234 5678', email: 'emailaddress@...om', type: 'qrPayments', status: 'First Time', category: 'SoftPOS', desc: 'QR Payment', location: 'Lagos', commission: 200, revenue: 100, amount: 4000, date: '10:00 AM | 25th March, 2025' },
    { id: 2, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', agentName: 'Rejoice Regina Rose', phoneNumber: '+234 801 234 5678', email: 'emailaddress@...om', type: 'cardPayments', status: 'Repeat Buyer', category: 'SoftPOS', desc: 'Card Payment', location: 'Lagos', commission: 200, revenue: 100, amount: 5000, date: '10:00 AM | 25th March, 2025' },
    { id: 3, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', agentName: 'Rejoice Regina Rose', phoneNumber: '+234 801 234 5678', email: 'emailaddress@...om', type: 'qrPayments', status: 'First Time', category: 'SoftPOS', desc: 'QR Payment', location: 'Abia', commission: 200, revenue: 100, amount: 200, date: '10:00 AM | 25th March, 2025' },
    { id: 4, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', agentName: 'Rejoice Regina Rose', phoneNumber: '+234 801 234 5678', email: 'emailaddress@...om', type: 'qrPayments', status: 'Repeat Buyer', category: 'SoftPOS', desc: 'QR Payment', location: 'Enugu', commission: 200, revenue: 100, amount: 400, date: '10:00 AM | 25th March, 2025' },
    { id: 5, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', agentName: 'Rejoice Regina Rose', phoneNumber: '+234 801 234 5678', email: 'emailaddress@...om', type: 'cardPayments', status: 'First Time', category: 'SoftPOS', desc: 'Card Payment', location: 'Abuja', commission: 200, revenue: 100, amount: 20000, date: '10:00 AM | 25th March, 2025' }
];

const SoftPOSRegionsDetailsData = [
    { id: 1, location: 'Lagos', totalKYC: 500000, totalSum: 40000, revenue: 40000, commission: 40000 },
    { id: 2, location: 'Abuja', totalKYC: 50000, totalSum: 50000, revenue: 20000, commission: 20000 },
    { id: 3, location: 'Enugu', totalKYC: 20000, totalSum: 20000, revenue: 10000, commission: 10000 },
    { id: 4, location: 'Rivers', totalKYC: 50000, totalSum: 4000, revenue: 10000, commission: 10000 },
    { id: 5, location: 'Cross Rivers', totalKYC: 100000, totalSum: 20000, revenue: 40000, commission: 40000 }
  ];

  const allSoftPOSTransactions = [
    { id: 1, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', agentName: 'Rejoice Regina Rose', phoneNumber: '+234 801 234 5678', email: 'emailaddress@...om', type: 'qrPayments', status: 'First Time', category: 'SoftPOS', desc: 'QR Payment', location: 'Lagos', commission: 200, revenue: 100, amount: 4000, date: '10:00 AM | 25th March, 2025' },
    { id: 2, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', agentName: 'Rejoice Regina Rose', phoneNumber: '+234 801 234 5678', email: 'emailaddress@...om', type: 'cardPayments', status: 'Repeat Buyer', category: 'SoftPOS', desc: 'Card Payment', location: 'Lagos', commission: 200, revenue: 100, amount: 5000, date: '10:00 AM | 25th March, 2025' },
    { id: 3, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', agentName: 'Rejoice Regina Rose', phoneNumber: '+234 801 234 5678', email: 'emailaddress@...om', type: 'qrPayments', status: 'First Time', category: 'SoftPOS', desc: 'QR Payment', location: 'Abia', commission: 200, revenue: 100, amount: 200, date: '10:00 AM | 25th March, 2025' },
    { id: 4, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', agentName: 'Rejoice Regina Rose', phoneNumber: '+234 801 234 5678', email: 'emailaddress@...om', type: 'qrPayments', status: 'Repeat Buyer', category: 'SoftPOS', desc: 'QR Payment', location: 'Enugu', commission: 200, revenue: 100, amount: 400, date: '10:00 AM | 25th March, 2025' },
    { id: 5, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', agentName: 'Rejoice Regina Rose', phoneNumber: '+234 801 234 5678', email: 'emailaddress@...om', type: 'cardPayments', status: 'First Time', category: 'SoftPOS', desc: 'Card Payment', location: 'Abuja', commission: 200, revenue: 100, amount: 20000, date: '10:00 AM | 25th March, 2025' }
  ];

export { SoftPOSRegionsData, SoftPOSTransactions, SoftPOSRegionsDetailsData, allSoftPOSTransactions}