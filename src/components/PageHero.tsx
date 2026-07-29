import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PosterFrame } from '@/components/PosterFrame';
import type { Poster } from '@/lib/homeEc/posters';

interface PageHeroProps {
  /** Small caps line above the title — the section's place in the series. */
  eyebrow: string;
  title: string;
  lede: string;
  icon?: LucideIcon;
  /** The plate to hang beside the title. Omit for a text-only title page. */
  poster?: Poster;
  /** Caption printed under the plate. */
  plateCaption?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * The standing title page for a section.
 *
 * Every section of the site opens the same way: ruled paper ground, a small-caps
 * eyebrow, a display-serif title, and — where the series has one — a framed
 * plate hung to the side. Consistency here is what makes the whole thing read as
 * one printed volume rather than a set of unrelated screens.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  icon: Icon,
  poster,
  plateCaption,
  children,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden border-b bg-[hsl(var(--poster-cream))] paper-grain py-14 md:py-16 dark:bg-background',
        className,
      )}
    >
      {/* Feint horizontal ruling, as on the page of a workbook */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.1]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, hsl(var(--poster-ink)) 0 1px, transparent 1px 44px)',
        }}
      />

      {/* Goldenrod rule closing the title page, as at the foot of a plate */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[3px] bg-[hsl(var(--poster-ochre))]/70"
      />

      <div className="container relative">
        <div
          className={cn(
            'gap-10 md:gap-14',
            poster ? 'grid grid-cols-1 md:grid-cols-12 md:items-center' : '',
          )}
        >
          <div
            className={cn(
              'space-y-5',
              poster ? 'md:col-span-8' : 'mx-auto max-w-3xl text-center',
            )}
          >
            <div
              className={cn(
                'flex items-center gap-3',
                poster ? '' : 'justify-center',
              )}
            >
              <span className="h-px w-8 bg-[hsl(var(--poster-terracotta))]" />
              <span className="font-slab text-[11px] font-bold uppercase tracking-[0.22em] text-[hsl(var(--poster-terracotta))]">
                {Icon && <Icon className="mr-1.5 inline h-3.5 w-3.5" />}
                {eyebrow}
              </span>
              {!poster && <span className="h-px w-8 bg-[hsl(var(--poster-terracotta))]" />}
            </div>

            <h1 className="poster-title text-4xl leading-[1.02] md:text-6xl">{title}</h1>

            <p
              className={cn(
                'text-lg leading-relaxed text-muted-foreground md:text-xl',
                poster ? 'max-w-2xl' : 'mx-auto max-w-2xl',
              )}
            >
              {lede}
            </p>

            {children && <div className="pt-2">{children}</div>}
          </div>

          {poster && (
            <div className="md:col-span-4">
              <div className="mx-auto max-w-[15rem] md:max-w-none">
                <PosterFrame poster={poster} ratio="portrait" tilt="right" priority />
                {plateCaption && (
                  <p className="mt-3 text-center font-slab text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {plateCaption}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
