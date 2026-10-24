import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/tables/DataTable';
import BaseModal from '@/components/modals/BaseModal';
import { Button } from '@/components/ui/button';
import { INVESTIGATION_COLUMNS, INVESTIGATION_ACTIONS } from './constants';
import {
  useInvestigations,
  useAddInvestigation,
  useRemoveInvestigation,
} from '@/store/features/investigations/useInvestigations';
import { usersApi } from '@/store/api/users-api';
import { handleError } from '@/store/utils/handleError';
import { handleSuccess } from '@/store/utils/handleSuccess';

const PAGE_LIMIT = 20;

// Admin-maintained "Users Under Investigation" watchlist. Distinct from the
// fraud blacklist (which blocks a raw value): this flags a specific user's
// own activity for closer review WITHOUT blocking anything - the user is
// never told. See backend/src/investigations/schemas/investigation.schema.ts
// for the full reasoning behind that design.
const Investigations = () => {
  const navigate = useNavigate();
  const [activeOnly, setActiveOnly] = useState(true);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useInvestigations({ page, limit: PAGE_LIMIT, activeOnly });
  const addInvestigation = useAddInvestigation();
  const removeInvestigation = useRemoveInvestigation();

  const entries = data?.data?.entries || [];
  const total = data?.data?.total || 0;
  const pagination = { page, limit: PAGE_LIMIT, total, totalPages: Math.ceil(total / PAGE_LIMIT) };

  const [modalOpen, setModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searching, setSearching] = useState(false);

  // Debounced user search against the same endpoint every other admin
  // people-picker uses (GET admin/dashboard/users/all?search=), so this
  // doesn't need its own resolution logic.
  useEffect(() => {
    if (!userQuery || selectedUser) {
      setUserResults([]);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await usersApi.getUsers({ search: userQuery, limit: 8 });
        if (!cancelled) setUserResults(res?.data || []);
      } catch {
        if (!cancelled) setUserResults([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [userQuery, selectedUser]);

  const openCreate = () => {
    setReason('');
    setUserQuery('');
    setUserResults([]);
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!selectedUser || !reason.trim()) return;
    addInvestigation.mutate(
      { userId: selectedUser._id, reason: reason.trim() },
      {
        onSuccess: () => {
          handleSuccess('User added to the investigation list');
          setModalOpen(false);
        },
        onError: (error) => handleError(error),
      },
    );
  };

  const handleAction = (action, row) => {
    if (action.label === 'Remove From List') {
      removeInvestigation.mutate(row._id, {
        onSuccess: () => handleSuccess('User removed from the investigation list'),
        onError: (error) => handleError(error),
      });
    } else if (action.label === 'View Login Sessions') {
      const userId = row.userId?._id || row.userId;
      navigate(`/security/login-sessions?userId=${userId}`);
    } else if (action.label === 'View Verification Captures') {
      const userId = row.userId?._id || row.userId;
      navigate(`/security/verification-attempts?userId=${userId}`);
    }
  };

  const actionsWithHandler = INVESTIGATION_ACTIONS.map((action) => ({
    ...action,
    // "Remove From List" only makes sense while the entry is still active -
    // closed entries stay in the table as history but aren't actionable.
    isVisible: (row) => (action.label === 'Remove From List' ? !!row.active : true),
    onClick: (row) => handleAction(action, row),
  }));

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E1E]">Users Under Investigation</h1>
          <p className="text-[#808C91] mt-1">
            Flagged users are monitored, not blocked — access is unaffected and they are never notified
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-[#505C61]">
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(e) => { setActiveOnly(e.target.checked); setPage(1); }}
            />
            Active only
          </label>
          <Button className="bg-[#FF5B04] hover:bg-[#e65203] text-white" onClick={openCreate}>
            Add User
          </Button>
        </div>
      </div>

      <DataTable
        data={entries}
        columns={INVESTIGATION_COLUMNS}
        title="Investigation List"
        actions={actionsWithHandler}
        showSearch={false}
        showCheckbox={false}
        loading={isLoading}
        pagination={pagination}
        pageSize={PAGE_LIMIT}
        onPageChange={setPage}
      />

      <BaseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add User To Investigation List"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-left">
          <div className="relative">
            <label className="text-xs font-medium text-[#505C61]">User</label>
            {selectedUser ? (
              <div className="w-full flex items-center justify-between h-11 px-3 border border-gray-300 rounded-lg text-sm mt-1">
                <span>
                  {[selectedUser.firstName, selectedUser.lastName].filter(Boolean).join(' ')}
                  {' — '}
                  {selectedUser.emailAddress || selectedUser.phoneNumber}
                </span>
                <button
                  className="text-[#808C91] hover:text-[#1E1E1E] text-xs font-medium"
                  onClick={() => { setSelectedUser(null); setUserQuery(''); }}
                >
                  Change
                </button>
              </div>
            ) : (
              <>
                <input
                  className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#FF5B04]"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Search by name, email, or phone number"
                />
                {(searching || userResults.length > 0) && userQuery && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                    {searching && (
                      <div className="px-3 py-2 text-sm text-[#808C91]">Searching…</div>
                    )}
                    {!searching && userResults.length === 0 && (
                      <div className="px-3 py-2 text-sm text-[#808C91]">No users found</div>
                    )}
                    {!searching && userResults.map((user) => (
                      <button
                        key={user._id}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                        onClick={() => { setSelectedUser(user); setUserResults([]); }}
                      >
                        <div className="font-medium text-[#1E1E1E]">
                          {[user.firstName, user.lastName].filter(Boolean).join(' ') || '—'}
                        </div>
                        <div className="text-xs text-[#808C91]">
                          {user.emailAddress || user.phoneNumber} · {user.type}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-[#505C61]">Reason</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#FF5B04]"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why is this user being monitored?"
            />
          </div>

          <Button
            className="w-full h-12 bg-[#FF5B04] hover:bg-[#e65203] text-white"
            onClick={handleSubmit}
            disabled={addInvestigation.isPending || !selectedUser || !reason.trim()}
          >
            Add To Investigation List
          </Button>
        </div>
      </BaseModal>
    </div>
  );
};

export default Investigations;
