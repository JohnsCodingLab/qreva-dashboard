import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ApprovalModals from '@/components/account-approvals/ApprovalModals';
import { useApprovalModals } from '@/hooks/useApprovalModals';
import { useAccountApprovalDetails, useApproveAccount, useDeclineAccount } from '@/store/features/approvals/useAccountApprovals';
import { handleError } from '@/store/utils/handleError';
import { handleSuccess } from '@/store/utils/handleSuccess';

const DetailItem = ({ label, value, className = '' }) => (
  <div className={className}>
    <p className="text-xs text-[#808C91] mb-1">{label}</p>
    <p className="font-medium text-sm text-[#1E1E1E]">{value || '-'}</p>
  </div>
);

const ImagePreview = ({ label, src, alt }) => (
  <div>
    <p className="text-xs text-[#808C91] mb-2">{label}</p>
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
    <div className="border border-dashed border-gray-300 rounded-lg overflow-hidden bg-qreva-ash min-h-[300px] flex items-center justify-center">
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-contain" />
      ) : (
        <div className="text-gray-400">{alt || 'No image uploaded'}</div>
      )}
    </div>
  </div>
);

const AccountApprovalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [approvalStatus, setApprovalStatus] = useState('pending');

  const { data: approvalResponse, isLoading } = useAccountApprovalDetails(id);
  const approveAccount = useApproveAccount();
  const declineAccount = useDeclineAccount();

  // API returns { user: {...}, client: {...} }
  const responseData = approvalResponse?.data || {};
  const user = responseData.user || responseData;
  const client = responseData.client || {};

  const {
    modals,
    setters,
    declineReason,
    setDeclineReason,
    feedbackType,
    setFeedbackType
  } = useApprovalModals();

  const handleApprove = useCallback(() => {
    if (approveAccount.isPending) return;
    approveAccount.mutate(id, {
      onSuccess: () => {
        setApprovalStatus('approved');
        setFeedbackType('approved');
        setters.setShowSuccessModal(true);
        handleSuccess('Account approved successfully');
      },
      onError: (error) => handleError(error),
    });
  }, [id, approveAccount, setFeedbackType, setters]);

  const handleDeclineSubmit = useCallback(() => {
    if (declineAccount.isPending) return;
    declineAccount.mutate({ userId: id, reason: declineReason }, {
      onSuccess: () => {
        setApprovalStatus('declined');
        setFeedbackType('declined');
        setters.setShowDeclineModal(false);
        setters.setShowSuccessModal(true);
        handleSuccess('Account declined successfully');
      },
      onError: (error) => {
        setters.setShowDeclineModal(false);
        handleError(error);
      },
    });
  }, [id, declineReason, declineAccount, setFeedbackType, setters]);

  useEffect(() => {
    const normalizedTierStatus = String(
      user?.kycTier3ReviewStatus || user?.kycTier3Status || ''
    )
      .trim()
      .toLowerCase();

    if (normalizedTierStatus === 'approved') {
      setApprovalStatus('approved');
      return;
    }
    if (normalizedTierStatus === 'declined' || normalizedTierStatus === 'rejected') {
      setApprovalStatus('declined');
      return;
    }
    setApprovalStatus('pending');
  }, [user?.kycTier3ReviewStatus, user?.kycTier3Status]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F7FAFA]">
        <div className="text-qreva-navy">Loading...</div>
      </div>
    );
  }

  if (!user || !user._id) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F7FAFA]">
        <div className="text-qreva-navy">User not found</div>
      </div>
    );
  }

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown';
  const initials = `${(user.firstName || '?')[0]}${(user.lastName || '?')[0]}`.toUpperCase();
  const kycLevel = client.kycLevel || '-';
  const tierReviewStatus = user.kycTier3ReviewStatus || user.status || 'Pending';
  const address = user.address || {};
  const kycDocs = user.kycTier3Documents || {};

  const formatDate = (val) => {
    if (!val) return '-';
    const d = new Date(val);
    if (isNaN(d)) return val;
    return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-6 pb-20">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <button
              onClick={() => navigate('/account-approvals')}
              className="flex items-center gap-2 text-sm text-[#808C91] hover:text-[#1E1E1E] mb-2"
            >
              <ArrowLeft size={16} />
              Back to Approvals
            </button>
            <h1 className="text-2xl font-bold text-[#1E1E1E]">View Details</h1>
            <p className="text-qreva-navy text-sm">Here is the full details submitted by the user</p>
          </div>

          {approvalStatus === 'pending' && (
            <div className="flex gap-3">
              <button
                onClick={() => setters.setShowDeclineModal(true)}
                className="px-6 py-2 border border-red-200 text-qreva-orange bg-red-50 rounded-lg text-sm font-medium hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={declineAccount.isPending || approveAccount.isPending}
              >
                Decline
              </button>
              <button
                onClick={handleApprove}
                className="px-6 py-2 bg-[#FF5B04] text-white rounded-lg text-sm font-medium hover:bg-[#E54F03] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={approveAccount.isPending || declineAccount.isPending}
              >
                {approveAccount.isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Approving...</span>
                  </>
                ) : (
                  'Approve'
                )}
              </button>
            </div>
          )}
        </div>

        {/* User Banner */}
        <div className="bg-white p-4 rounded-lg border border-qreva-ash mb-6 flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-qreva-blue font-bold text-lg">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-[#1E1E1E]">{fullName}</h2>
                <span className="bg-[#E0F2FE] text-[#0284C7] text-xs px-2 py-0.5 rounded">
                  KYC Level {kycLevel}
                </span>
              </div>
              <p className="text-sm text-qreva-navy">Tier 3 Review: {tierReviewStatus} | {user.type || 'Individual'}</p>
            </div>
          </div>

          {approvalStatus === 'pending' && (
            <button
              onClick={() => setters.setShowGuidelinesModal(true)}
              className="text-sm text-qreva-navy hover:text-black flex items-center gap-1 mt-3"
            >
              Guidelines for Good Upload →
            </button>
          )}

          {approvalStatus === 'approved' && (
            <span className="flex items-center gap-1 text-qreva-blue bg-green-50 px-3 py-1 rounded-full text-sm font-medium mt-3 w-fit">
              Approved <CheckCircle size={16} />
            </span>
          )}
        </div>

        {/* Decline Reason */}
        {approvalStatus === 'declined' && (
          <div className="bg-[#FFF4F2] border border-[#FECACA] rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-[#7F1D1D] mb-1">Reason For Declining</h4>
            <p className="text-sm text-[#991B1B]">{declineReason}</p>
          </div>
        )}

        {/* Details Sections */}
        <div className="space-y-6">
          {/* Personal Details */}
          <Card className="shadow-none border border-gray-200">
            <div className="p-4 border-b border-qreva-ash">
              <h3 className="font-semibold text-black">Personal Details</h3>
            </div>
            <CardContent className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2">
              <DetailItem label="First Name" value={user.firstName} />
              <DetailItem label="Last Name" value={user.lastName} />
              <DetailItem label="Email Address" value={user.emailAddress} />
              <DetailItem label="Phone Number" value={user.phoneNumber} />
              <DetailItem label="Date of Birth" value={formatDate(user.dateOfBirth)} />
              <DetailItem label="Account Type" value={user.type} />
              <DetailItem label="Status" value={user.status} />
              <DetailItem label="Created" value={formatDate(user.createdAt)} />
            </CardContent>
          </Card>

          {/* Address */}
          {address.address1 && (
            <Card className="shadow-none border border-gray-200">
              <div className="p-4 border-b border-qreva-ash">
                <h3 className="font-semibold text-black">Address</h3>
              </div>
              <CardContent className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2">
                <DetailItem label="Address" value={address.address1} className="col-span-2" />
                <DetailItem label="City" value={address.city} />
                <DetailItem label="State" value={address.state} />
                <DetailItem label="Country" value={address.country} />
              </CardContent>
            </Card>
          )}

          {/* Identity Verification */}
          <Card className="shadow-none border border-gray-200">
            <div className="p-4 border-b border-qreva-ash">
              <h3 className="font-semibold text-black">Identity Verification</h3>
            </div>
            <CardContent className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2">
              {user.bvn && (
                <>
                  <DetailItem label="Identity Type" value={user.identityType2 || 'BVN'} />
                  <DetailItem label="BVN Number" value={user.bvn} />
                </>
              )}
              {user.nin && (
                <>
                  <DetailItem label="Identity Type" value={user.identityType || 'NIN'} />
                  <DetailItem label="NIN Number" value={user.nin} />
                </>
              )}
            </CardContent>
          </Card>

          {/* KYC Tier 3 Documents */}
          {(kycDocs.proofOfAddress || kycDocs.photoId || kycDocs.cacDocument || kycDocs.cac2Document) && (
            <Card className="shadow-none border border-gray-200">
              <div className="p-4 border-b border-qreva-ash">
                <h3 className="font-semibold text-black">KYC Tier 3 Documents</h3>
                {user.kycTier3SubmittedAt && (
                  <p className="text-xs text-[#808C91] mt-1">Submitted: {formatDate(user.kycTier3SubmittedAt)}</p>
                )}
              </div>
              <CardContent className="p-4 space-y-6">
                {kycDocs.photoId && (
                  <ImagePreview label="Photo ID" src={kycDocs.photoId} alt="Photo ID" />
                )}
                {kycDocs.proofOfAddress && (
                  <ImagePreview label="Proof of Address" src={kycDocs.proofOfAddress} alt="Proof of Address" />
                )}
                {kycDocs.cacDocument && (
                  <ImagePreview label="CAC Document" src={kycDocs.cacDocument} alt="CAC Document" />
                )}
                {kycDocs.cac2Document && (
                  <ImagePreview label="CAC 2 Document (Particulars of Directors)" src={kycDocs.cac2Document} alt="CAC 2 Document" />
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ApprovalModals
        modals={modals}
        setters={setters}
        selectedUser={user}
        declineReason={declineReason}
        setDeclineReason={setDeclineReason}
        onAccept={handleApprove}
        onDecline={handleDeclineSubmit}
        feedbackType={feedbackType}
        isLoading={approveAccount.isPending || declineAccount.isPending}
      />
    </div>
  );
};

export default AccountApprovalDetails;

