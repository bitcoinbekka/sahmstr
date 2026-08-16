import { nip19 } from 'nostr-tools';
import { Link } from 'react-router-dom';
import { Radio, Clock, CheckCircle2, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { isEffectivelyLive, type Stream } from '@/lib/streamTypes';

/** One stream in the Live listing. Links to its watch page via naddr. */
export function StreamCard({ stream }: { stream: Stream }) {
  const author = useAuthor(stream.pubkey);
  const hostName = author.data?.metadata?.name ?? genUserName(stream.pubkey);
  const hostPic = author.data?.metadata?.picture;

  const live = isEffectivelyLive(stream);
  const naddr = nip19.naddrEncode({
    kind: 30311,
    pubkey: stream.pubkey,
    identifier: stream.identifier,
  });

  const badge = live
    ? { label: 'Live', className: 'bg-red-600 text-white', Icon: Radio }
    : stream.status === 'planned'
      ? { label: 'Planned', className: 'bg-[hsl(var(--poster-ochre))] text-[hsl(var(--poster-ink))]', Icon: Clock }
      : { label: 'Ended', className: 'bg-muted text-muted-foreground', Icon: CheckCircle2 };

  return (
    <Link to={`/${naddr}`} className="group block focus-visible:outline-none">
      <Card className="overflow-hidden rounded-sm border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {stream.image ? (
            <img
              src={stream.image}
              alt={stream.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[hsl(var(--poster-green))]/10">
              <Radio className="h-10 w-10 text-[hsl(var(--poster-green))]/40" />
            </div>
          )}
          <span
            className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-slab text-[10px] font-bold uppercase tracking-[0.12em] ${badge.className}`}
          >
            <badge.Icon className={`h-3 w-3 ${live ? 'animate-pulse' : ''}`} />
            {badge.label}
          </span>
          {live && stream.currentParticipants !== undefined && (
            <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
              <Users className="h-3 w-3" />
              {stream.currentParticipants}
            </span>
          )}
        </div>

        <div className="space-y-2 p-4">
          <h3 className="line-clamp-2 font-serif text-lg font-bold leading-tight">{stream.title}</h3>
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={hostPic} alt={hostName} />
              <AvatarFallback className="text-[8px]">{hostName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{hostName}</span>
          </div>
          {stream.summary && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{stream.summary}</p>
          )}
        </div>
      </Card>
    </Link>
  );
}
