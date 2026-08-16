import { useSeoMeta } from '@unhead/react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHero } from '@/components/PageHero';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
// `Lock` is avoided project-wide — see the note in Header.tsx.
import { Video, ShieldCheck, ArrowRight, Radio } from 'lucide-react';
import { StreamCard } from '@/components/live/StreamCard';
import { useStreams } from '@/hooks/useStreams';
import { isEffectivelyLive } from '@/lib/streamTypes';
import { SECTION_POSTERS } from '@/lib/homeEc';

export default function Vlogs() {
  useSeoMeta({
    title: 'Vlogs - SAHMstr',
    description: 'Watch past streams and video content from the SAHMstr community.',
  });

  const { data: streams = [], isLoading } = useStreams();
  // Past sessions worth rewatching: ended streams that kept a recording.
  const recordings = streams.filter(
    (s) => s.status === 'ended' && !isEffectivelyLive(s) && s.recording,
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Vlogs"
          icon={Video}
          title="Vlogs & Stories"
          lede="The ordinary record of a household, kept honestly — what worked this week and what did not. Rewatch past live sessions, or share video privately with family in the Circle."
          poster={SECTION_POSTERS.vlogs}
        />

        <section className="bg-background py-12">
          <div className="container space-y-14">
            {/* Past recorded sessions */}
            <div>
              <div className="mb-6 flex items-center justify-between gap-3">
                <h2 className="font-serif text-2xl font-bold">Past sessions</h2>
                <Link to="/live">
                  <Button variant="outline" size="sm" className="gap-1.5 rounded-sm border-2">
                    <Radio className="h-3.5 w-3.5" />
                    What's live now
                  </Button>
                </Link>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-video w-full rounded-sm" />
                      <Skeleton className="h-5 w-3/4" />
                    </div>
                  ))}
                </div>
              ) : recordings.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recordings.map((stream) => (
                    <StreamCard key={stream.coordinate} stream={stream} />
                  ))}
                </div>
              ) : (
                <Card className="rounded-sm border-2 border-dashed">
                  <CardContent className="px-8 py-12 text-center">
                    <p className="mx-auto max-w-md leading-relaxed text-muted-foreground">
                      No recorded sessions yet. When a host ends a live stream and keeps the
                      recording, it will appear here to rewatch.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Private video via the Circle */}
            <Card className="overflow-hidden rounded-sm border-2">
              <div aria-hidden className="ink-rule h-1.5" />
              <CardContent className="space-y-5 p-8 text-center">
                <ShieldCheck className="mx-auto h-9 w-9 text-[hsl(var(--poster-green))] dark:text-[hsl(var(--poster-ochre))]" />
                <h2 className="font-serif text-2xl font-bold">
                  Want to share video with family instead?
                </h2>
                <p className="mx-auto max-w-md leading-relaxed text-muted-foreground">
                  If what you actually want is to show your mother a clip of the children without
                  handing it to a platform, the Circle encrypts it end-to-end for the people you
                  name, and nobody else can read it. Not the relays, not us.
                </p>
                <Link to="/circle">
                  <Button className="gap-2 rounded-sm">
                    Open the Circle
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
