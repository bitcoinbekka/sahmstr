import type { NostrEvent } from '@nostrify/nostrify';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, ChefHat } from 'lucide-react';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { Link } from 'react-router-dom';
import { nip19 } from 'nostr-tools';

interface RecipeCardProps {
  event: NostrEvent;
}

export function RecipeCard({ event }: RecipeCardProps) {
  const author = useAuthor(event.pubkey);
  const metadata = author.data?.metadata;

  // Extract recipe metadata from tags
  const title = event.tags.find(([name]) => name === 'title')?.[1] || 'Untitled Recipe';
  const summary = event.tags.find(([name]) => name === 'summary')?.[1] || '';
  const image = event.tags.find(([name]) => name === 'image')?.[1];
  const tags = event.tags.filter(([name]) => name === 't').map(([, value]) => value);
  const publishedAt = event.tags.find(([name]) => name === 'published_at')?.[1];
  const dTag = event.tags.find(([name]) => name === 'd')?.[1];

  const displayName = metadata?.display_name || metadata?.name || genUserName(event.pubkey);
  const avatarUrl = metadata?.picture;

  // Create naddr for the recipe
  const naddr = dTag ? nip19.naddrEncode({
    kind: event.kind,
    pubkey: event.pubkey,
    identifier: dTag,
  }) : null;

  const recipeUrl = naddr ? `/${naddr}` : `/note/${nip19.noteEncode(event.id)}`;

  // Format date
  const date = new Date((publishedAt ? parseInt(publishedAt) : event.created_at) * 1000);
  const formattedDate = date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <Link to={recipeUrl}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 h-full">
        {image && (
          <div className="relative overflow-hidden aspect-video bg-muted">
            <img 
              src={image} 
              alt={title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
        
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-amber-500 text-white text-sm">
                {displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{displayName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          <div>
            <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </CardTitle>
            {summary && (
              <CardDescription className="mt-2 line-clamp-2 text-base">
                {summary}
              </CardDescription>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag, i) => (
              <Badge 
                key={i} 
                variant="secondary" 
                className="capitalize"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 4 && (
              <Badge variant="outline">
                +{tags.length - 4} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
