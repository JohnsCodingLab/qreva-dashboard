const UserProfileHeader = ({ 
  user, 
  activeTab, 
  onTabChange, 
  availableTabs,
  showActionsMenu,
  onToggleActionsMenu,
  actions
}) => {
  const displayName = user.name || user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown';
  const displayEmail = user.email || user.emailAddress || '';
  const normalizedRole = String(user?.role || '').trim().toLowerCase();
  const hideTierBadge = normalizedRole === 'aggregator' || normalizedRole === 'aggregator_manager' || normalizedRole === 'manager';

  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-cyan-100">
            <span className="text-2xl font-bold text-cyan-600">
              {getInitials(displayName)}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-xl font-bold text-black">{displayName}</h3>
            <p className="truncate text-qreva-navy">{displayEmail}</p>
          </div>
          {!hideTierBadge && user?.tier && (
            <span className="inline-flex w-fit rounded-full bg-cyan-100 px-3 py-1 text-sm font-medium text-cyan-700">
              {user.tier}
            </span>
          )}
        </div>
        
        {/* Actions Dropdown Button */}
        <div className="relative self-start lg:self-auto">
          <button
            onClick={onToggleActionsMenu}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-qreva-navy hover:bg-qreva-ash"
          >
            {user.type || user.accountType}
            <svg 
              className={`w-4 h-4 transition-transform ${showActionsMenu ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showActionsMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={onToggleActionsMenu}
              />
              <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className="w-full px-4 py-2 text-left text-sm text-qreva-navy hover:bg-qreva-ash transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-b border-gray-200">
        {availableTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-[#FF5B04] text-[#FF5B04]'
                : 'border-transparent text-qreva-navy hover:text-qreva-navy'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserProfileHeader;
