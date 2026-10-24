import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ChevronLeft, Bell, Settings, Menu } from 'lucide-react';
import { getRouteConfig, ROUTES } from '@/config/routes.config';
import NotificationsPanel from '@/components/common/NotificationsPanel';
import { useNotifications } from '@/store/features/notifications/useNotifications';
import { useNotificationAlerts } from '@/hooks/useNotificationAlerts';

const Breadcrumb = ({ user, onOpenSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [notifOpen, setNotifOpen] = useState(false);

  const { data: notifResponse, refetch: refetchNotifications } = useNotifications({ limit: 20 });
  const notifications = notifResponse?.data || notifResponse?.notifications || [];
  const unreadCount = notifications.filter(n => !n.read && !n.isRead).length;

  // Announce newly-arrived notifications with a toast + chime.
  useNotificationAlerts(notifications);

  const handleToggleNotif = () => {
    setNotifOpen((v) => {
      const next = !v;
      if (next) refetchNotifications();
      return next;
    });
  };

  const currentRoute = getRouteConfig(location.pathname);
  const path = location.pathname;

  // Show back button if the route has an explicit parent, OR if we're on a settings sub-page
  const isSettingsSubPage = path.startsWith('/settings/') && path !== '/settings';
  const canGoBack = currentRoute.parent !== null || isSettingsSubPage;

  const getBackPath = () => {
    if (currentRoute.parent) return currentRoute.parent;
    if (isSettingsSubPage) return '/settings';
    return null;
  };

  // Generate dynamic label based on route type and params
  const getDynamicLabel = () => {
    const { type, id } = params;

    // If no dynamic params, use default label
    if (!type && !id) {
      return currentRoute.label;
    }

    // Handle different view types
    if (type === 'region') {
      return 'View Location Details';
    }

    if (type === 'transaction') {
      return 'View Transaction History';
    }

    // Default fallback
    return currentRoute.label;
  };

  const handleBack = () => {
    const backPath = getBackPath();
    if (backPath) navigate(backPath);
  };

  // Build breadcrumb segments for routes with known parents
  const getBreadcrumbSegments = () => {
    // Tier Management sub-routes
    if (path.startsWith('/settings/tier/edit')) {
      return [
        { label: 'Settings', path: '/settings' },
        { label: 'Tier Management', path: '/settings/tier' },
        { label: 'Edit Details', path: null },
      ];
    }
    // Agent Category sub-routes
    if (path.startsWith('/settings/agent-category/create')) {
      return [
        { label: 'Settings', path: '/settings' },
        { label: 'Agent Category', path: '/settings/agent-category' },
        { label: 'Create New Category', path: null },
      ];
    }
    if (path.startsWith('/settings/agent-category/edit')) {
      return [
        { label: 'Settings', path: '/settings' },
        { label: 'Agent Category', path: '/settings/agent-category' },
        { label: 'Edit Details', path: null },
      ];
    }
    if (path.startsWith('/settings/agent-category/view')) {
      return [
        { label: 'Settings', path: '/settings' },
        { label: 'Agent Category', path: '/settings/agent-category' },
        { label: 'View Details', path: null },
      ];
    }
    if (path.startsWith('/settings/rbac/edit')) {
      return [
        { label: 'Settings', path: '/settings' },
        { label: 'Admin Management', path: '/settings/rbac' },
        { label: 'Edit Admin', path: null },
      ];
    }
    if (path.startsWith('/settings/rbac/view')) {
      return [
        { label: 'Settings', path: '/settings' },
        { label: 'Admin Management', path: '/settings/rbac' },
        { label: 'View Details', path: null },
      ];
    }
    // Settings sub-pages (first level under /settings)
    const settingsPages = {
      '/settings/tier': 'Tier Management',
      '/settings/rbac': 'Admin Management',
      '/settings/rbac/create': 'Add Admin',
      '/settings/agent-category': 'Agent Category',
      '/settings/agent-category/create': 'Create Agent Category',
      '/settings/contracts': 'Contract Management',
      '/settings/partner-api': 'Partner API',
      '/settings/activity-logs': 'Activity Logs',
      '/settings/profile': 'My Profile',
    };
    if (settingsPages[path]) {
      return [
        { label: 'Settings', path: '/settings' },
        { label: settingsPages[path], path: null },
      ];
    }
    return null;
  };

  const segments = getBreadcrumbSegments();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8EBED] bg-white px-4 py-3 sm:px-6 sm:py-4">
      {/* Left side - Back button and breadcrumb/title */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-lg p-2 hover:bg-qreva-ash transition-colors lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={20} className="text-[#084059]" />
        </button>
        {canGoBack && (
          <button
            onClick={handleBack}
            className="p-2 hover:bg-qreva-ash rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={20} className="text-[#084059]" />
          </button>
        )}
        {segments ? (
          <nav className="hidden items-center gap-1 text-sm sm:flex">
            {segments.map((seg, idx) => (
              <span key={idx} className="flex items-center gap-1">
                {idx > 0 && <span className="text-[#808C91]">/</span>}
                {seg.path ? (
                  <button
                    onClick={() => navigate(seg.path)}
                    className="text-[#808C91] hover:text-[#505C61] font-medium transition-colors"
                  >
                    {seg.label}
                  </button>
                ) : (
                  <span className="text-[#FF5B04] font-medium">{seg.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : (
          <h1 className="truncate text-sm font-general font-medium text-[#FF5B04]">
            {getDynamicLabel()}
          </h1>
        )}
        {segments && (
          <h1 className="truncate text-sm font-general font-medium text-[#FF5B04] sm:hidden">
            {segments[segments.length - 1]?.label}
          </h1>
        )}
      </div>

      {/* Right side - Notifications, Settings, User Badge */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative">
          <button
            onClick={handleToggleNotif}
            className="relative rounded-full border border-[#D9D9D9] p-2.5 transition-colors hover:bg-qreva-ash sm:p-3"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-[#084059]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-[#FF5B04] rounded-full flex items-center justify-center text-[9px] font-bold text-white px-0.5">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} />}
        </div>

        <button
          className="rounded-full border border-[#D9D9D9] p-2.5 transition-colors hover:bg-qreva-ash sm:p-3"
          aria-label="Settings"
          onClick={() => navigate('/settings')}
        >
          <Settings size={20} className="text-[#084059]" />
        </button>
        <hr className="hidden h-8 border-l border-gray-300 sm:block" />

        {['RegionalManager', 'StateManager'].includes(user?.role) && (
          <div className="hidden flex-col items-end sm:flex mr-2 text-right">
            <span className="text-sm font-semibold text-qreva-navy leading-none">{user?.username || 'John Doe'}</span>
            <span className="text-[11px] text-slate-500 mt-1 font-medium">
              ID: {user?.staffId || 'RM-1024'} &bull; {user?.assignedState || user?.region || 'South West'}
            </span>
          </div>
        )}

        <div className="flex h-10 w-10 items-center justify-center gap-2 rounded-full border border-[#D9D9D9] bg-[#F7FAFA] sm:h-11 sm:w-11">
          <span className="text-[12.8px] font-urbanist font-semibold text-[#1E1E1E] bg-[#CEEBF5] w-8 h-8 rounded-full flex items-center justify-center">
            {user?.username?.split(' ').map(n => n[0]).join('').toUpperCase() || 'JFD'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
