import { Link } from 'react-router-dom';
import { nip19 } from 'nostr-tools';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight } from 'lucide-react';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { SUBJECT_AREAS, type CommunityUnit } from '@/hooks/useCommunityUnits';

const SUBJECT_LABELS = new Map(SUBJECT_AREAS.map((s) => [s.value, s.label]));

interface CommunityUnitCardProps {
  unit: CommunityUnit;
}

export function CommunityUnitCard({ unit }: CommunityUnitCardProps) {
  const author = useAuthor(unit.event.pubkey);
  const metadata = author.data?.metadata;

  const displayName =
    metadata?.display_name || metadata?.name || genUserName(unit.event.pubkey);

  const naddr = nip19.naddrEncode({
    kind: unit.event.kind,
    pubkey: unit.event.pubkey,
    identifier: unit.identifier,
  });

  const date = new Date(unit.publishedAt * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link to={`/${naddr}`} className="group">
      <Card className="h-full border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
        {unit.image && (
          <div className="aspect-[16/9] overflow-hidden bg-muted">
            <img
              src={unit.image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        <CardHeader className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {unit.subjects.slice(0, 2).map((s) => (
              <Badge key={s} variant="secondary" className="text-xs">
                {SUBJECT_LABELS.get(s) ?? s}
              </Badge>
            ))}
          </div>

          <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors">
            {unit.title}
          </CardTitle>

          {unit.summary && (
            <CardDescription className="text-sm leading-relaxed line-clamp-3">
              {unit.summary}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="mt-auto pt-0">
          <div className="flex items-center justify-between gap-3 border-t pt-4">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarImage src={metadata?.picture} alt={displayName} />
                <AvatarFallback className="text-xs">
                  {displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground">{date}</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
