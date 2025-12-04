import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook to fetch recipe posts (kind 30023 long-form content with 't' tag 'recipe')
 */
export function useRecipes() {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['recipes'],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);
      
      const events = await nostr.query(
        [
          {
            kinds: [30023], // Long-form content
            '#t': ['recipe', 'cooking', 'baking'],
            limit: 50,
          },
        ],
        { signal }
      );

      // Sort by created_at descending (newest first)
      return events.sort((a, b) => b.created_at - a.created_at);
    },
  });
}
