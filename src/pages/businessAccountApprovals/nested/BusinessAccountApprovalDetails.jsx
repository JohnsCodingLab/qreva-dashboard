import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ApprovalModals from '@/components/account-approvals/ApprovalModals';
import { useApprovalModals } from '@/hooks/useApprovalModals';
import {
  useBusinessAccountApprovalDetails,
  useApproveBusinessAccount,
  useDeclineBusinessAccount,
} from '@/store/features/approvals/useBusinessAccountApprovals';
import { handleError } from '@/store/utils/handleError';
import { handleSuccess } from '@/store/utils/handleSuccess';

const DetailItem = ({ label, value, className = '' }) => (
  <div className={className}>
    <p className="text-xs text-[#808C91] mb-1">{label}</p>
    <p className="font-medium text-sm text-[#1E1E1E]">{value || '-'}</p>
  </div>
);

const IdentityPhoto = ({ label, src, caption }) => (
  <div>
    <p className="text-xs text-[#808C91] mb-2">{label}</p>
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-100 aspect-square flex items-center justify-center">
      {src ? (
        <img src={src} alt={label} className="w-full h-full object-cover" />
      ) : (
        <div className="text-gray-400 text-xs text-center px-4">Not available</div>
      )}
    </div>
    {caption && <p className="text-xs text-[#808C91] mt-1">{caption}</p>}
  </div>
);

// The provider's NIN/BVN photograph is cached as raw base64 (see backend
// IdentityCheck) with no data-URI prefix - add one so <img> can render it,
// but tolerate a value that already has one.
const toImageSrc = (value) => {
  if (!value) return null;
  return value.startsWith('data:') ? value : `data:image/jpeg;base64,${value}`;
};

const DocumentPreview = ({ label, src }) => (
  <div>
    <p className="text-xs text-[#808C91] mb-2">{label}</p>
    {src ? (
      <a
        href={src}
        target="_blank"
        rel="noreferrer"
        className="mb-2 block break-all text-xs text-qreva-blue underline"
      >
        {src}
      </a>
    ) : null}
    <div className="border border-dashed border-gray-300 rounded-lg overflow-hidden bg-qreva-ash min-h-[300px] flex items-center justify-center">
      {src ? (
        <img src={src} alt={label} className="w-full h-full object-contain" />
      ) : (
        <div className="text-gray-400">No document uploaded</div>
      )}
    </div>
  </div>
);

const BusinessAccountApprovalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [approvalStatus, setApprovalStatus] = useState('pending');

  const { data: approvalResponse, isLoading } = useBusinessAccountApprovalDetails(id);
  const approveBusinessAccount = useApproveBusinessAccount();
  const declineBusinessAccount = useDeclineBusinessAccount();

  const responseData = approvalResponse?.data || {};
  const personal = responseData.personal || {};
  const business = responseData.business || {};
  const documents = responseData.documents || {};
  const client = responseData.client || {};
  const accounts = responseData.accounts || [];
  const identityVerification = responseData.identityVerification || {};
  const referenceImages = identityVerification.referenceImages || {};

  const {
    modals,
    setters,
    declineReason,
    setDeclineReason,
    feedbackType,
    setFeedbackType
  } = useApprovalModals();

  const handleApprove = useCallback(() => {
    if (approveBusinessAccount.isPending) return;
    approveBusinessAccount.mutate(id, {
      onSuccess: () => {
        setApprovalStatus('approved');
        setFeedbackType('approved');
        setters.setShowSuccessModal(true);
        handleSuccess('Business Account approved and created successfully');
      },
      onError: (error) => handleError(error),
    });
  }, [id, approveBusinessAccount, setFeedbackType, setters]);

  const handleDeclineSubmit = useCallback(() => {
    if (declineBusinessAccount.isPending) return;
    declineBusinessAccount.mutate({ userId: id, reason: declineReason }, {
      onSuccess: () => {
        setApprovalStatus('declined');
        setFeedbackType('declined');
        setters.setShowDeclineModal(false);
        setters.setShowSuccessModal(true);
        handleSuccess('Business Account request declined successfully');
      },
      onError: (error) => {
        setters.setShowDeclineModal(false);
        handleError(error);
      },
    });
  }, [id, declineReason, declineBusinessAccount, setFeedbackType, setters]);

  useEffect(() => {
    const normalized = String(responseData.reviewStatus || '').trim().toLowerCase();
    if (normalized === 'approved') {
      setApprovalStatus('approved');
      return;
    }
    if (normalized === 'declined') {
      setApprovalStatus('declined');
      return;
    }
    setApprovalStatus('pending');
  }, [responseData.reviewStatus]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F7FAFA]">
        <div className="text-qreva-navy">Loading...</div>
      </div>
    );
  }

  if (!personal.emailAddress) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F7FAFA]">
        <div className="text-qreva-navy">User not found</div>
      </div>
    );
  }

  const fullName = `${personal.firstName || ''} ${personal.lastName || ''}`.trim() || 'Unknown';
  const initials = `${(personal.firstName || '?')[0]}${(personal.lastName || '?')[0]}`.toUpperCase();
  const address = personal.address || {};

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
              onClick={() => navigate('/business-account-approvals')}
              className="flex items-center gap-2 text-sm text-[#808C91] hover:text-[#1E1E1E] mb-2"
            >
              <ArrowLeft size={16} />
              Back to Approvals
            </button>
            <h1 className="text-2xl font-bold text-[#1E1E1E]">Business Account Request</h1>
            <p className="text-qreva-navy text-sm">Personal details, business details, and submitted documents</p>
          </div>

          {approvalStatus === 'pending' && (
            <div className="flex gap-3">
              <button
                onClick={() => setters.setShowDeclineModal(true)}
                className="px-6 py-2 border border-red-200 text-qreva-orange bg-red-50 rounded-lg text-sm font-medium hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={declineBusinessAccount.isPending || approveBusinessAccount.isPending}
              >
                Decline
              </button>
              <button
                onClick={handleApprove}
                className="px-6 py-2 bg-[#FF5B04] text-white rounded-lg text-sm font-medium hover:bg-[#E54F03] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={approveBusinessAccount.isPending || declineBusinessAccount.isPending}
              >
                {approveBusinessAccount.isPending ? (
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
                  KYC Level {client.kycLevel || '-'}
                </span>
              </div>
              <p className="text-sm text-qreva-navy">
                Business Account Review: {responseData.reviewStatus || 'Pending'}
              </p>
            </div>
          </div>

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

        <div className="space-y-6">
          {/* Personal Details */}
          <Card className="shadow-none border border-gray-200">
            <div className="p-4 border-b border-qreva-ash">
              <h3 className="font-semibold text-black">Personal Details</h3>
            </div>
            <CardContent className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2">
              <DetailItem label="First Name" value={personal.firstName} />
              <DetailItem label="Last Name" value={personal.lastName} />
              <DetailItem label="Email Address" value={personal.emailAddress} />
              <DetailItem label="Phone Number" value={personal.phoneNumber} />
              <DetailItem label="Identity Type" value={personal.identityType} />
              <DetailItem label="BVN" value={personal.bvn} />
              <DetailItem label="NIN" value={personal.nin} />
            </CardContent>
          </Card>

          {/* Identity Verification - side-by-side face comparison */}
          <Card className="shadow-none border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Identity Verification</h3>
              <p className="text-xs text-[#808C91] mt-1">
                Compare the face captured at onboarding against the photo on file for the verified NIN/BVN
              </p>
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <IdentityPhoto
                  label="Onboarding Selfie"
                  src={identityVerification.onboardingSelfieUrl}
                  caption="Captured during signup"
                />
                {referenceImages.nin && (
                  <IdentityPhoto
                    label="NIN Photo on File"
                    src={toImageSrc(referenceImages.nin)}
                    caption="From NIMC verification"
                  />
                )}
                {referenceImages.bvn && (
                  <IdentityPhoto
                    label="BVN Photo on File"
                    src={toImageSrc(referenceImages.bvn)}
                    caption="From BVN verification"
                  />
                )}
                {!referenceImages.nin && !referenceImages.bvn && (
                  <IdentityPhoto label="NIN/BVN Photo on File" src={null} />
                )}
              </div>
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

          {/* Business Details */}
          <Card className="shadow-none border border-gray-200">
            <div className="p-4 border-b border-qreva-ash">
              <h3 className="font-semibold text-black">Business Details</h3>
            </div>
            <CardContent className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2">
              <DetailItem label="Business Name" value={business.businessName} />
              <DetailItem label="Business Registration Number (RC/BN)" value={business.businessRegistrationNumber} />
              <DetailItem label="Business Email Address" value={business.businessEmailAddress} />
              <DetailItem label="Business Phone Number" value={business.businessPhoneNumber} />
            </CardContent>
          </Card>

          {/* Director Details */}
          <Card className="shadow-none border border-gray-200">
            <div className="p-4 border-b border-qreva-ash">
              <h3 className="font-semibold text-black">Director Details</h3>
              <p className="text-xs text-[#808C91] mt-1">
                Self-declared registered director — verified against SafeHaven on approval
              </p>
            </div>
            <CardContent className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2">
              <DetailItem label="Director First Name" value={documents.directorFirstName} />
              <DetailItem label="Director Last Name" value={documents.directorLastName} />
              <DetailItem label="Director Identity Type" value={documents.directorIdentityType} />
              <DetailItem label="Director BVN/NIN" value={documents.directorIdentityNumber} />
            </CardContent>
          </Card>

          {/* Documents */}
          {(documents.cacDocument || documents.directorParticularsDocument) && (
            <Card className="shadow-none border border-gray-200">
              <div className="p-4 border-b border-qreva-ash">
                <h3 className="font-semibold text-black">Business Documents</h3>
                {responseData.submittedAt && (
                  <p className="text-xs text-[#808C91] mt-1">Submitted: {formatDate(responseData.submittedAt)}</p>
                )}
              </div>
              <CardContent className="p-4 space-y-6">
                <DocumentPreview label="CAC Registration Document" src={documents.cacDocument} />
                <DocumentPreview
                  label="Particulars of Directors (CAC Form 1.1)"
                  src={documents.directorParticularsDocument}
                />
              </CardContent>
            </Card>
          )}

          {/* Existing Accounts */}
          <Card className="shadow-none border border-gray-200">
            <div className="p-4 border-b border-qreva-ash">
              <h3 className="font-semibold text-black">Accounts on this Client</h3>
              <p className="text-xs text-[#808C91] mt-1">
                The Business Account will appear here once approved
              </p>
            </div>
            <CardContent className="p-4 space-y-4">
              {accounts.length === 0 && (
                <p className="text-sm text-gray-400">No accounts found</p>
              )}
              {accounts.map((account) => (
                <div
                  key={account._id || account.accountNumber}
                  className="grid grid-cols-1 gap-4 rounded-lg border border-qreva-ash p-4 sm:grid-cols-4"
                >
                  <DetailItem
                    label="Type"
                    value={account.entityType === 'Corporate' ? 'Business' : 'Individual'}
                  />
                  <DetailItem label="Account Number" value={account.accountNumber} />
                  <DetailItem label="Account Name" value={account.accountName} />
                  <DetailItem label="Bank" value={account.bankName} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <ApprovalModals
        modals={modals}
        setters={setters}
        selectedUser={personal}
        declineReason={declineReason}
        setDeclineReason={setDeclineReason}
        onAccept={handleApprove}
        onDecline={handleDeclineSubmit}
        feedbackType={feedbackType}
        isLoading={approveBusinessAccount.isPending || declineBusinessAccount.isPending}
      />
    </div>
  );
};

export default BusinessAccountApprovalDetails;

