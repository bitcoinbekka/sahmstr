import { useSeoMeta } from '@unhead/react';
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
  Wallet,
  UtensilsCrossed,
  Scissors,
  ClipboardList,
  HeartPulse,
  Users,
  Baby,
  ShoppingBag,
  Home,
  SprayCan,
  ShieldCheck,
  Library,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react';
import { CURRICULUM, TOTAL_LESSONS, PROVENANCE } from '@/lib/homeEcCurriculum';

/** Map icon names from the curriculum data to Lucide components */
const ICONS: Record<string, LucideIcon> = {
  Wallet,
  UtensilsCrossed,
  Scissors,
  ClipboardList,
  HeartPulse,
  Users,
  Baby,
  ShoppingBag,
  Home,
  SprayCan,
  ShieldCheck,
};

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
                The old curriculum was serious about this work — household finance, housing, the
                care of a house, the use of time, nutrition, textiles, child development, and how
                to take an advertisement apart. We have rebuilt it, unit by unit, for households
                that intend to hold their own money, records, and skills.
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
                const Icon = ICONS[module.icon] ?? Lightbulb;
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
                          <span className="text-3xl font-serif font-bold text-muted-foreground/25">
                            {module.number}
                          </span>
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
                  in their homes. Share a recipe, a method, or a hard-won lesson.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                  <Link to="/recipes/new">
                    <Button className="gap-2 rounded-full">
                      Share a Recipe
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="outline" className="rounded-full">
                      Why sovereignty matters
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
