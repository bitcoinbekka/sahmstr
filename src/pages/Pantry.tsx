import { useSeoMeta } from '@unhead/react';
import { Package } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHero } from '@/components/PageHero';
import { Card, CardContent } from '@/components/ui/card';
import { LoginArea } from '@/components/auth/LoginArea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { AddPantryItem } from '@/components/pantry/AddPantryItem';
import { PantryInventory } from '@/components/pantry/PantryInventory';
import { PantryAlerts } from '@/components/pantry/PantryAlerts';

/**
 * The Pantry & Preserving Tracker.
 *
 * A private, cross-device inventory of what is on the household's shelves —
 * with pride of place for home-preserved food. Stored encrypted to the user's
 * own key (NIP-78 + NIP-44), so it is nobody's business but hers, and it
 * follows her from phone to laptop without a backend.
 */
export default function Pantry() {
  useSeoMeta({
    title: 'The Pantry — Provisions & Preserving — SAHMstr',
    description:
      'Keep a private inventory of your pantry, fridge, freezer and canning shelf. Track what you have put up, get gentle nudges before things pass their best, and waste nothing. Encrypted to you alone.',
  });

  const { user } = useCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Provisions"
          icon={Package}
          title="The Pantry"
          lede="A household runs on what is on its shelves. Keep account of your provisions and the food you have put up — so nothing is forgotten, and nothing is wasted."
        />

        <section className="bg-background py-12">
          <div className="container max-w-2xl">
            {!user ? (
              <Card className="rounded-sm border-2">
                <CardContent className="space-y-6 px-8 py-12 text-center">
                  <Package className="mx-auto h-10 w-10 text-muted-foreground/40" />
                  <div className="space-y-2">
                    <h2 className="font-serif text-2xl font-bold">
                      Log in to open your pantry
                    </h2>
                    <p className="mx-auto max-w-md leading-relaxed text-muted-foreground">
                      Your inventory is encrypted to your own key, so it is private
                      and follows you across your devices. There is nothing to show
                      until you are logged in.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <LoginArea className="max-w-60" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                <PantryAlerts />
                <AddPantryItem />
                <PantryInventory />
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
