import { useRef, useState } from 'react';
// `Lock` is avoided project-wide — see the note in Header.tsx.
import { ImagePlus, Loader2, ShieldCheck, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useUploadFile } from '@/hooks/useUploadFile';
import { usePublishStory } from '@/hooks/useCircleStories';
import { useCircle } from '@/hooks/useCircle';
import { useToast } from '@/hooks/useToast';
import { encryptFile } from '@/lib/circleCrypto';
import type { StoryMedia } from '@/lib/circleTypes';

/** Turn NIP-94 tags from the uploader into our media shape. */
function mediaFromTags(tags: string[][]): StoryMedia | null {
  const get = (k: string) => tags.find(([name]) => name === k)?.[1];
  const url = get('url');
  if (!url) return null;
  return {
    url,
    sha256: get('x') ?? get('ox'),
    dim: get('dim'),
    blurhash: get('blurhash'),
  };
}

/**
 * A local preview of an attachment.
 *
 * The uploaded blob is ciphertext, so it cannot be previewed directly — we keep
 * an object URL of the original bytes for the composer only.
 */
interface Attachment {
  media: StoryMedia;
  previewUrl: string;
  isVideo: boolean;
}

/**
 * Compose a private story.
 *
 * The composer is deliberately blunt about who will see the result — the whole
 * point of this feature is that the answer is short and known.
 */
export function StoryComposer() {
  const [caption, setCaption] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const { mutateAsync: uploadFile, isPending: uploading } = useUploadFile();
  const { mutateAsync: publishStory, isPending: publishing } = usePublishStory();
  const { data: members = [] } = useCircle();
  const { toast } = useToast();

  const isVideo = attachments.some((a) => a.isVideo);

  // Object URLs are process-wide; release them when the composer clears.
  const clearAttachments = () => {
    setAttachments((prev) => {
      for (const a of prev) URL.revokeObjectURL(a.previewUrl);
      return [];
    });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        // Encrypt before upload: the Blossom server stores bytes it cannot read.
        const encrypted = await encryptFile(file);
        const tags = await uploadFile(encrypted.file);
        const item = mediaFromTags(tags);

        if (item) {
          setAttachments((prev) => [
            ...prev,
            {
              media: {
                ...item,
                mimeType: encrypted.mimeType,
                decryptionKey: encrypted.key,
                decryptionNonce: encrypted.nonce,
              },
              previewUrl: URL.createObjectURL(file),
              isVideo: file.type.startsWith('video/'),
            },
          ]);
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

  const removeAttachment = (previewUrl: string) => {
    setAttachments((prev) => {
      const match = prev.find((a) => a.previewUrl === previewUrl);
      if (match) URL.revokeObjectURL(match.previewUrl);
      return prev.filter((a) => a.previewUrl !== previewUrl);
    });
  };

  const handleShare = async () => {
    try {
      const { recipients, withoutInbox } = await publishStory({
        caption,
        media: attachments.map((a) => a.media),
        isVideo,
      });

      setCaption('');
      clearAttachments();

      const others = recipients - 1;

      toast({
        title: 'Story shared privately',
        description:
          others <= 0
            ? 'Saved for you. Add people to your circle so they can see the next one.'
            : withoutInbox > 0
              ? `Sent to ${others} ${others === 1 ? 'person' : 'people'}. ${withoutInbox} of them has not listed inbox relays, so delivery is not guaranteed.`
              : `Delivered to ${others} ${others === 1 ? 'person' : 'people'} in your circle, encrypted.`,
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
          <ShieldCheck className="h-4 w-4 text-[hsl(var(--poster-green))] dark:text-[hsl(var(--poster-ochre))]" />
          <h2 className="font-serif text-xl font-bold">Share with your circle</h2>
        </div>

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="What happened today?"
          rows={3}
          className="resize-none rounded-sm text-base"
        />

        {/* Attachments — previewed from the original bytes, since the uploaded
            blob is ciphertext and cannot be rendered directly. */}
        {attachments.length > 0 && (
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {attachments.map((item, i) => (
              <li key={item.previewUrl} className="relative">
                <div className="aspect-square overflow-hidden rounded-sm border-2 bg-muted">
                  {item.isVideo ? (
                    <video
                      src={item.previewUrl}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.previewUrl}
                      alt={`Attachment ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(item.previewUrl)}
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
              disabled={publishing || uploading || attachments.length === 0}
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
          Files are encrypted on this device before upload, so the media host stores bytes it
          cannot read. The event itself is encrypted per person and sent under one-time keys, so
          relays cannot see the photo, the caption, your name, or who received it.{' '}
          <strong className="font-medium text-foreground">
            Anyone in your circle could still save or forward what you send them
          </strong>{' '}
          — privacy here is about the network, not about trust.
        </p>
      </CardContent>
    </Card>
  );
}
