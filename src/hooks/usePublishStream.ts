/**
 * Creating, updating, and ending a live stream (NIP-53 kind:30311).
 *
 * kind:30311 is addressable: re-publishing with the same `d` tag replaces the
 * previous version. So "go live", "update title", and "end stream" are all just
 * a publish of the same coordinate with different tags.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { KIND_LIVE_EVENT, type StreamStatus } from '@/lib/streamTypes';

export interface StreamDraft {
  /** Stable identifier for the stream. Reuse it to update/end the same stream. */
  identifier: string;
  title: string;
  summary?: string;
  image?: string;
  /** HLS (.m3u8) URL from your streaming server. */
  streaming?: string;
  recording?: string;
  status: StreamStatus;
  starts?: number;
  ends?: number;
  hashtags?: string[];
  /**
   * SAHMstr chat whitelist. When set, only these hex pubkeys (plus the host)
   * may chat, per our NIP.md extension. Empty/undefined means open chat.
   */
  chatAllowlist?: string[];
}

export function usePublishStream() {
  const { mutateAsync: publish } = useNostrPublish();
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (draft: StreamDraft) => {
      if (!user) throw new Error('You need to be logged in to start a stream.');

      const now = Math.floor(Date.now() / 1000);
      const tags: string[][] = [
        ['d', draft.identifier],
        ['title', draft.title],
        ['status', draft.status],
        // Host, per NIP-53. The proof term is optional; we omit it (self-hosted).
        ['p', user.pubkey, '', 'Host'],
      ];

      if (draft.summary) tags.push(['summary', draft.summary]);
      if (draft.image) tags.push(['image', draft.image]);
      if (draft.streaming) tags.push(['streaming', draft.streaming]);
      if (draft.recording) tags.push(['recording', draft.recording]);
      tags.push(['starts', String(draft.starts ?? now)]);
      if (draft.ends) tags.push(['ends', String(draft.ends)]);
      for (const t of draft.hashtags ?? []) tags.push(['t', t]);

      // Chat whitelist (SAHMstr extension — see NIP.md). One tag per pubkey so
      // it stays relay-queryable and easy to read back.
      for (const pk of draft.chatAllowlist ?? []) {
        tags.push(['chat-allow', pk]);
      }

      // NIP-31 alt for clients that don't understand kind:30311.
      tags.push(['alt', `Live stream: ${draft.title}`]);

      return publish({ kind: KIND_LIVE_EVENT, content: draft.summary ?? '', tags });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streams'] });
      queryClient.invalidateQueries({ queryKey: ['stream'] });
    },
  });
}
