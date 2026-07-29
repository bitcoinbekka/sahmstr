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
import { CURRICULUM, TOTAL_LESSONS, PROVENANCE } from '@/lib/homeEc';
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
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-primary/10 py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.08),transparent_50%)] pointer-events-none" />

          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 items-center justify-center mx-auto">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>

              <h1 className="text-4xl md:text-6xl font-serif font-bold">
                Home Economics
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                The old curriculum was serious about this work. It started with the family and the
                person, then taught the running of a house, the money, the children, the health —
                and how to take an advertisement apart. We have rebuilt it unit by unit, and
                closed it where the original could not: with money and identity a household
                genuinely holds.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Badge variant="secondary" className="gap-1.5 text-sm px-3 py-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {CURRICULUM.length} units
                </Badge>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {TOTAL_LESSONS} problems
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1">
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
                return (
                  <Link key={module.id} to={`/tips/${module.id}`} className="group">
                    <Card className="h-full border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col">
                      <CardHeader className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className={`h-12 w-12 rounded-xl bg-gradient-to-br ${module.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <span className="text-3xl font-serif font-bold text-muted-foreground/25">
                              {module.number}
                            </span>
                            {module.isNew && (
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 border-primary/40 text-primary"
                              >
                                New
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {module.title}
                          </CardTitle>
                          <p className="text-sm text-primary/80 font-medium">{module.tagline}</p>
                        </div>

                        <CardDescription className="text-sm leading-relaxed line-clamp-4">
                          {module.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="mt-auto pt-0 space-y-4">
                        <ul className="space-y-1.5 border-t pt-4">
                          {module.lessons.slice(0, 3).map((lesson) => (
                            <li
                              key={lesson.id}
                              className="text-xs text-muted-foreground leading-snug line-clamp-1"
                            >
                              {lesson.question}
                            </li>
                          ))}
                          {module.lessons.length > 3 && (
                            <li className="text-xs text-muted-foreground/60 italic">
                              and {module.lessons.length - 3} more…
                            </li>
                          )}
                        </ul>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {module.lessons.length} problems
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
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
