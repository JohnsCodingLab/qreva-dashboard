const TierDetailsCard = ({ tier, data }) => {
  if (!data) return null;

  const renderTier1 = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <DetailItem label="Valid ID" value={data.validId} />
      <DetailItem label="BVN Number" value={data.bvnNumber} />
    </div>
  );

  const renderTier2 = () => (
    <>
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DetailItem label="Valid ID" value={data.validId} />
        <DetailItem label="NIN Number" value={data.ninNumber} />
      </div>
      <ImagePreview
        label="Uploaded Photo"
        src={data.photoUrl}
        alt="NIN Card Image"
      />
    </>
  );

  const renderTier3 = () => (
    <>
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DetailItem label="State" value={data.state} />
        <DetailItem label="Local Government Area" value={data.lga} />
        <DetailItem label="Address" value={data.address} className="sm:col-span-2" />
        <DetailItem label="Document Type" value={data.documentType} className="sm:col-span-2" />
      </div>
      <div className="space-y-4">
        <ImagePreview
          label="Photo ID"
          src={data.photoIdUrl || data.documentUrl}
          alt="Photo ID"
        />
        <ImagePreview
          label="Proof Of Address"
          src={data.proofOfAddressUrl || data.documentUrl}
          alt="Proof Of Address"
        />
        {data.cacDocumentUrl && (
          <ImagePreview
            label="CAC Document"
            src={data.cacDocumentUrl}
            alt="CAC Document"
          />
        )}
        {data.cac2DocumentUrl && (
          <ImagePreview
            label="CAC 2 Document (Particulars of Directors)"
            src={data.cac2DocumentUrl}
            alt="CAC 2 Document"
          />
        )}
      </div>
    </>
  );

  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow-sm sm:p-6">
      <h3 className="text-lg font-semibold mb-4">Tier {tier} Details</h3>
      {tier === 1 && renderTier1()}
      {tier === 2 && renderTier2()}
      {tier === 3 && renderTier3()}
    </div>
  );
};

const DetailItem = ({ label, value, className = '' }) => (
  <div className={className}>
    <p className="text-sm text-qreva-navy">{label}</p>
    <p className="font-medium text-black">{value || '-'}</p>
  </div>
);

const ImagePreview = ({ label, src, alt }) => (
  <div>
    <p className="text-sm text-qreva-navy mb-2">{label}</p>
    {src && !String(src).startsWith('data:') && (
      <a
        href={src}
        target="_blank"
        rel="noreferrer"
        className="mb-2 block break-all text-xs text-qreva-blue underline"
      >
        {src}
      </a>
    )}
    <div className="h-56 w-full overflow-hidden rounded-lg bg-qreva-ash sm:h-64">
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-gray-400">{alt}</span>
        </div>
      )}
    </div>
  </div>
);

export default TierDetailsCard;
