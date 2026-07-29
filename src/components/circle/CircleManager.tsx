import { useState } from 'react';
import { nip19 } from 'nostr-tools';
import { UserPlus, X, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import {
  useCircle,
  useCircleActions,
  useInboxRelayList,
  usePublishInboxRelays,
} from '@/hooks/useCircle';
import { useToast } from '@/hooks/useToast';
import type { CircleMember } from '@/lib/circleTypes';

/**
 * Without a NIP-17 inbox list, other people's clients have nowhere specific to
 * deliver stories to us, and they may never arrive. Surface that rather than
 * letting it fail silently.
 *
 * Exported so the stories tab can show it too — a household that cannot receive
 * is just as broken as one that cannot send, and the fix is the same.
 */
export function InboxRelayNotice() {
  const { data: relays, isLoading } = useInboxRelayList();
  const { mutateAsync: publish, isPending } = usePublishInboxRelays();
  const { toast } = useToast();

  if (isLoading || (relays && relays.length > 0)) return null;

  const handlePublish = async () => {
    try {
      const published = await publish();
      toast({
        title: 'Inbox relays published',
        description: `Family can now deliver stories to you via ${published.length} ${published.length === 1 ? 'relay' : 'relays'}.`,
      });
    } catch (err) {
      toast({
        title: 'Could not publish your inbox relays',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="rounded-sm border-2 border-[hsl(var(--poster-ochre))]/50 bg-[hsl(var(--poster-ochre))]/10">
      <CardContent className="space-y-4 p-5">
        <div className="space-y-1.5">
          <h3 className="font-serif text-lg font-bold">
            One step so stories can reach you
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You have not told the network where to deliver your private mail. Until you do,
            stories shared with you may not arrive. This publishes a short list of your relays —
            it reveals nothing about your circle.
          </p>
        </div>
        <Button
          onClick={handlePublish}
          disabled={isPending}
          className="gap-2 rounded-sm"
          size="sm"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Publish my inbox relays
        </Button>
      </CardContent>
    </Card>
  );
}

/** One row in the circle roster. */
function MemberRow({
  member,
  onRemove,
  removing,
}: {
  member: CircleMember;
  onRemove: (pubkey: string) => void;
  removing: boolean;
}) {
  const author = useAuthor(member.pubkey);
  const metadata = author.data?.metadata;
  const name =
    member.petname ||
    metadata?.display_name ||
    metadata?.name ||
    genUserName(member.pubkey);

  return (
    <li className="flex items-center gap-3 rounded-sm border-2 bg-card px-3 py-2.5">
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarImage src={metadata?.picture} alt={name} />
        <AvatarFallback className="text-xs">
          {name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="truncate font-mono text-[11px] text-muted-foreground">
          {nip19.npubEncode(member.pubkey).slice(0, 20)}…
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(member.pubkey)}
        disabled={removing}
        aria-label={`Remove ${name} from your circle`}
      >
        {removing ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
      </Button>
    </li>
  );
}

/**
 * The roster of people allowed to see this household's private stories.
 *
 * The list is published as an encrypted NIP-51 set, so it is readable only by
 * its owner — the relay stores an opaque blob.
 */
export function CircleManager() {
  const { data: members = [], isLoading } = useCircle();
  const { addMember, removeMember } = useCircleActions();
  const { toast } = useToast();

  const [input, setInput] = useState('');
  const [petname, setPetname] = useState('');
  const [pendingRemoval, setPendingRemoval] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = input.trim();
    if (!trimmed) return;

    // Accept npub, nprofile, or raw hex — whatever the user has to hand.
    let pubkey: string | null = null;

    if (/^[0-9a-f]{64}$/i.test(trimmed)) {
      pubkey = trimmed.toLowerCase();
    } else {
      try {
        const decoded = nip19.decode(trimmed.replace(/^nostr:/, ''));
        if (decoded.type === 'npub') pubkey = decoded.data;
        else if (decoded.type === 'nprofile') pubkey = decoded.data.pubkey;
      } catch {
        pubkey = null;
      }
    }

    if (!pubkey) {
      toast({
        title: 'That does not look like a Nostr key',
        description: 'Paste an npub, an nprofile, or a 64-character hex pubkey.',
        variant: 'destructive',
      });
      return;
    }

    if (members.some((m) => m.pubkey === pubkey)) {
      toast({
        title: 'Already in your circle',
        description: 'That person can already see your private stories.',
      });
      return;
    }

    try {
      await addMember.mutateAsync({ pubkey, petname: petname.trim() || undefined });
      setInput('');
      setPetname('');
      toast({
        title: 'Added to your circle',
        description: 'They will see stories you share from now on.',
      });
    } catch (err) {
      toast({
        title: 'Could not update your circle',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRemove = async (pubkey: string) => {
    setPendingRemoval(pubkey);
    try {
      await removeMember.mutateAsync(pubkey);
      toast({
        title: 'Removed from your circle',
        description: 'They will not see stories you share from now on.',
      });
    } catch (err) {
      toast({
        title: 'Could not update your circle',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setPendingRemoval(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-sm border-2">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--poster-green))] dark:text-[hsl(var(--poster-ochre))]" />
            <div className="space-y-1">
              <h2 className="font-serif text-xl font-bold">Who is in your circle</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Only these people can open the stories you share here. The list itself is
                encrypted before it leaves your device — relays store it, but cannot read it,
                and neither can we.
              </p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="circle-key" className="font-slab text-[11px] uppercase tracking-[0.12em]">
                Their Nostr key
              </Label>
              <Input
                id="circle-key"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="npub1… or nprofile1…"
                className="rounded-sm font-mono text-sm"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="circle-petname" className="font-slab text-[11px] uppercase tracking-[0.12em]">
                What you call them <span className="normal-case tracking-normal opacity-60">(optional)</span>
              </Label>
              <Input
                id="circle-petname"
                value={petname}
                onChange={(e) => setPetname(e.target.value)}
                placeholder="Mum, Aunt Rose, Sarah from church…"
                className="rounded-sm"
                autoComplete="off"
              />
            </div>

            <Button
              type="submit"
              className="w-full gap-2 rounded-sm sm:w-auto"
              disabled={addMember.isPending || !input.trim()}
            >
              {addMember.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              Add to circle
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="font-slab text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {isLoading ? 'Loading your circle…' : `${members.length} in your circle`}
        </h3>

        {isLoading ? (
          <ul className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <li key={i} className="h-[58px] animate-pulse rounded-sm border-2 bg-muted/40" />
            ))}
          </ul>
        ) : members.length === 0 ? (
          <Card className="rounded-sm border-2 border-dashed">
            <CardContent className="px-8 py-10 text-center">
              <p className="mx-auto max-w-sm leading-relaxed text-muted-foreground">
                Your circle is empty, so a story shared now would go only to you. Add your
                mother, your sister, a friend — anyone whose npub you have.
              </p>
            </CardContent>
          </Card>
        ) : (
          <ul className="space-y-2">
            {members.map((member) => (
              <MemberRow
                key={member.pubkey}
                member={member}
                onRemove={handleRemove}
                removing={pendingRemoval === member.pubkey}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
