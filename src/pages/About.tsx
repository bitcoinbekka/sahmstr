import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Bitcoin, Heart, Shield, Users } from 'lucide-react';

export default function About() {
  useSeoMeta({
    title: 'About - SAHMstr',
    description: 'Learn about the SAHMstr community and our mission to empower stay-at-home moms through bitcoin and decentralized technology.',
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-accent/30 py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-serif font-bold">
                About SAHMstr
              </h1>
              
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
                  SAHMstr is a vibrant community for stay-at-home moms who embrace bitcoin and value financial sovereignty. 
                  We believe in the power of decentralized technology to give families more control over their future, while 
                  celebrating the timeless wisdom of homemaking.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                <Card>
                  <CardContent className="p-6 space-y-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                      <Bitcoin className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">Bitcoin-Focused</h3>
                    <p className="text-muted-foreground">
                      We embrace bitcoin as a tool for financial independence and generational wealth building.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 space-y-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">Decentralized</h3>
                    <p className="text-muted-foreground">
                      Built on Nostr protocol - censorship-resistant, user-owned, and truly open.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 space-y-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">Supportive Community</h3>
                    <p className="text-muted-foreground">
                      Real connections with women who share your values and understand your journey.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 space-y-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">Knowledge Sharing</h3>
                    <p className="text-muted-foreground">
                      From recipes to budgeting tips, we share practical wisdom that matters.
                    </p>
                  </CardContent>
                </Card>
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
                </ul>
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
