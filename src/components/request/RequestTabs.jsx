const RequestTabs = ({ activeTab, onTabChange, tabs, pendingCount }) => {
  return (
    <div className="flex gap-6 border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`pb-3 px-1 text-sm font-general font-medium relative ${
            activeTab === tab.key
              ? 'text-[#FF5B04]'
              : 'text-[#475367] hover:text-[#1E1E1E]'
          }`}
        >
          {tab.label}
          {tab.key === 'pending' && pendingCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-[#FF5B04] text-white text-xs rounded-full">
              {pendingCount}
            </span>
          )}
          {activeTab === tab.key && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5B04]" />
          )}
        </button>
      ))}
    </div>
  );
};

export default RequestTabs;