import { useSeoMeta } from '@unhead/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Lightbulb,
  ArrowRight,
  BookOpen,
  Library,
  ExternalLink,
  Users,
  PenLine,
} from 'lucide-react';
import { CURRICULUM, TOTAL_LESSONS, PROVENANCE, getUnitPoster } from '@/lib/homeEc';
import { resolveUnitIcon } from '@/lib/homeEc/icons';
import { useCommunityUnits, SUBJECT_AREAS } from '@/hooks/useCommunityUnits';
import { CommunityUnitCard } from '@/components/CommunityUnitCard';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Contributed units, fetched from relays. Rendered below the canonical
 * curriculum so the authored material is always present even when relays are
 * slow or unreachable.
 */
function CommunityUnitsSection() {
  const [subject, setSubject] = useState<string | undefined>(undefined);
  const { data: units, isLoading } = useCommunityUnits(subject);

  return (
    <section className="py-14 bg-muted/20 border-y">
      <div className="container">
        <div className="max-w-3xl mb-8 space-y-3">
          <div className="flex items-center gap-2.5">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-2xl md:text-3xl font-serif font-bold">
              From the Community
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Units written by the mothers using this curriculum, published to Nostr and owned by
            their authors. The sixteen units above are ours; everything here belongs to someone
            else.
          </p>
        </div>

        {/* Subject filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setSubject(undefined)}
            aria-pressed={subject === undefined}
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Badge
              variant={subject === undefined ? 'default' : 'outline'}
              className="cursor-pointer px-3 py-1 text-sm"
            >
              All
            </Badge>
          </button>
          {SUBJECT_AREAS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setSubject(s.value)}
              aria-pressed={subject === s.value}
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Badge
                variant={subject === s.value ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1 text-sm"
              >
                {s.label}
              </Badge>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-2">
                <CardHeader className="space-y-3">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-6 w-3/4" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 border-t pt-4">
                    <Skeleton className="h-7 w-7 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-2.5 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : units && units.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units.map((unit) => (
              <CommunityUnitCard key={`${unit.event.pubkey}:${unit.identifier}`} unit={unit} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2">
            <CardContent className="py-14 px-8 text-center">
              <div className="max-w-md mx-auto space-y-5">
                <p className="text-muted-foreground leading-relaxed">
                  {subject
                    ? 'No contributed units in this subject yet. Yours could be the first.'
                    : 'No contributed units yet. If you have a method that works in your household, write it down — someone else needs it.'}
                </p>
                <Link to="/contribute">
                  <Button className="gap-2 rounded-full">
                    <PenLine className="h-4 w-4" />
                    Contribute a Unit
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {units && units.length > 0 && (
          <div className="text-center mt-10">
            <Link to="/contribute">
              <Button variant="outline" className="gap-2 rounded-full">
                <PenLine className="h-4 w-4" />
                Contribute a Unit
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default function Tips() {
  useSeoMeta({
    title: 'Home Economics — SAHMstr',
    description:
      'A complete home economics curriculum in the classic tradition, rebuilt for self-sovereign households. Household finance, food, textiles, home management, and more.',
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero — set as a title page */}
        <section className="relative overflow-hidden border-b bg-[hsl(var(--poster-cream))] dark:bg-background paper-grain py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.1]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, hsl(var(--poster-ink)) 0 1px, transparent 1px 44px)',
            }}
          />

          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-3">
                <span className="h-px w-8 bg-[hsl(var(--poster-terracotta))]" />
                <span className="font-slab text-[11px] font-bold uppercase tracking-[0.22em] text-[hsl(var(--poster-terracotta))]">
                  <Lightbulb className="mr-1.5 inline h-3.5 w-3.5" />
                  The complete course
                </span>
                <span className="h-px w-8 bg-[hsl(var(--poster-terracotta))]" />
              </div>

              <h1 className="poster-title text-4xl md:text-6xl">Home Economics</h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                The old curriculum was serious about this work. It started with the family and the
                person, then taught the running of a house, the money, the children, the health —
                and how to take an advertisement apart. We have rebuilt it unit by unit, and
                closed it where the original could not: with money and identity a household
                genuinely holds.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Badge
                  variant="secondary"
                  className="gap-1.5 rounded-sm font-slab text-[11px] uppercase tracking-[0.12em] px-3 py-1"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  {CURRICULUM.length} units
                </Badge>
                <Badge
                  variant="secondary"
                  className="rounded-sm font-slab text-[11px] uppercase tracking-[0.12em] px-3 py-1"
                >
                  {TOTAL_LESSONS} problems
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-sm font-slab text-[11px] uppercase tracking-[0.12em] px-3 py-1"
                >
                  Classic principles · modern application
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Approach note */}
        <section className="py-10 bg-background border-b">
          <div className="container max-w-3xl space-y-6">
            <Card className="border-2 border-primary/20 bg-card">
              <CardContent className="p-6 space-y-3">
                <h2 className="font-serif text-xl font-bold">How this is organized</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Each module is a <strong className="text-foreground">unit</strong>, and each
                  unit is divided into <strong className="text-foreground">problems</strong> —
                  plain questions a household actually has to answer.{' '}
                  <em>How shall the responsibilities of the home be distributed?</em> We kept
                  that old convention on purpose. A question invites thought where a heading only
                  announces a topic.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Every problem has the same shape. First the{' '}
                  <strong className="text-foreground">classic principle</strong> — what home
                  economics taught and why it worked. Then the{' '}
                  <strong className="text-foreground">modern application</strong> — how it holds
                  up today, and where the world has changed enough to need a different answer.
                  Then <strong className="text-foreground">practice</strong>: specific things to
                  do this week. And finally{' '}
                  <strong className="text-foreground">suggested activities</strong>, because the
                  old books understood that nothing is learned by reading about it.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Some problems close with a note on sovereignty, where the old thrift wisdom runs
                  into the modern problem of money that does not hold its value.
                </p>
              </CardContent>
            </Card>

            {/* Provenance */}
            <Card className="border-2 bg-muted/30">
              <CardContent className="p-6 space-y-3">
                <h2 className="font-serif text-xl font-bold flex items-center gap-2.5">
                  <Library className="h-5 w-5 text-primary" />
                  Where the structure came from
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our scope-and-sequence reference is{' '}
                  <a
                    href={PROVENANCE.reference.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-foreground font-medium underline decoration-primary/40 underline-offset-4 hover:decoration-primary inline-flex items-baseline gap-1"
                  >
                    <em>{PROVENANCE.reference.title}</em>
                    <ExternalLink className="h-3 w-3 self-center" />
                  </a>{' '}
                  ({PROVENANCE.reference.year}) by {PROVENANCE.reference.authors} — a high school
                  text from the School of Home Economics at Kansas State College. Its units
                  covered family life, home management, housing, the care of the house, the use of
                  time, family income, consumer education, child care and development, health,
                  home nursing, and the relationship between home and community.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {PROVENANCE.statement}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {PROVENANCE.divergence}
                </p>
                <p className="text-sm text-muted-foreground/80 leading-relaxed pt-1">
                  The consumer unit is the one worth noting. It taught teenagers to take an
                  advertisement apart — to name the emotional appeal, separate the claim from the
                  suggestion, and notice what was carefully left unsaid. That was media literacy,
                  taught in the 1940s, and largely dropped since. It has never been more needed.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Module grid */}
        <section className="py-14 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CURRICULUM.map((module) => {
                const Icon = resolveUnitIcon(module.icon);
                const poster = getUnitPoster(module.id);
                return (
                  <Link key={module.id} to={`/tips/${module.id}`} className="group">
                    <Card className="flex h-full flex-col overflow-hidden rounded-sm border-2 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl">
                      {/* Plate, or a printed plate where the illustrator never got to it */}
                      {poster ? (
                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                          <img
                            src={poster.url}
                            alt={poster.alt}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                          />
                          <span className="absolute left-0 top-0 bg-[hsl(var(--poster-cream))]/95 px-2 py-1 font-slab text-[10px] font-bold uppercase tracking-[0.14em] text-[hsl(var(--poster-ink))]">
                            Unit {module.number}
                          </span>
                        </div>
                      ) : (
                        <div
                          className={`relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${module.wash} ${module.ink}`}
                        >
                          <Icon className="h-12 w-12 opacity-90" />
                          <span className="absolute left-0 top-0 bg-[hsl(var(--poster-cream))]/95 px-2 py-1 font-slab text-[10px] font-bold uppercase tracking-[0.14em] text-[hsl(var(--poster-ink))]">
                            Unit {module.number}
                          </span>
                        </div>
                      )}

                      {/* Title band across the foot */}
                      <div
                        className={`flex items-start gap-2.5 bg-gradient-to-r px-4 py-3 ${module.wash} ${module.ink}`}
                      >
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 opacity-90" />
                        <div className="min-w-0">
                          <CardTitle className="text-base font-bold leading-tight">
                            {module.title}
                          </CardTitle>
                          <p className="mt-0.5 text-xs opacity-85">{module.tagline}</p>
                        </div>
                      </div>

                      <CardHeader className="space-y-2 pb-3 pt-4">
                        {module.isNew && (
                          <Badge
                            variant="outline"
                            className="w-fit rounded-sm border-primary/40 font-slab text-[9px] uppercase tracking-[0.14em] text-primary"
                          >
                            New material
                          </Badge>
                        )}
                        <CardDescription className="text-sm leading-relaxed line-clamp-4">
                          {module.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="mt-auto space-y-4 pt-0">
                        <ul className="space-y-1.5 border-t pt-4">
                          {module.lessons.slice(0, 3).map((lesson) => (
                            <li
                              key={lesson.id}
                              className="line-clamp-1 text-xs leading-snug text-muted-foreground"
                            >
                              {lesson.question}
                            </li>
                          ))}
                          {module.lessons.length > 3 && (
                            <li className="text-xs italic text-muted-foreground/60">
                              and {module.lessons.length - 3} more…
                            </li>
                          )}
                        </ul>

                        <div className="flex items-center justify-between">
                          <span className="font-slab text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                            {module.lessons.length} problems
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-slab text-[11px] font-bold uppercase tracking-[0.12em] text-primary transition-all group-hover:gap-2.5">
                            Read
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Community-contributed units */}
        <CommunityUnitsSection />

        {/* Closing CTA */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-background">
          <div className="container">
            <Card className="max-w-3xl mx-auto border-2 border-primary/20 bg-card">
              <CardContent className="p-10 text-center space-y-5">
                <h2 className="text-2xl md:text-3xl font-serif font-bold">
                  Have something to add?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  This curriculum improves when the women using it contribute what actually works
                  in their homes. Write a unit, share a recipe, or add a hard-won lesson.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                  <Link to="/contribute">
                    <Button className="gap-2 rounded-full">
                      Contribute a Unit
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/recipes/new">
                    <Button variant="outline" className="rounded-full">
                      Share a Recipe
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
}
