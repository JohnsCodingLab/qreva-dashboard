import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { format } from 'date-fns';

const ViewAdminProfileModal = ({ isOpen, onClose, manager, roleLabel }) => {
  if (!manager) return null;

  const isActive = manager.status === 'Active' || manager.status === 'active';

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all font-general">
                <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-qreva-navy mb-4 font-urbanist">
                  {roleLabel} Profile
                </Dialog.Title>

                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-qreva-blue text-white flex items-center justify-center text-2xl font-bold font-urbanist">
                      {manager.fullName?.charAt(0).toUpperCase() || manager.firstName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-qreva-navy font-urbanist">{manager.fullName || `${manager.firstName} ${manager.lastName}`}</h4>
                      <p className="text-sm text-gray-500">{manager.email || manager.emailAddress}</p>
                    </div>
                  </div>

                  <div className="bg-[#F7FAFA] p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-sm text-gray-500 font-medium">Status</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isActive
                            ? 'bg-[#E6F9E6] text-qreva-blue'
                            : 'bg-[#FBE9E9] text-qreva-orange'
                        }`}
                      >
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-sm text-gray-500 font-medium">Role</span>
                      <span className="text-sm font-semibold text-qreva-navy">{roleLabel}</span>
                    </div>

                    {(manager.assignedRegion || manager.region) && (
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-sm text-gray-500 font-medium">Assigned Region</span>
                        <span className="text-sm font-semibold text-qreva-navy">{manager.assignedRegion || manager.region}</span>
                      </div>
                    )}

                    {(manager.assignedState || manager.state) && (
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-sm text-gray-500 font-medium">Assigned State</span>
                        <span className="text-sm font-semibold text-qreva-navy">{manager.assignedState || manager.state}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-medium">Date Added</span>
                      <span className="text-sm font-semibold text-qreva-navy">
                        {manager.createdAt ? format(new Date(manager.createdAt), 'dd MMM yyyy') : '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg border border-transparent bg-qreva-ash px-6 py-2 text-sm font-semibold text-qreva-navy hover:bg-gray-200 focus:outline-none"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ViewAdminProfileModal;
