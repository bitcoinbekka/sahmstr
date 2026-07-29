import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHero } from '@/components/PageHero';
import { Card, CardContent } from '@/components/ui/card';
import { Radio } from 'lucide-react';
import { SECTION_POSTERS } from '@/lib/homeEc';

export default function Live() {
  useSeoMeta({
    title: 'Live Streams - SAHMstr',
    description: 'Join live cooking sessions and community events on SAHMstr.',
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Plate V · Gathering"
          icon={Radio}
          title="Live & Gathering"
          lede="Cooking together in real time, questions answered plainly, and the door left open. Scheduled gatherings are still being built."
          poster={SECTION_POSTERS.live}
          plateCaption="Plate V · Making the House a Home"
        />

        <section className="bg-background py-14">
          <div className="container max-w-2xl">
            <Card className="rounded-sm border-2 border-dashed">
              <CardContent className="px-8 py-14 text-center">
                <div className="mx-auto max-w-md space-y-3">
                  <h2 className="font-serif text-xl font-bold">Nothing on just now</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    When a gathering is scheduled it will be listed here, with the time in your
                    own timezone.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
