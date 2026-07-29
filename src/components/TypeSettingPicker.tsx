import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTypeSetting } from '@/hooks/useTypeSetting';
import { TYPE_SETTING_LIST } from '@/lib/typeSettings';

/**
 * The type specimen sheet.
 *
 * Rather than listing font names, each option prints its own name in its own
 * display face at poster size, with a line of its body face beneath — so the
 * choice is made by eye. Selecting one restyles the entire site immediately.
 */
export function TypeSettingPicker() {
  const { settingId, setSetting } = useTypeSetting();

  return (
    <div className="space-y-3">
      {TYPE_SETTING_LIST.map((setting) => {
        const active = setting.id === settingId;

        return (
          <button
            key={setting.id}
            type="button"
            onClick={() => setSetting(setting.id)}
            aria-pressed={active}
            className={cn(
              'group relative w-full overflow-hidden rounded-sm border-2 p-5 text-left transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              active
                ? 'border-primary bg-primary/[0.06] shadow-sm'
                : 'border-border bg-card hover:border-primary/40 hover:bg-accent/40',
            )}
          >
            {/* Ink rule down the edge marks the active setting */}
            <span
              aria-hidden
              className={cn(
                'absolute inset-y-0 left-0 w-1 transition-colors',
                active ? 'bg-[hsl(var(--poster-ochre))]' : 'bg-transparent',
              )}
            />

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-2">
                {/* The name, printed in its own display face */}
                <div
                  className="text-3xl leading-none md:text-4xl"
                  style={{
                    fontFamily: setting.display,
                    fontWeight: setting.displayWeight,
                    letterSpacing: setting.displayTracking,
                  }}
                >
                  {setting.name}
                </div>

                <div className="font-slab text-[10px] font-bold uppercase tracking-[0.16em] text-[hsl(var(--poster-terracotta))]">
                  {setting.era}
                </div>

                {/* A line of the body face, so the pairing can be judged */}
                <p
                  className="pt-1 text-[15px] leading-relaxed text-muted-foreground"
                  style={{ fontFamily: setting.body }}
                >
                  {setting.note}
                </p>
              </div>

              <span
                className={cn(
                  'mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-transparent group-hover:border-primary/40',
                )}
              >
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
