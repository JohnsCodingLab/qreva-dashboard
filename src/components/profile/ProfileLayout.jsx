import { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import UserProfileHeader from '@/components/base/UserProfileHeader';

const ProfileLayout = ({ 
  userData, 
  activeTab, 
  onTabChange, 
  availableTabs,
  actions,
  children 
}) => {
  const [timeFilter, setTimeFilter] = useState({ range: 'today', label: 'Today' });
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  return (
    <div className="flex-1 overflow-auto bg-[#F7FAFA]">
      <div className="p-4 sm:p-6">
        <PageHeader
          title="View Profile Details"
          subtitle="Here is the full profile details of this user"
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
        />

        <UserProfileHeader
          user={userData}
          activeTab={activeTab}
          onTabChange={onTabChange}
          availableTabs={availableTabs}
          showActionsMenu={showActionsMenu}
          onToggleActionsMenu={() => setShowActionsMenu(!showActionsMenu)}
          actions={actions}
        />

        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;
