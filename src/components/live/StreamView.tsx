import { Radio, CheckCircle2, Loader2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HlsPlayer } from '@/components/live/HlsPlayer';
import { LiveChat } from '@/components/live/LiveChat';
import { useAuthor } from '@/hooks/useAuthor';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { usePublishStream } from '@/hooks/usePublishStream';
import { useToast } from '@/hooks/useToast';
import { genUserName } from '@/lib/genUserName';
import { chatAllowlist } from '@/hooks/useStreamChat';
import { isEffectivelyLive, type Stream } from '@/lib/streamTypes';

/** The watch page: player (or offline state) + host controls + live chat. */
export function StreamView({ stream }: { stream: Stream }) {
  const { user } = useCurrentUser();
  const { toast } = useToast();
  const { mutateAsync: publishStream, isPending: ending } = usePublishStream();

  const author = useAuthor(stream.pubkey);
  const hostName = author.data?.metadata?.name ?? genUserName(stream.pubkey);
  const hostPic = author.data?.metadata?.picture;

  const isHost = user?.pubkey === stream.pubkey;
  const live = isEffectivelyLive(stream);

  const handleEnd = async () => {
    try {
      const allow = chatAllowlist(stream);
      await publishStream({
        identifier: stream.identifier,
        title: stream.title,
        summary: stream.summary,
        image: stream.image,
        streaming: stream.streaming,
        recording: stream.recording,
        status: 'ended',
        ends: Math.floor(Date.now() / 1000),
        hashtags: stream.hashtags,
        chatAllowlist: allow ? Array.from(allow).filter((pk) => pk !== stream.pubkey) : undefined,
      });
      toast({ title: 'Stream ended', description: 'Your stream is no longer listed as live.' });
    } catch (err) {
      toast({
        title: 'Could not end the stream',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Player + meta */}
      <div className="space-y-4 lg:col-span-2">
        {stream.streaming ? (
          <HlsPlayer src={stream.streaming} poster={stream.image} />
        ) : (
          <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-sm border-2 border-dashed bg-muted/40 text-center">
            <Clock className="h-9 w-9 text-muted-foreground/50" />
            <p className="max-w-xs text-sm text-muted-foreground">
              This stream is planned but the video hasn't started yet. Chat is open below.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {live ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 font-slab text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                  <Radio className="h-3 w-3 animate-pulse" />
                  Live
                </span>
              ) : stream.status === 'ended' ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-slab text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3" />
                  Ended
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--poster-ochre))] px-2.5 py-1 font-slab text-[10px] font-bold uppercase tracking-[0.12em] text-[hsl(var(--poster-ink))]">
                  <Clock className="h-3 w-3" />
                  Planned
                </span>
              )}
            </div>
            <h1 className="font-serif text-2xl font-bold leading-tight md:text-3xl">{stream.title}</h1>
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={hostPic} alt={hostName} />
                <AvatarFallback className="text-[10px]">{hostName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{hostName}</span>
            </div>
          </div>

          {isHost && stream.status !== 'ended' && (
            <Button
              type="button"
              variant="outline"
              className="gap-2 rounded-sm border-2"
              onClick={handleEnd}
              disabled={ending}
            >
              {ending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              End stream
            </Button>
          )}
        </div>

        {stream.summary && (
          <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{stream.summary}</p>
        )}
      </div>

      {/* Chat */}
      <div className="h-[70vh] min-h-[24rem] lg:col-span-1">
        <LiveChat stream={stream} />
      </div>
    </div>
  );
}
