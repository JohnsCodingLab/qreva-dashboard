export const mockApprovals = [
  { 
    id: 1, 
    name: 'Rejoice Regina Rose', 
    email: 'emailaddress@gmail.com', 
    account: 'Personal Account', 
    tier: 'Tier 2', 
    status: 'Pending', 
    date: '10:00 AM | 25th March, 2025',
    firstName: 'Rejoice',
    middleName: 'Regina',
    lastName: 'Rose',
    phone: '08012345678',
    tier1: { validId: 'BVN', bvnNumber: '2018****190' },
    tier2: { validId: 'BVN', bvnNumber: '2018****190', ninNumber: '2018****190' }
  },
  { 
    id: 2, 
    name: 'John Doe', 
    email: 'johndoe@gmail.com', 
    account: 'Agent Account', 
    tier: 'Tier 2', 
    status: 'Pending', 
    date: '10:00 AM | 24th March, 2025',
    firstName: 'John',
    middleName: '',
    lastName: 'Doe',
    phone: '08012345679',
    tier1: { validId: 'BVN', bvnNumber: '2018****191' },
    tier2: { validId: 'BVN', bvnNumber: '2018****191', ninNumber: '2018****191' }
  },
  { 
    id: 3, 
    name: 'Sarah Smith', 
    email: 'sarah@gmail.com', 
    account: 'Merchant', 
    tier: 'Tier 2', 
    status: 'Declined', 
    date: '09:00 AM | 25th March, 2025',
    firstName: 'Sarah',
    middleName: '',
    lastName: 'Smith',
    phone: '08012345680',
    tier1: { validId: 'BVN', bvnNumber: '2018****192' },
    tier2: { validId: 'BVN', bvnNumber: '2018****192', ninNumber: '2018****192' },
    declineReason: "Your NIN photo isn't well lit and it looks blurry."
  },
  { 
    id: 4, 
    name: 'Michael Brown', 
    email: 'michael@gmail.com', 
    account: 'Agent Account', 
    tier: 'Tier 2', 
    status: 'Approved', 
    date: '10:00 AM | 25th March, 2025',
    firstName: 'Michael',
    middleName: '',
    lastName: 'Brown',
    phone: '08012345681',
    tier1: { validId: 'BVN', bvnNumber: '2018****193' },
    tier2: { validId: 'BVN', bvnNumber: '2018****193', ninNumber: '2018****193' }
  },
];

export const getApprovalById = (id) => {
  return mockApprovals.find(approval => approval.id === parseInt(id));
};