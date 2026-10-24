import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

// Short two-tone chime, synthesised rather than shipped as an audio asset so
// there's no binary to bundle or 404 if the file path shifts.
const playAlertChime = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.32);

    osc.start();
    osc.stop(ctx.currentTime + 0.32);
    osc.onended = () => ctx.close().catch(() => {});
  } catch {
    // Browsers block audio until the user has interacted with the page. A
    // silent alert is still a visible alert, so this must never throw.
  }
};

const idOf = (n) => n?._id || n?.id;

/**
 * Watches the admin notification feed and announces newly-arrived ones with a
 * toast plus a chime. Existing notifications present on first load are seeded
 * as already-seen, so opening the dashboard doesn't fire a burst of toasts for
 * a backlog the user has already lived through.
 */
export const useNotificationAlerts = (notifications) => {
  const seenIds = useRef(null);

  useEffect(() => {
    if (!Array.isArray(notifications)) return;

    const unread = notifications.filter((n) => !n.read && !n.isRead);

    // First pass: remember what was already there without announcing it.
    if (seenIds.current === null) {
      seenIds.current = new Set(unread.map(idOf).filter(Boolean));
      return;
    }

    const fresh = unread.filter((n) => {
      const id = idOf(n);
      return id && !seenIds.current.has(id);
    });

    if (!fresh.length) return;

    fresh.forEach((n) => seenIds.current.add(idOf(n)));

    playAlertChime();

    fresh.forEach((n) => {
      // Uses the same alert colours as the rest of the dashboard (the status
      // badges on the transaction tables) so alerts look native rather than
      // introducing a third scheme.
      //
      // Both the container AND the description are styled. The global Toaster
      // pins every toast to one dark background, and sonner styles the
      // description separately - previously only the container was set, so a
      // dark saturated background kept sonner's muted grey description text,
      // which was close to unreadable. Class names are written out in full
      // rather than built from variables so Tailwind emits them.
      const palettes = {
        error: {
          style: { background: '#FCECEC', color: '#9E2D2D', border: '1px solid #E56566' },
          descriptionClassName: '!text-[#9E2D2D]',
          closeButtonClassName: '!bg-[#FCECEC] !border-[#E56566] !text-[#9E2D2D] hover:!bg-[#F7DADA]',
        },
        warning: {
          // Darker than the badge amber (#B58202): that only reaches 3.2:1
          // here, which fails WCAG AA for body text. #8A6200 gives 5.2:1.
          style: { background: '#FFF8E6', color: '#8A6200', border: '1px solid #FFC535' },
          descriptionClassName: '!text-[#8A6200]',
          closeButtonClassName: '!bg-[#FFF8E6] !border-[#FFC535] !text-[#8A6200] hover:!bg-[#FBEFCF]',
        },
        success: {
          // Same reason: the badge green reaches only 3.9:1, #147038 gives 5.7:1.
          style: { background: '#E9F9EF', color: '#147038', border: '1px solid #4ED17E' },
          descriptionClassName: '!text-[#147038]',
          closeButtonClassName: '!bg-[#E9F9EF] !border-[#4ED17E] !text-[#147038] hover:!bg-[#D8F2E2]',
        },
        info: {
          style: { background: '#FFFFFF', color: '#1E1E1E', border: '1px solid #D9D9D9' },
          descriptionClassName: '!text-[#1E1E1E]',
          closeButtonClassName: '!bg-[#FFFFFF] !border-[#D9D9D9] !text-[#1E1E1E] hover:!bg-[#F1F3F4]',
        },
      };

      const palette = palettes[n.type] || palettes.info;

      const options = {
        description: n.message || '',
        duration: 8000,
        style: palette.style,
        descriptionClassName: palette.descriptionClassName,
        // Without this an operator had to sit and wait out the full 8s, and a
        // burst of alerts stacked up with no way to clear them.
        closeButton: true,
        // The close button is styled from the global Toaster, which pins a dark
        // theme - left alone it renders near-invisible on these light alert
        // backgrounds, the same way the description text did.
        classNames: { closeButton: palette.closeButtonClassName },
      };

      if (n.type === 'error') {
        toast.error(n.title || 'Alert', options);
      } else if (n.type === 'warning') {
        toast.warning(n.title || 'Alert', options);
      } else if (n.type === 'success') {
        toast.success(n.title || 'Notification', options);
      } else {
        toast.info(n.title || 'Notification', options);
      }
    });
  }, [notifications]);
};
