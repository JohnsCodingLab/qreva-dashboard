import { useEffect, useMemo, useState } from 'react';
import BaseModal from './BaseModal';

const STATUS_OPTIONS = ['Pending', 'Active', 'Inactive', 'Blocked'];

const toDateInputValue = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

const UpdateCustomerProfileModal = ({
  isOpen,
  onClose,
  user,
  onSubmit,
  isSaving = false,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    if (!isOpen) return;
    setPhoneNumber(user?.phoneNumber || '');
    setDateOfBirth(toDateInputValue(user?.personalDetails?.dateOfBirth || user?.dateOfBirth));
    setStatus(user?.status || 'Active');
  }, [isOpen, user]);

  const isDirty = useMemo(() => {
    return (
      phoneNumber !== (user?.phoneNumber || '') ||
      dateOfBirth !== toDateInputValue(user?.personalDetails?.dateOfBirth || user?.dateOfBirth) ||
      status !== (user?.status || 'Active')
    );
  }, [dateOfBirth, phoneNumber, status, user]);

  const handleSubmit = () => {
    if (!isDirty || !user?._id) return;
    const payload = {};
    if (phoneNumber.trim() !== (user?.phoneNumber || '')) {
      payload.phoneNumber = phoneNumber.trim();
    }
    if (dateOfBirth !== toDateInputValue(user?.personalDetails?.dateOfBirth || user?.dateOfBirth)) {
      payload.dateOfBirth = dateOfBirth || undefined;
    }
    if (status !== (user?.status || 'Active')) {
      payload.status = status;
    }
    onSubmit?.(payload);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Edit Profile Details" maxWidth="max-w-lg">
      <div className="space-y-5">
        <p className="text-sm text-[#667085]">
          Update the customer&apos;s phone number, date of birth, or account status.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[#344054]">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+2348012345678"
              className="h-12 w-full rounded-lg border border-[#D0D5DD] px-4 text-sm text-[#101828] outline-none transition focus:border-[#FF5B04]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#344054]">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="h-12 w-full rounded-lg border border-[#D0D5DD] px-4 text-sm text-[#101828] outline-none transition focus:border-[#FF5B04]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#344054]">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-12 w-full rounded-lg border border-[#D0D5DD] bg-white px-4 text-sm text-[#101828] outline-none transition focus:border-[#FF5B04]"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg border border-[#D0D5DD] px-5 text-sm font-semibold text-[#344054] hover:bg-[#F9FAFB]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isDirty || isSaving}
            className="h-11 rounded-lg bg-[#FF5B04] px-5 text-sm font-semibold text-white hover:bg-[#E45403] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default UpdateCustomerProfileModal;
