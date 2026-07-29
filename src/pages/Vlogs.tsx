import { useSeoMeta } from '@unhead/react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHero } from '@/components/PageHero';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// `Lock` is avoided project-wide — see the note in Header.tsx.
import { Video, ShieldCheck, ArrowRight } from 'lucide-react';
import { SECTION_POSTERS } from '@/lib/homeEc';

export default function Vlogs() {
  useSeoMeta({
    title: 'Vlogs - SAHMstr',
    description: 'Watch vlogs and video content from the SAHMstr community.',
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Plate IV · Vlogs"
          icon={Video}
          title="Vlogs & Stories"
          lede="The ordinary record of a household, kept honestly — what worked this week and what did not. Public vlogs are still being built."
          poster={SECTION_POSTERS.vlogs}
          plateCaption="Plate IV · The Successful Family"
        />

        <section className="bg-background py-14">
          <div className="container max-w-2xl">
            <Card className="overflow-hidden rounded-sm border-2">
              <div className="h-1.5 bg-gradient-to-r from-[hsl(var(--poster-green))] via-[hsl(var(--poster-sage))] to-[hsl(var(--poster-ochre))]" />
              <CardContent className="space-y-5 p-8 text-center">
                <ShieldCheck className="mx-auto h-9 w-9 text-[hsl(var(--poster-green))] dark:text-[hsl(var(--poster-ochre))]" />
                <h2 className="font-serif text-2xl font-bold">
                  Want to share video with family instead?
                </h2>
                <p className="mx-auto max-w-md leading-relaxed text-muted-foreground">
                  Public vlogs are coming. But if what you actually want is to show your mother a
                  clip of the children without publishing it to the whole network, that already
                  works — the Circle encrypts it for the people you name.
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
