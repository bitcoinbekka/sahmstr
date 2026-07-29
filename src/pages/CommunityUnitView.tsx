import { useSeoMeta } from '@unhead/react';
import { Link } from 'react-router-dom';
import { nip19 } from 'nostr-tools';
import type { Event } from 'nostr-tools';
import Markdown from 'react-markdown';
import type { NostrEvent } from '@nostrify/nostrify';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { CommentsSection } from '@/components/comments/CommentsSection';
import { ZapButton } from '@/components/ZapButton';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { useCommunityUnit, SUBJECT_AREAS } from '@/hooks/useCommunityUnits';
import { ArrowLeft, Users, PenLine } from 'lucide-react';
import NotFound from './NotFound';

const SUBJECT_LABELS = new Map(SUBJECT_AREAS.map((s) => [s.value, s.label]));

interface CommunityUnitViewProps {
  pubkey: string;
  identifier: string;
}

/**
 * Renders a contributed unit (NIP-23 kind 30023 tagged `homeec`).
 * Reached via the NIP-19 route as an naddr.
 */
export function CommunityUnitView({ pubkey, identifier }: CommunityUnitViewProps) {
  const { data: unit, isLoading } = useCommunityUnit(pubkey, identifier);
  const author = useAuthor(pubkey);
  const metadata = author.data?.metadata;

  const displayName = metadata?.display_name || metadata?.name || genUserName(pubkey);

  useSeoMeta({
    title: unit ? `${unit.title} — SAHMstr` : 'Loading — SAHMstr',
    description: unit?.summary || undefined,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container max-w-3xl py-14 space-y-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Separator />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!unit) {
    return <NotFound />;
  }

  const npub = nip19.npubEncode(pubkey);
  const date = new Date(unit.publishedAt * 1000).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Header */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-primary/10 py-12">
          <div className="container max-w-3xl relative space-y-6">
            <Link
              to="/tips"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All units
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5 border-primary/40 text-primary">
                <Users className="h-3 w-3" />
                Contributed
              </Badge>
              {unit.subjects.map((s) => (
                <Badge key={s} variant="secondary">
                  {SUBJECT_LABELS.get(s) ?? s}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
              {unit.title}
            </h1>

            {unit.summary && (
              <p className="text-lg text-muted-foreground leading-relaxed">{unit.summary}</p>
            )}

            {/* Author */}
            <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
              <Link to={`/${npub}`} className="flex items-center gap-3 group">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={metadata?.picture} alt={displayName} />
                  <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">{date}</p>
                </div>
              </Link>

              {/* ZapButton takes a nostr-tools Event; NostrEvent is the same shape. */}
              <ZapButton target={unit.event as Event} />
            </div>
          </div>
        </section>

        {unit.image && (
          <div className="container max-w-3xl -mt-2">
            <img
              src={unit.image}
              alt=""
              className="w-full rounded-xl border aspect-[16/9] object-cover"
            />
          </div>
        )}

        {/* Body */}
        <section className="py-12 bg-background">
          <div className="container max-w-3xl">
            <article
              className="prose prose-neutral dark:prose-invert max-w-none
                prose-headings:font-serif prose-headings:font-bold
                prose-h1:text-3xl prose-h1:text-primary prose-h1:leading-snug
                prose-h2:text-xl prose-h2:uppercase prose-h2:tracking-wide
                prose-h2:text-muted-foreground prose-h2:font-semibold prose-h2:text-sm
                prose-p:leading-relaxed prose-p:text-[15px]
                prose-li:text-[15px] prose-li:leading-relaxed
                prose-a:text-primary prose-a:underline-offset-4"
            >
              <Markdown
                components={{
                  // Keep contributed content inert: no raw HTML, and links open safely.
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noreferrer nofollow ugc">
                      {children}
                    </a>
                  ),
                  img: ({ src, alt }) => (
                    <img src={typeof src === 'string' ? src : undefined} alt={alt ?? ''} loading="lazy" className="rounded-lg" />
                  ),
                }}
              >
                {unit.event.content}
              </Markdown>
            </article>

            <Separator className="my-10" />

            {/* Provenance of contributed material */}
            <Card className="border-2 bg-muted/30">
              <CardContent className="p-5 space-y-2">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This unit was contributed by a member of the community, not written by
                  SAHMstr. It is published as a long-form Nostr article signed by its author,
                  which means it belongs to her and can be read in any Nostr client.
                </p>
                <Link to="/contribute">
                  <Button variant="outline" size="sm" className="gap-2 rounded-full mt-1">
                    <PenLine className="h-3.5 w-3.5" />
                    Contribute your own
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Comments */}
        <section className="pb-16 bg-background">
          <div className="container max-w-3xl">
            <CommentsSection
              root={unit.event as NostrEvent}
              title="Discussion"
              emptyStateMessage="No comments yet"
              emptyStateSubtitle="Share what worked — or did not — in your household."
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
