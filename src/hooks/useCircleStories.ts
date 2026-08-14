/**
 * Publishing and reading Circle stories.
 *
 * A story is a NIP-68 picture (`kind:20`) or NIP-71 short video (`kind:22`)
 * built as an unsigned NIP-59 rumor, sealed to each recipient, and gift wrapped
 * under a throwaway key. The network sees only `kind:1059` events from random
 * pubkeys. There is no public record of who posted, what was posted, or to whom.
 */

import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import type { NostrEvent, NRelay } from '@nostrify/nostrify';
import { generateSecretKey, getEventHash } from 'nostr-tools';
import { NSecSigner } from '@nostrify/nostrify';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCircle } from '@/hooks/useCircle';
import {
  KIND_GIFT_WRAP,
  KIND_SEAL,
  KIND_PICTURE,
  KIND_SHORT_VIDEO,
  KIND_DM_RELAY_LIST,
  SAHMSTR_RELAY,
  buildImetaTag,
  parseImetaTags,
  sortWraps,
  validateStoryRumor,
  type CircleStory,
  type StoryMedia,
} from '@/lib/circleTypes';

const TWO_DAYS = 2 * 24 * 60 * 60;

/**
 * Timestamps on the seal and the wrap are randomised into the recent past, per
 * NIP-59, to frustrate correlation by time. Only the rumor carries the honest
 * `created_at`. Never a future date — many relays refuse those.
 */
function randomPastTimestamp(): number {
  const now = Math.round(Date.now() / 1000);
  return Math.round(now - Math.random() * TWO_DAYS);
}

interface PublishStoryArgs {
  caption: string;
  media: StoryMedia[];
  /** Video stories use kind:22, pictures use kind:20. */
  isVideo?: boolean;
}

/**
 * Resolve each recipient's preferred inbox relays (NIP-17 `kind:10050`).
 *
 * This matters more than it looks. The app's default event router publishes to
 * the *author's* write relays, which is correct for public posts and wrong for
 * gift wraps: a wrap sent only to relays your aunt does not read is a story she
 * will never see. NIP-17 is explicit that clients must publish to the relays
 * listed in the recipient's own `kind:10050`.
 *
 * Recipients with no published list fall back to the author's relays — not
 * ideal, but silently dropping the story would be worse, and many users have
 * never published a 10050.
 */
async function resolveInboxRelays(
  nostr: NRelay,
  pubkeys: string[],
  signal: AbortSignal,
): Promise<Map<string, string[]>> {
  const routes = new Map<string, string[]>();
  if (pubkeys.length === 0) return routes;

  try {
    const lists = await nostr.query(
      [{ kinds: [KIND_DM_RELAY_LIST], authors: pubkeys, limit: pubkeys.length * 2 }],
      { signal },
    );

    // Keep only the newest list per author.
    const newest = new Map<string, NostrEvent>();
    for (const event of lists) {
      const prev = newest.get(event.pubkey);
      if (!prev || event.created_at > prev.created_at) newest.set(event.pubkey, event);
    }

    for (const [pubkey, event] of newest) {
      const relays = event.tags
        .filter((t) => t[0] === 'relay' && typeof t[1] === 'string')
        .map((t) => t[1])
        .filter((url) => url.startsWith('wss://') || url.startsWith('ws://'));

      if (relays.length > 0) routes.set(pubkey, relays);
    }
  } catch {
    // A failed lookup must not block sending; fall back for everyone.
  }

  return routes;
}

/** Publish a story, gift wrapped once per recipient plus a copy to yourself. */
export function usePublishStory() {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();
  const { data: members = [] } = useCircle();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ caption, media, isVideo = false }: PublishStoryArgs) => {
      if (!user) throw new Error('You must be logged in to share a story.');
      if (!user.signer.nip44) {
        throw new Error(
          'Your signer does not support NIP-44 encryption, which private sharing requires. Please upgrade your extension.',
        );
      }
      if (media.length === 0) {
        throw new Error('A story needs at least one photo or video.');
      }

      const kind = isVideo ? KIND_SHORT_VIDEO : KIND_PICTURE;
      const audience = members.map((m) => m.pubkey);

      // The rumor: a normal picture/video event, deliberately left unsigned so
      // that if it ever leaks it cannot be authenticated against the author.
      const tags: string[][] = media.map(buildImetaTag);

      // NIP-71 wants a title on video events; NIP-68 wants alt text for a11y.
      if (isVideo) {
        tags.push(['title', caption.slice(0, 90) || 'Family story']);
      }
      tags.push(['alt', caption || 'A private family story']);

      const rumorBase = {
        kind,
        content: caption,
        tags,
        created_at: Math.round(Date.now() / 1000),
        pubkey: user.pubkey,
      };
      const rumor = { ...rumorBase, id: getEventHash(rumorBase) };

      if (!validateStoryRumor(rumor)) {
        throw new Error('That story could not be assembled correctly.');
      }

      // Wrap once per recipient, and once to ourselves so the author retains a
      // readable copy. Each wrap is a separate seal — a seal is bound to one
      // recipient's conversation key.
      const recipients = Array.from(new Set([...audience, user.pubkey]));

      const inboxes = await resolveInboxRelays(
        nostr,
        recipients,
        AbortSignal.timeout(4000),
      );

      const wraps = await Promise.all(
        recipients.map(async (recipient) => {
          // Seal: the rumor, encrypted to this recipient, signed by the author.
          const sealContent = await user.signer.nip44!.encrypt(
            recipient,
            JSON.stringify(rumor),
          );

          const seal = await user.signer.signEvent({
            kind: KIND_SEAL,
            content: sealContent,
            created_at: randomPastTimestamp(),
            tags: [],
          });

          // Wrap: the seal, encrypted and signed under a single-use key so the
          // author's identity never appears on the outer event.
          const throwawaySigner = new NSecSigner(generateSecretKey());
          const wrapContent = await throwawaySigner.nip44!.encrypt(
            recipient,
            JSON.stringify(seal),
          );

          const wrap = await throwawaySigner.signEvent({
            kind: KIND_GIFT_WRAP,
            content: wrapContent,
            created_at: randomPastTimestamp(),
            tags: [['p', recipient]],
          });

          return { wrap, recipient };
        }),
      );

      // Send each wrap to its own recipient's inbox relays. Recipients without a
      // published 10050 fall back to the SAHMstr relay — the shared home that
      // every app user reads — rather than the author's write relays, which the
      // recipient may not read at all. This is what makes app-to-app delivery
      // reliable even when a family member has never configured their own inbox.
      const results = await Promise.allSettled(
        wraps.map(({ wrap, recipient }) => {
          const relays = inboxes.get(recipient);
          const target =
            relays && relays.length > 0
              ? nostr.group(relays)
              : nostr.group([SAHMSTR_RELAY]);
          return target.event(wrap, { signal: AbortSignal.timeout(8000) });
        }),
      );

      const delivered = results.filter((r) => r.status === 'fulfilled').length;

      if (delivered === 0) {
        throw new Error('The story could not be delivered to any relay. Please try again.');
      }

      queryClient.invalidateQueries({ queryKey: ['circle-stories', user.pubkey] });

      return {
        delivered,
        recipients: recipients.length,
        /**
         * Recipients with no published inbox list. Their wrap was delivered to
         * the shared SAHMstr relay as a fallback, so they will receive it if
         * they use SAHMstr (or any client that reads that relay). Surfaced to
         * the user as reassurance, not a warning.
         */
        viaSharedRelay: recipients.filter(
          (r) => r !== user.pubkey && !inboxes.has(r),
        ).length,
      };
    },
  });
}

/**
 * Read stories addressed to the logged-in user.
 *
 * Relays are asked only for `kind:1059` events p-tagged to us — which is all
 * they can usefully index, since the outer author is random. Unwrapping happens
 * entirely on the client.
 */
export function useCircleStories() {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();

  const unwrap = useCallback(
    async (wrap: NostrEvent): Promise<CircleStory | null> => {
      if (!user?.signer.nip44) return null;

      try {
        // Wrap → seal
        const sealJson = await user.signer.nip44.decrypt(wrap.pubkey, wrap.content);
        const seal: unknown = JSON.parse(sealJson);

        if (
          typeof seal !== 'object' ||
          seal === null ||
          (seal as NostrEvent).kind !== KIND_SEAL
        ) {
          return null;
        }

        const sealEvent = seal as NostrEvent;

        // Seal → rumor. The seal's pubkey is the true author.
        const rumorJson = await user.signer.nip44.decrypt(
          sealEvent.pubkey,
          sealEvent.content,
        );
        const rumor: unknown = JSON.parse(rumorJson);

        if (typeof rumor !== 'object' || rumor === null) return null;

        const r = rumor as NostrEvent;

        // The rumor must claim the same author as the seal, or it is forged.
        if (r.pubkey !== sealEvent.pubkey) return null;
        if (!validateStoryRumor(r)) return null;

        return {
          id: r.id,
          pubkey: r.pubkey,
          createdAt: r.created_at,
          kind: r.kind,
          content: r.content ?? '',
          media: parseImetaTags(r.tags ?? []),
          audience: (r.tags ?? [])
            .filter((t) => t[0] === 'p')
            .map((t) => t[1]),
          wrapId: wrap.id,
        };
      } catch {
        // A wrap we cannot open is not ours to read. Skip it quietly.
        return null;
      }
    },
    [user],
  );

  return useQuery({
    queryKey: ['circle-stories', user?.pubkey],
    enabled: !!user,
    // Unwrapping is real work; don't refetch aggressively.
    staleTime: 30_000,
    queryFn: async (c) => {
      if (!user) return [] as CircleStory[];

      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(6000)]);

      const wraps = await nostr.query(
        [{ kinds: [KIND_GIFT_WRAP], '#p': [user.pubkey], limit: 200 }],
        { signal },
      );

      const stories = await Promise.all(sortWraps(wraps).map(unwrap));

      // Deduplicate by rumor id — the author's own copy and a recipient wrap of
      // the same story share one id.
      const seen = new Set<string>();
      return stories
        .filter((s): s is CircleStory => s !== null)
        .filter((s) => {
          if (seen.has(s.id)) return false;
          seen.add(s.id);
          return true;
        })
        .sort((a, b) => b.createdAt - a.createdAt);
    },
  });
}
