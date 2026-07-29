import { useSeoMeta } from '@unhead/react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  ArrowRight,
  Landmark,
  Sparkles,
  CheckCircle2,
  Bitcoin,
  Lightbulb,
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
  Heart,
  Sprout,
  Activity,
  Network,
  GraduationCap,
  PenLine,
  type LucideIcon,
} from 'lucide-react';
import { CURRICULUM, getModule } from '@/lib/homeEc';
import NotFound from './NotFound';

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
  Heart,
  Sprout,
  Activity,
  Network,
  GraduationCap,
};

export default function HomeEcModule() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const module = moduleId ? getModule(moduleId) : undefined;

  useSeoMeta({
    title: module ? `${module.title} — Home Economics — SAHMstr` : 'Not Found — SAHMstr',
    description: module?.description,
  });

  if (!module) {
    return <NotFound />;
  }

  const Icon = ICONS[module.icon] ?? Lightbulb;
  const index = CURRICULUM.findIndex((m) => m.id === module.id);
  const prev = index > 0 ? CURRICULUM[index - 1] : null;
  const next = index < CURRICULUM.length - 1 ? CURRICULUM[index + 1] : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Module header */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-primary/10 py-14">
          <div className="container max-w-4xl relative">
            <Link
              to="/tips"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All units
            </Link>

            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div
                className={`h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br ${module.gradient} flex items-center justify-center shadow-md`}
              >
                <Icon className="h-8 w-8 text-white" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Unit {module.number}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {module.lessons.length} problems
                  </span>
                  {module.isNew && (
                    <Badge variant="outline" className="border-primary/40 text-primary">
                      Entirely new material
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
                  {module.title}
                </h1>

                <p className="text-lg text-primary/90 font-medium">{module.tagline}</p>

                <p className="text-muted-foreground leading-relaxed max-w-2xl">
                  {module.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Unit opening passage + contents */}
        <section className="py-10 bg-background border-b">
          <div className="container max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-8">
            {module.opening && (
              <div className="lg:col-span-3">
                <p className="text-lg leading-relaxed font-serif border-l-2 border-primary/40 pl-5 text-foreground/90">
                  {module.opening}
                </p>
              </div>
            )}

            <div className={module.opening ? 'lg:col-span-2' : 'lg:col-span-5'}>
              <Card className="border-2 bg-muted/30">
                <CardContent className="p-5 space-y-3">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Problems in this unit
                  </h2>
                  <ol className="space-y-2.5">
                    {module.lessons.map((lesson, i) => (
                      <li key={lesson.id} className="flex gap-2.5 text-sm leading-snug">
                        <span className="font-mono text-muted-foreground shrink-0">
                          {i + 1}.
                        </span>
                        <a
                          href={`#${lesson.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {lesson.question}
                        </a>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Lessons */}
        <section className="py-12 bg-background">
          <div className="container max-w-4xl space-y-8">
            {module.lessons.map((lesson, i) => (
              <article key={lesson.id} id={lesson.id}>
                <Card className="border-2 overflow-hidden">
                  {/* Lesson header — framed as a "problem", in the classic style */}
                  <div className="p-6 md:p-8 pb-0 space-y-3">
                    <div className="flex items-baseline gap-3">
                      <span className="text-sm font-mono text-muted-foreground shrink-0">
                        {module.number}.{i + 1}
                      </span>
                      <h2 className="text-xl md:text-2xl font-serif font-bold leading-snug text-primary">
                        {lesson.question}
                      </h2>
                    </div>
                    <div className="pl-0 sm:pl-10 space-y-1.5">
                      <p className="text-lg font-serif font-semibold">{lesson.title}</p>
                      <p className="text-muted-foreground leading-relaxed">{lesson.summary}</p>
                    </div>
                  </div>

                  <CardContent className="p-6 md:p-8 space-y-7">
                    <Separator />

                    {/* Classic principle */}
                    <div className="space-y-2.5">
                      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        <Landmark className="h-4 w-4 text-primary" />
                        The classic principle
                      </h3>
                      <p className="leading-relaxed text-[15px]">{lesson.classicPrinciple}</p>
                    </div>

                    {/* Modern application */}
                    <div className="space-y-2.5">
                      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Today
                      </h3>
                      <p className="leading-relaxed text-[15px]">{lesson.modernApplication}</p>
                    </div>

                    {/* Practice */}
                    <div className="space-y-3">
                      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Practice
                      </h3>
                      <ul className="space-y-2.5">
                        {lesson.practice.map((item, j) => (
                          <li key={j} className="flex gap-3 text-[15px] leading-relaxed">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Sovereign note */}
                    {lesson.sovereignNote && (
                      <div className="flex gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <Bitcoin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-[15px] leading-relaxed italic">
                          {lesson.sovereignNote}
                        </p>
                      </div>
                    )}

                    {/* Suggested activities */}
                    {lesson.activities && lesson.activities.length > 0 && (
                      <div className="rounded-xl border-2 border-dashed p-5 space-y-3 bg-muted/20">
                        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                          <PenLine className="h-4 w-4 text-primary" />
                          Suggested activities
                        </h3>
                        <ol className="space-y-2.5">
                          {lesson.activities.map((item, j) => (
                            <li key={j} className="flex gap-3 text-[15px] leading-relaxed">
                              <span className="font-mono text-xs text-muted-foreground pt-1 shrink-0">
                                {String.fromCharCode(97 + j)}.
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </article>
            ))}
          </div>
        </section>

        {/* Prev / next navigation */}
        <section className="pb-16 bg-background">
          <div className="container max-w-4xl">
            <Separator className="mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prev ? (
                <Link to={`/tips/${prev.id}`} className="group">
                  <Card className="h-full border-2 hover:border-primary/50 transition-all">
                    <CardContent className="p-5">
                      <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5">
                        <ArrowLeft className="h-3 w-3" />
                        Unit {prev.number}
                      </p>
                      <p className="font-serif font-bold group-hover:text-primary transition-colors">
                        {prev.title}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <div className="hidden sm:block" />
              )}

              {next && (
                <Link to={`/tips/${next.id}`} className="group sm:text-right">
                  <Card className="h-full border-2 hover:border-primary/50 transition-all">
                    <CardContent className="p-5">
                      <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5 sm:justify-end">
                        Unit {next.number}
                        <ArrowRight className="h-3 w-3" />
                      </p>
                      <p className="font-serif font-bold group-hover:text-primary transition-colors">
                        {next.title}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )}
            </div>

            <div className="text-center mt-8">
              <Link to="/tips">
                <Button variant="outline" className="gap-2 rounded-full">
                  <ArrowLeft className="h-4 w-4" />
                  Back to all units
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
