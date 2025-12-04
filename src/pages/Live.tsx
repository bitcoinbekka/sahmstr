import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Radio } from 'lucide-react';

export default function Live() {
  useSeoMeta({
    title: 'Live Streams - SAHMstr',
    description: 'Join live cooking sessions and community events on SAHMstr.',
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-accent/30 py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 items-center justify-center mx-auto">
                <Radio className="h-8 w-8 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-serif font-bold">
                Live Streaming
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Connect in real-time with cooking sessions, Q&As, and community gatherings.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container">
            <div className="text-center py-20">
              <p className="text-muted-foreground">Live streaming events coming soon...</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
