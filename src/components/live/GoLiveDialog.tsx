import { useState } from 'react';
import { nip19 } from 'nostr-tools';
import { Radio, Loader2, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/useToast';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { usePublishStream } from '@/hooks/usePublishStream';

/** Turn a whitelist textarea (npubs or hex, any separators) into hex pubkeys. */
function parseAllowlist(raw: string): string[] {
  return raw
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) => {
      if (entry.startsWith('npub1')) {
        try {
          const decoded = nip19.decode(entry);
          if (decoded.type === 'npub') return decoded.data;
        } catch {
          return null;
        }
      }
      return /^[0-9a-f]{64}$/i.test(entry) ? entry.toLowerCase() : null;
    })
    .filter((v): v is string => v !== null);
}

/**
 * The host's "go live" form. Publishes a NIP-53 kind:30311 event pointing at an
 * HLS URL from their streaming server, optionally restricting chat to a
 * whitelist. Editing later reuses the same identifier so it replaces cleanly.
 */
export function GoLiveDialog({ onCreated }: { onCreated?: (naddr: string) => void }) {
  const { user } = useCurrentUser();
  const { toast } = useToast();
  const { mutateAsync: publishStream, isPending } = usePublishStream();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [streaming, setStreaming] = useState('');
  const [image, setImage] = useState('');
  const [restrictChat, setRestrictChat] = useState(false);
  const [allowlist, setAllowlist] = useState('');

  const handleGoLive = async () => {
    if (!user) return;
    if (!title.trim()) {
      toast({ title: 'Give your stream a title.', variant: 'destructive' });
      return;
    }

    try {
      const identifier = `sahmstr-${Date.now()}`;
      await publishStream({
        identifier,
        title: title.trim(),
        summary: summary.trim() || undefined,
        streaming: streaming.trim() || undefined,
        image: image.trim() || undefined,
        status: 'live',
        chatAllowlist: restrictChat ? parseAllowlist(allowlist) : undefined,
      });

      const naddr = nip19.naddrEncode({
        kind: 30311,
        pubkey: user.pubkey,
        identifier,
      });

      toast({
        title: "You're live",
        description: 'Your stream is now listed for your community.',
      });
      setOpen(false);
      setTitle('');
      setSummary('');
      setStreaming('');
      setImage('');
      setRestrictChat(false);
      setAllowlist('');
      onCreated?.(naddr);
    } catch (err) {
      toast({
        title: 'Could not start the stream',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-sm">
          <Radio className="h-4 w-4" />
          Go live
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Start a live stream</DialogTitle>
          <DialogDescription>
            Cook, bake, or gather in real time. Your stream is listed for your community and shows
            up in other Nostr live apps too.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="stream-title">Title</Label>
            <Input
              id="stream-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sunday sourdough, start to finish"
              className="rounded-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stream-summary">What's it about? (optional)</Label>
            <Textarea
              id="stream-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="A slow bake with plenty of time for questions."
              rows={2}
              className="resize-none rounded-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stream-url">Stream URL (HLS .m3u8)</Label>
            <Input
              id="stream-url"
              value={streaming}
              onChange={(e) => setStreaming(e.target.value)}
              placeholder="https://your-server.com/live/stream.m3u8"
              className="rounded-sm font-mono text-xs"
            />
            <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-3 w-3 shrink-0" />
              This is the HLS link from your streaming server (or a service like zap.stream).
              You can add it later — the stream lists as “planned” until then.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stream-image">Cover image URL (optional)</Label>
            <Input
              id="stream-image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://…/cover.jpg"
              className="rounded-sm font-mono text-xs"
            />
          </div>

          <div className="space-y-3 rounded-sm border-2 border-dashed p-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="restrict-chat" className="font-medium">
                Members-only chat
              </Label>
              <Switch id="restrict-chat" checked={restrictChat} onCheckedChange={setRestrictChat} />
            </div>
            <p className="text-xs text-muted-foreground">
              Anyone can watch, but only people you list can chat. Leave off for open chat.
            </p>
            {restrictChat && (
              <Textarea
                value={allowlist}
                onChange={(e) => setAllowlist(e.target.value)}
                placeholder="Paste npubs (or hex pubkeys), one per line."
                rows={3}
                className="resize-none rounded-sm font-mono text-xs"
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            className="w-full gap-2 rounded-sm sm:w-auto"
            onClick={handleGoLive}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Radio className="h-4 w-4" />}
            Go live
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
