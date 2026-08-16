/**
 * Reading live streams (NIP-53 kind:30311).
 *
 * These hooks query the network for stream events and parse them into the
 * `Stream` shape. Live-first ordering, with planned and ended streams after.
 */

import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';
import { nip19 } from 'nostr-tools';
import {
  KIND_LIVE_EVENT,
  parseStream,
  isEffectivelyLive,
  type Stream,
  type StreamStatus,
} from '@/lib/streamTypes';

/** Sort: live first, then planned (soonest first), then ended (newest first). */
function sortStreams(a: Stream, b: Stream): number {
  const rank = (s: Stream): number => {
    if (isEffectivelyLive(s)) return 0;
    if (s.status === 'planned') return 1;
    return 2;
  };
  const ra = rank(a);
  const rb = rank(b);
  if (ra !== rb) return ra - rb;
  // Within a group, most recently updated first.
  return b.event.created_at - a.event.created_at;
}

/**
 * All streams from the network. Optionally scope to a single host's pubkey,
 * which is how the "my streams" management view works.
 */
export function useStreams(options?: { host?: string; statuses?: StreamStatus[] }) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['streams', options?.host ?? 'all', options?.statuses ?? 'any'],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);
      const filter: Record<string, unknown> = { kinds: [KIND_LIVE_EVENT], limit: 100 };
      if (options?.host) filter.authors = [options.host];

      const events = await nostr.query([filter], { signal });

      // Addressable events: keep only the latest per coordinate.
      const latest = new Map<string, ReturnType<typeof parseStream>>();
      for (const event of events) {
        const stream = parseStream(event);
        if (!stream) continue;
        const existing = latest.get(stream.coordinate);
        if (!existing || event.created_at > existing.event.created_at) {
          latest.set(stream.coordinate, stream);
        }
      }

      let streams = Array.from(latest.values()).filter((s): s is Stream => s !== null);

      if (options?.statuses) {
        streams = streams.filter((s) => options.statuses!.includes(s.status));
      }

      return streams.sort(sortStreams);
    },
    refetchInterval: 30_000, // Streams change often; keep the list fresh.
  });
}

/**
 * A single stream by its NIP-19 `naddr` (as used in the URL). Returns null when
 * the identifier is not a valid stream address.
 */
export function useStream(naddr: string | undefined) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['stream', naddr],
    enabled: Boolean(naddr),
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);
      if (!naddr) return null;

      let decoded;
      try {
        decoded = nip19.decode(naddr);
      } catch {
        return null;
      }
      if (decoded.type !== 'naddr' || decoded.data.kind !== KIND_LIVE_EVENT) return null;

      const { pubkey, identifier } = decoded.data;
      const events = await nostr.query(
        [{ kinds: [KIND_LIVE_EVENT], authors: [pubkey], '#d': [identifier], limit: 1 }],
        { signal },
      );

      const event = events.sort((a, b) => b.created_at - a.created_at)[0];
      return event ? parseStream(event) : null;
    },
    refetchInterval: 30_000,
  });
}
