import { X } from 'lucide-react';

const RequestDetailsModal = ({ isOpen, onClose, request }) => {
  if (!isOpen || !request) return null;

  const getStatusBadge = () => {
    const statusStyles = {
      Pending: 'bg-[#FFF8E6] border border-[#FFC535] text-[#B58202]',
      Approved: 'bg-[#E9F9EF] border border-[#4ED17E] text-[#188C43]',
      Rejected: 'bg-[#FCECEC] border border-[#E56566] text-[#9E2D2D]',
      pending: 'bg-[#FFF8E6] border border-[#FFC535] text-[#B58202]',
      accepted: 'bg-[#E9F9EF] border border-[#4ED17E] text-[#188C43]',
      declined: 'bg-[#FCECEC] border border-[#E56566] text-[#9E2D2D]',
    };
    return (
      <span className={`px-3 py-1.5 rounded-md text-xs font-general font-semibold capitalize ${statusStyles[request.status] || 'bg-qreva-ash border border-gray-300 text-qreva-navy'}`}>
        {request.status}
      </span>
    );
  };

  const formattedDate = request.createdAt
    ? new Date(request.createdAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '-';

  const initials = (request.requesterName || '')
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'RQ';

  const receiverName = request.receiverName || request.recipientName || request.receiver?.name || null;
  const receiverEmail = request.receiverEmail || request.recipientEmail || request.receiver?.email || null;
  const receiverRole = request.receiverRole || request.recipientRole || request.receiver?.role || null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-general font-bold text-[#1E1E1E]">Request Details</h2>
              <p className="text-sm font-general text-[#475367] mt-1">Here are the details of this request</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-qreva-navy">
              <X size={24} />
            </button>
          </div>

          {/* Requester avatar + amount */}
          <div className="bg-[#F7FAFA] rounded-lg p-6 mb-6 text-center">
            <div className="w-12 h-12 bg-[#D0E7ED] rounded-full flex items-center justify-center text-[#084059] font-general font-semibold mx-auto mb-3">
              {initials}
            </div>
            <h3 className="text-base font-general font-medium text-[#1E1E1E] mb-1">
              {request.requesterName}
            </h3>
            <p className="text-sm font-general text-[#808C91] mb-3">{request.requesterEmail || 'No email'}</p>
            <p className="text-2xl font-general font-bold text-[#1E1E1E] mb-3">
              ₦{(request.amount || 0).toLocaleString()}
            </p>
            {getStatusBadge()}
          </div>

          {/* Sender details */}
          <div className="mb-5">
            <p className="text-xs font-general font-semibold text-[#808C91] uppercase tracking-wide mb-3">Request Sender</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-general text-[#808C91] mb-1">Name</p>
                <p className="text-sm font-general font-medium text-[#1E1E1E]">{request.requesterName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-general text-[#808C91] mb-1">Role</p>
                <p className="text-sm font-general font-medium text-[#1E1E1E]">{request.requesterRole || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-general text-[#808C91] mb-1">Email</p>
                <p className="text-sm font-general font-medium text-[#1E1E1E] break-all">{request.requesterEmail || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Receiver details */}
          <div className="mb-5">
            <p className="text-xs font-general font-semibold text-[#808C91] uppercase tracking-wide mb-3">Request Receiver</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-general text-[#808C91] mb-1">Name</p>
                <p className="text-sm font-general font-medium text-[#1E1E1E]">{receiverName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-general text-[#808C91] mb-1">Role</p>
                <p className="text-sm font-general font-medium text-[#1E1E1E]">{receiverRole || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-general text-[#808C91] mb-1">Email</p>
                <p className="text-sm font-general font-medium text-[#1E1E1E] break-all">{receiverEmail || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-general text-[#808C91] mb-1">Request Type</p>
              <p className="text-sm font-general font-medium text-[#1E1E1E]">{request.requestType || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-general text-[#808C91] mb-1">Date</p>
              <p className="text-sm font-general font-medium text-[#1E1E1E]">{formattedDate}</p>
            </div>
          </div>

          {/* Reason */}
          <div className="mb-6">
            <p className="text-xs font-general text-[#808C91] mb-2">Reason</p>
            <p className="text-sm font-general text-[#1E1E1E] leading-relaxed">{request.reason || '-'}</p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {request.status === 'Approved' && (
              <button className="w-full py-3 bg-[#FFF8E6] text-[#FF5B04] rounded-lg text-sm font-general font-medium hover:bg-[#FFE4CC] transition-colors">
                View Receipt
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#FF5B04] text-white rounded-lg text-sm font-general font-medium hover:bg-[#E54F03] transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
