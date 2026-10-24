import { X } from 'lucide-react';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm",
  cancelText = "Dismiss",
  confirmStyle = "danger" // "danger" or "primary"
}) => {
  if (!isOpen) return null;

  const confirmButtonStyle = confirmStyle === "danger" 
    ? "bg-[#FF544A] hover:bg-[#FF5252] text-white border border-[#9E2D2D]"
    : "bg-qreva-blue hover:bg-blue-700 text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-urbanist font-semibold text-black">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-qreva-ash rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 font-general">
          <p className="text-qreva-navy">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onConfirm}
            className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${confirmButtonStyle}`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-[#FFEFE6] border border-[#FFCCB1] text-[#FF5B04] rounded-lg font-general font-semibold hover:bg-[#FFE5D3] transition-colors"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;