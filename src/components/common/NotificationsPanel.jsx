import { useEffect, useRef, useState } from 'react';
import { Bell, Check, CheckCheck, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/store/features/notifications/useNotifications';

const typeIcon = (type) => {
  switch ((type || '').toLowerCase()) {
    case 'success': return <Check size={14} className="text-qreva-blue" />;
    case 'warning': return <AlertTriangle size={14} className="text-qreva-orange" />;
    case 'error':
    case 'alert': return <AlertCircle size={14} className="text-qreva-orange" />;
    default: return <Info size={14} className="text-[#084059]" />;
  }
};

const typeBg = (type) => {
  switch ((type || '').toLowerCase()) {
    case 'success': return 'bg-green-50';
    case 'warning': return 'bg-yellow-50';
    case 'error':
    case 'alert': return 'bg-red-50';
    default: return 'bg-[#EAF4F8]';
  }
};

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const formatFullDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const NotificationsPanel = ({ onClose }) => {
  const panelRef = useRef(null);
  const { data: response, isLoading } = useNotifications({ limit: 20 });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const [selectedNotif, setSelectedNotif] = useState(null);

  const notifications = response?.data || response?.notifications || [];
  const unreadCount = notifications.filter((n) => !n.read && !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  const handleOpenNotif = (n) => {
    setSelectedNotif(n);
    const isUnread = !n.read && !n.isRead;
    if (isUnread) {
      markRead.mutate(n._id || n.id);
    }
  };

  const handleCloseDetail = () => {
    setSelectedNotif(null);
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full z-50 mt-2 w-[min(380px,calc(100vw-1rem))] overflow-hidden rounded-xl border border-[#E8EBED] bg-white shadow-xl"
      style={{ maxHeight: '520px' }}
    >
      {/* ── Detail View ── */}
      {selectedNotif ? (
        <div className="flex flex-col" style={{ maxHeight: '520px' }}>
          {/* Detail Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#F0F3F4] shrink-0">
            <button
              onClick={handleCloseDetail}
              className="p-1 hover:bg-[#F5F6F7] rounded-md transition-colors"
              title="Back to notifications"
            >
              <svg
                width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                className="text-[#505C61]"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className="text-sm font-urbanist font-semibold text-[#1E1E1E] flex-1">
              Notification Detail
            </span>
            <button onClick={onClose} className="p-1 hover:bg-[#F5F6F7] rounded-md transition-colors">
              <X size={16} className="text-[#808C91]" />
            </button>
          </div>

          {/* Detail Body */}
          <div className="overflow-y-auto p-4 space-y-4" style={{ maxHeight: '460px' }}>
            {/* Icon + Title + Time */}
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full ${typeBg(selectedNotif.type || selectedNotif.notificationType || 'info')} flex items-center justify-center shrink-0`}
              >
                {typeIcon(selectedNotif.type || selectedNotif.notificationType || 'info')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-general font-semibold text-[#1E1E1E] leading-snug">
                  {selectedNotif.title || selectedNotif.subject || selectedNotif.heading || 'Notification'}
                </p>
                <p className="text-[11px] text-[#B0B7C3] font-general mt-1">
                  {formatFullDate(selectedNotif.createdAt || selectedNotif.timestamp || selectedNotif.date)}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#F0F3F4]" />

            {/* Full message */}
            {(selectedNotif.message || selectedNotif.body || selectedNotif.description || selectedNotif.content) ? (
              <p className="text-sm text-[#505C61] font-general leading-relaxed whitespace-pre-wrap">
                {selectedNotif.message || selectedNotif.body || selectedNotif.description || selectedNotif.content}
              </p>
            ) : (
              <p className="text-sm text-[#B0B7C3] font-general italic">No additional details available.</p>
            )}

            {/* Extra metadata if available */}
            {selectedNotif.metadata &&
              typeof selectedNotif.metadata === 'object' &&
              Object.keys(selectedNotif.metadata).length > 0 && (
                <div className="rounded-lg border border-[#F0F3F4] bg-[#FAFCFF] p-3 space-y-2">
                  <p className="text-[10px] font-general font-semibold text-[#808C91] uppercase tracking-wide">
                    Details
                  </p>
                  {Object.entries(selectedNotif.metadata).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2 text-xs">
                      <span className="text-[#808C91] font-general capitalize">
                        {k.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-[#1E1E1E] font-general font-medium text-right break-all">
                        {String(v)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            {/* Read confirmation badge */}
            <div className="flex items-center gap-1.5 text-[11px] text-green-600 font-general">
              <Check size={12} />
              Marked as read
            </div>
          </div>
        </div>
      ) : (
        /* ── List View ── */
        <>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F3F4]">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-[#084059]" />
              <span className="text-sm font-urbanist font-semibold text-[#1E1E1E]">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 bg-[#FF5B04] text-white text-[10px] font-bold rounded-full leading-none">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={markAllRead.isPending}
                  className="flex items-center gap-1 text-xs text-[#084059] hover:text-[#FF5B04] font-general transition-colors"
                >
                  <CheckCheck size={13} />
                  Mark all read
                </button>
              )}
              <button onClick={onClose} className="p-1 hover:bg-[#F5F6F7] rounded-md transition-colors">
                <X size={16} className="text-[#808C91]" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto" style={{ maxHeight: '456px' }}>
            {isLoading ? (
              <div className="flex flex-col gap-3 p-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-[#F0F3F4] shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-[#F0F3F4] rounded w-3/4" />
                      <div className="h-2 bg-[#F0F3F4] rounded w-full" />
                      <div className="h-2 bg-[#F0F3F4] rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-[#F0F3F4] flex items-center justify-center mb-3">
                  <Bell size={20} className="text-[#B0B7C3]" />
                </div>
                <p className="text-sm font-general font-medium text-[#505C61]">No notifications yet</p>
                <p className="text-xs text-[#B0B7C3] mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div>
                {notifications.map((n) => {
                  const isUnread = !n.read && !n.isRead;
                  const id = n._id || n.id;
                  const title = n.title || n.subject || n.heading || 'Notification';
                  const message = n.message || n.body || n.description || n.content || '';
                  const time = timeAgo(n.createdAt || n.timestamp || n.date);
                  const type = n.type || n.notificationType || 'info';

                  return (
                    <div
                      key={id}
                      onClick={() => handleOpenNotif(n)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleOpenNotif(n)}
                      className={`flex gap-3 px-4 py-3 border-b border-[#F7FAFA] transition-colors cursor-pointer select-none
                        ${isUnread ? 'bg-[#FAFCFF]' : 'bg-white'}
                        hover:bg-[#F0F7FA] active:bg-[#E8F3F8]`}
                    >
                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-full ${typeBg(type)} flex items-center justify-center shrink-0 mt-0.5`}>
                        {typeIcon(type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-general leading-snug ${isUnread ? 'font-semibold text-[#1E1E1E]' : 'font-medium text-[#505C61]'}`}>
                            {title}
                          </p>
                          {isUnread && (
                            <span
                              className="shrink-0 w-2 h-2 rounded-full bg-[#FF5B04] mt-1.5"
                              title="Unread"
                            />
                          )}
                        </div>
                        {message && (
                          <p className="text-xs text-[#808C91] font-general mt-0.5 leading-relaxed line-clamp-2">
                            {message}
                          </p>
                        )}
                        <p className="text-[10px] text-[#B0B7C3] font-general mt-1">{time}</p>
                      </div>

                      {/* Chevron */}
                      <div className="shrink-0 flex items-center self-center">
                        <svg
                          width="14" height="14" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round"
                          className="text-[#D0D7DC]"
                        >
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsPanel;
