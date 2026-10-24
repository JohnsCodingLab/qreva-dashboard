import React, { useState } from 'react';
import { ShieldCheck, ShieldOff, Copy, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { use2faStatus, use2faBeginSetup, use2faVerifySetup, use2faDisable } from '@/store/features/security/use2fa';

const BackupCodeGrid = ({ codes }) => {
  const [copied, setCopied] = useState(false);

  const copyAll = () => {
    navigator.clipboard.writeText(codes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-[#E9F1F3] bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-[#1E1E1E]">Backup codes</p>
        <button
          onClick={copyAll}
          className="flex items-center gap-1 text-xs text-[#0FB5C9] hover:underline"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy all'}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {codes.map((code) => (
          <code key={code} className="text-xs font-mono bg-white border border-[#E9F1F3] rounded px-2 py-1 text-center tracking-widest">
            {code}
          </code>
        ))}
      </div>
      <p className="text-xs text-[#808C91] mt-3">
        Save these in a safe place. Each code can only be used once. You won't see them again.
      </p>
    </div>
  );
};

const DisableConfirmModal = ({ isOpen, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-sm bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FFF5F2] flex items-center justify-center">
            <AlertTriangle size={20} className="text-[#FF5B04]" />
          </div>
          <h3 className="font-bold text-lg text-[#1E1E1E]">Disable 2FA?</h3>
        </div>
        <p className="text-sm text-[#808C91]">
          Your account will only be protected by your password after this. You can re-enable 2FA at any time.
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#FF5B04] border-[#B54103] hover:bg-orange-600 text-white"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Disabling…' : 'Disable'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const TwoFactorSetup = () => {
  const { data: statusData, isLoading: statusLoading } = use2faStatus();
  const beginSetup = use2faBeginSetup();
  const verifySetup = use2faVerifySetup();
  const disable = use2faDisable();

  const [setupData, setSetupData] = useState(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);

  const status = statusData?.data;
  const isEnabled = status?.enabled;

  const handleBeginSetup = async () => {
    const res = await beginSetup.mutateAsync();
    if (res?.data) {
      setSetupData(res.data);
      setVerified(false);
    }
  };

  const handleVerify = async () => {
    const res = await verifySetup.mutateAsync(verifyCode.trim());
    if (res?.statusCode === 200) {
      setVerified(true);
      setSetupData(null);
      setVerifyCode('');
    }
  };

  const handleDisable = async () => {
    await disable.mutateAsync();
    setShowDisableModal(false);
    setSetupData(null);
    setVerified(false);
  };

  if (statusLoading) {
    return (
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
        <div className="animate-pulse h-6 w-48 bg-gray-200 rounded mb-4" />
        <div className="animate-pulse h-40 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-urbanist text-[#1E1E1E]">Two-Factor Authentication</h1>
        <p className="text-[#808C91] font-general mt-1">
          Add an extra layer of security to your admin account with an authenticator app
        </p>
      </div>

      {/* Current status banner */}
      <div className={`rounded-xl p-5 mb-6 flex items-center gap-4 ${isEnabled ? 'bg-[#ECFDF3] border border-[#ABEFC6]' : 'bg-[#FFF5F2] border border-[#FFD6C4]'}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isEnabled ? 'bg-[#ABEFC6]' : 'bg-[#FFD6C4]'}`}>
          {isEnabled
            ? <ShieldCheck size={20} className="text-[#067647]" />
            : <ShieldOff size={20} className="text-[#FF5B04]" />
          }
        </div>
        <div>
          <p className={`font-semibold text-sm ${isEnabled ? 'text-[#067647]' : 'text-[#FF5B04]'}`}>
            {isEnabled ? '2FA is enabled' : '2FA is not enabled'}
          </p>
          <p className="text-xs text-[#808C91]">
            {isEnabled
              ? `Enabled on ${status.enabledAt ? new Date(status.enabledAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }) : 'unknown date'} · ${status.backupCodesRemaining} backup code${status.backupCodesRemaining !== 1 ? 's' : ''} remaining`
              : 'Your account is only protected by your password'
            }
          </p>
        </div>
      </div>

      {/* SETUP FLOW — only shown when not yet enabled and setup has started */}
      {!isEnabled && !verified && (
        <>
          {!setupData ? (
            <div className="bg-white rounded-xl border border-[#E9F1F3] p-6 space-y-4">
              <p className="text-sm text-[#808C91]">
                Use any TOTP app — Google Authenticator, Authy, 1Password, or similar — to scan a QR code and generate login codes.
              </p>
              <Button
                onClick={handleBeginSetup}
                disabled={beginSetup.isPending}
                className="bg-[#0FB5C9] hover:bg-[#0da3b5] text-white"
              >
                {beginSetup.isPending ? 'Generating…' : 'Set up 2FA'}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Step 1: Scan QR */}
              <div className="bg-white rounded-xl border border-[#E9F1F3] p-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-[#0FB5C9] text-white text-xs flex items-center justify-center font-bold">1</span>
                  <h3 className="font-semibold text-[#1E1E1E]">Scan this QR code</h3>
                </div>
                <p className="text-sm text-[#808C91]">Open your authenticator app and scan the code below.</p>
                <div className="flex justify-center">
                  <img src={setupData.qrCodeDataUrl} alt="2FA QR code" className="w-48 h-48 border border-[#E9F1F3] rounded-lg" />
                </div>
                <details className="text-xs text-[#808C91]">
                  <summary className="cursor-pointer hover:text-[#0FB5C9]">Can't scan? Enter the key manually</summary>
                  <code className="block mt-2 bg-gray-50 border border-[#E9F1F3] rounded px-3 py-2 font-mono tracking-widest break-all">{setupData.secret}</code>
                </details>
              </div>

              {/* Step 2: Save backup codes */}
              <div className="bg-white rounded-xl border border-[#E9F1F3] p-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-[#0FB5C9] text-white text-xs flex items-center justify-center font-bold">2</span>
                  <h3 className="font-semibold text-[#1E1E1E]">Save your backup codes</h3>
                </div>
                <BackupCodeGrid codes={setupData.backupCodes} />
              </div>

              {/* Step 3: Confirm with live code */}
              <div className="bg-white rounded-xl border border-[#E9F1F3] p-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-[#0FB5C9] text-white text-xs flex items-center justify-center font-bold">3</span>
                  <h3 className="font-semibold text-[#1E1E1E]">Confirm with a live code</h3>
                </div>
                <p className="text-sm text-[#808C91]">Enter the 6-digit code your app currently shows to finish setup.</p>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full border border-[#D0D5DD] rounded-lg px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:border-[#0FB5C9]"
                />
                <Button
                  onClick={handleVerify}
                  disabled={verifyCode.length < 6 || verifySetup.isPending}
                  className="w-full bg-[#0FB5C9] hover:bg-[#0da3b5] text-white"
                >
                  {verifySetup.isPending ? 'Verifying…' : 'Enable 2FA'}
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* SUCCESS CONFIRMATION after just enabling */}
      {!isEnabled && verified && (
        <div className="bg-[#ECFDF3] border border-[#ABEFC6] rounded-xl p-6 text-center space-y-2">
          <ShieldCheck size={32} className="text-[#067647] mx-auto" />
          <p className="font-semibold text-[#067647]">2FA enabled — refresh to see updated status</p>
        </div>
      )}

      {/* DISABLE — shown when 2FA is active */}
      {isEnabled && (
        <div className="bg-white rounded-xl border border-[#E9F1F3] p-6 space-y-3">
          <h3 className="font-semibold text-[#1E1E1E]">Disable two-factor authentication</h3>
          <p className="text-sm text-[#808C91]">
            Removing 2FA will make your account less secure. Only do this if you're switching apps or losing access.
          </p>
          <Button
            variant="outline"
            className="border-[#FF5B04] text-[#FF5B04] hover:bg-[#FFF5F2]"
            onClick={() => setShowDisableModal(true)}
          >
            Disable 2FA
          </Button>
        </div>
      )}

      <DisableConfirmModal
        isOpen={showDisableModal}
        onConfirm={handleDisable}
        onCancel={() => setShowDisableModal(false)}
        isLoading={disable.isPending}
      />
    </div>
  );
};

export default TwoFactorSetup;
