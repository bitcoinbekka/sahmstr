/**
 * The pantry, stored as a single NIP-78 app-data event whose content is the
 * item list NIP-44 encrypted to the author's own key.
 *
 * Encrypt-to-self gives us a private, cross-device, backend-free store: the
 * relay holds an opaque blob, and the same list appears on any device the user
 * logs in from. This mirrors how the Circle stores its membership.
 */

import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import {
  PANTRY_IDENTIFIER,
  KIND_APP_DATA,
  parsePantryItems,
  type PantryItem,
} from '@/lib/pantryTypes';

/** Read and decrypt the logged-in user's pantry list. */
export function usePantry() {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();

  return useQuery({
    queryKey: ['pantry', user?.pubkey],
    enabled: !!user,
    queryFn: async (c) => {
      if (!user) return [] as PantryItem[];

      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(4000)]);

      const events = await nostr.query(
        [
          {
            kinds: [KIND_APP_DATA],
            authors: [user.pubkey],
            '#d': [PANTRY_IDENTIFIER],
            limit: 1,
          },
        ],
        { signal },
      );

      const event = events[0];
      if (!event || !event.content) return [] as PantryItem[];

      // The list is encrypted to ourselves. An unreadable payload must not
      // throw — degrade to an empty pantry rather than a broken page.
      if (!user.signer.nip44) return [] as PantryItem[];

      try {
        const plaintext = await user.signer.nip44.decrypt(user.pubkey, event.content);
        return parsePantryItems(JSON.parse(plaintext));
      } catch {
        return [] as PantryItem[];
      }
    },
  });
}

/** Add, update, and remove pantry items, republishing the encrypted list. */
export function usePantryActions() {
  const { user } = useCurrentUser();
  const { mutateAsync: publishEvent } = useNostrPublish();
  const queryClient = useQueryClient();
  const { data: items = [] } = usePantry();

  const publishPantry = useCallback(
    async (next: PantryItem[]) => {
      if (!user) throw new Error('You must be logged in to keep a pantry.');
      if (!user.signer.nip44) {
        throw new Error(
          'Your signer does not support NIP-44 encryption, which the private pantry requires. Please upgrade your extension.',
        );
      }

      const content = await user.signer.nip44.encrypt(
        user.pubkey,
        JSON.stringify(next),
      );

      await publishEvent({
        kind: KIND_APP_DATA,
        content,
        tags: [
          ['d', PANTRY_IDENTIFIER],
          // A human-readable hint for any client that lists app-data events.
          ['alt', 'SAHMstr private pantry & preserving inventory'],
        ],
      });

      // Optimistically seed the cache so the UI updates immediately, then
      // invalidate to reconcile with what the relay actually stored.
      queryClient.setQueryData(['pantry', user.pubkey], next);
      queryClient.invalidateQueries({ queryKey: ['pantry', user.pubkey] });
    },
    [user, publishEvent, queryClient],
  );

  const addItem = useMutation({
    mutationFn: async (item: PantryItem) => {
      await publishPantry([...items, item]);
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PantryItem> }) => {
      await publishPantry(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
    },
  });

  const removeItem = useMutation({
    mutationFn: async (id: string) => {
      await publishPantry(items.filter((i) => i.id !== id));
    },
  });

  return { items, addItem, updateItem, removeItem };
}
