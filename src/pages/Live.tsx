import { useSeoMeta } from '@unhead/react';
import { Radio } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHero } from '@/components/PageHero';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { GoLiveDialog } from '@/components/live/GoLiveDialog';
import { StreamCard } from '@/components/live/StreamCard';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useStreams } from '@/hooks/useStreams';
import { isEffectivelyLive, type Stream } from '@/lib/streamTypes';
import { SECTION_POSTERS } from '@/lib/homeEc';

export default function Live() {
  useSeoMeta({
    title: 'Live Streams - SAHMstr',
    description: 'Join live cooking and baking sessions and community gatherings on SAHMstr.',
  });

  const { user } = useCurrentUser();
  const { data: streams = [], isLoading } = useStreams();

  const liveNow = streams.filter(isEffectivelyLive);
  const upcoming = streams.filter((s) => s.status === 'planned');
  const past = streams.filter((s) => s.status === 'ended' && !isEffectivelyLive(s));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Gathering"
          icon={Radio}
          title="Live & Gathering"
          lede="Cook and bake together in real time, questions answered plainly, and the door left open. Watch live, join the chat, or go live yourself."
          poster={SECTION_POSTERS.live}
        >
          {user && <GoLiveDialog />}
        </PageHero>

        <section className="bg-background py-12">
          <div className="container">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-video w-full rounded-sm" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : streams.length === 0 ? (
              <Card className="mx-auto max-w-2xl rounded-sm border-2 border-dashed">
                <CardContent className="px-8 py-14 text-center">
                  <div className="mx-auto max-w-md space-y-3">
                    <Radio className="mx-auto h-10 w-10 text-muted-foreground/40" />
                    <h2 className="font-serif text-xl font-bold">Nothing on just now</h2>
                    <p className="leading-relaxed text-muted-foreground">
                      {user
                        ? 'No one is live at the moment. Be the first — tap “Go live” above to start cooking.'
                        : 'No one is live at the moment. Log in to start your own stream, or check back soon.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-14">
                {liveNow.length > 0 && (
                  <StreamSection title="Live now" streams={liveNow} accent />
                )}
                {upcoming.length > 0 && <StreamSection title="Coming up" streams={upcoming} />}
                {past.length > 0 && <StreamSection title="Past streams" streams={past} />}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function StreamSection({
  title,
  streams,
  accent,
}: {
  title: string;
  streams: Stream[];
  accent?: boolean;
}) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        {accent && <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-600" />}
        <h2 className="font-serif text-2xl font-bold">{title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {streams.map((stream) => (
          <StreamCard key={stream.coordinate} stream={stream} />
        ))}
      </div>
    </div>
  );
}
