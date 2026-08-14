import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Bitcoin, Heart, Shield, Users } from 'lucide-react';
import { TONE_WASH, TONE_INK, type PosterTone } from '@/lib/homeEc/posters';

/** The four pillars, each struck in one of the series inks. */
const PILLARS: Array<{
  icon: typeof Bitcoin;
  tone: PosterTone;
  title: string;
  body: string;
}> = [
  {
    icon: Bitcoin,
    tone: 'ochre',
    title: 'Sound Money',
    body: 'Bitcoin held in self-custody. Not your keys, not your coins — and no one can inflate away what your household has saved.',
  },
  {
    icon: Shield,
    tone: 'green',
    title: 'Self-Sovereign',
    body: 'Built on Nostr. Your keys are your account — censorship-resistant, permissionless, and impossible to deplatform you from.',
  },
  {
    icon: Heart,
    tone: 'terracotta',
    title: 'Not Surveillance Capital',
    body: 'No ads, no tracking, no engagement algorithm. Your family is not training data and your attention is not the product.',
  },
  {
    icon: Users,
    tone: 'teal',
    title: 'Peer-to-Peer',
    body: 'Women talking directly to each other, with no intermediary deciding who gets heard. Self-host it all if you would rather.',
  },
];

export default function About() {
  useSeoMeta({
    title: 'About - SAHMstr',
    description: 'Learn about the SAHMstr community and our mission to empower stay-at-home moms through bitcoin and decentralized technology.',
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="paper-grain relative overflow-hidden border-b bg-[hsl(var(--poster-cream))] py-16 dark:bg-background">
          {/* Ruled ground, as on a title page */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.1]"
            style={{
              backgroundImage:
                'none',
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
                  The imprint
                </span>
                <span className="h-px w-8 bg-[hsl(var(--poster-terracotta))]" />
              </div>

              <h1 className="poster-title text-4xl md:text-6xl">About SAHMstr</h1>

              <p className="text-xl text-muted-foreground">
                Empowering stay-at-home moms through community, knowledge sharing, and financial sovereignty
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container max-w-4xl">
            <div className="prose prose-lg max-w-none space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-serif font-bold">Our Mission</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  SAHMstr is a community for stay-at-home mothers who have opted out of the
                  extractive web. We think the household is the smallest unit of real independence,
                  and that self-custody, self-hosting and peer-to-peer protocols are how it gets its
                  footing back — while keeping the timeless craft of homemaking exactly where it
                  belongs, at the centre.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                {PILLARS.map(({ icon: Icon, tone, title, body }) => (
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

              <div className="space-y-4">
                <h2 className="text-3xl font-serif font-bold">What We Offer</h2>
                <ul className="space-y-3 text-muted-foreground text-lg">
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Recipes & Cooking:</strong> Share and discover wholesome recipes, from scratch cooking, baking, and meal planning</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Vlogs & Stories:</strong> Share your homemaking journey through video content and connect authentically</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Live Streaming:</strong> Join real-time cooking sessions, Q&As, and community gatherings</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Home Economics:</strong> Learn about budgeting, gardening, sewing, preserving, and sustainable living</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong className="text-foreground">The Circle:</strong> Share photos and
                      video of your children with a private, encrypted list of family — not with
                      the whole network
                    </span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-serif font-bold">Financial Sovereignty for Families</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  At the heart of SAHMstr is the belief that financial sovereignty strengthens families. When families
                  control their own money and economic future, they gain independence, security, and the ability to
                  build generational wealth on their own terms.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">What is Bitcoin?</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Bitcoin is sound money for the digital age. Unlike government-issued currencies that can be printed
                  endlessly, bitcoin has a fixed supply of 21 million coins. This scarcity makes it an excellent store
                  of value - protecting your family's savings from inflation and debasement.
                </p>

                <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 space-y-4">
                  <h4 className="text-xl font-semibold">Why Bitcoin Matters for Families</h4>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        <strong className="text-foreground">Protection from Inflation:</strong> Your savings won't lose
                        purchasing power over time as governments print more money
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        <strong className="text-foreground">True Ownership:</strong> You control your bitcoin directly -
                        no bank can freeze your account or deny you access to your money
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        <strong className="text-foreground">Global & Borderless:</strong> Send value to anyone, anywhere,
                        without permission from banks or payment processors
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        <strong className="text-foreground">Generational Wealth:</strong> Bitcoin can be passed down to
                        your children, providing financial security for generations
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        <strong className="text-foreground">Low Time Preference:</strong> Saving in bitcoin encourages
                        long-term thinking and planning for the future
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">Value-for-Value (V4V) Communities</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Value-for-value is a new economic model made possible by bitcoin and Nostr. Instead of ads, subscriptions,
                  or platform fees, creators and community members exchange value directly through peer-to-peer transactions.
                </p>

                <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 space-y-4">
                  <h4 className="text-xl font-semibold">How V4V Works</h4>
                  <p className="text-muted-foreground">
                    When someone shares a valuable recipe, helpful tip, or inspiring vlog, you can send them bitcoin
                    (called "zaps" on Nostr) directly as a thank you. No middlemen, no platform taking a cut - just
                    direct appreciation flowing from person to person.
                  </p>
                  <ul className="space-y-3 text-muted-foreground mt-4">
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        <strong className="text-foreground">No Ads or Algorithms:</strong> Content creators aren't
                        incentivized to be sensational or clickbait-y - they're rewarded for genuine value
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        <strong className="text-foreground">Direct Support:</strong> Every satoshi (smallest unit of bitcoin)
                        goes directly to the creator, not a platform
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        <strong className="text-foreground">Voluntary Exchange:</strong> You decide what content is valuable
                        and reward creators accordingly
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        <strong className="text-foreground">Community-Driven:</strong> The community determines value, not
                        corporate sponsors or advertisers
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">Building Stronger Families Through P2P Communities</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Peer-to-peer (P2P) communities built on Nostr and bitcoin create a fundamentally different kind of
                  social network - one that strengthens families rather than fragmenting them.
                </p>

                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-6 py-2">
                    <h4 className="font-semibold text-lg mb-2">Economic Independence</h4>
                    <p className="text-muted-foreground">
                      Stay-at-home moms can earn bitcoin by sharing their knowledge and skills - whether that's recipes,
                      homemaking tips, or crafts. This creates economic value for homemaking work that society often
                      undervalues, giving moms financial independence while staying home with their children.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-6 py-2">
                    <h4 className="font-semibold text-lg mb-2">Aligned Incentives</h4>
                    <p className="text-muted-foreground">
                      Traditional social media profits from keeping you addicted and distracted. V4V communities profit
                      when they provide real value to your life. This alignment means content that helps your family
                      thrive - not content designed to steal your attention from your children.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-6 py-2">
                    <h4 className="font-semibold text-lg mb-2">True Ownership</h4>
                    <p className="text-muted-foreground">
                      Your content, connections, and reputation belong to you. If SAHMstr disappeared tomorrow, you could
                      take your Nostr identity to any other Nostr app and find the same connections, content, and community.
                      This protects families from platform risk and censorship.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-6 py-2">
                    <h4 className="font-semibold text-lg mb-2">Long-Term Thinking</h4>
                    <p className="text-muted-foreground">
                      Bitcoin's fixed supply encourages saving and long-term planning. When your money appreciates over
                      time instead of depreciating, you naturally think more about the future - your children's education,
                      retirement, and generational wealth. This mindset strengthens family bonds and builds resilience.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-6 py-2">
                    <h4 className="font-semibold text-lg mb-2">Privacy & Safety</h4>
                    <p className="text-muted-foreground">
                      Unlike traditional social media that harvests your data, Nostr gives you control over your privacy.
                      You can be pseudonymous or public, share what you choose, and protect your family's personal
                      information. Bitcoin transactions are also peer-to-peer, without revealing your banking details.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border-2 border-primary/20 rounded-2xl p-8 space-y-4">
                <h3 className="text-2xl font-serif font-bold">The Vision</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  SAHMstr exists to help families thrive in the digital age by combining timeless homemaking wisdom
                  with cutting-edge financial technology. We believe that when moms have financial sovereignty, strong
                  peer-to-peer communities, and the freedom to share their knowledge without corporate interference,
                  families become stronger, more resilient, and more connected.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  This is more than just a social network - it's a movement toward family financial independence,
                  authentic community, and a better future for our children.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-serif font-bold">Why Nostr?</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We built SAHMstr on the Nostr protocol because we believe in true digital ownership. Your content belongs to you,
                  not a corporation. Your connections are portable - you can take them with you anywhere. There's no algorithm
                  controlling what you see, and no central authority that can silence your voice.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Combined with bitcoin, Nostr represents a complete ecosystem of financial and digital sovereignty - values
                  that align perfectly with our mission to empower families.
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
