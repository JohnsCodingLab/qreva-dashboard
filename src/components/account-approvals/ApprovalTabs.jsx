const ApprovalTabs = ({ activeTab, onTabChange, tabs, tabCounts }) => {
  return (
    <div className="border-b border-gray-200 mb-6 mt-4">
      <div className="flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`pb-3 text-sm font-medium relative ${
              activeTab === tab.key ? 'text-[#FF5B04]' : 'text-qreva-navy hover:text-qreva-navy'
            }`}
          >
            {tab.label}
            {tabCounts[tab.key] > 0 && (
              <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key 
                  ? 'bg-[#FF5B041A] text-[#FF5B04]' 
                  : 'bg-qreva-ash text-qreva-navy'
              }`}>
                {tabCounts[tab.key]}
              </span>
            )}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF5B04]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ApprovalTabs;