import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Lightbulb } from 'lucide-react';

export default function Tips() {
  useSeoMeta({
    title: 'Home Tips - SAHMstr',
    description: 'Home economics, budgeting, gardening, and sustainable living tips from the SAHMstr community.',
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-accent/30 py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 items-center justify-center mx-auto">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-serif font-bold">
                Home Economics & Tips
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Practical wisdom for budgeting, gardening, sewing, and sustainable homemaking.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container">
            <div className="text-center py-20">
              <p className="text-muted-foreground">Tips and guides coming soon...</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
