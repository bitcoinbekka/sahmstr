import { cn } from '@/lib/utils';
import type { Poster } from '@/lib/homeEc/posters';

interface PosterFrameProps {
  poster: Poster;
  /** Constrain to the poster aspect ratio (they are all portrait). */
  ratio?: 'portrait' | 'wide' | 'auto';
  className?: string;
  /** Slight rotation, as if pinned to a wall. */
  tilt?: 'left' | 'right' | 'none';
  priority?: boolean;
}

const RATIOS: Record<NonNullable<PosterFrameProps['ratio']>, string> = {
  portrait: 'aspect-[3/4]',
  wide: 'aspect-[16/10]',
  auto: '',
};

const TILTS: Record<NonNullable<PosterFrameProps['tilt']>, string> = {
  left: '-rotate-1',
  right: 'rotate-1',
  none: '',
};

/**
 * A framed print. Cream mount, hairline rule, soft shadow — the poster should
 * read as a physical object on the page rather than a background image.
 */
export function PosterFrame({
  poster,
  ratio = 'portrait',
  className,
  tilt = 'none',
  priority = false,
}: PosterFrameProps) {
  return (
    <div
      className={cn(
        'poster-frame transition-transform duration-500 ease-out',
        TILTS[tilt],
        className,
      )}
    >
      <div className={cn('overflow-hidden rounded-sm bg-muted', RATIOS[ratio])}>
        <img
          src={poster.url}
          alt={poster.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
