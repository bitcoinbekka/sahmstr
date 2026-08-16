import { useSeoMeta } from '@unhead/react';
import { nip19 } from 'nostr-tools';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StreamView } from '@/components/live/StreamView';
import { useStream } from '@/hooks/useStreams';
import type { AddressPointer } from 'nostr-tools/nip19';

/** Watch a single live stream, resolved from its naddr. */
export function StreamPage({ address }: { address: AddressPointer }) {
  const naddr = nip19.naddrEncode(address);
  const { data: stream, isLoading } = useStream(naddr);

  useSeoMeta({
    title: stream ? `${stream.title} — Live — SAHMstr` : 'Live — SAHMstr',
    description: stream?.summary ?? 'A live stream on SAHMstr.',
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-8">
        <div className="container">
          <Link to="/live">
            <Button variant="ghost" className="mb-6 gap-2 rounded-sm">
              <ArrowLeft className="h-4 w-4" />
              All streams
            </Button>
          </Link>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <Skeleton className="aspect-video w-full rounded-sm" />
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="h-[70vh] rounded-sm lg:col-span-1" />
            </div>
          ) : !stream ? (
            <Card className="mx-auto max-w-lg rounded-sm border-2 border-dashed">
              <CardContent className="px-8 py-14 text-center">
                <div className="mx-auto max-w-sm space-y-3">
                  <h2 className="font-serif text-xl font-bold">Stream not found</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    This stream may have ended or isn't reachable on your relays right now.
                  </p>
                  <Link to="/live">
                    <Button className="rounded-sm">Back to Live</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <StreamView stream={stream} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
