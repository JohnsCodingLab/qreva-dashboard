import { useState } from 'react';
import { X, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import logo from '../../assets/images/logo.png';
import { abbreviateBankName } from '@/utils/bankName';
import { resolveSenderName } from '@/utils/transactionParties';

const ShareReceiptModal = ({ isOpen, onClose, transaction }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !transaction) return null;

  const statusColor = {
    Successful: 'bg-green-50 text-green-700',
    Completed: 'bg-green-50 text-green-700',
    Pending: 'bg-yellow-50 text-yellow-700',
    Failed: 'bg-red-50 text-red-700',
  };

  const statusLabel = transaction.status || 'Successful';
  const statusClass = statusColor[statusLabel] || statusColor.Successful;

  const txDate = transaction.createdAt
    ? new Date(transaction.createdAt).toLocaleDateString('en-NG', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : transaction.date || '—';

  const recipientName =
    transaction.recipient ||
    transaction.clientName ||
    transaction.transferId?.nameEnquiryId?.accountName ||
    transaction.utilityId?.phoneNumber ||
    transaction.title ||
    null;

  // counterpartyBankName is resolved backend-side and always describes the
  // other party: the recipient's bank on Outward, the sender's bank on Inward.
  const counterpartyBank = transaction.counterpartyBankName
    ? abbreviateBankName(transaction.counterpartyBankName)
    : null;
  const counterpartyBankLabel =
    transaction.type === 'Outward' ? 'Recipient Bank' : 'Sender Bank';
  const resolvedSenderName = resolveSenderName(transaction);
  const senderName = resolvedSenderName !== '-' ? resolvedSenderName : null;

  const txId = transaction._id || transaction.id || '—';
  const category = transaction.typeCategory || transaction.category || transaction.type || '—';
  const amount = transaction.amount != null ? `NGN ${Number(transaction.amount).toLocaleString()}` : '—';

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a5' });
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 40;
      const contentW = pageW - margin * 2;
      let y = 40;

      // Header bar
      doc.setFillColor(255, 91, 4);
      doc.rect(0, 0, pageW, 8, 'F');

      // Try to add logo
      try {
        const img = new Image();
        img.src = logo;
        await new Promise((res) => { img.onload = res; img.onerror = res; });
        if (img.complete && img.naturalWidth) {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          canvas.getContext('2d').drawImage(img, 0, 0);
          doc.addImage(canvas.toDataURL('image/png'), 'PNG', margin, y, 28, 28);
        }
      } catch { /* skip logo */ }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(30, 30, 30);
      doc.text('qreva', margin + 34, y + 18);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(128, 140, 145);
      doc.text('Transaction Receipt', pageW - margin, y + 18, { align: 'right' });

      y += 52;

      // Divider
      doc.setDrawColor(232, 235, 237);
      doc.line(margin, y, pageW - margin, y);
      y += 24;

      // Amount
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.setTextColor(255, 91, 4);
      doc.text(amount, pageW / 2, y, { align: 'center' });
      y += 20;

      // Status badge
      const badgeColors = {
        Successful: [233, 249, 239], Completed: [233, 249, 239],
        Pending: [255, 248, 230], Failed: [252, 236, 236],
      };
      const badgeTextColors = {
        Successful: [24, 140, 67], Completed: [24, 140, 67],
        Pending: [181, 130, 2], Failed: [158, 45, 45],
      };
      const bgColor = badgeColors[statusLabel] || [245, 246, 247];
      const textColor = badgeTextColors[statusLabel] || [80, 92, 97];
      const badgeText = `Transaction ${statusLabel}!`;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      const badgeW = doc.getTextWidth(badgeText) + 20;
      doc.setFillColor(...bgColor);
      doc.roundedRect((pageW - badgeW) / 2, y, badgeW, 20, 10, 10, 'F');
      doc.setTextColor(...textColor);
      doc.text(badgeText, pageW / 2, y + 13, { align: 'center' });
      y += 36;

      // Date under amount
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(128, 140, 145);
      doc.text(txDate, pageW / 2, y, { align: 'center' });
      y += 24;

      // Divider
      doc.setDrawColor(232, 235, 237);
      doc.line(margin, y, pageW - margin, y);
      y += 20;

      // Detail rows
      const rows = [
        recipientName && ['Recipient', recipientName],
        senderName && ['Sender', senderName],
        counterpartyBank && [counterpartyBankLabel, counterpartyBank],
        ['Transaction ID', txId.length > 30 ? txId.slice(0, 30) + '…' : txId],
        ['Category', category],
        ['Date', txDate],
        ['Status', statusLabel],
        transaction.externalReferenceId && ['Reference', transaction.externalReferenceId],
        transaction.utilityId?.phoneNumber && ['Phone', transaction.utilityId.phoneNumber],
      ].filter(Boolean);

      doc.setFontSize(10);
      rows.forEach(([label, value]) => {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(128, 140, 145);
        doc.text(label, margin, y);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 30, 30);
        doc.text(String(value), pageW - margin, y, { align: 'right' });
        y += 20;

        // Light row separator
        doc.setDrawColor(245, 246, 247);
        doc.line(margin, y - 6, pageW - margin, y - 6);
      });

      y += 12;
      // Footer
      doc.setDrawColor(232, 235, 237);
      doc.line(margin, y, pageW - margin, y);
      y += 16;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(128, 140, 145);
      doc.text('Powered by Qreva · www.qreva.com', pageW / 2, y, { align: 'center' });

      // Footer bar
      doc.setFillColor(255, 91, 4);
      doc.rect(0, doc.internal.pageSize.getHeight() - 8, pageW, 8, 'F');

      doc.save(`receipt-${txId.slice(0, 16)}.pdf`);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h2 className="text-xl font-semibold font-urbanist text-black">Download Receipt</h2>
            <p className="text-sm text-qreva-navy font-general mt-1">Here are the details of this transaction</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-qreva-ash rounded-lg transition-colors">
            <X size={20} className="text-qreva-navy" />
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 bg-white">
            <div className="flex justify-between mb-6">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-gray-200" />
              ))}
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Qreva" className="w-6 h-6" />
                <span className="font-semibold text-black">qreva</span>
              </div>
              <span className="text-xs text-qreva-navy">Transaction Receipt</span>
            </div>

            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-qreva-orange mb-2">
                {transaction.amount != null ? `₦${Number(transaction.amount).toLocaleString()}` : '—'}
              </div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 ${statusClass} rounded-full text-sm font-medium`}>
                Transaction {statusLabel}!
              </div>
              <div className="text-xs text-qreva-navy mt-2">{txDate}</div>
            </div>

            <div className="space-y-3 text-sm mb-6">
              {recipientName && (
                <div className="flex justify-between">
                  <span className="text-qreva-navy">Recipient</span>
                  <span className="font-medium text-black">{recipientName}</span>
                </div>
              )}
              {senderName && (
                <div className="flex justify-between">
                  <span className="text-qreva-navy">Sender</span>
                  <span className="font-medium text-black">{senderName}</span>
                </div>
              )}
              {counterpartyBank && (
                <div className="flex justify-between">
                  <span className="text-qreva-navy">{counterpartyBankLabel}</span>
                  <span
                    className="font-medium text-black"
                    title={transaction.counterpartyBankName}
                  >
                    {counterpartyBank}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-qreva-navy">Transaction ID</span>
                <span className="font-medium text-black font-mono text-xs truncate max-w-[180px]">{txId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-qreva-navy">Category</span>
                <span className="font-medium text-black">{category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-qreva-navy">Date</span>
                <span className="font-medium text-black">{txDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-qreva-navy">Status</span>
                <span className={`font-medium ${statusLabel === 'Failed' ? 'text-qreva-orange' : statusLabel === 'Pending' ? 'text-qreva-orange' : 'text-qreva-blue'}`}>
                  {statusLabel}
                </span>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-gray-200" />
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-3 bg-[#FF5B04] text-white font-medium font-general rounded-lg hover:bg-[#E54F03] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            {isDownloading ? 'Downloading...' : 'Download Receipt'}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-orange-50 text-qreva-orange font-medium font-general rounded-lg hover:bg-orange-100 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareReceiptModal;
