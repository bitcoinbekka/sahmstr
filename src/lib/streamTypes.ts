/**
 * Live streaming on Nostr — NIP-53.
 *
 * A live stream is an addressable **kind:30311** event whose tags advertise the
 * stream: its title, its HLS `streaming` URL, its status, and who is hosting.
 * Live chat rides in **kind:1311** messages that reference the stream by its `a`
 * coordinate. Both are standard NIP-53, so SAHMstr streams are visible in other
 * live clients (zap.stream, Amethyst) and vice versa — no custom kinds.
 *
 * NIP-53 deliberately does NOT carry the video: the app only points at an HLS
 * (`.m3u8`) URL produced by a streaming/ingest server. That server is a separate
 * concern (self-hosted on the VPS, or a service). The whole *metadata + chat*
 * layer is pure Nostr and needs no backend.
 */

import type { NostrEvent } from '@nostrify/nostrify';

/** NIP-53 live streaming event. */
export const KIND_LIVE_EVENT = 30311;
/** NIP-53 live chat message. */
export const KIND_LIVE_CHAT = 1311;

export type StreamStatus = 'planned' | 'live' | 'ended';

/** A parsed live stream, read from a kind:30311 event. */
export interface Stream {
  /** The addressable coordinate: `30311:<pubkey>:<d>`. */
  coordinate: string;
  /** The `d` identifier. */
  identifier: string;
  /** The host's pubkey (event author). */
  pubkey: string;
  title: string;
  summary?: string;
  image?: string;
  /** HLS (.m3u8) stream URL. Absent for a planned stream with no feed yet. */
  streaming?: string;
  /** Recording URL, set once the stream has ended and been edited. */
  recording?: string;
  status: StreamStatus;
  starts?: number;
  ends?: number;
  currentParticipants?: number;
  hashtags: string[];
  /** The raw event, kept for zap targets, chat `a` tags, etc. */
  event: NostrEvent;
}

function tag(event: NostrEvent, name: string): string | undefined {
  return event.tags.find(([n]) => n === name)?.[1];
}

/**
 * A stream is only worth showing if it can be identified and titled. Everything
 * else is optional per the NIP, so we validate just the load-bearing bits.
 */
export function validateStream(event: NostrEvent): boolean {
  if (event.kind !== KIND_LIVE_EVENT) return false;
  const d = tag(event, 'd');
  const title = tag(event, 'title');
  return Boolean(d && title);
}

/** Parse a kind:30311 event into a Stream, or null if it is not valid. */
export function parseStream(event: NostrEvent): Stream | null {
  if (!validateStream(event)) return null;

  const identifier = tag(event, 'd')!;
  const rawStatus = tag(event, 'status');
  const status: StreamStatus =
    rawStatus === 'live' || rawStatus === 'ended' || rawStatus === 'planned'
      ? rawStatus
      : 'planned';

  const starts = tag(event, 'starts');
  const ends = tag(event, 'ends');
  const participants = tag(event, 'current_participants');

  return {
    coordinate: `${KIND_LIVE_EVENT}:${event.pubkey}:${identifier}`,
    identifier,
    pubkey: event.pubkey,
    title: tag(event, 'title')!,
    summary: tag(event, 'summary'),
    image: tag(event, 'image'),
    streaming: tag(event, 'streaming'),
    recording: tag(event, 'recording'),
    status,
    starts: starts ? parseInt(starts, 10) : undefined,
    ends: ends ? parseInt(ends, 10) : undefined,
    currentParticipants: participants ? parseInt(participants, 10) : undefined,
    hashtags: event.tags.filter(([n]) => n === 't').map(([, v]) => v),
    event,
  };
}

/**
 * A stream is considered stale if it says `live` but hasn't been updated in
 * over an hour — NIP-53 clients treat that as ended. This keeps abandoned
 * streams from showing "live" forever.
 */
export function isEffectivelyLive(stream: Stream): boolean {
  if (stream.status !== 'live') return false;
  const hourAgo = Math.floor(Date.now() / 1000) - 3600;
  return stream.event.created_at >= hourAgo;
}
