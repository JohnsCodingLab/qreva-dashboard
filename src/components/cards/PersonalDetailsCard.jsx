const PersonalDetailsCard = ({ user }) => {
  const personal = user.personalDetails || {};
  const dob = personal.dateOfBirth
    ? new Date(personal.dateOfBirth).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;
  const signedUpDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow-sm sm:p-6">
      <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DetailItem label="First Name" value={user.firstName} />
        <DetailItem label="Last Name" value={user.lastName} />
        <DetailItem label="Email Address" value={user.emailAddress} />
        <DetailItem label="Mobile Number" value={user.phoneNumber} />
        <DetailItem label="Date of Birth" value={dob} />
        <DetailItem label="Signed Up" value={signedUpDate} />
        <DetailItem label="Account Status" value={user.status} />
        <DetailItem label="Gender" value={personal.gender} />
        <DetailItem label="State" value={personal.state} />
        <DetailItem label="LGA" value={personal.lga} />
        {(user.referralCode || user.referralLink) && (
          <DetailItem label="Referral Code" value={user.referralCode} />
        )}
        {(user.referralCode || user.referralLink) && (
          <DetailItem label="Referral Link" value={user.referralLink} />
        )}
        <DetailItem label="Address" value={personal.address} className="sm:col-span-2" />
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

export default PersonalDetailsCard;
