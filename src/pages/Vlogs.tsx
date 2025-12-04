import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Video } from 'lucide-react';

export default function Vlogs() {
  useSeoMeta({
    title: 'Vlogs - SAHMstr',
    description: 'Watch vlogs and video content from the SAHMstr community.',
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-primary/10 py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 items-center justify-center mx-auto">
                <Video className="h-8 w-8 text-white" />
              </div>

              <h1 className="text-4xl md:text-6xl font-serif font-bold">
                Vlogs & Videos
              </h1>

              <p className="text-xl text-muted-foreground">
                Real life, real moments. Watch homemaking vlogs from our community.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container">
            <div className="text-center py-20">
              <p className="text-muted-foreground">Video content coming soon...</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
