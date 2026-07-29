import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Shield, Sparkles } from 'lucide-react';
import { TONE_WASH, TONE_INK, type PosterTone } from '@/lib/homeEc/posters';

/** The four house rules, each struck in one of the series inks. */
const RULES: Array<{
  icon: typeof Heart;
  tone: PosterTone;
  title: string;
  body: string;
}> = [
  {
    icon: Heart,
    tone: 'terracotta',
    title: 'Be Respectful',
    body: "Treat everyone with kindness and respect. We're all on different journeys, and our diversity makes us stronger.",
  },
  {
    icon: Sparkles,
    tone: 'ochre',
    title: 'Share Authentically',
    body: 'Be genuine in your contributions. Share your real experiences, successes, and challenges alike.',
  },
  {
    icon: Users,
    tone: 'green',
    title: 'Support Each Other',
    body: 'Offer encouragement and constructive feedback. We rise by lifting each other up.',
  },
  {
    icon: Shield,
    tone: 'teal',
    title: 'Stay On Topic',
    body: 'Keep content relevant to homemaking, bitcoin, and family life. This helps maintain a focused, valuable community.',
  },
];

export default function Guidelines() {
  useSeoMeta({
    title: 'Community Guidelines - SAHMstr',
    description: 'Our community guidelines and values for creating a positive, supportive environment on SAHMstr.',
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="paper-grain relative overflow-hidden border-b bg-[hsl(var(--poster-cream))] py-16 dark:bg-background">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.1]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, hsl(var(--poster-ink)) 0 1px, transparent 1px 44px)',
            }}
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[3px] bg-[hsl(var(--poster-ochre))]/70"
          />

          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-[hsl(var(--poster-terracotta))]" />
                <span className="font-slab text-[11px] font-bold uppercase tracking-[0.22em] text-[hsl(var(--poster-terracotta))]">
                  House rules
                </span>
                <span className="h-px w-8 bg-[hsl(var(--poster-terracotta))]" />
              </div>

              <h1 className="poster-title text-4xl md:text-6xl">Community Guidelines</h1>

              <p className="text-xl text-muted-foreground">
                Creating a nurturing space for all SAHMstr community members
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container max-w-4xl">
            <div className="space-y-12">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  SAHMstr is built on the principles of respect, authenticity, and mutual support.
                  Our community thrives when we all contribute to a positive, welcoming environment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {RULES.map(({ icon: Icon, tone, title, body }) => (
                  <Card key={title} className="overflow-hidden rounded-sm border-2">
                    <CardContent className="p-6 space-y-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-sm bg-gradient-to-br shadow-sm ${TONE_WASH[tone]} ${TONE_INK[tone]}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold">{title}</h3>
                      <p className="text-muted-foreground">{body}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-serif font-bold">Our Values</h2>

                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-6 py-2">
                    <h3 className="font-semibold text-lg mb-2">Financial Sovereignty</h3>
                    <p className="text-muted-foreground">
                      We believe in bitcoin's potential to empower families. Discussions about financial
                      independence, saving, and bitcoin education are encouraged.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-6 py-2">
                    <h3 className="font-semibold text-lg mb-2">Homemaking Excellence</h3>
                    <p className="text-muted-foreground">
                      From cooking to budgeting to home education, we celebrate the art and science
                      of creating a thriving home environment.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-6 py-2">
                    <h3 className="font-semibold text-lg mb-2">Decentralization</h3>
                    <p className="text-muted-foreground">
                      Built on Nostr, we value freedom, privacy, and user ownership. Your content
                      belongs to you, and censorship has no place here.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-6 py-2">
                    <h3 className="font-semibold text-lg mb-2">Lifelong Learning</h3>
                    <p className="text-muted-foreground">
                      We're all students and teachers. Share your knowledge generously and remain
                      open to learning from others.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-serif font-bold">Content Guidelines</h2>

                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong className="text-foreground">Recipes:</strong> Share complete, tested recipes with clear
                      instructions. Include ingredients, measurements, and helpful tips.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong className="text-foreground">Vlogs & Videos:</strong> Keep content family-friendly and
                      relevant to homemaking, parenting, or bitcoin topics.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong className="text-foreground">Tips & How-Tos:</strong> Provide actionable advice based on
                      real experience. Cite sources when sharing technical or financial information.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong className="text-foreground">Comments & Discussion:</strong> Engage thoughtfully.
                      Constructive criticism is welcome; personal attacks are not.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-card border-2 border-primary/20 rounded-2xl p-8 space-y-4">
                <h2 className="text-2xl font-serif font-bold">Building Together</h2>
                <p className="text-muted-foreground leading-relaxed">
                  SAHMstr is more than a platform - it's a community built by its members. By following these
                  guidelines and embodying our values, you help create a space where homemakers can connect,
                  learn, and thrive together. Thank you for being part of this journey!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
