import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AddAggregatorModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  onResolveInvitee,
  isResolvingInvitee,
  inviteTypeLabel = 'Aggregator',
}) => {
  const [formData, setFormData] = useState({ email: '' });
  const [resolvedInvitee, setResolvedInvitee] = useState(null);
  const [resolutionError, setResolutionError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setFormData({ email: '' });
      setResolvedInvitee(null);
      setResolutionError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isValidEmail = /\S+@\S+\.\S+/.test(formData.email);

  const handleResolveInvitee = async () => {
    if (!isValidEmail || !onResolveInvitee) return;
    setResolutionError('');
    setResolvedInvitee(null);
    try {
      const invitee = await onResolveInvitee(formData.email.trim());
      if (!invitee) {
        setResolutionError('Unable to resolve invitee details.');
        return;
      }
      setResolvedInvitee(invitee);
      if (!invitee.eligible) {
        setResolutionError(invitee.eligibilityMessage || 'This user is not eligible for this invite type.');
      }
    } catch (error) {
      setResolutionError(error?.response?.data?.message || 'Unable to resolve invitee details.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resolvedInvitee?.eligible) return;
    onSubmit({
      email: resolvedInvitee.email || formData.email.trim(),
      fullName: resolvedInvitee.fullName || '',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-black cursor-pointer">
          <X size={20} />
        </button>

        <h2 className="text-xl font-urbanist font-bold text-[#1E1E1E] mb-1">Invite {inviteTypeLabel}</h2>
        <p className="text-sm text-[#808C91] font-general font-medium mb-4">
          Enter the agent email, verify identity, then send invite.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div className="flex gap-2">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ email: e.target.value });
                  setResolvedInvitee(null);
                  setResolutionError('');
                }}
                onBlur={() => {
                  if (isValidEmail && formData.email.trim() !== (resolvedInvitee?.email || '')) {
                    handleResolveInvitee();
                  }
                }}
                placeholder="Agent Email Address"
                className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5B04] focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={handleResolveInvitee}
                disabled={!isValidEmail || isResolvingInvitee}
                className="px-4 rounded-lg border border-[#FF5B04] text-[#FF5B04] text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResolvingInvitee ? 'Checking...' : 'Verify'}
              </button>
            </div>

            {resolvedInvitee && (
              <div className="rounded-lg border border-[#D9D9D9] bg-[#F8FAFB] p-3">
                <p className="text-xs text-[#808C91] mb-1">Matched Agent</p>
                <p className="text-sm font-semibold text-[#1E1E1E]">{resolvedInvitee.fullName || '-'}</p>
                <p className="text-xs text-[#505C61] mt-1">{resolvedInvitee.email}</p>
                <p className="text-xs text-[#505C61] mt-1">
                  Current Role: {resolvedInvitee.role || resolvedInvitee.type || 'Agent'}
                </p>
              </div>
            )}

            {resolutionError && (
              <p className="text-xs text-qreva-orange">{resolutionError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!resolvedInvitee?.eligible || isSubmitting}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              !resolvedInvitee?.eligible || isSubmitting
                ? 'opacity-50 cursor-not-allowed bg-[#9A9A9A]/60 text-white'
                : 'bg-[#FF5B04] text-white hover:bg-[#E54F03]'
            }`}
          >
            {isSubmitting ? 'Sending Invite...' : `Invite ${inviteTypeLabel}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAggregatorModal;
