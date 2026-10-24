import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DataTable from '@/components/tables/DataTable';
import CustomEye from '@/components/icons/CustomEye';
import LoginSessionDetailsModal from '@/components/modals/LoginSessionDetailsModal';
import { useLoginSessions } from '@/store/features/security/useLoginSessions';
import { LOGIN_SESSION_COLUMNS, ACCOUNT_TYPE_OPTIONS } from './constants';

const PAGE_LIMIT = 25;

// Every successful sign-in, customer app and admin/console both - who,
// where from, and what device - for support and security review. Written
// at the same two places a session token is actually issued (see
// backend/src/common/schemas/login-session.schema.ts).
const LoginSessions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterUserId = searchParams.get('userId') || '';

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [accountType, setAccountType] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { data, isLoading } = useLoginSessions({
    page,
    limit: PAGE_LIMIT,
    search: search || undefined,
    accountType: accountType || undefined,
    userId: filterUserId || undefined,
  });

  const clearUserFilter = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('userId');
    setSearchParams(next);
  };

  const sessions = data?.data || [];
  const pagination = data?.pagination || {};

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleAccountTypeChange = (e) => {
    setAccountType(e.target.value);
    setPage(1);
  };

  const tableActions = [
    {
      label: 'View Details',
      icon: CustomEye,
      onClick: (row) => {
        setSelectedSession(row);
        setShowDetailsModal(true);
      },
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E1E]">Login Sessions</h1>
          <p className="text-[#808C91] mt-1">
            Every successful sign-in across the platform, newest first — user, location and device
          </p>
        </div>
        <select
          className="h-10 px-3 border border-gray-300 rounded-lg text-sm"
          value={accountType}
          onChange={handleAccountTypeChange}
        >
          {ACCOUNT_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {filterUserId && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-[#FFF4E5] px-4 py-2 text-sm text-[#B25E00]">
          <span>Showing sessions for one flagged user only</span>
          <button className="font-medium underline" onClick={clearUserFilter}>Clear filter</button>
        </div>
      )}

      <DataTable
        className="font-general"
        data={sessions}
        columns={LOGIN_SESSION_COLUMNS}
        title="Login Sessions"
        actions={tableActions}
        showSearch={true}
        showCheckbox={false}
        showFilter={false}
        loading={isLoading}
        pagination={pagination}
        pageSize={PAGE_LIMIT}
        onPageChange={setPage}
        onSearch={handleSearch}
      />

      <LoginSessionDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        session={selectedSession}
      />
    </div>
  );
};

export default LoginSessions;
