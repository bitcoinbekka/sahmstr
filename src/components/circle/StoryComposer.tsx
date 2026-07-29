import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Lock, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useUploadFile } from '@/hooks/useUploadFile';
import { usePublishStory } from '@/hooks/useCircleStories';
import { useCircle } from '@/hooks/useCircle';
import { useToast } from '@/hooks/useToast';
import type { StoryMedia } from '@/lib/circleTypes';

/** Turn NIP-94 tags from the uploader into our media shape. */
function mediaFromTags(tags: string[][]): StoryMedia | null {
  const get = (k: string) => tags.find(([name]) => name === k)?.[1];
  const url = get('url');
  if (!url) return null;
  return {
    url,
    mimeType: get('m'),
    sha256: get('x') ?? get('ox'),
    dim: get('dim'),
    blurhash: get('blurhash'),
  };
}

/**
 * Compose a private story.
 *
 * The composer is deliberately blunt about who will see the result — the whole
 * point of this feature is that the answer is short and known.
 */
export function StoryComposer() {
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState<StoryMedia[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const { mutateAsync: uploadFile, isPending: uploading } = useUploadFile();
  const { mutateAsync: publishStory, isPending: publishing } = usePublishStory();
  const { data: members = [] } = useCircle();
  const { toast } = useToast();

  const isVideo = media.some((m) => m.mimeType?.startsWith('video/'));

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        const tags = await uploadFile(file);
        const item = mediaFromTags(tags);
        if (item) {
          // Blossom does not always report the MIME type back; trust the File.
          setMedia((prev) => [...prev, { ...item, mimeType: item.mimeType ?? file.type }]);
        }
      } catch (err) {
        toast({
          title: `Could not upload ${file.name}`,
          description: err instanceof Error ? err.message : 'Please try again.',
          variant: 'destructive',
        });
      }
    }

    if (fileInput.current) fileInput.current.value = '';
  };

  const handleShare = async () => {
    try {
      const { recipients } = await publishStory({ caption, media, isVideo });
      setCaption('');
      setMedia([]);
      toast({
        title: 'Story shared privately',
        description:
          recipients <= 1
            ? 'Saved for you. Add people to your circle so they can see the next one.'
            : `Delivered to ${recipients - 1} ${recipients - 1 === 1 ? 'person' : 'people'} in your circle, encrypted.`,
      });
    } catch (err) {
      toast({
        title: 'Could not share that story',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="overflow-hidden rounded-sm border-2">
      <div className="h-1.5 bg-gradient-to-r from-[hsl(var(--poster-green))] via-[hsl(var(--poster-sage))] to-[hsl(var(--poster-ochre))]" />
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-[hsl(var(--poster-green))] dark:text-[hsl(var(--poster-ochre))]" />
          <h2 className="font-serif text-xl font-bold">Share with your circle</h2>
        </div>

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="What happened today?"
          rows={3}
          className="resize-none rounded-sm text-base"
        />

        {/* Attachments */}
        {media.length > 0 && (
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {media.map((item, i) => (
              <li key={item.url} className="relative">
                <div className="aspect-square overflow-hidden rounded-sm border-2 bg-muted">
                  {item.mimeType?.startsWith('video/') ? (
                    <video
                      src={item.url}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={`Attachment ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setMedia((prev) => prev.filter((m) => m.url !== item.url))}
                  className="absolute -right-2 -top-2 rounded-full bg-background p-1 shadow-md ring-1 ring-border transition-colors hover:text-destructive"
                  aria-label={`Remove attachment ${i + 1}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <input
          ref={fileInput}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            className="gap-2 rounded-sm border-2"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
            {uploading ? 'Uploading…' : 'Add photos or video'}
          </Button>

          <div className="flex items-center gap-3">
            <span className="font-slab text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {members.length === 0
                ? 'Only you'
                : `${members.length} ${members.length === 1 ? 'person' : 'people'}`}
            </span>
            <Button
              type="button"
              className="gap-2 rounded-sm"
              onClick={handleShare}
              disabled={publishing || uploading || media.length === 0}
            >
              {publishing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Share privately
            </Button>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Encrypted for each person individually and sent under one-time keys. Relays cannot see
          the photo, the caption, your name, or who received it.{' '}
          <strong className="font-medium text-foreground">
            Anyone in your circle could still save or forward what you send them
          </strong>{' '}
          — privacy here is about the network, not about trust.
        </p>
      </CardContent>
    </Card>
  );
}
