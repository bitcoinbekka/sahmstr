import type { NostrEvent } from '@nostrify/nostrify';
import type { AddressPointer } from 'nostr-tools/nip19';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, ChefHat } from 'lucide-react';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { useRecipeByNaddr } from '@/hooks/useRecipeByNaddr';
import { useSeoMeta } from '@unhead/react';

interface RecipeViewProps {
  naddr: AddressPointer;
}

export function RecipeView({ naddr }: RecipeViewProps) {
  const { data: recipe, isLoading, error } = useRecipeByNaddr(naddr);
  const author = useAuthor(recipe?.pubkey || naddr.pubkey);
  const metadata = author.data?.metadata;

  const displayName = metadata?.display_name || metadata?.name || genUserName(naddr.pubkey);
  const avatarUrl = metadata?.picture;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12 bg-background">
          <div className="container max-w-4xl">
            <Card>
              <Skeleton className="aspect-video w-full" />
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-10 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-20 bg-background">
          <div className="container max-w-4xl">
            <Card className="border-dashed">
              <CardContent className="py-12 px-8 text-center">
                <ChefHat className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Recipe not found</p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return <RecipeContent recipe={recipe} displayName={displayName} avatarUrl={avatarUrl} />;
}

function RecipeContent({ recipe, displayName, avatarUrl }: { recipe: NostrEvent; displayName: string; avatarUrl?: string }) {
  const title = recipe.tags.find(([name]) => name === 'title')?.[1] || 'Untitled Recipe';
  const summary = recipe.tags.find(([name]) => name === 'summary')?.[1];
  const image = recipe.tags.find(([name]) => name === 'image')?.[1];
  const tags = recipe.tags.filter(([name]) => name === 't').map(([, value]) => value);
  const publishedAt = recipe.tags.find(([name]) => name === 'published_at')?.[1];

  const date = new Date((publishedAt ? parseInt(publishedAt) : recipe.created_at) * 1000);
  const formattedDate = date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  useSeoMeta({
    title: `${title} - SAHMstr`,
    description: summary || 'A recipe shared on SAHMstr',
    ogTitle: title,
    ogDescription: summary || 'A recipe shared on SAHMstr',
    ogImage: image,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        {/* Hero Image */}
        {image && (
          <div className="relative w-full h-[400px] bg-muted overflow-hidden">
            <img 
              src={image} 
              alt={title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        )}

        <div className="container max-w-4xl py-12">
          <article className="space-y-8">
            {/* Header */}
            <header className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-background shadow-lg">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-amber-500 text-white">
                    {displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{displayName}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
                {title}
              </h1>

              {summary && (
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {summary}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <Badge 
                    key={i} 
                    variant="secondary" 
                    className="capitalize text-sm"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </header>

            {/* Recipe Content */}
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap break-words">
                    {recipe.content}
                  </div>
                </div>
              </CardContent>
            </Card>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
