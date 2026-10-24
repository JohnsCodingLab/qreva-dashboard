import { User, Calendar, Mail } from 'lucide-react';

const RequestCard = ({ request, onViewDetails }) => {
  const formattedDate = request.createdAt
    ? new Date(request.createdAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })
    : '-';

  const receiverName = request.receiverName || request.recipientName || request.receiver?.name || null;
  const receiverEmail = request.receiverEmail || request.recipientEmail || request.receiver?.email || null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-base font-general font-semibold text-[#1E1E1E]">
          {request.requestType}
        </h3>
        <button
          onClick={() => onViewDetails(request)}
          className="text-[#FF5B04] text-sm font-general font-medium hover:underline"
        >
          View Details →
        </button>
      </div>

      <p className="text-sm font-general text-[#475367] mb-4">
        {request.reason}
      </p>

      <div className="mb-4 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="text-xs font-general text-[#808C91] mb-0.5">Sender</p>
          <div className="flex items-center gap-1.5 text-sm font-general text-[#475367]">
            <User size={14} className="shrink-0" />
            <span className="truncate">{request.requesterName || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-general text-[#808C91] mt-0.5">
            <Mail size={12} className="shrink-0" />
            <span className="truncate" title={request.requesterEmail}>{request.requesterEmail || 'N/A'}</span>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-general text-[#808C91] mb-0.5">Receiver</p>
          <div className="flex items-center gap-1.5 text-sm font-general text-[#475367]">
            <User size={14} className="shrink-0" />
            <span className="truncate">{receiverName || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-general text-[#808C91] mt-0.5">
            <Mail size={12} className="shrink-0" />
            <span className="truncate" title={receiverEmail}>{receiverEmail || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-general text-[#808C91]">
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>
        <span className="text-xl font-general font-bold text-[#1E1E1E]">
          ₦{(request.amount || 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default RequestCard;
