import { useEffect, useMemo, useRef, useState } from 'react';
import { Send, Loader2, MessageSquare, ShieldCheck, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuthor } from '@/hooks/useAuthor';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useToast } from '@/hooks/useToast';
import { genUserName } from '@/lib/genUserName';
import {
  useStreamChat,
  useSendChatMessage,
  chatAllowlist,
  type ChatMessage,
} from '@/hooks/useStreamChat';
import type { Stream } from '@/lib/streamTypes';
import { cn } from '@/lib/utils';

function ChatRow({ message, dimmed }: { message: ChatMessage; dimmed: boolean }) {
  const author = useAuthor(message.pubkey);
  const name = author.data?.metadata?.name ?? genUserName(message.pubkey);
  const picture = author.data?.metadata?.picture;

  return (
    <div className={cn('flex items-start gap-2.5 px-1 py-1.5', dimmed && 'opacity-40')}>
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarImage src={picture} alt={name} />
        <AvatarFallback className="text-[10px]">{name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <span className="mr-2 font-slab text-xs font-bold text-[hsl(var(--poster-terracotta))]">
          {name}
        </span>
        <span className="break-words text-sm text-foreground">{message.content}</span>
      </div>
    </div>
  );
}

/**
 * Live chat panel for a stream (NIP-53 kind:1311).
 *
 * If the host set a whitelist, off-list messages are hidden by default, and the
 * host gets a toggle to reveal them (for moderation). This is a display policy;
 * a truly locked room is enforced by the host's relay write policy.
 */
export function LiveChat({ stream }: { stream: Stream }) {
  const { user } = useCurrentUser();
  const { toast } = useToast();
  const { data: messages = [], isLoading } = useStreamChat(stream);
  const { mutateAsync: send, isPending: sending } = useSendChatMessage(stream);
  const [draft, setDraft] = useState('');
  const [showOffList, setShowOffList] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allow = useMemo(() => chatAllowlist(stream), [stream]);
  const isHost = user?.pubkey === stream.pubkey;
  const isRestricted = allow !== null;
  // Can the current user chat under the display policy?
  const canChat = Boolean(user) && (!isRestricted || (user ? allow!.has(user.pubkey) : false));

  const visible = useMemo(
    () => messages.filter((m) => !m.offAllowlist || showOffList),
    [messages, showOffList],
  );

  // Keep the newest message in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visible.length]);

  const handleSend = async () => {
    if (!draft.trim()) return;
    try {
      await send(draft);
      setDraft('');
    } catch (err) {
      toast({
        title: 'Could not send message',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex h-full flex-col rounded-sm border-2 bg-card">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-serif text-base font-bold">Live chat</h3>
          {isRestricted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--poster-green))]/10 px-2 py-0.5 font-slab text-[9px] font-bold uppercase tracking-[0.14em] text-[hsl(var(--poster-green))] dark:text-[hsl(var(--poster-ochre))]">
              <ShieldCheck className="h-2.5 w-2.5" />
              Members only
            </span>
          )}
        </div>
        {isHost && isRestricted && (
          <div className="flex items-center gap-1.5">
            <Switch
              id="show-off-list"
              checked={showOffList}
              onCheckedChange={setShowOffList}
              className="scale-75"
            />
            <Label htmlFor="show-off-list" className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <EyeOff className="h-3 w-3" />
              Show hidden
            </Label>
          </div>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="space-y-0.5 p-3">
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading chat…</p>
          ) : visible.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No messages yet. Say hello!
            </p>
          ) : (
            visible.map((m) => (
              <ChatRow key={m.event.id} message={m} dimmed={m.offAllowlist} />
            ))
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="border-t p-3">
        {!user ? (
          <p className="text-center text-xs text-muted-foreground">Log in to join the chat.</p>
        ) : isRestricted && !canChat ? (
          <p className="text-center text-xs text-muted-foreground">
            This is a members-only chat. Ask the host to add you.
          </p>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Send a message…"
              className="rounded-sm"
              maxLength={500}
            />
            <Button
              type="button"
              size="icon"
              className="shrink-0 rounded-sm"
              onClick={handleSend}
              disabled={sending || !draft.trim()}
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
