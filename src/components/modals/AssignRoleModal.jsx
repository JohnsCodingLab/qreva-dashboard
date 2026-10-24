import { useState, useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useRoles } from '@/store/features/settings/useRbac';

const AssignRoleModal = ({ isOpen, onClose, onAssign, currentRoleId, isSubmitting }) => {
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const { data: rolesResponse, isLoading } = useRoles({}, { enabled: isOpen });

  const roles = rolesResponse?.data || rolesResponse?.roles || rolesResponse || [];

  useEffect(() => {
    if (isOpen) setSelectedRoleId(currentRoleId || '');
  }, [isOpen, currentRoleId]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRoleId) return;
    onAssign(selectedRoleId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F3F4]">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#FF5B04]" />
            <h2 className="text-base font-urbanist font-semibold text-[#FF5B04]">Assign Role</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[#F5F6F7] rounded-lg transition-colors">
            <X size={18} className="text-[#808C91]" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <p className="text-sm text-[#505C61] font-general">
            Select a role to assign to this user. This will grant the user all permissions defined under that role.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-general font-medium text-[#505C61]">Role</label>
            {isLoading ? (
              <div className="h-10 bg-[#F0F3F4] rounded-lg animate-pulse" />
            ) : (
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="w-full h-10 px-3 text-sm font-general text-[#1E1E1E] bg-white border border-[#D9D9D9] rounded-lg focus:outline-none focus:border-[#FF5B04] transition-colors"
                required
              >
                <option value="">Select a role...</option>
                {(Array.isArray(roles) ? roles : []).map((role) => {
                  const id = role._id || role.id;
                  const name = role.name || role.roleName || role.title || id;
                  return (
                    <option key={id} value={id}>{name}</option>
                  );
                })}
              </select>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 text-sm font-general font-semibold text-[#FF5B04] bg-[#FFEFE6] border border-[#FFCCB1] hover:bg-[#FFE5D3] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedRoleId || isSubmitting}
              className="flex-1 h-10 text-sm font-general font-medium text-white bg-[#FF5B04] hover:bg-[#E54F03] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {isSubmitting ? 'Assigning...' : 'Assign Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignRoleModal;
