import { useSeoMeta } from '@unhead/react';
import { Link } from 'react-router-dom';
import { ChefHat, Video, Lightbulb, Radio, ArrowRight, Sparkles, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Index = () => {
  useSeoMeta({
    title: 'SAHMstr - Where Bitcoin Meets Homemaking',
    description: 'A vibrant community for stay-at-home moms who embrace bitcoin. Share recipes, vlogs, home tips, and connect with like-minded women.',
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-accent/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.15),transparent_50%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(134,239,172,0.15),transparent_50%)] pointer-events-none" />
          
          <div className="container relative py-24 md:py-32">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Powered by Nostr & Bitcoin</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
                Where{' '}
                <span className="bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Bitcoin
                </span>{' '}
                Meets{' '}
                <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  Homemaking
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A nurturing community for stay-at-home moms who embrace financial sovereignty. 
                Share recipes, vlogs, home economics tips, and build lasting connections.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link to="/recipes">
                  <Button size="lg" className="gap-2 text-lg px-8 rounded-full shadow-lg hover:shadow-xl transition-all">
                    Explore Recipes
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="gap-2 text-lg px-8 rounded-full">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif font-bold">
                Everything You Need in One Place
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From kitchen to homestead, discover resources that empower your daily life
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                <CardHeader>
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ChefHat className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Recipes & Cooking</CardTitle>
                  <CardDescription className="text-base">
                    From scratch cooking, baking, preserving, and meal planning for your family
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/recipes">
                    <Button variant="ghost" className="gap-2 group-hover:gap-3 transition-all">
                      Browse Recipes
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                <CardHeader>
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Video className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Vlogs & Stories</CardTitle>
                  <CardDescription className="text-base">
                    Real life, real moments. Watch and share your daily homemaking journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/vlogs">
                    <Button variant="ghost" className="gap-2 group-hover:gap-3 transition-all">
                      Watch Vlogs
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                <CardHeader>
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Radio className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Live Streaming</CardTitle>
                  <CardDescription className="text-base">
                    Join live cooking sessions, Q&As, and connect in real-time with the community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/live">
                    <Button variant="ghost" className="gap-2 group-hover:gap-3 transition-all">
                      View Live Events
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                <CardHeader>
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Lightbulb className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Home Economics</CardTitle>
                  <CardDescription className="text-base">
                    Budgeting, gardening, sewing, and sustainable living tips for the modern homemaker
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/tips">
                    <Button variant="ghost" className="gap-2 group-hover:gap-3 transition-all">
                      Learn More
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Community Values Section */}
        <section className="py-20 bg-gradient-to-br from-secondary/30 to-accent/20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-4xl md:text-5xl font-serif font-bold">
                  Built on Strong Values
                </h2>
                <p className="text-xl text-muted-foreground">
                  Our community is rooted in principles that matter
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Financial Sovereignty</h3>
                  <p className="text-muted-foreground">
                    Empowering families through bitcoin and decentralized money
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mx-auto">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Authentic Community</h3>
                  <p className="text-muted-foreground">
                    Real connections, genuine support, and lasting friendships
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Decentralized</h3>
                  <p className="text-muted-foreground">
                    Built on Nostr - censorship-resistant and user-owned
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <Card className="max-w-3xl mx-auto border-2 border-primary/20 bg-gradient-to-br from-background to-secondary/20">
              <CardContent className="p-12 text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-serif font-bold">
                  Ready to Join the Community?
                </h2>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  Connect with inspiring women, share your knowledge, and build a better future for your family
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <Link to="/recipes">
                    <Button size="lg" className="gap-2 text-lg px-8 rounded-full">
                      Get Started
                      <ArrowRight className="h-5 w-5" />
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
};

export default Index;
