import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import DeclineReasonModal from '@/components/modals/DeclineReasonModal';
import ActionSuccessModal from '@/components/modals/ActionSuccessModal';
import { useDisputeDetails, useRefundDispute, useDeclineDispute } from '@/store/features/approvals/useDisputes';
import { handleError } from '@/store/utils/handleError';

const DisputedTransactionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });

    const { data: disputeResponse, isLoading } = useDisputeDetails(id);
    const refundDispute = useRefundDispute();
    const declineDispute = useDeclineDispute();
    const transaction = disputeResponse?.data || {};

    const handleRefund = () => {
        refundDispute.mutate(id, {
            onSuccess: () => {
                setSuccessMessage({
                    title: 'Dispute Refunded',
                    message: 'The user will be notified about the refund as this action has been successfully completed',
                });
                setIsSuccessModalOpen(true);
            },
            onError: (error) => handleError(error),
        });
    };

    const handleDeclineClick = () => {
        setIsDeclineModalOpen(true);
    };

    const handleDeclineSubmit = (reason) => {
        declineDispute.mutate({ id, reason }, {
            onSuccess: () => {
                setIsDeclineModalOpen(false);
                setSuccessMessage({
                    title: 'Dispute Declined',
                    message: 'The user will be notified about the declined dispute as this action has been successfully completed',
                });
                setIsSuccessModalOpen(true);
            },
            onError: (error) => {
                setIsDeclineModalOpen(false);
                handleError(error);
            },
        });
    };

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center h-64">
                <p className="text-qreva-navy">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <div className="flex items-center text-sm text-qreva-orange mb-1">
                         <span onClick={() => navigate('/disputed-transactions')} className="cursor-pointer hover:underline">Disputed Transactions</span>
                         <span className="mx-2">/</span>
                         <span className="text-qreva-navy">View Details</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-start">
                <div>
                     <h1 className="text-2xl font-bold text-black">View Details</h1>
                     <p className="text-qreva-navy">Here is the full detail about this disputed transaction</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="text-qreva-orange border-red-200 bg-red-50 hover:bg-red-100 font-medium px-8"
                        onClick={handleDeclineClick}
                        disabled={declineDispute.isPending}
                    >
                        Decline
                    </Button>
                    <Button
                        className="bg-qreva-orange hover:bg-qreva-orange text-white font-medium px-8"
                        onClick={handleRefund}
                        disabled={refundDispute.isPending}
                    >
                        {refundDispute.isPending ? 'Refunding...' : 'Refund'}
                    </Button>
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-qreva-ash rounded-lg p-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-qreva-blue font-semibold text-lg">
                        {(transaction.recipient || 'N/A').slice(0, 2).toUpperCase()}
                     </div>
                     <div>
                        <h2 className="text-lg font-bold text-black">{transaction.recipient || '-'}</h2>
                        <p className="text-sm text-qreva-navy">{transaction.walletAccountNo || '-'}</p>
                     </div>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-black">{transaction.balance || transaction.amount || '-'}</span>
                </div>
            </div>

            {/* Details Grid */}
            <div className="bg-qreva-ash rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <div>
                    <label className="text-xs text-gray-400 block mb-1">Recipient Details</label>
                    <p className="text-sm font-medium text-black">{transaction.recipientDetails || '-'}</p>
                </div>
                 <div>
                    <label className="text-xs text-gray-400 block mb-1">Dispute Type</label>
                    <p className="text-sm font-medium text-black">{transaction.disputeType || transaction.title || '-'}</p>
                </div>
                <div>
                    <label className="text-xs text-gray-400 block mb-1">Transaction Date</label>
                    <p className="text-sm font-medium text-black">{transaction.transactionDate || '-'}</p>
                </div>
                 <div>
                    <label className="text-xs text-gray-400 block mb-1">Date Sent</label>
                    <p className="text-sm font-medium text-black">{transaction.dateSent || transaction.date || '-'}</p>
                </div>
                 <div>
                    <label className="text-xs text-gray-400 block mb-1">Transaction ID</label>
                    <p className="text-sm font-medium text-black">{transaction.transactionId || '-'}</p>
                </div>
                 <div>
                    <label className="text-xs text-gray-400 block mb-1">Category</label>
                    <p className="text-sm font-medium text-black">{transaction.category || '-'}</p>
                </div>
                 <div>
                    <label className="text-xs text-gray-400 block mb-1">Dispute Status</label>
                    <span className="inline-block px-3 py-1 bg-orange-100 text-qreva-orange text-xs rounded-full font-medium">
                        {transaction.disputeStatus || transaction.status || '-'}
                    </span>
                </div>
                 <div>
                    <label className="text-xs text-gray-400 block mb-1">Transaction Status</label>
                     <span className="inline-block px-3 py-1 bg-qreva-ash text-qreva-navy text-xs rounded-full font-medium border border-gray-200">
                        {transaction.transactionStatus || '-'}
                    </span>
                </div>
                <div className="md:col-span-2">
                    <label className="text-xs text-gray-400 block mb-1">Short Description</label>
                    <p className="text-sm font-medium text-black">{transaction.shortDescription || transaction.description || '-'}</p>
                </div>
            </div>

            {/* Image Preview */}
            <div className="space-y-2">
                 <h3 className="text-sm text-qreva-navy">Uploaded Photo</h3>
                 <div className="border border-dashed border-gray-300 rounded-lg overflow-hidden bg-qreva-ash min-h-[300px] flex items-center justify-center">
                     {transaction.imageUrl ? (
                         <img src={transaction.imageUrl} alt="Evidence" className="w-full h-auto object-cover" />
                     ) : (
                         <div className="text-gray-400">Image Preview Placeholder</div>
                     )}
                 </div>
            </div>

            <DeclineReasonModal
                isOpen={isDeclineModalOpen}
                onClose={() => setIsDeclineModalOpen(false)}
                onDecline={handleDeclineSubmit}
            />

            <ActionSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => {
                    setIsSuccessModalOpen(false);
                    navigate('/disputed-transactions');
                }}
                title={successMessage.title}
                message={successMessage.message}
                buttonText="Dismiss"
            />
        </div>
    );
};

export default DisputedTransactionDetails;

