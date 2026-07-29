import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shirt, Sparkles, User, Wand2 } from 'lucide-react';
import { ClosetGrid } from '@/components/wardrobe/ClosetGrid';
import { StyleProfileForm } from '@/components/wardrobe/StyleProfileForm';
import { OutfitSuggestions } from '@/components/wardrobe/OutfitSuggestions';
import { AIStylistPanel } from '@/components/wardrobe/AIStylistPanel';
import { useSearchParams } from 'react-router-dom';
import { PageHero } from '@/components/PageHero';
import { SECTION_POSTERS } from '@/lib/homeEc';

export default function Wardrobe() {
  useSeoMeta({
    title: 'Wardrobe & Style - SAHMstr',
    description: 'Upload your clothing, set your style profile, and get personalized outfit suggestions based on your skin tone, season, and occasion.',
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'stylist';

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value }, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero — the textiles plate */}
        <PageHero
          eyebrow="Plate III · Wardrobe"
          icon={Shirt}
          title="Wardrobe & Style"
          lede="Know your fibres, keep what lasts, and dress well from a closet you already own. Your stylist works from what is actually hanging there."
          poster={SECTION_POSTERS.wardrobe}
          plateCaption="Plate III · Managing the Home"
        />

        {/* Main Content */}
        <section className="py-10 bg-background">
          <div className="container max-w-6xl">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-8">
                <TabsTrigger value="stylist" className="gap-1.5">
                  <Wand2 className="h-4 w-4" />
                  <span className="hidden sm:inline">AI Stylist</span>
                  <span className="sm:hidden">AI</span>
                </TabsTrigger>
                <TabsTrigger value="outfits" className="gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">Quick Ideas</span>
                  <span className="sm:hidden">Ideas</span>
                </TabsTrigger>
                <TabsTrigger value="closet" className="gap-1.5">
                  <Shirt className="h-4 w-4" />
                  <span className="hidden sm:inline">My Closet</span>
                  <span className="sm:hidden">Closet</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="gap-1.5">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Style Profile</span>
                  <span className="sm:hidden">Profile</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="stylist">
                <AIStylistPanel />
              </TabsContent>

              <TabsContent value="outfits">
                <OutfitSuggestions />
              </TabsContent>

              <TabsContent value="closet">
                <ClosetGrid />
              </TabsContent>

              <TabsContent value="profile">
                <StyleProfileForm />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
