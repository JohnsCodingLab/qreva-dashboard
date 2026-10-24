import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { NigerianStates } from '@/utils/NigerianStates';

const AddManagerModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  inviteTypeLabel = 'Regional Manager',
  roleType = 'RegionalManager', // RegionalManager or StateManager
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    assignedRegion: '',
    assignedState: '',
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        assignedRegion: '',
        assignedState: '',
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Derive regions from states data
  const regions = [...new Set(NigerianStates.map(state => state.geopolitical_zone))].filter(Boolean).sort();
  const states = NigerianStates.map(state => state.state).sort();

  const isValid = formData.firstName.trim() && 
                  formData.lastName.trim() &&
                  /\S+@\S+\.\S+/.test(formData.email) && 
                  (roleType === 'RegionalManager' ? formData.assignedRegion : formData.assignedState);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    onSubmit({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      emailAddress: formData.email.trim(),
      role: roleType,
      assignedRegion: roleType === 'RegionalManager' ? formData.assignedRegion : undefined,
      assignedState: roleType === 'StateManager' ? formData.assignedState : undefined,
      permissions: {},
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-black cursor-pointer">
          <X size={20} />
        </button>

        <h2 className="text-xl font-urbanist font-bold text-[#1E1E1E] mb-1">Add {inviteTypeLabel}</h2>
        <p className="text-sm text-[#808C91] font-general font-medium mb-4">
          Fill in the details to invite a new {inviteTypeLabel}.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-[#808C91] mb-1 block">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="First Name"
                  className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-qreva-orange focus:border-transparent"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-[#808C91] mb-1 block">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Last Name"
                  className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-qreva-orange focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-[#808C91] mb-1 block">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter Email Address"
                className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-qreva-orange focus:border-transparent"
                required
              />
            </div>
            
            {roleType === 'RegionalManager' && (
              <div>
                <label className="text-xs text-[#808C91] mb-1 block">Assigned Region</label>
                <select
                  value={formData.assignedRegion}
                  onChange={(e) => setFormData({ ...formData, assignedRegion: e.target.value })}
                  className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-qreva-orange focus:border-transparent bg-white"
                  required
                >
                  <option value="" disabled>Select Region</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            )}

            {roleType === 'StateManager' && (
              <div>
                <label className="text-xs text-[#808C91] mb-1 block">Assigned State</label>
                <select
                  value={formData.assignedState}
                  onChange={(e) => setFormData({ ...formData, assignedState: e.target.value })}
                  className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-qreva-orange focus:border-transparent bg-white"
                  required
                >
                  <option value="" disabled>Select State</option>
                  {states.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              !isValid || isSubmitting
                ? 'opacity-50 cursor-not-allowed bg-[#9A9A9A]/60 text-white'
                : 'bg-qreva-orange text-white hover:bg-opacity-90'
            }`}
          >
            {isSubmitting ? 'Sending Invite...' : `Invite ${inviteTypeLabel}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddManagerModal;
