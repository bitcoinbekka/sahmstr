/**
 * The Pantry & Preserving Tracker.
 *
 * The problem this solves: a household loses track of what is in the freezer,
 * the pantry, and — especially — the canning shelf. Home-preserved food is
 * effort turned into stored value; forgetting a shelf of it, or letting it slip
 * past its best, is waste of the most disheartening kind.
 *
 * How it is stored: the whole pantry is a single **NIP-78 app-data event**
 * (`kind:30078`) with the `d` identifier `sahmstr-pantry`, whose content is the
 * item list **NIP-44 encrypted to the author's own key**. So it is:
 *
 *   - Private: relays store an opaque blob; nobody but the owner can read it.
 *   - Portable: it syncs across her phone and laptop with no backend, because
 *     it lives on the relays she already uses.
 *   - Durable: clearing a browser does not lose it, unlike device-only storage.
 *
 * This is the same encrypt-to-self pattern the Circle uses for its membership.
 */

/** Where a stored item lives in the home. */
export type PantryLocation = 'pantry' | 'fridge' | 'freezer' | 'canning';

/** The kind of item, which shapes how we treat dates and nudges. */
export type PantryItemKind = 'staple' | 'preserve';

export interface PantryItem {
  /** Stable client-generated id. */
  id: string;
  /** What it is, e.g. "Strawberry jam", "Flour", "Chicken stock". */
  name: string;
  /** Where it is kept. */
  location: PantryLocation;
  /**
   * Whether this is an ordinary staple or something home-preserved. Preserves
   * get a "put up on" date and pride of place; staples are just inventory.
   */
  kind: PantryItemKind;
  /** How much there is, a free number. */
  quantity: number;
  /** The unit, e.g. "jars", "lbs", "cups", "cans". Free text, kept short. */
  unit: string;
  /**
   * ISO date (YYYY-MM-DD) this should be used by / is best before. Optional —
   * many staples have none. Drives the expiry nudges.
   */
  bestBy?: string;
  /** ISO date (YYYY-MM-DD) a preserve was put up. Only meaningful for preserves. */
  madeOn?: string;
  /** Freeform note: recipe used, batch size, who it's for, etc. */
  note?: string;
}

/** The NIP-78 addressable identifier for the pantry list. */
export const PANTRY_IDENTIFIER = 'sahmstr-pantry';

/** NIP-78 application-specific data. */
export const KIND_APP_DATA = 30078;

export const PANTRY_LOCATIONS: { value: PantryLocation; label: string }[] = [
  { value: 'pantry', label: 'Pantry' },
  { value: 'fridge', label: 'Fridge' },
  { value: 'freezer', label: 'Freezer' },
  { value: 'canning', label: 'Canning shelf' },
];

/** Sensible unit suggestions, shown as a datalist rather than a hard list. */
export const UNIT_SUGGESTIONS = [
  'jars',
  'cans',
  'bags',
  'boxes',
  'lbs',
  'oz',
  'kg',
  'g',
  'cups',
  'litres',
  'bottles',
  'bunches',
  'each',
];

/** How many days ahead counts as "use soon". */
export const EXPIRING_SOON_DAYS = 14;

export type ExpiryStatus = 'expired' | 'soon' | 'ok' | 'none';

/**
 * Classify an item by its best-by date relative to today. Pure and defensive:
 * a missing or unparseable date is simply "none", never an error.
 */
export function expiryStatus(item: PantryItem, now: Date = new Date()): ExpiryStatus {
  if (!item.bestBy) return 'none';
  const then = new Date(item.bestBy + 'T00:00:00');
  if (Number.isNaN(then.getTime())) return 'none';

  const msPerDay = 24 * 60 * 60 * 1000;
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((then.getTime() - startOfToday.getTime()) / msPerDay);

  if (days < 0) return 'expired';
  if (days <= EXPIRING_SOON_DAYS) return 'soon';
  return 'ok';
}

/**
 * Validate an unknown value parsed from a decrypted payload into a PantryItem.
 * Read paths must not trust their input — a corrupt or hand-edited event should
 * drop bad rows rather than crash the pantry.
 */
export function isPantryItem(value: unknown): value is PantryItem {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    typeof v.location === 'string' &&
    ['pantry', 'fridge', 'freezer', 'canning'].includes(v.location as string) &&
    typeof v.quantity === 'number'
  );
}

/** Fields the AI can suggest from a photo of pantry items. */
export interface PantryItemTags {
  name: string;
  location: PantryLocation;
  kind: PantryItemKind;
  quantity: number;
  unit: string;
}

/** The instruction sent to the vision AI for tagging a pantry photo. */
export function buildPantryTagInstruction(): string {
  return `You analyze a photo of food or household provisions and return structured metadata as JSON only — no markdown, no commentary.

Return this exact shape:
{
  "name": "Short plain name, e.g. 'Strawberry jam' or 'All-purpose flour'",
  "location": one of ["pantry","fridge","freezer","canning"],
  "kind": "preserve" if it looks home-canned/preserved (mason jar, homemade label), otherwise "staple",
  "quantity": a number (count of items visible, default 1),
  "unit": short unit word like "jars", "cans", "bags", "lbs", "each"
}

Guidance:
- A mason/ball jar of jam, pickles, sauce, or preserves is usually "canning" + "preserve".
- Boxed/bagged dry goods are usually "pantry" + "staple".
- Obvious cold items are "fridge"; frozen bags are "freezer".`;
}

/** Parse the AI's JSON answer into clean PantryItemTags, or null. */
export function parsePantryTagResponse(raw: string): PantryItemTags | null {
  // Strip markdown fences if present, then find the first JSON object.
  const cleaned = raw.replace(/```json|```/gi, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null) return null;
  const p = parsed as Record<string, unknown>;

  const location: PantryLocation = (['pantry', 'fridge', 'freezer', 'canning'] as const).includes(
    p.location as PantryLocation,
  )
    ? (p.location as PantryLocation)
    : 'pantry';

  return {
    name: typeof p.name === 'string' ? p.name : '',
    location,
    kind: p.kind === 'preserve' ? 'preserve' : 'staple',
    quantity: typeof p.quantity === 'number' && p.quantity > 0 ? p.quantity : 1,
    unit: typeof p.unit === 'string' ? p.unit : '',
  };
}

/** Coerce a decrypted array into clean PantryItems, dropping anything invalid. */
export function parsePantryItems(value: unknown): PantryItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isPantryItem).map((item) => ({
    // Normalise optional fields so the rest of the app can rely on shape.
    kind: item.kind === 'preserve' ? 'preserve' : 'staple',
    unit: typeof item.unit === 'string' ? item.unit : '',
    ...item,
  }));
}
