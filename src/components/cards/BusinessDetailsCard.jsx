const BusinessDetailsCard = ({ business }) => {
  if (!business) return null;

  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow-sm sm:p-6">
      <h3 className="text-lg font-semibold mb-4">Business Details</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DetailItem label="Business Name" value={business.businessName} />
        <DetailItem label="Business Email" value={business.businessEmail} />
        <DetailItem label="Business Phone" value={business.businessPhone} />
        <DetailItem 
          label="Business Address" 
          value={business.businessAddress} 
          className="sm:col-span-2" 
        />
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, className = '' }) => (
  <div className={className}>
    <p className="text-sm text-qreva-navy">{label}</p>
    <p className="font-medium text-black">{value || '-'}</p>
  </div>
);

export default BusinessDetailsCard;
