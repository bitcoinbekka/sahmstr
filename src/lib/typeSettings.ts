/**
 * Typographic settings for the SAHMstr poster series.
 *
 * The palette was only half the story — the period character of a c. 1880–1920
 * lithograph lives mostly in its lettering. Each setting below is a complete
 * voice: a display face for titles, a text face for reading, and a label face
 * for the small caps that run under plates and across buttons.
 *
 * These are real historical categories rather than arbitrary pairings:
 *
 *  - Didone (Bodoni): the high-contrast advertising face of the era. Sharp
 *    hairlines, vertical stress. What a railway poster's title was set in.
 *  - Fat face (Abril): a Didone swollen to extreme weight. The 19th century's
 *    answer to needing a headline visible from across a station concourse.
 *  - Slab / Egyptian (Alfa Slab): heavy square serifs, the workhorse of
 *    Victorian display printing and handbills.
 *  - Old style (Garamond): the book face. Warmer and older than the rest —
 *    reads as the textbook the curriculum is drawn from.
 *  - Wood type (Rye): decorative Western letterpress, cut in wood rather than
 *    cast in metal. The loudest option, and deliberately so.
 */

export type TypeSettingId =
  | 'playfair'
  | 'didone'
  | 'fatface'
  | 'egyptian'
  | 'oldstyle'
  | 'woodtype';

export interface TypeSetting {
  id: TypeSettingId;
  /** Short name shown in the switcher. */
  name: string;
  /** The historical category, for the curious. */
  era: string;
  /** One line on what it does to the page. */
  note: string;
  /** Display face — titles and headings. */
  display: string;
  /** Text face — body copy. */
  body: string;
  /** Label face — small caps, eyebrows, buttons. */
  slab: string;
  /**
   * Display faces vary enormously in optical size. Fat faces and wood type
   * need looser tracking and tighter leading than a Didone; without this the
   * headings either crash together or fall apart.
   */
  displayTracking: string;
  displayLeading: string;
  /**
   * Fat faces and wood type have no real bold — they ship one weight. Asking
   * for 700 triggers ugly synthetic emboldening, so these declare their weight.
   */
  displayWeight: string;
  /** Some display faces only read well in caps at large sizes. */
  displayTransform: 'none' | 'uppercase';
}

const STACK_FALLBACK = 'Georgia, serif';

export const TYPE_SETTINGS: Record<TypeSettingId, TypeSetting> = {
  playfair: {
    id: 'playfair',
    name: 'Playfair',
    era: 'Transitional · c. 2011',
    note: 'The original setting. Clean and modern — a familiar editorial voice.',
    display: `'Playfair Display Variable', ${STACK_FALLBACK}`,
    body: `'DM Sans', system-ui, sans-serif`,
    slab: `'Bitter', ${STACK_FALLBACK}`,
    displayTracking: '-0.02em',
    displayLeading: '1.02',
    displayWeight: '700',
    displayTransform: 'none',
  },

  didone: {
    id: 'didone',
    name: 'Didone',
    era: 'Modern serif · c. 1790–1900',
    note: 'High-contrast advertising type. Sharp, elegant, unmistakably period.',
    display: `'Bodoni Moda Variable', ${STACK_FALLBACK}`,
    body: `'DM Sans', system-ui, sans-serif`,
    slab: `'Bitter', ${STACK_FALLBACK}`,
    displayTracking: '-0.015em',
    displayLeading: '1.04',
    displayWeight: '700',
    displayTransform: 'none',
  },

  fatface: {
    id: 'fatface',
    name: 'Fat Face',
    era: 'Display Didone · c. 1820–1900',
    note: 'Poster type at full weight. Bold and loud, the way a real plate shouts.',
    display: `'Abril Fatface', ${STACK_FALLBACK}`,
    body: `'EB Garamond Variable', ${STACK_FALLBACK}`,
    slab: `'Bitter', ${STACK_FALLBACK}`,
    displayTracking: '0.005em',
    displayLeading: '1.06',
    displayWeight: '400',
    displayTransform: 'none',
  },

  egyptian: {
    id: 'egyptian',
    name: 'Egyptian',
    era: 'Slab serif · c. 1815–1920',
    note: 'Heavy square serifs. The workhorse of Victorian handbills and rail notices.',
    display: `'Alfa Slab One', ${STACK_FALLBACK}`,
    body: `'Crimson Pro Variable', ${STACK_FALLBACK}`,
    slab: `'Bitter', ${STACK_FALLBACK}`,
    displayTracking: '0.01em',
    displayLeading: '1.1',
    displayWeight: '400',
    displayTransform: 'none',
  },

  oldstyle: {
    id: 'oldstyle',
    name: 'Old Style',
    era: 'Garalde · c. 1540, revived 1900s',
    note: 'The book voice. Warm and quiet — reads as the textbook itself.',
    display: `'EB Garamond Variable', ${STACK_FALLBACK}`,
    body: `'EB Garamond Variable', ${STACK_FALLBACK}`,
    slab: `'Josefin Sans', system-ui, sans-serif`,
    displayTracking: '0em',
    displayLeading: '1.08',
    displayWeight: '600',
    displayTransform: 'none',
  },

  woodtype: {
    id: 'woodtype',
    name: 'Wood Type',
    era: 'Western letterpress · c. 1870–1910',
    note: 'Decorative wood-cut display. The loudest, most theatrical option.',
    display: `'Rye', ${STACK_FALLBACK}`,
    body: `'EB Garamond Variable', ${STACK_FALLBACK}`,
    slab: `'Bitter', ${STACK_FALLBACK}`,
    displayTracking: '0.015em',
    displayLeading: '1.16',
    displayWeight: '400',
    displayTransform: 'none',
  },
};

/** Settings in the order they appear in the switcher. */
export const TYPE_SETTING_LIST: TypeSetting[] = [
  TYPE_SETTINGS.didone,
  TYPE_SETTINGS.fatface,
  TYPE_SETTINGS.egyptian,
  TYPE_SETTINGS.oldstyle,
  TYPE_SETTINGS.woodtype,
  TYPE_SETTINGS.playfair,
];

export const DEFAULT_TYPE_SETTING: TypeSettingId = 'didone';

export function isTypeSettingId(value: unknown): value is TypeSettingId {
  return typeof value === 'string' && value in TYPE_SETTINGS;
}

/**
 * Storage key, shared with the hook that owns this preference.
 * Versioned so a future change to the stored shape cannot be misread.
 */
export const TYPE_SETTING_STORAGE_KEY = 'sahmstr:type-setting:v1';

/**
 * Read the saved setting and apply it, before React mounts. Kept dependency
 * free and defensive so a bad storage value can never block startup.
 */
export function bootstrapTypeSetting(): void {
  let id: TypeSettingId = DEFAULT_TYPE_SETTING;

  try {
    const raw = localStorage.getItem(TYPE_SETTING_STORAGE_KEY);
    if (raw) {
      // useLocalStorage stores JSON, so the value arrives quoted.
      const parsed: unknown = JSON.parse(raw);
      if (isTypeSettingId(parsed)) id = parsed;
    }
  } catch {
    // Unreadable or unparseable storage: fall through to the default.
  }

  applyTypeSetting(id);
}

/**
 * Apply a setting by writing the font variables onto the document root.
 * Everything downstream reads these, so one write restyles the whole site.
 */
export function applyTypeSetting(id: TypeSettingId): void {
  /*
   * Typography is decoration: it must never be able to take the site down.
   * Everything here is wrapped so that a missing setting, a frozen style
   * object or an unavailable DOM degrades to the defaults baked into
   * index.css rather than throwing during render.
   */
  try {
    const setting = TYPE_SETTINGS[id] ?? TYPE_SETTINGS[DEFAULT_TYPE_SETTING];
    if (!setting) return;

    const root = document.documentElement;
    if (!root) return;

    root.style.setProperty('--font-display', setting.display);
    root.style.setProperty('--font-body', setting.body);
    root.style.setProperty('--font-slab', setting.slab);
    root.style.setProperty('--display-tracking', setting.displayTracking);
    root.style.setProperty('--display-leading', setting.displayLeading);
    root.style.setProperty('--display-weight', setting.displayWeight);
    root.style.setProperty('--display-transform', setting.displayTransform);
    root.dataset.type = setting.id;
  } catch (error) {
    console.warn('Could not apply the type setting; using defaults.', error);
  }
}
