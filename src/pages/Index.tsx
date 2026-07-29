import { useSeoMeta } from '@unhead/react';
import { Link } from 'react-router-dom';
import {
  ChefHat,
  Video,
  Lightbulb,
  Radio,
  Shirt,
  ArrowRight,
  Bitcoin,
  Heart,
  Users,
  // `Lock` is avoided project-wide: it shadows the Web Locks API global and can
  // resolve to the native class under the ESM CDN build.
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PosterFrame } from '@/components/PosterFrame';
import {
  HERO_POSTER,
  SECTION_POSTERS,
  POSTER_GALLERY,
  TONE_WASH,
  TONE_INK,
  CURRICULUM,
  TOTAL_LESSONS,
  type Poster,
} from '@/lib/homeEc';

/**
 * The five standing sections of the site, each printed as a plate from the
 * poster series with a title band across the foot — the same treatment the
 * posters themselves use.
 */
const SECTIONS: Array<{
  to: string;
  label: string;
  plate: string;
  icon: typeof ChefHat;
  blurb: string;
  cta: string;
  poster: Poster;
}> = [
  {
    to: '/recipes',
    label: 'Recipes & Cooking',
    plate: 'Plate I',
    icon: ChefHat,
    blurb:
      'Cooking from staples, putting up the harvest, and feeding a family well on what the week actually allows.',
    cta: 'Browse recipes',
    poster: SECTION_POSTERS.recipes,
  },
  {
    to: '/tips',
    label: 'Home Economics',
    plate: 'Plate II',
    icon: Lightbulb,
    blurb: `A full curriculum in the classic tradition — ${CURRICULUM.length} units, ${TOTAL_LESSONS} problems, rebuilt for households that hold their own money.`,
    cta: 'Open the curriculum',
    poster: SECTION_POSTERS.tips,
  },
  {
    to: '/wardrobe',
    label: 'Wardrobe & Style',
    plate: 'Plate III',
    icon: Shirt,
    blurb:
      'Know your fibres, keep what lasts, and dress well from a closet you already own.',
    cta: 'Style me',
    poster: SECTION_POSTERS.wardrobe,
  },
  {
    to: '/vlogs',
    label: 'Vlogs & Stories',
    plate: 'Plate IV',
    icon: Video,
    blurb:
      'The ordinary record of a household kept honestly — what worked this week and what did not.',
    cta: 'Watch vlogs',
    poster: SECTION_POSTERS.vlogs,
  },
  {
    to: '/live',
    label: 'Live & Gathering',
    plate: 'Plate V',
    icon: Radio,
    blurb:
      'Cooking together in real time, questions answered plainly, and the door left open.',
    cta: 'See what is on',
    poster: SECTION_POSTERS.live,
  },
];

const VALUES = [
  {
    icon: Bitcoin,
    title: 'Money you hold',
    tone: 'ochre' as const,
    body: 'Savings the household keeps custody of, in a currency nobody can quietly dilute.',
  },
  {
    icon: Heart,
    title: 'A real community',
    tone: 'terracotta' as const,
    body: 'Women who know the work, answering each other directly rather than performing for an algorithm.',
  },
  {
    icon: Users,
    title: 'Yours to take',
    tone: 'green' as const,
    body: 'Your identity, writing and connections live on Nostr. If this site vanished, you would keep all of it.',
  },
];

const Index = () => {
  useSeoMeta({
    title: 'SAHMstr — Home Economics for Sovereign Households',
    description:
      'A home economics curriculum, recipe collection and community for mothers who keep their own money. Built on Nostr and bitcoin.',
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* ───────────────────────── Hero: the cover plate ───────────────────────── */}
        <section className="relative overflow-hidden paper-grain border-b bg-[hsl(var(--poster-cream))] dark:bg-background">
          {/* Ruled margin, as on a title page */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.1]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, hsl(var(--poster-ink)) 0 1px, transparent 1px 44px)',
            }}
          />

          <div className="container relative py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Title side */}
              <div className="lg:col-span-7 space-y-7">
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-[hsl(var(--poster-terracotta))]" />
                  <span className="font-slab text-[11px] font-bold uppercase tracking-[0.22em] text-[hsl(var(--poster-terracotta))]">
                    A household series · No. 1
                  </span>
                </div>

                <h1 className="poster-title text-[2.75rem] leading-[0.95] sm:text-6xl md:text-7xl">
                  <span className="block">Home economics</span>
                  <span className="block italic font-normal text-[hsl(var(--poster-terracotta))]">
                    for households that
                  </span>
                  <span className="block">hold their own money.</span>
                </h1>

                <p className="max-w-xl text-lg md:text-xl leading-relaxed text-muted-foreground">
                  The old curriculum was serious about this work — the family, the house, the
                  money, the children, the health. We have rebuilt it unit by unit, and closed it
                  where the original could not: with a currency that keeps its promises.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <Link to="/tips">
                    <Button size="lg" className="gap-2 rounded-sm px-7 text-base shadow-sm">
                      Open the curriculum
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/recipes">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-sm border-2 px-7 text-base"
                    >
                      Browse the recipes
                    </Button>
                  </Link>
                </div>

                {/* Imprint line, in the manner of a textbook colophon */}
                <dl className="grid grid-cols-3 gap-6 max-w-md border-t pt-6">
                  {[
                    { k: 'Units', v: String(CURRICULUM.length) },
                    { k: 'Problems', v: String(TOTAL_LESSONS) },
                    { k: 'Plates', v: String(POSTER_GALLERY.length) },
                  ].map(({ k, v }) => (
                    <div key={k}>
                      <dd className="font-serif text-3xl font-bold leading-none">{v}</dd>
                      <dt className="mt-1.5 font-slab text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        {k}
                      </dt>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Cover plate */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-sm lg:max-w-none">
                  {/* Two plates behind, as if the series were stacked */}
                  <div
                    aria-hidden
                    className="absolute inset-0 translate-x-3 translate-y-3 rotate-2 rounded-sm bg-[hsl(var(--poster-sage))]/30 ring-1 ring-black/10"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 translate-x-1.5 translate-y-1.5 rotate-1 rounded-sm bg-[hsl(var(--poster-ochre))]/25 ring-1 ring-black/10"
                  />
                  <PosterFrame
                    poster={HERO_POSTER}
                    ratio="portrait"
                    tilt="left"
                    priority
                    className="relative hover:rotate-0"
                  />
                  <p className="mt-4 text-center font-slab text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Frontispiece · Stay at Home
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────── The five plates ───────────────────────── */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container">
            <div className="max-w-2xl space-y-4 mb-12">
              <span className="font-slab text-[11px] font-bold uppercase tracking-[0.22em] text-[hsl(var(--poster-terracotta))]">
                Contents
              </span>
              <h2 className="poster-title text-3xl md:text-5xl">
                Five plates, one household
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Everything here is written to be used on an ordinary Tuesday, not admired on a
                shelf.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {SECTIONS.map(({ to, label, plate, icon: Icon, blurb, cta, poster }, i) => (
                <Link
                  key={to}
                  to={to}
                  className="group focus-visible:outline-none"
                  aria-label={label}
                >
                  <Card
                    className={`h-full overflow-hidden rounded-sm border-2 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring ${
                      i === 0 ? 'lg:col-span-1' : ''
                    }`}
                  >
                    {/* The plate itself */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={poster.url}
                        alt={poster.alt}
                        loading={i < 2 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="h-full w-full object-cover transition-transform [transition-duration:900ms] ease-out group-hover:scale-[1.06]"
                      />
                      {/* Plate number, printed in the corner */}
                      <span className="absolute left-0 top-0 bg-[hsl(var(--poster-cream))]/95 px-2.5 py-1 font-slab text-[10px] font-bold uppercase tracking-[0.16em] text-[hsl(var(--poster-ink))]">
                        {plate}
                      </span>
                    </div>

                    {/* Title band across the foot, as on the posters */}
                    <div
                      className={`flex items-center gap-3 bg-gradient-to-r px-5 py-3.5 ${
                        TONE_WASH[poster.tone]
                      } ${TONE_INK[poster.tone]}`}
                    >
                      <Icon className="h-5 w-5 shrink-0 opacity-90" />
                      <h3 className="font-serif text-lg font-bold leading-tight">{label}</h3>
                    </div>

                    <CardContent className="space-y-4 p-5">
                      <p className="text-[15px] leading-relaxed text-muted-foreground">{blurb}</p>
                      <span className="inline-flex items-center gap-1.5 font-slab text-xs font-bold uppercase tracking-[0.14em] text-primary transition-all group-hover:gap-3">
                        {cta}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              {/* Sixth cell: the Circle, set as a sealed envelope rather than a plate */}
              <Link to="/circle" className="group focus-visible:outline-none">
                <Card className="flex h-full flex-col justify-between overflow-hidden rounded-sm border-2 bg-[hsl(var(--poster-green))] p-5 text-[hsl(42_52%_96%)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="space-y-3">
                    <span className="inline-flex items-center gap-1.5 font-slab text-[10px] font-bold uppercase tracking-[0.16em] text-[hsl(var(--poster-ochre))]">
                      <ShieldCheck className="h-3 w-3" />
                      Sealed · private
                    </span>
                    <h3 className="font-serif text-2xl font-bold leading-snug">
                      The Circle
                    </h3>
                    <p className="text-[15px] leading-relaxed text-[hsl(42_44%_88%)]">
                      Share photos and video of your children with the family you name — encrypted
                      for each of them, and invisible to the rest of the network.
                    </p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-slab text-xs font-bold uppercase tracking-[0.14em] text-[hsl(var(--poster-ochre))] transition-all group-hover:gap-3">
                    Open your circle
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* ───────────────────────── Values, set as a printed panel ───────────────────────── */}
        <section className="relative overflow-hidden border-y bg-[hsl(var(--poster-green))] py-16 md:py-20 text-[hsl(42_52%_96%)] paper-grain">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, hsl(42 52% 96%) 0 1px, transparent 1px 18px)',
            }}
          />
          <div className="container relative">
            <div className="max-w-2xl space-y-4 mb-12">
              <span className="font-slab text-[11px] font-bold uppercase tracking-[0.22em] text-[hsl(var(--poster-ochre))]">
                What this rests on
              </span>
              <h2 className="poster-title text-3xl md:text-5xl">Three plain commitments</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {VALUES.map(({ icon: Icon, title, body, tone }) => (
                <div key={title} className="space-y-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-sm bg-gradient-to-br shadow-md ${TONE_WASH[tone]} ${TONE_INK[tone]}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold">{title}</h3>
                  <p className="leading-relaxed text-[hsl(42_44%_88%)]">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────────── The series, as a hung wall ───────────────────────── */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container">
            <div className="max-w-2xl space-y-4 mb-12">
              <span className="font-slab text-[11px] font-bold uppercase tracking-[0.22em] text-[hsl(var(--poster-terracotta))]">
                The plates
              </span>
              <h2 className="poster-title text-3xl md:text-5xl">The SAHMstr poster series</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                One plate for each unit of the curriculum. Flat colour, strong silhouettes, a title
                band across the foot — the way this subject was illustrated when it was still
                taught seriously.
              </p>
            </div>

            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
              {POSTER_GALLERY.map(({ unitId, poster }, i) => (
                <li key={unitId}>
                  <Link to={`/tips/${unitId}`} className="group block">
                    <PosterFrame
                      poster={poster}
                      ratio="portrait"
                      tilt={i % 3 === 0 ? 'left' : i % 3 === 1 ? 'none' : 'right'}
                      className="group-hover:-translate-y-1.5 group-hover:rotate-0 group-hover:shadow-xl"
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-12 text-center">
              <Link to="/tips">
                <Button variant="outline" className="gap-2 rounded-sm border-2 px-6">
                  See every unit
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ───────────────────────── Closing card ───────────────────────── */}
        <section className="pb-20 pt-4 bg-background">
          <div className="container">
            <Card className="mx-auto max-w-3xl overflow-hidden rounded-sm border-2 bg-card">
              <div className="h-1.5 bg-gradient-to-r from-[hsl(var(--poster-terracotta))] via-[hsl(var(--poster-ochre))] to-[hsl(var(--poster-green))]" />
              <CardContent className="space-y-5 p-10 text-center md:p-12">
                <h2 className="poster-title text-3xl md:text-4xl">
                  There is a seat at this table
                </h2>
                <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground">
                  Read the units, cook from the recipes, and add what you have learned the hard
                  way. Nothing here asks you for an account you cannot take with you.
                </p>
                <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
                  <Link to="/tips">
                    <Button size="lg" className="gap-2 rounded-sm px-7">
                      Start reading
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button size="lg" variant="ghost" className="rounded-sm px-7">
                      Why we built it
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
