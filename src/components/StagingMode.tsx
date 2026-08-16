import { useHead } from '@unhead/react';

/**
 * Staging mode.
 *
 * When the site is built with `VITE_STAGING=true` (i.e. it is a private demo /
 * pre-launch build, not the real public launch), this:
 *
 *   1. adds a `noindex, nofollow` robots meta tag so search engines never list
 *      the demo, and
 *   2. shows a small fixed ribbon so anyone viewing knows it is not the live
 *      site and shouldn't be shared around.
 *
 * A normal production build (`VITE_STAGING` unset) renders nothing, so this is
 * completely inert once you truly go live. The flag is read at build time, so
 * staging and production are the *same code*, differing only by an env var.
 */
export const IS_STAGING = import.meta.env.VITE_STAGING === 'true';

export function StagingMode() {
  // Hooks must run unconditionally; the head entry is only added when staging.
  useHead(
    IS_STAGING
      ? { meta: [{ name: 'robots', content: 'noindex, nofollow' }] }
      : {},
  );

  if (!IS_STAGING) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-3 left-1/2 z-[100] -translate-x-1/2"
      role="status"
      aria-label="Staging environment"
    >
      <span className="rounded-full border border-[hsl(var(--poster-ochre))] bg-[hsl(var(--poster-ink))]/90 px-3 py-1 font-slab text-[10px] font-bold uppercase tracking-[0.16em] text-[hsl(var(--poster-ochre))] shadow-lg backdrop-blur">
        Staging · preview build — not for public sharing
      </span>
    </div>
  );
}
