/**
 * The family circle: a private, NIP-44 encrypted NIP-51 follow set.
 *
 * Membership is stored as *private* list items, so the relay — and anyone
 * reading it — learns only that you keep a list, never who is on it. That
 * matters here: the membership of a family circle is itself sensitive.
 */

import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import {
  CIRCLE_IDENTIFIER,
  KIND_FOLLOW_SET,
  parsePrivateMembers,
  type CircleMember,
} from '@/lib/circleTypes';

/** Read the logged-in user's circle, decrypting the private membership. */
export function useCircle() {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();

  return useQuery({
    queryKey: ['circle', user?.pubkey],
    enabled: !!user,
    queryFn: async (c) => {
      if (!user) return [] as CircleMember[];

      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(4000)]);

      const events = await nostr.query(
        [
          {
            kinds: [KIND_FOLLOW_SET],
            authors: [user.pubkey],
            '#d': [CIRCLE_IDENTIFIER],
            limit: 1,
          },
        ],
        { signal },
      );

      const event = events[0];
      if (!event) return [] as CircleMember[];

      // Public items, if any were ever written by another client.
      const members = parsePrivateMembers(event.tags);

      // Private items live NIP-44 encrypted in .content, keyed to the author's
      // own pubkey. An unreadable payload must not break the whole list.
      if (event.content && user.signer.nip44) {
        try {
          const plaintext = await user.signer.nip44.decrypt(user.pubkey, event.content);
          const parsed: unknown = JSON.parse(plaintext);
          if (Array.isArray(parsed)) {
            const priv = parsePrivateMembers(parsed as string[][]);
            for (const m of priv) {
              if (!members.some((x) => x.pubkey === m.pubkey)) members.push(m);
            }
          }
        } catch {
          // Older NIP-04 payloads, or a signer without nip44 — degrade to the
          // public items rather than throwing.
        }
      }

      return members;
    },
  });
}

/** Add and remove circle members, republishing the encrypted set. */
export function useCircleActions() {
  const { user } = useCurrentUser();
  const { mutateAsync: publishEvent } = useNostrPublish();
  const queryClient = useQueryClient();
  const { data: members = [] } = useCircle();

  const publishCircle = useCallback(
    async (next: CircleMember[]) => {
      if (!user) throw new Error('You must be logged in to manage your circle.');
      if (!user.signer.nip44) {
        throw new Error(
          'Your signer does not support NIP-44 encryption. Please upgrade your extension to keep your circle private.',
        );
      }

      // Everyone goes in the private payload. Nothing about the circle is public.
      const privateTags = next.map((m) => {
        const tag = ['p', m.pubkey];
        if (m.relay || m.petname) tag.push(m.relay ?? '');
        if (m.petname) tag.push(m.petname);
        return tag;
      });

      const content = await user.signer.nip44.encrypt(
        user.pubkey,
        JSON.stringify(privateTags),
      );

      await publishEvent({
        kind: KIND_FOLLOW_SET,
        content,
        tags: [
          ['d', CIRCLE_IDENTIFIER],
          ['title', 'Family Circle'],
          [
            'description',
            'People allowed to see private stories shared from this household.',
          ],
        ],
      });

      queryClient.invalidateQueries({ queryKey: ['circle', user.pubkey] });
    },
    [user, publishEvent, queryClient],
  );

  const addMember = useMutation({
    mutationFn: async (member: CircleMember) => {
      if (members.some((m) => m.pubkey === member.pubkey)) return;
      await publishCircle([...members, member]);
    },
  });

  const removeMember = useMutation({
    mutationFn: async (pubkey: string) => {
      await publishCircle(members.filter((m) => m.pubkey !== pubkey));
    },
  });

  return { addMember, removeMember, members };
}
