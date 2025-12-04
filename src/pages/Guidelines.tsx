import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Shield, Sparkles } from 'lucide-react';

export default function Guidelines() {
  useSeoMeta({
    title: 'Community Guidelines - SAHMstr',
    description: 'Our community guidelines and values for creating a positive, supportive environment on SAHMstr.',
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-accent/30 py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-serif font-bold">
                Community Guidelines
              </h1>
              
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
                <Card>
                  <CardContent className="p-6 space-y-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">Be Respectful</h3>
                    <p className="text-muted-foreground">
                      Treat everyone with kindness and respect. We're all on different journeys, 
                      and our diversity makes us stronger.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 space-y-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">Share Authentically</h3>
                    <p className="text-muted-foreground">
                      Be genuine in your contributions. Share your real experiences, successes, 
                      and challenges alike.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 space-y-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">Support Each Other</h3>
                    <p className="text-muted-foreground">
                      Offer encouragement and constructive feedback. We rise by lifting each other up.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 space-y-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">Stay On Topic</h3>
                    <p className="text-muted-foreground">
                      Keep content relevant to homemaking, bitcoin, and family life. 
                      This helps maintain a focused, valuable community.
                    </p>
                  </CardContent>
                </Card>
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

              <div className="bg-secondary/50 rounded-2xl p-8 space-y-4">
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
