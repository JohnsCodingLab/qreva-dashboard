import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { useAdminUsers } from '@/store/features/admin/useAdminUsers';

const getUserId = (user) => user?._id || user?.id || user?.userId;

const getUserName = (user) => {
  const fullName =
    user?.name ||
    user?.fullName ||
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
  return fullName || user?.emailAddress || user?.email || getUserId(user);
};

const AssignRoleToUserModal = ({
  isOpen,
  onClose,
  onAssign,
  role,
  isSubmitting,
}) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const { data: adminsResponse, isLoading } = useAdminUsers(
    { limit: 100 },
    { enabled: isOpen },
  );

  const admins = useMemo(() => {
    const data =
      adminsResponse?.data || adminsResponse?.admins || adminsResponse?.users || adminsResponse || [];
    return Array.isArray(data) ? data : [];
  }, [adminsResponse]);

  const roleName = role?.roleName || role?.name || role?.title || 'this role';

  useEffect(() => {
    if (isOpen) setSelectedUserId('');
  }, [isOpen, role]);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedUserId) return;
    onAssign(selectedUserId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F3F4]">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#FF5B04]" />
            <h2 className="text-base font-urbanist font-semibold text-[#FF5B04]">
              Assign Role
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#F5F6F7] rounded-lg transition-colors"
          >
            <X size={18} className="text-[#808C91]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <p className="text-sm text-[#505C61] font-general">
            Select the admin user that should receive {roleName}.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-general font-medium text-[#505C61]">
              Admin User
            </label>
            {isLoading ? (
              <div className="h-10 bg-[#F0F3F4] rounded-lg animate-pulse" />
            ) : (
              <select
                value={selectedUserId}
                onChange={(event) => setSelectedUserId(event.target.value)}
                className="w-full h-10 px-3 text-sm font-general text-[#1E1E1E] bg-white border border-[#D9D9D9] rounded-lg focus:outline-none focus:border-[#FF5B04] transition-colors"
                required
              >
                <option value="">Select an admin user...</option>
                {admins.map((user) => {
                  const id = getUserId(user);
                  if (!id) return null;
                  const name = getUserName(user);
                  const email = user.emailAddress || user.email;
                  return (
                    <option key={id} value={id}>
                      {email ? `${name} (${email})` : name}
                    </option>
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
              disabled={!selectedUserId || isSubmitting}
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

export default AssignRoleToUserModal;
