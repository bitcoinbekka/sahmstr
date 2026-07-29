import { useEffect, useState } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';
import { decryptToBlobUrl } from '@/lib/circleCrypto';
import { isEncryptedMedia, type StoryMedia } from '@/lib/circleTypes';

interface EncryptedMediaProps {
  media: StoryMedia;
  alt: string;
  /** Video attachments render a player rather than an image. */
  isVideo: boolean;
}

/**
 * Render one Circle attachment, decrypting it first when necessary.
 *
 * Circle media is uploaded as ciphertext, so it cannot be handed straight to an
 * `<img src>`. We fetch, decrypt with the key carried inside the gift wrap, and
 * render from a blob URL — which is revoked on unmount so long feeds do not leak
 * memory.
 */
export function EncryptedMedia({ media, alt, isVideo }: EncryptedMediaProps) {
  const encrypted = isEncryptedMedia(media);

  const [src, setSrc] = useState<string | null>(encrypted ? null : media.url);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!encrypted) {
      setSrc(media.url);
      return;
    }

    let objectUrl: string | null = null;
    let cancelled = false;

    setSrc(null);
    setFailed(false);

    decryptToBlobUrl(
      media.url,
      media.decryptionKey!,
      media.decryptionNonce!,
      media.mimeType || 'application/octet-stream',
    )
      .then((url) => {
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        objectUrl = url;
        setSrc(url);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [
    encrypted,
    media.url,
    media.decryptionKey,
    media.decryptionNonce,
    media.mimeType,
  ]);

  if (failed) {
    return (
      <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 bg-muted px-6 text-center">
        <ImageOff className="h-7 w-7 text-muted-foreground/50" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          This attachment could not be opened. The file may have expired from the media host.
        </p>
      </div>
    );
  }

  if (!src) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center bg-muted">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/60" />
      </div>
    );
  }

  if (isVideo) {
    return (
      <video
        src={src}
        controls
        playsInline
        preload="metadata"
        className="max-h-[70vh] w-full bg-black object-contain"
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="max-h-[70vh] w-full object-cover"
    />
  );
}
