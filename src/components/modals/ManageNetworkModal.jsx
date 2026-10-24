import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

const ManageNetworkModal = ({
  isOpen,
  onClose,
  owner,
  networkResponse,
  isLoadingNetwork,
  onResolveCandidate,
  isResolvingCandidate,
  onAssign,
  isAssigning,
  onRemove,
  isRemoving,
}) => {
  const [email, setEmail] = useState("");
  const [resolvedCandidate, setResolvedCandidate] = useState(null);
  const [resolutionError, setResolutionError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setResolvedCandidate(null);
      setResolutionError("");
    }
  }, [isOpen]);

  const memberType = networkResponse?.data?.memberType || "Member";
  const members = networkResponse?.data?.members || [];
  const ownerType = networkResponse?.data?.owner?.ownerType;
  const ownerName = useMemo(() => {
    if (!owner) return "";
    return `${owner.firstName || ""} ${owner.lastName || ""}`.trim();
  }, [owner]);

  if (!isOpen) return null;

  const isValidEmail = /\S+@\S+\.\S+/.test(email);

  const handleResolve = async () => {
    if (!isValidEmail || !owner?._id) return;
    setResolutionError("");
    setResolvedCandidate(null);
    try {
      const response = await onResolveCandidate(owner._id, email.trim());
      const data = response?.data || null;
      setResolvedCandidate(data);
      if (!data?.eligible) {
        setResolutionError(data?.eligibilityMessage || "This user is not eligible.");
      }
    } catch (error) {
      setResolutionError(error?.response?.data?.message || "Unable to verify this email.");
    }
  };

  const handleAssign = () => {
    if (!owner?._id || !resolvedCandidate?.eligible) return;
    onAssign(owner._id, resolvedCandidate.email || email.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-black cursor-pointer">
          <X size={20} />
        </button>

        <h2 className="text-xl font-urbanist font-bold text-[#1E1E1E] mb-1">
          {ownerType === "aggregator_manager" ? "Manage Aggregators" : "Manage Agents"}
        </h2>
        <p className="text-sm text-[#808C91] font-general mb-5">
          {ownerName || "Selected user"} - {ownerType === "aggregator_manager" ? "Aggregator Manager" : "Aggregator"}
        </p>

        <div className="border border-[#E8EBED] rounded-lg p-4 mb-5">
          <h3 className="text-sm font-semibold text-[#1E1E1E] mb-3">
            Add {memberType}
          </h3>
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setResolvedCandidate(null);
                setResolutionError("");
              }}
              placeholder={`Enter ${memberType} email`}
              className="flex-1 px-4 py-2.5 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5B04] focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleResolve}
              disabled={!isValidEmail || isResolvingCandidate}
              className="px-4 py-2.5 rounded-lg border border-[#FF5B04] text-[#FF5B04] text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResolvingCandidate ? "Checking..." : "Verify"}
            </button>
            <button
              type="button"
              onClick={handleAssign}
              disabled={!resolvedCandidate?.eligible || isAssigning}
              className="px-4 py-2.5 rounded-lg bg-[#FF5B04] text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAssigning ? "Adding..." : `Add ${memberType}`}
            </button>
          </div>

          {resolvedCandidate && (
            <div className="mt-3 rounded-lg border border-[#D9D9D9] bg-[#F8FAFB] p-3">
              <p className="text-xs text-[#808C91] mb-1">Matched User</p>
              <p className="text-sm font-semibold text-[#1E1E1E]">{resolvedCandidate.fullName || "-"}</p>
              <p className="text-xs text-[#505C61] mt-1">{resolvedCandidate.email}</p>
              <p className="text-xs text-[#505C61] mt-1">
                Type: {resolvedCandidate.type || "-"} {resolvedCandidate.role ? `(${resolvedCandidate.role})` : ""}
              </p>
            </div>
          )}

          {resolutionError ? <p className="text-xs text-qreva-orange mt-2">{resolutionError}</p> : null}
        </div>

        <div className="border border-[#E8EBED] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[#1E1E1E] mb-3">
            Current {ownerType === 'aggregator_manager' ? 'Aggregators' : 'Agents / Merchants'} ({members.length})
          </h3>
          {isLoadingNetwork ? (
            <p className="text-sm text-[#808C91]">Loading members...</p>
          ) : members.length ? (
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between border border-[#F0F3F4] rounded-lg p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-[#1E1E1E]">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-[#808C91]">{member.emailAddress}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(owner?._id, member._id)}
                    disabled={isRemoving}
                    className="px-3 py-1.5 rounded-md border border-[#FCA5A5] text-[#DC2626] text-xs font-medium disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#808C91]">
              No {ownerType === 'aggregator_manager' ? 'aggregators' : 'agents or merchants'} assigned yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageNetworkModal;

