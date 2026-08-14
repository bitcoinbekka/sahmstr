/**
 * The SAHMstr image set.
 *
 * Soft-modern editorial lifestyle photography — warm natural light, muted
 * earthy tones (off-white, sage, clay, oak), calm uncluttered domestic scenes.
 * It matches the ADR-012 rebrand (premium, contemporary, unironically warm) and
 * replaces the earlier vintage-poster plates.
 *
 * Units reference images by unit id. Anything without an image falls back to
 * its gradient badge, so the site never depends on an image loading.
 */

/** The ink colours of the poster series. */
export type PosterTone =
  | 'ochre'
  | 'green'
  | 'terracotta'
  | 'sage'
  | 'blue'
  | 'teal'
  | 'oxblood'
  | 'cream';

export interface Poster {
  url: string;
  /** Descriptive alt text — these carry real content, so describe them. */
  alt: string;
  /** Dominant colour family, used to tint surrounding surfaces. */
  tone: PosterTone;
}

/**
 * Soft two-stop washes keyed by tone. Muted and modern — quiet earthy fills
 * rather than saturated inks. These track the accent drawer in index.css; keep
 * them in step (ADR-004).
 */
export const TONE_WASH: Record<PosterTone, string> = {
  ochre: 'from-[hsl(36_54%_58%)] to-[hsl(32_46%_46%)]',
  green: 'from-[hsl(145_18%_42%)] to-[hsl(148_20%_30%)]',
  terracotta: 'from-[hsl(16_44%_56%)] to-[hsl(12_40%_44%)]',
  sage: 'from-[hsl(130_16%_58%)] to-[hsl(134_18%_44%)]',
  blue: 'from-[hsl(210_26%_56%)] to-[hsl(212_26%_42%)]',
  teal: 'from-[hsl(180_22%_46%)] to-[hsl(182_24%_34%)]',
  oxblood: 'from-[hsl(8_44%_52%)] to-[hsl(6_42%_40%)]',
  cream: 'from-[hsl(40_28%_90%)] to-[hsl(36_22%_80%)]',
};

/** Foreground that reads on each wash. Cream is light, so it takes dark ink. */
export const TONE_INK: Record<PosterTone, string> = {
  ochre: 'text-[hsl(40_30%_98%)]',
  green: 'text-[hsl(40_30%_98%)]',
  terracotta: 'text-[hsl(40_30%_98%)]',
  sage: 'text-[hsl(130_28%_14%)]',
  blue: 'text-[hsl(40_30%_98%)]',
  teal: 'text-[hsl(40_30%_98%)]',
  oxblood: 'text-[hsl(40_30%_98%)]',
  cream: 'text-[hsl(30_10%_20%)]',
};

/** The hero image for the site as a whole. */
export const HERO_POSTER: Poster = {
  url: 'https://blossom.ditto.pub/c840c9a6d8bd7708a6073c390259f64f901dcb0c78c34c958f387eb76d1f6b2c.jpeg',
  alt: 'A mother standing at a sunlit kitchen window in the early morning, holding a mug of tea, in warm natural light.',
  tone: 'sage',
};

/** Images keyed by curriculum unit id. */
export const UNIT_POSTERS: Record<string, Poster> = {
  'successful-family': {
    url: 'https://blossom.ditto.pub/82de3e7bf801e19ba9e24e92d2f46f8fd57b5bf2c7a37fbffa926c372050cfdf.jpeg',
    alt: 'A family gathered warmly around a wooden dining table sharing a simple meal in soft golden light.',
    tone: 'terracotta',
  },
  'growing-up': {
    url: 'https://blossom.ditto.pub/d20681375d39f5f6218d71dec6bb7ec0568742099775c277e910d25233e2c542.jpeg',
    alt: 'A mother and small child walking hand in hand through a sunlit garden of soft green foliage.',
    tone: 'sage',
  },
  'home-management': {
    url: 'https://blossom.ditto.pub/d1c8d25528ef326ad83b26472b34ff26e83bf84b618718d4882a4cacaf2bd353.jpeg',
    alt: 'A serene living-room corner with a linen sofa, woven basket and trailing plant in soft daylight.',
    tone: 'green',
  },
  'house-and-home': {
    url: 'https://blossom.ditto.pub/d40927ca59b8e8956f7ec76b2dc9591f3e544d20ebb7027ca758b1339e1dec9a.jpeg',
    alt: 'An inviting front porch at golden hour with two wooden chairs, a linen throw and a warm glowing doorway.',
    tone: 'terracotta',
  },
  'caring-for-the-house': {
    url: 'https://blossom.ditto.pub/e5ccbd48b76c8de07305c58a07c9f5b96fcf848026f1c84314887efda8e0e173.jpeg',
    alt: 'Freshly folded linens in a woven basket beside natural soap and a sprig of lavender in warm light.',
    tone: 'terracotta',
  },
  'food-nutrition': {
    url: 'https://blossom.ditto.pub/b78c2c8bcd5fee546e60a96041bf5a7695ad6709391edcd8f91941c84362d319.jpeg',
    alt: 'A wooden kitchen table with fresh seasonal vegetables, homemade sourdough and a bowl of fruit in morning light.',
    tone: 'cream',
  },
  'textiles-clothing': {
    url: 'https://blossom.ditto.pub/aa0166b0a0bf2c0078b676feca5c90205e6ee2360d4bb773a8aa29207d90b650.jpeg',
    alt: 'Neatly folded natural-fibre clothing in oatmeal, cream and sage stacked on a wooden shelf beside a basket.',
    tone: 'ochre',
  },
  'consumer-education': {
    url: 'https://blossom.ditto.pub/2b954d934a714840348af6c4d4c195bdf8743848990e8fe2f91dfe4262cf5a30.jpeg',
    alt: 'A beautifully organised pantry shelf of glass jars, homemade preserves and dried herbs in warm light.',
    tone: 'cream',
  },
  'young-child': {
    url: 'https://blossom.ditto.pub/7c3ce765efc18193b23f5218afd99cfa4676b56eb1b5f244933f439e60224f41.jpeg',
    alt: 'A peaceful nursery corner with a baby resting in a woven bassinet beside a wooden rocking chair.',
    tone: 'sage',
  },
  'child-development': {
    url: 'https://blossom.ditto.pub/d8a45e829ae6f6212f7cfe52f942e5f75eadfddb65c8ada7e58db7a03ccdb4e7.jpeg',
    alt: 'Children walking a sunlit garden path between soft flowering borders of green and cream.',
    tone: 'green',
  },
  'keeping-good-health': {
    url: 'https://blossom.ditto.pub/027e0afea673a60bf079af28e17ff05a1476d8ea9676d6a1b47b11c84038312a.jpeg',
    alt: 'A calm windowsill still life with a glass of water, a bowl of fresh apples and green sprigs in soft daylight.',
    tone: 'teal',
  },
  'health-home-nursing': {
    url: 'https://blossom.ditto.pub/e5ccbd48b76c8de07305c58a07c9f5b96fcf848026f1c84314887efda8e0e173.jpeg',
    alt: 'Fresh linens, natural soap and a sprig of lavender arranged on a wooden surface in warm light.',
    tone: 'sage',
  },
  hospitality: {
    url: 'https://blossom.ditto.pub/d40927ca59b8e8956f7ec76b2dc9591f3e544d20ebb7027ca758b1339e1dec9a.jpeg',
    alt: 'A welcoming porch at golden hour with two chairs, greenery and an open, glowing front door.',
    tone: 'terracotta',
  },
};

/**
 * A tone for every unit, including the three with no poster of their own.
 * Units without a poster print as a plate — flat ink, unit number, icon — which
 * is how the original books handled a unit the illustrator never got to.
 */
export const UNIT_TONES: Record<string, PosterTone> = {
  'successful-family': 'terracotta',
  'growing-up': 'sage',
  'home-management': 'green',
  'house-and-home': 'terracotta',
  'caring-for-the-house': 'terracotta',
  'food-nutrition': 'cream',
  'textiles-clothing': 'ochre',
  'household-finance': 'oxblood',
  'consumer-education': 'cream',
  'young-child': 'sage',
  'child-development': 'green',
  hospitality: 'terracotta',
  'keeping-good-health': 'teal',
  'health-home-nursing': 'sage',
  'digital-household': 'teal',
  'home-and-protocols': 'blue',
};

/** Get the poster for a unit, if it has one. */
export function getUnitPoster(unitId: string): Poster | undefined {
  return UNIT_POSTERS[unitId];
}

/** The ink a unit prints in, whether or not it has a poster. */
export function getUnitTone(unitId: string): PosterTone {
  return UNIT_POSTERS[unitId]?.tone ?? UNIT_TONES[unitId] ?? 'green';
}

/**
 * Posters for the main sections of the site. These reuse plates from the series
 * rather than commissioning new ones, which is what a publisher would have done:
 * a good plate gets used again with a different caption.
 */
export const SECTION_POSTERS: Record<
  'recipes' | 'vlogs' | 'live' | 'tips' | 'wardrobe',
  Poster
> = {
  recipes: UNIT_POSTERS['food-nutrition'],
  vlogs: UNIT_POSTERS['successful-family'],
  live: UNIT_POSTERS.hospitality,
  tips: UNIT_POSTERS['home-management'],
  wardrobe: UNIT_POSTERS['textiles-clothing'],
};

/** Posters in a stable order, for gallery display. */
export const POSTER_GALLERY: Array<{ unitId: string; poster: Poster }> = Object.entries(
  UNIT_POSTERS,
)
  .map(([unitId, poster]) => ({ unitId, poster }))
  // De-duplicate posters shared between units.
  .filter(
    (entry, i, all) => all.findIndex((e) => e.poster.url === entry.poster.url) === i,
  );
