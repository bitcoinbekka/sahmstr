import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';
import type { AddressPointer } from 'nostr-tools/nip19';

/**
 * Hook to fetch a single recipe by naddr coordinates
 */
export function useRecipeByNaddr(naddr: AddressPointer) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['recipe', naddr.kind, naddr.pubkey, naddr.identifier],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);
      
      const events = await nostr.query(
        [
          {
            kinds: [naddr.kind],
            authors: [naddr.pubkey],
            '#d': [naddr.identifier],
            limit: 1,
          },
        ],
        { signal }
      );

      return events[0] || null;
    },
  });
}
