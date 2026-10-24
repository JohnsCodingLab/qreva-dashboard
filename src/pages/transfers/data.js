const multiLineData = [
    { day: 'Today', bank: 14500, wallet: 14200 },
    { day: 'Yesterday', bank: 14200, wallet: 14800 },
    { day: '2 Days Ago', bank: 14800, wallet: 14600 },
    { day: '3 Days Ago', bank: 14600, wallet: 15200 },
    { day: '4 Days Ago', bank: 15200, wallet: 15800 },
    { day: '5 Days Ago', bank: 15800, wallet: 16200 },
    { day: '6 Days Ago', bank: 16200, wallet: 15600 },
    { day: '7 Days Ago', bank: 15600, wallet: 16800 },
    { day: 'Week Ago', bank: 16800, wallet: 16200 },
    { day: '2 Weeks Ago', bank: 16200, wallet: 13800 },
    { day: '3 Weeks Ago', bank: 13800, wallet: 17200 },
    { day: '4 Weeks Ago', bank: 17200, wallet: 18000 }
  ];

  const barData = [
    { day: 'Today', bank: 600, wallet: 700 },
    { day: 'Yesterday', bank: 450, wallet: 750 },
    { day: '2 Days Ago', bank: 500, wallet: 400 },
    { day: '3 Days Ago', bank: 650, wallet: 700 },
    { day: '4 Days Ago', bank: 350, wallet: 400 },
    { day: '5 Days Ago', bank: 580, wallet: 500 },
    { day: '6 Days Ago', bank: 480, wallet: 450 },
    { day: '7 Days Ago', bank: 520, wallet: 280 },
    { day: 'Week Ago', bank: 600, wallet: 550 },
    { day: '2 Weeks Ago', bank: 850, wallet: 780 },
    { day: '3 Weeks Ago', bank: 620, wallet: 800 },
    { day: '4 Weeks Ago', bank: 600, wallet: 620 }
  ];

  const lineChartSeries = [
    { data: multiLineData.map(d => d.bank), color: '#B54103', label: 'Wallet - Bank' },
    { data: multiLineData.map(d => d.wallet), color: '#FF9157', label: 'Wallet - Wallet' }
  ];

  const barChartSeries = [
    { data: barData.map(d => d.bank), color: '#B54103', label: 'Wallet - Bank' },
    { data: barData.map(d => d.wallet), color: '#FF9157', label: 'Wallet - Wallet' }
  ];

  const transferRegions = [
    { id: 1, location: 'Lagos', totalTransfers: 500000, volume: 40000, revenue: 40000, successRate: 98 },
    { id: 2, location: 'Abuja', totalTransfers: 50000, volume: 50000, revenue: 20000, successRate: 98 },
    { id: 3, location: 'Enugu', totalTransfers: 20000, volume: 20000, revenue: 10000, successRate: 98 },
    { id: 4, location: 'Rivers', totalTransfers: 50000, volume: 4000, revenue: 10000, successRate: 98 },
    { id: 5, location: 'Cross Rivers', totalTransfers: 100000, volume: 20000, revenue: 40000, successRate: 98 }
  ];

  const transferTransactions = [
    { id: 1, title: 'Transfer from Victor Odinaka', acc: '+234 801 234 5678', senderName: 'Rejoice Regina Rose', recipientName: 'Peculiar Regina', status: 'Successful', type: 'Credit', revenue: 100, amount: 4000, date: '10:00 AM | 25th March, 2025', category: 'Transfer', desc: 'Wallet Transfer', location: 'Lagos' },
    { id: 2, title: 'Transfer from Victor Odinaka', acc: '+234 801 234 5678', senderName: 'Rejoice Regina Rose', recipientName: 'Peculiar Regina', status: 'Pending', type: 'Debit', revenue: 100, amount: 5000, date: '10:00 AM | 25th March, 2025', category: 'Transfer', desc: 'Bank Transfer', location: 'Abuja' },
    { id: 3, title: 'Transfer from Victor Odinaka', acc: '+234 801 234 5678', senderName: 'Rejoice Regina Rose', recipientName: 'Peculiar Regina', status: 'Successful', type: 'Credit', revenue: 100, amount: 200, date: '10:00 AM | 25th March, 2025', category: 'Transfer', desc: 'Wallet Transfer', location: 'Enugu' },
    { id: 4, title: 'Transfer from Victor Odinaka', acc: '+234 801 234 5678', senderName: 'Rejoice Regina Rose', recipientName: 'Peculiar Regina', status: 'Failed', type: 'Credit', revenue: 100, amount: 400, date: '10:00 AM | 25th March, 2025', category: 'Transfer', desc: 'Bank Transfer', location: 'Rivers' },
    { id: 5, title: 'Transfer from Victor Odinaka', acc: '+234 801 234 5678', senderName: 'Rejoice Regina Rose', recipientName: 'Peculiar Regina', status: 'Successful', type: 'Debit', revenue: 100, amount: 20000, date: '10:00 AM | 25th March, 2025', category: 'Transfer', desc: 'Wallet Transfer', location: 'Lagos' }
  ];

   const statusData = [
    { id: 0, value: 30, label: 'Success', color: '#22C55E' },
    { id: 1, value: 20, label: 'Failed', color: '#FF5B04' },
    { id: 2, value: 20, label: 'Reversed', color: '#26C8B9' },
    { id: 3, value: 10, label: 'Pending', color: '#FFB703' }
  ];

   const stats = [
    { 
      label: 'Total Transfers', 
      value: '45,823', 
      subtext: '50,000 in last 24 hours',
      change: '+200%',
      changeColor: 'text-qreva-blue'
    },
    { 
      label: 'Total Transfers Volume', 
      value: '₦4,005,823', 
      subtext: '₦50,000 in last 24 hours',
      change: '+200%',
      changeColor: 'text-qreva-orange'
    },
    { 
      label: 'Total Transfers Revenue', 
      value: '₦1,070,823', 
      subtext: '₦50,000 in last 24 hours',
      change: '+200%',
      changeColor: 'text-qreva-orange'
    },
    { 
      label: 'Success Rate', 
      value: '98%', 
      subtext: '2% in last 24 hours',
      change: '+200%',
      changeColor: 'text-qreva-orange'
    },
  ];

   const allTransferTransactions = [
    { id: 1, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', senderName: 'Rejoice Regina Rose', recipientName: 'Peculiar Regina', status: 'First Time', type: 'Credit', revenue: 100, amount: 4000, date: '10:00 AM | 25th March, 2025', category: 'Transfer', desc: 'Wallet Transfer', location: 'Lagos' },
    { id: 2, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', senderName: 'Rejoice Regina Rose', recipientName: 'Peculiar Regina', status: 'Repeat Buyer', type: 'Debit', revenue: 100, amount: 5000, date: '10:00 AM | 25th March, 2025', category: 'Transfer', desc: 'Bank Transfer', location: 'Abuja' },
    { id: 3, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', senderName: 'Rejoice Regina Rose', recipientName: 'Peculiar Regina', status: 'First Time', type: 'Credit', revenue: 100, amount: 200, date: '10:00 AM | 25th March, 2025', category: 'Transfer', desc: 'Wallet Transfer', location: 'Enugu' },
    { id: 4, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', senderName: 'Rejoice Regina Rose', recipientName: 'Peculiar Regina', status: 'Repeat Buyer', type: 'Credit', revenue: 100, amount: 400, date: '10:00 AM | 25th March, 2025', category: 'Transfer', desc: 'Bank Transfer', location: 'Rivers' },
    { id: 5, title: 'Rejoice Regina Rose', acc: '+234 801 234 5678', senderName: 'Rejoice Regina Rose', recipientName: 'Peculiar Regina', status: 'First Time', type: 'Debit', revenue: 100, amount: 20000, date: '10:00 AM | 25th March, 2025', category: 'Transfer', desc: 'Wallet Transfer', location: 'Lagos' }
  ];

export {multiLineData, barData, lineChartSeries, barChartSeries, transferRegions, transferTransactions, statusData, stats, allTransferTransactions}  