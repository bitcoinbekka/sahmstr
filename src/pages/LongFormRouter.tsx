import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';
import type { AddressPointer } from 'nostr-tools/nip19';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { HOMEEC_TAG } from '@/hooks/useCommunityUnits';
import { CommunityUnitView } from './CommunityUnitView';
import { RecipeView } from './RecipeView';
import NotFound from './NotFound';

/**
 * Recipes and contributed curriculum units are both NIP-23 long-form events
 * (kind 30023), so an naddr alone does not say which view to render. This
 * component resolves the event once and dispatches on the `homeec` tag.
 */
export function LongFormRouter({ naddr }: { naddr: AddressPointer }) {
  const { nostr } = useNostr();

  const { data, isLoading } = useQuery({
    queryKey: ['nostr', 'longform-kind', naddr.kind, naddr.pubkey, naddr.identifier],
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
        { signal },
      );

      const event = events[0];
      if (!event) return { kind: 'missing' as const };

      const isUnit = event.tags.some(([n, v]) => n === 't' && v === HOMEEC_TAG);
      return { kind: isUnit ? ('unit' as const) : ('recipe' as const) };
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container max-w-3xl py-14 space-y-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Separator />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!data || data.kind === 'missing') {
    return <NotFound />;
  }

  if (data.kind === 'unit') {
    return <CommunityUnitView pubkey={naddr.pubkey} identifier={naddr.identifier} />;
  }

  return <RecipeView naddr={naddr} />;
}
