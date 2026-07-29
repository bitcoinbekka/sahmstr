import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';
import type { NostrEvent } from '@nostrify/nostrify';

/**
 * A contributed home economics unit is a NIP-23 long-form event (kind 30023)
 * tagged `t: homeec`. See NIP.md for the full schema.
 */
export const HOMEEC_TAG = 'homeec';
export const COMMUNITY_UNIT_KIND = 30023;

/** Subject areas a contributed unit can be filed under. */
export const SUBJECT_AREAS = [
  { value: 'family', label: 'Family Life' },
  { value: 'management', label: 'Home Management' },
  { value: 'housing', label: 'Housing' },
  { value: 'housecare', label: 'Care of the House' },
  { value: 'food', label: 'Food & Nutrition' },
  { value: 'textiles', label: 'Textiles & Clothing' },
  { value: 'finance', label: 'Household Finance' },
  { value: 'consumer', label: 'Consumer & Commerce' },
  { value: 'children', label: 'Children' },
  { value: 'health', label: 'Health' },
  { value: 'community', label: 'Community' },
  { value: 'sovereignty', label: 'Sovereignty' },
] as const;

export interface CommunityUnit {
  event: NostrEvent;
  identifier: string;
  title: string;
  summary: string;
  image?: string;
  subjects: string[];
  publishedAt: number;
}

/**
 * A contributed unit must have a `d` identifier and a title to be renderable.
 * Events missing either are dropped rather than displayed broken.
 */
function parseUnit(event: NostrEvent): CommunityUnit | null {
  const identifier = event.tags.find(([name]) => name === 'd')?.[1];
  const title = event.tags.find(([name]) => name === 'title')?.[1];

  if (!identifier || !title) return null;

  const publishedAtTag = event.tags.find(([name]) => name === 'published_at')?.[1];
  const publishedAt = publishedAtTag ? parseInt(publishedAtTag, 10) : event.created_at;

  const subjects = event.tags
    .filter(([name]) => name === 't')
    .map(([, value]) => value)
    .filter((t) => t !== HOMEEC_TAG && t !== 'sahmstr');

  return {
    event,
    identifier,
    title,
    summary: event.tags.find(([name]) => name === 'summary')?.[1] ?? '',
    image: event.tags.find(([name]) => name === 'image')?.[1],
    subjects,
    publishedAt: Number.isFinite(publishedAt) ? publishedAt : event.created_at,
  };
}

/**
 * Fetch contributed units, optionally narrowed to one subject area.
 * Filtering happens at the relay level via `#t`.
 */
export function useCommunityUnits(subject?: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['nostr', 'community-units', subject ?? 'all'],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);

      const events = await nostr.query(
        [
          {
            kinds: [COMMUNITY_UNIT_KIND],
            '#t': subject ? [subject] : [HOMEEC_TAG],
            limit: 60,
          },
        ],
        { signal },
      );

      // When filtering by subject we must still confirm the homeec tag,
      // since a subject tag alone could match unrelated articles.
      const relevant = subject
        ? events.filter((e) => e.tags.some(([n, v]) => n === 't' && v === HOMEEC_TAG))
        : events;

      return relevant
        .map(parseUnit)
        .filter((u): u is CommunityUnit => u !== null)
        .sort((a, b) => b.publishedAt - a.publishedAt);
    },
  });
}

/** Fetch a single contributed unit by author and identifier. */
export function useCommunityUnit(pubkey?: string, identifier?: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['nostr', 'community-unit', pubkey, identifier],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);

      const events = await nostr.query(
        [
          {
            kinds: [COMMUNITY_UNIT_KIND],
            authors: [pubkey!],
            '#d': [identifier!],
            limit: 1,
          },
        ],
        { signal },
      );

      if (!events.length) return null;
      return parseUnit(events[0]);
    },
    enabled: Boolean(pubkey && identifier),
  });
}
