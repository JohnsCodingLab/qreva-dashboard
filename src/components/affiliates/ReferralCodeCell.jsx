import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Link2 } from 'lucide-react';

/**
 * The referral code, with its two copy actions spelled out.
 *
 * Both used to hang off the code itself as 10px grey text reading "copy
 * link" — easy to miss, and it gave no way to copy the bare code, which is
 * what anyone reading a code out over the phone actually wants. They are
 * labelled buttons now, and each confirms in place so there is no doubt
 * which of the two landed on the clipboard.
 */
const ReferralCodeCell = ({ code, onCopyCode, onCopyLink }) => {
  const [copied, setCopied] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const confirm = (which) => {
    setCopied(which);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(null), 1600);
  };

  const button = (which, Icon, label, onClick) => {
    const isCopied = copied === which;
    return (
      <button
        type="button"
        onClick={() => {
          onClick();
          confirm(which);
        }}
        title={label}
        aria-label={label}
        className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-general font-medium transition-colors ${
          isCopied
            ? 'border-[#4ED17E] bg-[#E9F9EF] text-[#188C43]'
            : 'border-[#E8EBED] bg-white text-[#1E1E1E] hover:bg-[#F7FAFA]'
        }`}
      >
        {isCopied ? <Check size={12} /> : <Icon size={12} />}
        <span>{isCopied ? 'Copied' : label}</span>
      </button>
    );
  };

  return (
    <div className="flex h-full flex-col justify-center gap-1.5 py-1">
      <span className="font-mono text-sm font-semibold tracking-wide text-qreva-navy">
        {code || '—'}
      </span>
      <div className="flex items-center gap-1.5">
        {button('code', Copy, 'Copy code', () => onCopyCode?.(code))}
        {button('link', Link2, 'Copy link', () => onCopyLink?.())}
      </div>
    </div>
  );
};

export default ReferralCodeCell;
