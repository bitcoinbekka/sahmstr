/**
 * Live chat for a stream (NIP-53 kind:1311).
 *
 * Chat messages reference the stream by its `a` coordinate. We poll frequently
 * so the room feels live without needing a websocket subscription in the UI
 * layer. Sending is a plain kind:1311 publish with the stream's `a` tag.
 *
 * Moderation model (see NIP.md, streaming section):
 * - If the stream carries a `chat-allow` whitelist, only those pubkeys (plus
 *   the host) are *shown* as allowed; others are visually flagged/hidden. Nostr
 *   is open, so this is a client-side display policy, not a hard gate — the host
 *   relay's write policy is the real enforcement for a locked room.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import type { NostrEvent } from '@nostrify/nostrify';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { KIND_LIVE_CHAT, type Stream } from '@/lib/streamTypes';

export interface ChatMessage {
  event: NostrEvent;
  pubkey: string;
  content: string;
  createdAt: number;
  /** True when the host has an allowlist and this author is not on it. */
  offAllowlist: boolean;
}

/** The set of pubkeys allowed to chat: the host plus any `chat-allow` tags. */
export function chatAllowlist(stream: Stream): Set<string> | null {
  const allowed = stream.event.tags
    .filter(([n]) => n === 'chat-allow')
    .map(([, v]) => v);
  if (allowed.length === 0) return null; // open chat
  return new Set([stream.pubkey, ...allowed]);
}

export function useStreamChat(stream: Stream | null | undefined) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['stream-chat', stream?.coordinate],
    enabled: Boolean(stream),
    queryFn: async (c): Promise<ChatMessage[]> => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);
      if (!stream) return [];

      const events = await nostr.query(
        [{ kinds: [KIND_LIVE_CHAT], '#a': [stream.coordinate], limit: 200 }],
        { signal },
      );

      const allow = chatAllowlist(stream);

      return events
        .map((event) => ({
          event,
          pubkey: event.pubkey,
          content: event.content,
          createdAt: event.created_at,
          offAllowlist: allow ? !allow.has(event.pubkey) : false,
        }))
        .sort((a, b) => a.createdAt - b.createdAt);
    },
    refetchInterval: 5_000, // Chat should feel live.
  });
}

/** Send a chat message into a stream's room. */
export function useSendChatMessage(stream: Stream | null | undefined) {
  const { mutateAsync: publish } = useNostrPublish();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!stream) throw new Error('No stream to chat in.');
      if (!content.trim()) throw new Error('Message is empty.');

      return publish({
        kind: KIND_LIVE_CHAT,
        content: content.trim(),
        tags: [['a', stream.coordinate, '', 'root']],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stream-chat', stream?.coordinate] });
    },
  });
}
