import { Trash2, Loader2, Minus, Plus, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePantry, usePantryActions } from '@/hooks/usePantry';
import {
  PANTRY_LOCATIONS,
  expiryStatus,
  type PantryItem,
  type PantryLocation,
} from '@/lib/pantryTypes';
import { cn } from '@/lib/utils';

/** A short, human date like "12 Aug 2026". */
function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function ExpiryBadge({ item }: { item: PantryItem }) {
  const status = expiryStatus(item);
  if (status === 'none' || status === 'ok') {
    return item.bestBy ? (
      <span className="font-slab text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        Best by {formatDate(item.bestBy)}
      </span>
    ) : null;
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-sm border font-slab text-[10px] uppercase tracking-[0.1em]',
        status === 'expired'
          ? 'border-[hsl(var(--poster-oxblood))] text-[hsl(var(--poster-oxblood))]'
          : 'border-[hsl(var(--poster-ochre))] text-[hsl(var(--poster-ochre))]',
      )}
    >
      {status === 'expired' ? 'Past best' : 'Use soon'}
      {item.bestBy ? ` · ${formatDate(item.bestBy)}` : ''}
    </Badge>
  );
}

function ItemRow({ item }: { item: PantryItem }) {
  const { updateItem, removeItem } = usePantryActions();
  const isPreserve = item.kind === 'preserve';

  const changeQty = (delta: number) => {
    const next = Math.max(0, item.quantity + delta);
    updateItem.mutate({ id: item.id, updates: { quantity: next } });
  };

  return (
    <li className="flex items-start gap-3 rounded-sm border-2 bg-card px-3 py-2.5">
      {isPreserve && (
        <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--poster-green))] dark:text-[hsl(var(--poster-ochre))]" />
      )}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-medium">{item.name}</span>
          {isPreserve && item.madeOn && (
            <span className="font-slab text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              Put up {formatDate(item.madeOn)}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ExpiryBadge item={item} />
          {item.note && (
            <span className="text-xs italic text-muted-foreground">{item.note}</span>
          )}
        </div>
      </div>

      {/* Quantity stepper — the common action is "I used one". */}
      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => changeQty(-1)}
          disabled={updateItem.isPending || item.quantity <= 0}
          aria-label={`Use one ${item.name}`}
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <span className="min-w-[3.5rem] text-center font-mono text-sm tabular-nums">
          {item.quantity}
          {item.unit ? ` ${item.unit}` : ''}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => changeQty(1)}
          disabled={updateItem.isPending}
          aria-label={`Add one ${item.name}`}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
        onClick={() => removeItem.mutate(item.id)}
        disabled={removeItem.isPending}
        aria-label={`Remove ${item.name}`}
      >
        {removeItem.isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
      </Button>
    </li>
  );
}

/** The whole inventory, grouped by where things live. */
export function PantryInventory() {
  const { data: items = [], isLoading } = usePantry();

  if (isLoading) {
    return (
      <ul className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="h-16 animate-pulse rounded-sm border-2 bg-muted/40" />
        ))}
      </ul>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="rounded-sm border-2 border-dashed">
        <CardContent className="px-8 py-12 text-center">
          <p className="mx-auto max-w-sm leading-relaxed text-muted-foreground">
            Your shelves are empty here. Add the jam you put up, the flour in the
            pantry, the stock in the freezer — and never lose track of it again.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort within each location: things needing attention float to the top.
  const order: Record<string, number> = { expired: 0, soon: 1, ok: 2, none: 3 };
  const byLocation = PANTRY_LOCATIONS.map(({ value, label }) => {
    const group = items
      .filter((i) => i.location === value)
      .sort((a, b) => order[expiryStatus(a)] - order[expiryStatus(b)]);
    return { value: value as PantryLocation, label, group };
  }).filter((g) => g.group.length > 0);

  return (
    <div className="space-y-8">
      {byLocation.map(({ value, label, group }) => (
        <div key={value} className="space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="font-slab text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              {label}
            </h3>
            <span className="h-px flex-1 bg-border" />
            <span className="font-slab text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {group.length} {group.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <ul className="space-y-2">
            {group.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
