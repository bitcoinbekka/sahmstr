import type { PosterTone } from '@/lib/homeEc/posters';

/**
 * The sovereign toolkit — alternatives to the extractive platforms.
 *
 * Every entry is something a household can use today, and every one can be
 * self-hosted or walked away from without losing your identity or your
 * customers. Kept deliberately short: a long list of tools reads as homework,
 * three reads as a starting point.
 *
 * Lives in its own module rather than inline in the page so it can be linked
 * from anywhere (the homepage and the footer both use it) and edited without
 * touching layout code.
 */
export interface ToolkitEntry {
  /** Product name, as the project itself writes it. */
  label: string;
  /** Small-caps kicker above the name — the category, not a tagline. */
  kicker: string;
  /** Why a household would care. Plain, concrete, no hype. */
  body: string;
  href: string;
  /** Which ink from the poster series this entry prints in. */
  tone: PosterTone;
}

export const TOOLKIT: ToolkitEntry[] = [
  {
    label: 'Plebeian Market',
    kicker: 'Peer-to-peer trade',
    body: 'Sell what your household makes without a middleman taking a cut or owning your customers. Listings are events you sign yourself, payment is bitcoin over Lightning straight to you, and the whole shop can run from a node in your own closet.',
    href: 'https://plebeian.market',
    tone: 'ochre',
  },
  {
    label: 'Nostr',
    kicker: 'Censorship-resistant',
    body: 'The protocol underneath this site. One keypair is your account everywhere — no email, no phone number, nothing to be locked out of. Run your own relay and your family\u2019s words live on hardware you control.',
    href: 'https://nostr.com',
    tone: 'green',
  },
  {
    label: 'Start9 & Umbrel',
    kicker: 'Self-hosting',
    body: 'Sovereignty is a server in the cupboard, not a subscription. Both turn a small computer at home into your own relay, node and cloud — your photos, your money, your data, on your own hardware.',
    href: 'https://start9.com',
    tone: 'teal',
  },
];

/** Compact form for the footer, where only the name and link are shown. */
export const TOOLKIT_LINKS: Array<{ href: string; label: string }> = [
  { href: 'https://plebeian.market', label: 'Plebeian Market' },
  { href: 'https://nostr.com', label: 'What is Nostr?' },
  { href: 'https://start9.com', label: 'Self-host at home' },
];
