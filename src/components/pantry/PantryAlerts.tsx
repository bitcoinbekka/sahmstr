import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { usePantry } from '@/hooks/usePantry';
import { expiryStatus } from '@/lib/pantryTypes';

/**
 * A gentle nudge at the top of the pantry: what is past its best, and what to
 * use soon. Silent when there is nothing to say.
 */
export function PantryAlerts() {
  const { data: items = [] } = usePantry();

  const expired = items.filter((i) => expiryStatus(i) === 'expired');
  const soon = items.filter((i) => expiryStatus(i) === 'soon');

  if (expired.length === 0 && soon.length === 0) return null;

  return (
    <Card className="rounded-sm border-2 border-[hsl(var(--poster-ochre))]/50 bg-[hsl(var(--poster-ochre))]/10">
      <CardContent className="space-y-3 p-5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-[hsl(var(--poster-ochre))]" />
          <h3 className="font-serif text-lg font-bold">On your mind</h3>
        </div>

        {expired.length > 0 && (
          <p className="text-sm leading-relaxed">
            <span className="font-semibold text-[hsl(var(--poster-oxblood))]">
              Past its best:
            </span>{' '}
            {expired.map((i) => i.name).join(', ')}. Check before using, or make room
            on the shelf.
          </p>
        )}

        {soon.length > 0 && (
          <p className="text-sm leading-relaxed">
            <span className="font-semibold">Use soon:</span>{' '}
            {soon.map((i) => i.name).join(', ')}. Good candidates for this week's
            meals.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
