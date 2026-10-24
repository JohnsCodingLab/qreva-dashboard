import { X, Smartphone, MapPin, Wifi, ShieldAlert, KeyRound, User as UserIcon } from 'lucide-react';
import { RiskBadge, AccountTypeBadge } from '@/components/security/LoginSessionBadges';

// Every field a login session can carry - the rich deviceContext /
// locationContext / networkContext are only ever populated for customer
// mobile app logins (see DeviceContextDto / LocationContextDto /
// NetworkContextDto on the backend); admin/console logins fall back to the
// browser/os/deviceType resolved server-side from the User-Agent header,
// same fallback LOGIN_SESSION_COLUMNS already uses for the table row.

const DetailRow = ({ label, value, flag }) => {
  const display = value === undefined || value === null || value === '' ? '—' : String(value);
  return (
    <div>
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className={`font-medium break-all ${flag ? 'text-[#D92D20]' : 'text-gray-900'}`}>{display}</p>
    </div>
  );
};

const SectionCard = (props) => {
  const Icon = props.icon;
  return (
    <div className="bg-gray-50 border border-[#E9F1F3] rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className="text-[#808C91]" />
        <h4 className="text-sm font-semibold text-[#1E1E1E]">{props.title}</h4>
      </div>
      <div className="grid grid-cols-1 gap-4 text-sm font-general sm:grid-cols-2">{props.children}</div>
    </div>
  );
};

const formatDate = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  if (isNaN(d)) return val;
  return (
    d.toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }) +
    ' | ' +
    d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', hour12: true })
  );
};

const boolLabel = (v) => (v === true ? 'Yes' : v === false ? 'No' : '—');

// Street -> area -> city -> state -> country, skipping whatever the geocoder
// could not supply. Reads as an address rather than a bare city name, which
// is what makes a wrong reading obvious at a glance.
const composeAddress = (lc) =>
  [lc.street, lc.area, lc.city, lc.state, lc.country]
    .filter((part) => part !== undefined && part !== null && part !== '')
    .join(', ') || undefined;

// A metre figure means little on its own. Naming the band it falls in says
// whether the reading can be trusted to a street or only to a district.
const accuracyLabel = (metres) => {
  if (typeof metres !== 'number') return undefined;
  const rounded = Math.round(metres);
  if (metres <= 30) return `${rounded} m · street level`;
  if (metres <= 150) return `${rounded} m · approximate`;
  return `${rounded} m · area only`;
};

// The fix's own timestamp against when the session was recorded. A fix taken
// long before the request is a cached position from wherever the device
// previously was, no matter how tight its accuracy looks - which is exactly
// how a stale reading passes for a precise one.
const capturedLabel = (capturedAt, sessionAt) => {
  if (!capturedAt) return undefined;
  const fixTime = new Date(capturedAt);
  if (Number.isNaN(fixTime.getTime())) return undefined;
  const reference = sessionAt ? new Date(sessionAt) : new Date();
  const ageSeconds = Math.round((reference - fixTime) / 1000);
  const stamp = fixTime.toLocaleString();
  if (!Number.isFinite(ageSeconds) || ageSeconds < 0) return stamp;
  if (ageSeconds < 60) return `${stamp} · live`;
  if (ageSeconds < 3600) return `${stamp} · ${Math.round(ageSeconds / 60)} min before sign-in`;
  return `${stamp} · ${Math.round(ageSeconds / 3600)} h before sign-in — cached`;
};

const isStaleFix = (capturedAt, sessionAt) => {
  if (!capturedAt) return false;
  const fixTime = new Date(capturedAt);
  if (Number.isNaN(fixTime.getTime())) return false;
  const reference = sessionAt ? new Date(sessionAt) : new Date();
  return (reference - fixTime) / 1000 > 300;
};

const LoginSessionDetailsModal = ({ isOpen, onClose, session }) => {
  if (!isOpen || !session) return null;

  const dc = session.deviceContext || {};
  const lc = session.locationContext || {};
  const nc = session.networkContext || {};
  const sc = session.sessionContext || {};
  const hasDeviceContext = Object.keys(dc).length > 0;
  const hasLocationContext = Object.keys(lc).length > 0;
  const hasNetworkContext = Object.keys(nc).length > 0;
  const hasSessionContext = Object.keys(sc).length > 0;

  // Rendered separately, and in red when true, so a reviewer doesn't have
  // to scan every field to spot the signals that actually matter.
  const securityFlags = [
    { label: 'Rooted / Jailbroken', value: dc.isRootedOrJailbroken },
    { label: 'Emulator', value: dc.isEmulator },
    { label: 'Debugger Attached', value: dc.isDebuggerAttached },
    { label: 'Overlay Permission', value: dc.hasOverlayPermission },
  ].filter((f) => f.value !== undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-sm bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h2 className="text-2xl font-bold font-urbanist text-gray-900">Login Session Details</h2>
            <p className="text-sm text-gray-500 font-general mt-1">Full context captured at sign-in</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-6 border border-[#E9F1F3] flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#F2E8FD] flex items-center justify-center mb-3">
              <UserIcon size={28} className="text-[#7C3AED]" />
            </div>
            <h3 className="font-medium text-gray-900">{session.accountName || '—'}</h3>
            <p className="text-sm text-gray-500 mb-3">{session.accountEmail || '—'}</p>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <AccountTypeBadge type={session.accountType} />
              <RiskBadge action={session.riskAction} />
              {session.isNewDevice && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#FFF6E5] text-[#B8860B]">
                  New device
                </span>
              )}
            </div>
          </div>

          <SectionCard icon={UserIcon} title="Account & Session">
            <DetailRow label="User ID" value={session.userId} />
            <DetailRow label="Account Role" value={session.accountRole} />
            <DetailRow label="Signed In At" value={formatDate(session.loginAt)} />
            <DetailRow label="IP Address" value={session.ipAddress} />
          </SectionCard>

          {hasSessionContext && (
            <SectionCard icon={KeyRound} title="Session">
              <DetailRow label="Session ID" value={sc.sessionId} />
              <DetailRow label="Auth Method" value={sc.authMethod} />
              <DetailRow label="Session Age (s)" value={sc.sessionAgeSeconds} />
              <DetailRow
                label="MFA Completed"
                value={boolLabel(sc.mfaCompleted)}
                flag={sc.mfaCompleted === false}
              />
            </SectionCard>
          )}

          <SectionCard icon={Smartphone} title="Device">
            {hasDeviceContext ? (
              <>
                <DetailRow label="Platform" value={dc.platform} />
                <DetailRow label="Model" value={dc.model} />
                <DetailRow label="OS Version" value={dc.osVersion} />
                <DetailRow label="App Version" value={dc.appVersion} />
                <DetailRow label="Device ID" value={dc.deviceId} />
                <DetailRow label="Screen Resolution" value={dc.screenResolution} />
                <DetailRow label="Timezone" value={dc.timezone} />
                <DetailRow label="Locale" value={dc.locale} />
                <DetailRow
                  label="Battery Level"
                  value={dc.batteryLevel != null ? `${dc.batteryLevel}%` : undefined}
                />
              </>
            ) : (
              <>
                <DetailRow label="Browser" value={session.browser} />
                <DetailRow label="OS" value={session.os} />
                <DetailRow label="Device Type" value={session.deviceType} />
                <DetailRow label="User Agent" value={session.userAgent} />
              </>
            )}
          </SectionCard>

          {securityFlags.length > 0 && (
            <SectionCard icon={ShieldAlert} title="Device Security Signals">
              {securityFlags.map((f) => (
                <DetailRow key={f.label} label={f.label} value={boolLabel(f.value)} flag={f.value === true} />
              ))}
            </SectionCard>
          )}

          <SectionCard icon={MapPin} title="Location">
            {hasLocationContext ? (
              <>
                <div className="sm:col-span-2">
                  <DetailRow label="Address" value={composeAddress(lc)} />
                </div>
                <DetailRow label="City" value={lc.city} />
                <DetailRow label="State" value={lc.state} />
                <DetailRow label="Country" value={lc.country} />
                <DetailRow label="Source" value={lc.source} />
                <DetailRow label="Latitude" value={lc.latitude} />
                <DetailRow label="Longitude" value={lc.longitude} />
                <DetailRow
                  label="Accuracy"
                  value={accuracyLabel(lc.accuracyMeters) ?? lc.accuracyMeters}
                  flag={
                    typeof lc.accuracyMeters === 'number' &&
                    lc.accuracyMeters > 150
                  }
                />
                <DetailRow
                  label="Mock location"
                  value={boolLabel(lc.isMocked)}
                  flag={lc.isMocked === true}
                />
                <div className="sm:col-span-2">
                  <DetailRow
                    label="Fix taken"
                    value={capturedLabel(lc.capturedAt, session.loginAt)}
                    flag={isStaleFix(lc.capturedAt, session.loginAt)}
                  />
                </div>
              </>
            ) : (
              <DetailRow label="Location" value={session.headerLocation} />
            )}
          </SectionCard>

          <SectionCard icon={Wifi} title="Network">
            <DetailRow label="IP Address" value={session.ipAddress} />
            {hasNetworkContext && (
              <>
                <DetailRow label="VPN / Proxy" value={boolLabel(nc.isVpnOrProxy)} flag={nc.isVpnOrProxy === true} />
                <DetailRow label="Tor" value={boolLabel(nc.isTor)} flag={nc.isTor === true} />
                <DetailRow label="Connection Type" value={nc.connectionType} />
              </>
            )}
          </SectionCard>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#FF5B04] border border-[#B54103] text-white font-general font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSessionDetailsModal;
