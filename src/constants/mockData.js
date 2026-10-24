import TransfersIcon from '../assets/icons/transfer.svg';
import SoftPOSIcon from '../assets/icons/softpos.svg';
import KYCIcon from '../assets/icons/kycapproval.svg';
import AirtimeIcon from '../assets/icons/phone.svg';
import DataIcon from '../assets/icons/globe.svg';
import dummyImg from '../assets/images/dummy.png'
import AirtelIcon from '../assets/icons/airtel.svg'
import MTNIcon from '../assets/icons/mtn.svg'
import GloIcon from '../assets/icons/glo.svg'
import EtisalatIcon from '../assets/icons/etisalat.svg'
import NineMobileIcon from '../assets/icons/9mobile.svg'


export const dailyTransactionData = [
  { day: 'Today', value: 145000 },
  { day: '1Day', value: 114200 },
  { day: '2 Days', value: 140800 },
  { day: '3 Days', value: 140600 },
  { day: '4 Days', value: 150200 },
  { day: '5 Days', value: 415800 },
  { day: '6 Days', value: 162000 },
  { day: '7 Days', value: 150600 },
  { day: '8 Days', value: 160800 },
  { day: '9 Days', value: 160200 },
  { day: '10 Days', value: 103800 },
  { day: '11 Days', value: 917200 }
];

export const topTransactionTypes = [
  { 
    id: 1, 
    name: 'Transfers', 
    value: 2000000, 
    icon: TransfersIcon ,
    percentage: 80
  },
  { 
    id: 2, 
    name: 'SoftPOS', 
    value: 2000000, 
    icon: SoftPOSIcon,
    percentage: 70
  },
  { 
    id: 3, 
    name: 'KYC Ver.', 
    value: 2000000, 
    icon: KYCIcon,
    percentage: 60
  },
  { 
    id: 4, 
    name: 'Airtime', 
    value: 2000000, 
    icon: AirtimeIcon,
    percentage: 85
  },
  { 
    id: 5, 
    name: 'Data', 
    value: 2000000, 
    icon: DataIcon,
    percentage: 65
  }
];

export const transactionPercentages = [
  { id: 0, value: 30, label: 'Airtime', color: '#E85304' },
  { id: 1, value: 20, label: 'Transfers', color: '#FF5B04' },
  { id: 2, value: 20, label: 'SoftPOS', color: '#FF7C36' },
  { id: 3, value: 10, label: 'KYC Ver.', color: '#26C8B9' },
  { id: 4, value: 20, label: 'Requests', color: '#FF7C36' },
  { id: 5, value: 10, label: 'Data', color: '#26C8B9' }
];

export const airtimePercentages = [
  { id: 0, value: 30, label: 'Airtel', color: '#E85304' },
  { id: 1, value: 20, label: 'MTN', color: '#FF5B04' },
  { id: 2, value: 20, label: 'Etisalat', color: '#FF7C36' },
  { id: 3, value: 10, label: 'Glo', color: '#26C8B9' },
  { id: 4, value: 20, label: '9Mobile', color: '#FF7C36' },
];

export const cardVsQRPayments = [
  { id: 1, value: 70, label: 'QR Payments', color: '#26C8B9' },
  { id: 0, value: 30, label: 'Card Payments', color: '#E85304' }
  
];

export const topCustomers = [
  { id: 1, name: 'Rejoice Rosa', amount: 2000000, avatar: dummyImg, rank: 1 },
  { id: 2, name: 'Rejoice Rosa', amount: 2000000, avatar: dummyImg, rank: 2 },
  { id: 3, name: 'Rejoice Rosa', amount: 2000000, avatar: dummyImg, rank: 3 },
  { id: 4, name: 'Rejoice Rosa', amount: 2000000, avatar: dummyImg, rank: 4 },
  { id: 5, name: 'Rejoice Rosa', amount: 2000000, avatar: dummyImg, rank: 5 },
  { id: 6, name: 'Rejoice Rosa', amount: 2000000, avatar: dummyImg, rank: 6 },
  { id: 7, name: 'Rejoice Rosa', amount: 2000000, avatar: dummyImg, rank: 7 },
  { id: 8, name: 'Rejoice Rosa', amount: 2000000, avatar: dummyImg, rank: 8 },
  { id: 9, name: 'Rejoice Rosa', amount: 2000000, avatar: dummyImg, rank: 9 },
  { id: 10, name: 'Rejoice Rosa', amount: 2000000, avatar: dummyImg, rank: 10 }
];

export const regionsData = [
  { id: 1, location: 'Lagos', total: 500000, revenue: 40000, volume: 40000, rate: 98 },
  { id: 2, location: 'Abuja', total: 50000, revenue: 23000, volume: 50000, rate: 98 },
  { id: 3, location: 'Enugu', total: 20000, revenue: 14000, volume: 20000, rate: 98 },
  { id: 4, location: 'Rivers', total: 50000, revenue: 10000, volume: 4000, rate: 98 },
  { id: 5, location: 'Cross Rivers', total: 100000, revenue: 40000, volume: 20000, rate: 98 }
];

export const transactionHistoryData = [
  { id: 1, title: 'Rejoice Regina', acc: 'Acc. Number', desc: 'Transfer from Vict...', category: 'Transfer', status: 'Successful', type: 'Credit', amount: 40000, date: '10:00 AM | 20th March, 2025' },
  { id: 2, title: 'Rejoice Regina', acc: 'Acc. Number', desc: 'Transfer to Victor...', category: 'Transfer', status: 'Successful', type: 'Debit', amount: 5000000, date: '10:00 AM | 20th March, 2025' },
  { id: 3, title: 'Rejoice Regina', acc: 'Acc. Number', desc: 'GoTv Subscription', category: 'Bill Payment', status: 'Successful', type: 'Debit', amount: 200000, date: '10:00 AM | 20th March, 2025' },
  { id: 4, title: 'Rejoice Regina', acc: 'Acc. Number', desc: 'Airtime Purchase', category: 'Airtime', status: 'Successful', type: 'Debit', amount: 40000000, date: '10:00 AM | 20th March, 2025' },
  { id: 5, title: 'Rejoice Regina', acc: 'Acc. Number', desc: 'MTN 2.5GB for 900', category: 'Data', status: 'Successful', type: 'Debit', amount: 20000, date: '10:00 AM | 20th March, 2025' },
  { id: 6, title: 'Rejoice Regina', acc: 'Acc. Number', desc: 'MTN 3.5GB for 1000', category: 'Data', status: 'Successful', type: 'Debit', amount: 30000, date: '10:00 AM | 20th March, 2025' },
  { id: 7, title: 'Rejoice Regina', acc: 'Acc. Number', desc: 'Transfer from Vict...', category: 'Transfer', status: 'Successful', type: 'Credit', amount: 20000, date: '10:00 AM | 20th March, 2025' },
  { id: 8, title: 'Rejoice Regina', acc: 'Acc. Number', desc: 'Transfer from Vict...', category: 'Transfer', status: 'Successful', type: 'Credit', amount: 20000, date: '10:00 AM | 20th March, 2025' },
  { id: 9, title: 'Rejoice Regina', acc: 'Acc. Number', desc: 'Transfer from Vict...', category: 'Transfer', status: 'Successful', type: 'Credit', amount: 20000, date: '10:00 AM | 20th March, 2025' }
];

export const airtimeProviders = [
  { 
    id: 1, 
    name: 'Airtel', 
    value: 2000000, 
    color: '#E31E24',
    icon: AirtelIcon,
    percentage: 85
  },
  { 
    id: 2, 
    name: 'MTN', 
    value: 2000000, 
    color: '#FFCB05',
    icon: MTNIcon,
    percentage: 75
  },
  { 
    id: 3, 
    name: 'Glo', 
    value: 2000000, 
    color: '#00A65A',
    icon: GloIcon,
    percentage: 65
  },
  { 
    id: 4, 
    name: 'Etisalat', 
    value: 2000000, 
    color: '#006F3E',
    icon: EtisalatIcon,
    percentage: 70
  },
  { 
    id: 5, 
    name: '9Mobile', 
    value: 2000000, 
    color: '#00923F',
    icon: NineMobileIcon,
    percentage: 60
  }
];