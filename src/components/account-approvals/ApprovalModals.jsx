import { CheckCircle, X } from 'lucide-react';
import BaseModal from '@/components/modals/BaseModal';

const ApprovalModals = ({
  modals,
  setters,
  selectedUser,
  declineReason,
  setDeclineReason,
  onAccept,
  onDecline,
  feedbackType,
  isLoading = false,
}) => {
  const displayName = selectedUser?.name || selectedUser?.fullName ||
    `${selectedUser?.firstName || ''} ${selectedUser?.lastName || ''}`.trim() || 'this user';

  return (
    <>
      {/* Accept Modal */}
      <BaseModal
        isOpen={modals.showAcceptModal}
        onClose={() => {
          if (!isLoading) setters.setShowAcceptModal(false);
        }}
        title="Accept Approval"
      >
        <p className="text-sm text-[#808C91] font-general mb-6">
          Are you sure you want to accept the approval for{' '}
          <span className="font-semibold text-[#1E1E1E]">{displayName}</span>?
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setters.setShowAcceptModal(false);
            }}
            disabled={isLoading}
            className="flex-1 py-3 text-sm font-general font-medium text-[#1E1E1E] bg-white border border-[#E8EBED] rounded-lg hover:bg-[#F7FAFA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            disabled={isLoading}
            className="flex-1 py-3 text-sm font-general font-medium text-white bg-[#4ED17E] rounded-lg hover:bg-[#3DB86A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Approving...</span>
              </>
            ) : (
              'Accept'
            )}
          </button>
        </div>
      </BaseModal>

      {/* Decline Modal */}
      <BaseModal
        isOpen={modals.showDeclineModal}
        onClose={() => {
          if (!isLoading) setters.setShowDeclineModal(false);
        }}
        title="Reason for Declining"
      >
        <p className="text-sm text-[#808C91] font-general mb-4">
          Kindly write down your reason for declining this KYC approval
        </p>
        <textarea
          disabled={isLoading}
          className="w-full p-3 border border-[#E8EBED] rounded-lg text-sm font-general focus:outline-none focus:ring-2 focus:ring-[#FF5B04]/20 mb-6 h-32 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Reason For Declining..."
          value={declineReason}
          onChange={(e) => setDeclineReason(e.target.value)}
        />
        <button
          onClick={onDecline}
          disabled={!declineReason?.trim() || isLoading}
          className="w-full py-3 bg-[#E56566] text-white rounded-lg font-general font-medium hover:bg-[#D14546] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Declining...</span>
            </>
          ) : (
            'Decline Approval'
          )}
        </button>
      </BaseModal>

      {/* Success Modal */}
      <BaseModal
        isOpen={modals.showSuccessModal}
        onClose={() => setters.setShowSuccessModal(false)}
        hasCloseButton={true}
        title=""
      >
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            feedbackType === 'approved' ? 'bg-[#E9F9EF]' : 'bg-[#FCECEC]'
          }`}>
            {feedbackType === 'approved' ? (
              <CheckCircle className="w-8 h-8 text-[#4ED17E]" />
            ) : (
              <X className="w-8 h-8 text-[#E56566]" />
            )}
          </div>

          <h3 className="text-xl font-bold font-urbanist text-[#1E1E1E] mb-2">
            KYC {feedbackType === 'approved' ? 'Approved' : 'Declined'}
          </h3>
          <p className="text-sm text-[#808C91] font-general mb-6">
            The user will be notified about the {feedbackType === 'approved' ? 'approved' : 'declined'} KYC as this action has been successfully completed
          </p>

          <button
            onClick={() => setters.setShowSuccessModal(false)}
            className="w-full py-3 bg-[#FF5B04] text-white rounded-lg font-general font-medium hover:bg-[#E54F03] transition-colors"
          >
            Dismiss
          </button>
        </div>
      </BaseModal>

      {/* Guidelines Modal */}
      <BaseModal
        isOpen={modals.showGuidelinesModal}
        onClose={() => setters.setShowGuidelinesModal(false)}
        title="Guidelines for Good Upload"
        maxWidth="max-w-2xl"
      >
        <p className="text-sm text-[#808C91] font-general mb-6">Here are the following guidelines</p>

        {/* Example Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="bg-[#F7FAFA] rounded-lg p-4 mb-2 relative">
              <div className="absolute top-2 right-2 w-6 h-6 bg-[#4ED17E] rounded-full flex items-center justify-center text-white text-xs">
                &#10003;
              </div>
              <div className="text-xs font-general text-[#808C91]">ID Card Sample</div>
            </div>
            <p className="text-sm font-general font-medium text-[#1E1E1E]">Good</p>
          </div>
          <div className="text-center">
            <div className="bg-[#F7FAFA] rounded-lg p-4 mb-2 relative">
              <div className="absolute top-2 right-2 w-6 h-6 bg-[#E56566] rounded-full flex items-center justify-center text-white text-xs">
                &#10007;
              </div>
              <div className="text-xs font-general text-[#808C91]">Blurred</div>
            </div>
            <p className="text-sm font-general font-medium text-[#1E1E1E]">No blur</p>
          </div>
          <div className="text-center">
            <div className="bg-[#F7FAFA] rounded-lg p-4 mb-2 relative">
              <div className="absolute top-2 right-2 w-6 h-6 bg-[#E56566] rounded-full flex items-center justify-center text-white text-xs">
                &#10007;
              </div>
              <div className="text-xs font-general text-[#808C91]">Cut off</div>
            </div>
            <p className="text-sm font-general font-medium text-[#1E1E1E]">No cut</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h4 className="text-sm font-general font-semibold text-[#1E1E1E] mb-3">Must Be:</h4>
            <div className="space-y-2">
              {[
                'Government Issued',
                'Original Full size, unedited',
                'Place document against a single colored background',
                'Readable, well lit and colored',
              ].map((text) => (
                <div key={text} className="flex items-center gap-2 border border-[#4ED17E]/30 bg-[#E9F9EF] rounded-lg p-3">
                  <CheckCircle className="w-5 h-5 text-[#4ED17E] flex-shrink-0" />
                  <span className="text-sm font-general text-[#1E1E1E]">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-general font-semibold text-[#1E1E1E] mb-3">Must Not Be:</h4>
            <div className="space-y-2">
              {[
                'Black or white images',
                'Blurred or cut images',
              ].map((text) => (
                <div key={text} className="flex items-center gap-2 border border-[#E56566]/30 bg-[#FCECEC] rounded-lg p-3">
                  <X className="w-5 h-5 text-[#E56566] flex-shrink-0" />
                  <span className="text-sm font-general text-[#1E1E1E]">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => setters.setShowGuidelinesModal(false)}
          className="w-full py-3 bg-[#FF5B04] text-white rounded-lg font-general font-medium hover:bg-[#E54F03] transition-colors"
        >
          Dismiss
        </button>
      </BaseModal>
    </>
  );
};

export default ApprovalModals;
