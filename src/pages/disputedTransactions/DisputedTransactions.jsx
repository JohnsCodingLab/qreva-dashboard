import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DisputedTransactionCard from '@/components/disputedTransactions/DisputedTransactionCard';
import { DISPUTED_TRANSACTIONS_TABS } from './constants';
import { useDisputes } from '@/store/features/approvals/useDisputes';

const DisputedTransactions = () => {
  const [activeTab, setActiveTab] = useState(DISPUTED_TRANSACTIONS_TABS[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: disputesResponse, isLoading } = useDisputes({
    status: activeTab.toLowerCase(),
    search: searchTerm || undefined,
  });

  const transactions = disputesResponse?.data || [];
  const tabs = DISPUTED_TRANSACTIONS_TABS;

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-black">Disputed Transactions</h1>
        <p className="text-qreva-navy">Here is the full list of disputed transactions on the platform</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-0">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab
                  ? 'text-qreva-orange border-b-2 border-qreva-orange z-10'
                  : 'text-qreva-navy hover:text-qreva-navy'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-2 w-full sm:w-auto pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search here..."
              className="pl-9 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-qreva-navy">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactions.map((transaction) => (
            <DisputedTransactionCard key={transaction.id} transaction={transaction} />
          ))}
          {transactions.length === 0 && (
            <div className="col-span-full text-center py-12 text-qreva-navy">
              No {activeTab.toLowerCase()} disputes found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DisputedTransactions;

