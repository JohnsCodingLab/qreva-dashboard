import RequestCard from './RequestCard';

const RequestsGrid = ({ requests, onViewDetails }) => {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#475367] font-general">No requests found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {requests.map((request) => (
        <RequestCard
          key={request._id || request.id}
          request={request}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default RequestsGrid;
