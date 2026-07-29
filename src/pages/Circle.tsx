import { useSeoMeta } from '@unhead/react';
import { Lock, Images, Users } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHero } from '@/components/PageHero';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { LoginArea } from '@/components/auth/LoginArea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { CircleManager } from '@/components/circle/CircleManager';
import { StoryComposer } from '@/components/circle/StoryComposer';
import { StoryFeed } from '@/components/circle/StoryFeed';

/**
 * The Circle: private photo and video sharing for family.
 *
 * This is the answer to "I want to show my mother a picture of the children
 * without putting it on the internet forever". Stories are gift wrapped per
 * NIP-59 to a whitelist the household controls.
 */
export default function Circle() {
  useSeoMeta({
    title: 'The Circle — Private Family Sharing — SAHMstr',
    description:
      'Share photos and videos of your family with a private, encrypted circle — not with the whole network. End-to-end encrypted with NIP-59 gift wrapping.',
  });

  const { user } = useCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Private sharing"
          icon={Lock}
          title="The Circle"
          lede="A photo of your children does not belong to the whole network. Share it with the people you name — encrypted for each of them, invisible to everyone else, including us."
        />

        <section className="bg-background py-12">
          <div className="container max-w-2xl">
            {!user ? (
              <Card className="rounded-sm border-2">
                <CardContent className="space-y-6 px-8 py-12 text-center">
                  <Lock className="mx-auto h-10 w-10 text-muted-foreground/40" />
                  <div className="space-y-2">
                    <h2 className="font-serif text-2xl font-bold">Log in to open your circle</h2>
                    <p className="mx-auto max-w-md leading-relaxed text-muted-foreground">
                      Private sharing is encrypted to your own key, so there is nothing for us to
                      show you until you are logged in. Your circle and your stories are readable
                      only on your devices.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <LoginArea className="max-w-60" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="stories" className="w-full">
                <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-2 rounded-sm">
                  <TabsTrigger value="stories" className="gap-1.5 rounded-sm">
                    <Images className="h-4 w-4" />
                    Stories
                  </TabsTrigger>
                  <TabsTrigger value="circle" className="gap-1.5 rounded-sm">
                    <Users className="h-4 w-4" />
                    My circle
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="stories" className="space-y-8">
                  <StoryComposer />
                  <StoryFeed />
                </TabsContent>

                <TabsContent value="circle">
                  <CircleManager />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
