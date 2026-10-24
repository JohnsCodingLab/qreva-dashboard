import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const PopupDialog = ({ 
  isOpen, 
  onClose, 
  title,
  data,
  type = 'region' // 'region', 'transaction', 'customer'
}) => {
  if (!isOpen) return null;

  // Render different content based on type
  const renderContent = () => {
    switch(type) {
      case 'region':
        return (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-general text-[#084059]">Location</p>
              <p className="text-base font-general font-semibold text-[#1E1E1E]">
                {data?.location || 'N/A'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-general text-[#084059]">Total Transactions</p>
              <p className="text-base font-general font-semibold text-[#1E1E1E]">
                {data?.total?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-general text-[#084059]">Total Revenue</p>
              <p className="text-base font-general font-semibold text-[#1E1E1E]">
                ₦{data?.revenue?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-general text-[#084059]">Transaction Volume</p>
              <p className="text-base font-general font-semibold text-[#1E1E1E]">
                ₦{data?.volume?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-general text-[#084059]">Success Rate</p>
              <p className="text-base font-general font-semibold text-[#1E1E1E]">
                {data?.rate}%
              </p>
            </div>
          </div>
        );

      case 'transaction':
        return (
          <div className="space-y-6">
            {/* Transaction Icon/Logo */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-[#E31E24] flex items-center justify-center">
                <span className="text-2xl text-white">📱</span>
              </div>
              <h3 className="text-xl font-urbanist font-semibold text-[#1E1E1E]">
                {data?.category || 'Transaction'}
              </h3>
              <p className="text-3xl font-urbanist font-bold text-[#084059]">
                - ₦{data?.amount?.toLocaleString() || '0'}
              </p>
              <span className={`px-3 py-1 rounded-full text-xs font-general font-medium ${
                data?.status === 'Successful' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {data?.status || 'Pending'}
              </span>
            </div>

            {/* Transaction Details */}
            <div className="grid grid-cols-1 gap-4 border-t border-[#E8EBED] pt-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-general text-[#084059]">Recipient Mobile</p>
                <p className="text-base font-general font-semibold text-[#1E1E1E]">
                  {data?.phoneNumber || data?.acc || 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-general text-[#084059]">Transaction ID</p>
                <p className="text-base font-general font-semibold text-[#1E1E1E] break-all">
                  {data?.transactionId || '181020010109737759210144'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-general text-[#084059]">Location</p>
                <p className="text-base font-general font-semibold text-[#1E1E1E]">
                  {data?.location || 'Lagos'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-general text-[#084059]">Transaction Date</p>
                <p className="text-base font-general font-semibold text-[#1E1E1E]">
                  {data?.date || '18th October, 2025 | 09:00 AM'}
                </p>
              </div>
              <div className="space-y-1 col-span-2">
                <p className="text-sm font-general text-[#084059]">Status</p>
                <p className="text-base font-general font-semibold text-[#1E1E1E]">
                  {data?.status || 'First Time'}
                </p>
              </div>
              {data?.dataPlan && (
                <div className="space-y-1 col-span-2">
                  <p className="text-sm font-general text-[#084059]">Data Plan</p>
                  <p className="text-base font-general font-semibold text-[#1E1E1E]">
                    {data.dataPlan}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'customer':
        return (
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#FFE8DC] rounded-full flex items-center justify-center">
                <span className="text-2xl">{data?.avatar || '👤'}</span>
              </div>
              <div>
                <h3 className="text-xl font-urbanist font-semibold text-[#1E1E1E]">
                  {data?.name || 'Customer Name'}
                </h3>
                <p className="text-sm font-general text-[#084059]">
                  Rank #{data?.rank || 1}
                </p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 gap-4 border-t border-[#E8EBED] pt-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-general text-[#084059]">Total Transactions</p>
                <p className="text-base font-general font-semibold text-[#1E1E1E]">
                  {data?.totalTransactions?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-general text-[#084059]">Total Amount</p>
                <p className="text-base font-general font-semibold text-[#1E1E1E]">
                  ₦{data?.amount?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-general text-[#084059]">Last Transaction</p>
                <p className="text-base font-general font-semibold text-[#1E1E1E]">
                  {data?.lastTransaction || 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-general text-[#084059]">Success Rate</p>
                <p className="text-base font-general font-semibold text-[#1E1E1E]">
                  {data?.successRate || '98'}%
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return <p>No data available</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E8EBED] sticky top-0 bg-white z-10">
          <h2 className="text-xl font-urbanist font-semibold text-[#1E1E1E]">
            {title || 'Details'}
          </h2>
          <button 
            onClick={onClose}
            className="text-[#084059] hover:text-[#1E1E1E] transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {data ? renderContent() : (
            <p className="text-center text-[#084059]">No data available</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-[#E8EBED] sticky bottom-0 bg-white">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="font-general"
          >
            {type === 'transaction' ? 'Dismiss' : 'Close'}
          </Button>
          {type === 'region' && (
            <Button 
              className="bg-[#FF5B04] hover:bg-[#E55A1B] font-general text-white"
            >
              Export Data
            </Button>
          )}
          {type === 'transaction' && (
            <Button 
              className="bg-[#FF5B04] hover:bg-[#E55A1B] font-general text-white"
            >
              Download Receipt
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupDialog;
