import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Loader2, VideoOff } from 'lucide-react';

interface HlsPlayerProps {
  /** HLS (.m3u8) stream URL. */
  src: string;
  poster?: string;
  className?: string;
}

/**
 * An HLS video player.
 *
 * Safari plays HLS natively; everywhere else we use hls.js. NIP-53 streams are
 * always HLS, so this is the one player the Live section needs. It reports a
 * clear "stream is offline" state rather than a silent black box when the feed
 * is not (yet) reachable.
 */
export function HlsPlayer({ src, poster, className }: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setState('loading');

    // Native HLS (Safari / iOS).
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      const onLoaded = () => setState('ready');
      const onError = () => setState('error');
      video.addEventListener('loadeddata', onLoaded);
      video.addEventListener('error', onError);
      return () => {
        video.removeEventListener('loadeddata', onLoaded);
        video.removeEventListener('error', onError);
      };
    }

    // hls.js everywhere else.
    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => setState('ready'));
      hls.on(Hls.Events.ERROR, (_evt, data) => {
        if (data.fatal) setState('error');
      });
      return () => hls.destroy();
    }

    setState('error');
  }, [src]);

  return (
    <div className={`relative aspect-video overflow-hidden rounded-sm bg-black ${className ?? ''}`}>
      <video
        ref={videoRef}
        controls
        playsInline
        poster={poster}
        className="h-full w-full"
      />

      {state === 'loading' && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 text-white">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {state === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 px-6 text-center text-white/90">
          <VideoOff className="h-8 w-8" />
          <p className="text-sm">
            This stream is offline right now. Check back when the host goes live.
          </p>
        </div>
      )}
    </div>
  );
}
