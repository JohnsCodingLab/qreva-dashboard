import CustomEye from '@/components/icons/CustomEye';
import CustomApprove from '@/components/icons/CustomApprove';
import CustomDecline from '@/components/icons/CustomDecline';

export const businessApprovalTabs = [
  { key: 'Pending', label: 'Pending' },
  { key: 'Approved', label: 'Approved' },
  { key: 'Declined', label: 'Declined' }
];

export const businessApprovalColumns = [
  {
    field: 'fullName',
    headerName: 'Applicant',
    width: 220,
    flex: 1,
    renderCell: (params) => (
      <div>
        <div className="text-sm font-medium text-[#1E1E1E]">{params.row.fullName}</div>
        <div className="text-xs text-qreva-navy">{params.row.emailAddress}</div>
      </div>
    )
  },
  {
    field: 'businessName',
    headerName: 'Business Name',
    width: 200,
    flex: 1,
    renderCell: (params) => (
      <div>
        <div className="text-sm text-[#1E1E1E]">{params.row.businessName || '-'}</div>
        <div className="text-xs text-qreva-navy">{params.row.businessRegistrationNumber || ''}</div>
      </div>
    )
  },
  {
    field: 'accountType',
    headerName: 'Account Type',
    width: 140,
    flex: 1,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
    flex: 1,
    renderCell: (params) => {
      const statusStyles = {
        Approved: 'border border-[#4ED17E] bg-[#E9F9EF] text-[#188C43]',
        Declined: 'border border-[#E56566] bg-[#FCECEC] text-[#9E2D2D]',
        Pending: 'border border-[#FFC535] bg-[#FFF8E6] text-[#B58202]'
      };

      return (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyles[params.value]}`}>
          {params.value}
        </span>
      );
    }
  },
  {
    field: 'submittedAt',
    headerName: 'Submission Date',
    width: 220,
    flex: 1,
    renderCell: (params) => {
      const dateObj = params.value ? new Date(params.value) : null;
      if (!dateObj) return <span>N/A</span>;
      const formatted = dateObj.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        + ' | ' + dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      return <span className="text-sm text-[#1E1E1E]">{formatted}</span>;
    },
  },
];

export const createBusinessApprovalActions = (
  navigate,
  activeTab,
  onAccept,
  onDecline
) => [
  {
    label: 'View Details',
    icon: CustomEye,
    onClick: (row) =>
      navigate(`/business-account-approvals/${activeTab}/${row.userId || row._id}`)
  },
  {
    label: 'Accept Approval',
    icon: CustomApprove,
    isVisible: (row) => String(row?.status || '').toLowerCase() === 'pending',
    onClick: (row) => onAccept(row)
  },
  {
    label: 'Decline Approval',
    icon: CustomDecline,
    isVisible: (row) => String(row?.status || '').toLowerCase() === 'pending',
    onClick: (row) => onDecline(row)
  }
];

