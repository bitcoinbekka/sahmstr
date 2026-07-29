import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Plus, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRecipes } from '@/hooks/useRecipes';
import { RecipeCard } from '@/components/RecipeCard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHero } from '@/components/PageHero';
import { SECTION_POSTERS } from '@/lib/homeEc';

export default function Recipes() {
  useSeoMeta({
    title: 'Recipes - SAHMstr',
    description: 'Discover delicious recipes from the SAHMstr community. From scratch cooking, baking, and meal planning.',
  });

  const { data: recipes, isLoading, error } = useRecipes();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero — the recipe plate */}
        <PageHero
          eyebrow="Plate I · Recipes"
          icon={ChefHat}
          title="Recipe Collection"
          lede="Cooking from staples, putting up the harvest, and feeding a family well on what the week actually allows."
          poster={SECTION_POSTERS.recipes}
          plateCaption="Plate I · The Family as a Consumer"
        >
          <Link to="/recipes/new">
            <Button size="lg" className="gap-2 rounded-sm px-7">
              <Plus className="h-5 w-5" />
              Share your recipe
            </Button>
          </Link>
        </PageHero>

        {/* Recipes Grid */}
        <section className="py-12 bg-background">
          <div className="container">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Card className="border-dashed">
                <CardContent className="py-12 px-8 text-center">
                  <div className="max-w-sm mx-auto space-y-6">
                    <p className="text-muted-foreground">
                      Unable to load recipes. Please check your relay connections.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : !recipes || recipes.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 px-8 text-center">
                  <div className="max-w-sm mx-auto space-y-6">
                    <ChefHat className="h-16 w-16 mx-auto text-muted-foreground/50" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">No recipes yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Be the first to share a delicious recipe with the community!
                      </p>
                      <Link to="/recipes/new">
                        <Button className="gap-2">
                          <Plus className="h-4 w-4" />
                          Create Recipe
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} event={recipe} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
