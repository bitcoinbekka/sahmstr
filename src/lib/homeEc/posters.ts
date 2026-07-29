/**
 * The SAHMstr poster series.
 *
 * A set of original vintage-style posters in the WPA / mid-century travel
 * poster tradition — flat planes of colour, strong silhouettes, warm ochres and
 * forest greens, and a title band across the foot. They set the visual register
 * for the whole site: grandmillennial, domestic, unironically warm.
 *
 * Units reference posters by unit id. Anything without a poster falls back to
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
 * Flat ink washes keyed by tone. Two stops only — the posters are screen-printed,
 * not airbrushed, so gradients stay short and stay within one ink family. These
 * track the ink drawer in index.css; keep them in step.
 */
export const TONE_WASH: Record<PosterTone, string> = {
  ochre: 'from-[hsl(40_82%_50%)] to-[hsl(32_74%_38%)]',
  green: 'from-[hsl(158_40%_24%)] to-[hsl(162_46%_15%)]',
  terracotta: 'from-[hsl(14_66%_45%)] to-[hsl(8_58%_33%)]',
  sage: 'from-[hsl(96_20%_46%)] to-[hsl(100_24%_32%)]',
  blue: 'from-[hsl(205_56%_40%)] to-[hsl(210_50%_27%)]',
  teal: 'from-[hsl(188_48%_32%)] to-[hsl(192_52%_20%)]',
  oxblood: 'from-[hsl(356_52%_35%)] to-[hsl(352_50%_23%)]',
  cream: 'from-[hsl(39_50%_78%)] to-[hsl(34_40%_62%)]',
};

/** Foreground that reads on each wash. Cream and ochre are light, so they take ink. */
export const TONE_INK: Record<PosterTone, string> = {
  ochre: 'text-[hsl(22_36%_13%)]',
  green: 'text-[hsl(41_56%_95%)]',
  terracotta: 'text-[hsl(41_56%_95%)]',
  sage: 'text-[hsl(100_30%_10%)]',
  blue: 'text-[hsl(41_56%_95%)]',
  teal: 'text-[hsl(41_56%_95%)]',
  oxblood: 'text-[hsl(41_56%_95%)]',
  cream: 'text-[hsl(22_36%_16%)]',
};

/** The hero poster for the site as a whole. */
export const HERO_POSTER: Poster = {
  url: 'https://blossom.dreamith.to/1a7868e393234ade76f16c87d8fbbf804ccd27689821150d47d8b7fa8f4d2570.jpeg',
  alt: 'Vintage-style poster of a woman standing at a sunlit kitchen window, reading "Stay at Home SAHMstr", with a small bitcoin mark in the corner.',
  tone: 'ochre',
};

/** Posters keyed by curriculum unit id. */
export const UNIT_POSTERS: Record<string, Poster> = {
  'successful-family': {
    url: 'https://blossom.ditto.pub/27cdaa4e7021f6194b0a68d265c2b0f25616e1f9e341d7ea96fcf684986d4c03.jpeg',
    alt: 'Vintage-style poster of a family of five gathered around a table in warm terracotta light, titled "The Successful Family".',
    tone: 'terracotta',
  },
  'growing-up': {
    url: 'https://blossom.primal.net/cadc3dc51dc629bd6b33e805057c7604f230070a2b630544962cf30a7526d9ab.jpg',
    alt: 'Vintage-style poster of a mother and small child in sun hats walking hand in hand through a garden gate, titled "Growing Up".',
    tone: 'sage',
  },
  'home-management': {
    url: 'https://blossom.primal.net/8f3088f0d6e94fa1d1cc078098d72404ef31678a5d4a2d771fdc56fee88f1d11.jpg',
    alt: 'Vintage-style poster of a woman silhouetted at a green kitchen counter with bold slanting sunlight, titled "Managing a Home".',
    tone: 'green',
  },
  'house-and-home': {
    url: 'https://blossom.primal.net/b8ad0fe4a9b3dc8f993c1effd8918523f839f0f3ed2c90c8fc74674637de9f25.jpg',
    alt: 'Vintage-style poster of two white rocking chairs on a rose-covered porch with a lit doorway, titled "Making the House a Home".',
    tone: 'terracotta',
  },
  'caring-for-the-house': {
    url: 'https://blossom.primal.net/44fe0c6316ad184a4cd7c019d8effbf78ab3980c7c2acf865389c262e1d52669.jpg',
    alt: 'Vintage-style poster of a woman folding linens beside a basket of vegetables in a warm brown room, titled "Managing the Home".',
    tone: 'terracotta',
  },
  'food-nutrition': {
    url: 'https://blossom.primal.net/2eb16cfb9a9f0e88745d6b51143fdafd983898acb2e109d6d707d4f333c0ef72.jpg',
    alt: 'Vintage-style poster of an open larder cupboard filled with preserves, bread and fruit, titled "The Family as a Consumer".',
    tone: 'cream',
  },
  'textiles-clothing': {
    url: 'https://blossom.primal.net/863e6eea09dc3299b37ca95d1f0810b1b96a952252d257730eb5f267c8d2b65b.jpg',
    alt: 'Vintage-style poster of a woman at a window sorting folded cloth and garden vegetables in golden light, titled "Managing the Home".',
    tone: 'ochre',
  },
  'consumer-education': {
    url: 'https://blossom.primal.net/2eb16cfb9a9f0e88745d6b51143fdafd983898acb2e109d6d707d4f333c0ef72.jpg',
    alt: 'Vintage-style poster of an open larder cupboard filled with preserves, bread and fruit, titled "The Family as a Consumer".',
    tone: 'cream',
  },
  'young-child': {
    url: 'https://blossom.primal.net/ee67e18145e67d296f7be1c5a639557d23f1ee4344c2db79c30c6c3c15013da5.jpg',
    alt: 'Vintage-style poster of a baby in a wicker basket beside a bentwood chair in a sunlit room, titled "Caring for the Young Child".',
    tone: 'sage',
  },
  'child-development': {
    url: 'https://blossom.primal.net/35614c2920181f2a11d26db3709c30e833538746a11310bee54f51dd0ddffa7f.jpg',
    alt: 'Vintage-style poster of three children walking a sunlit garden path between flowering borders, titled "Understanding and Guiding Children".',
    tone: 'green',
  },
  'keeping-good-health': {
    url: 'https://blossom.ditto.pub/219c60bf509eb00dcf3f9b1dddeb15be29e4829fd2a148ecd7af314038a80e15.jpeg',
    alt: 'Vintage-style poster of an open window over rolling green hills with a bowl of apples and a glass of milk, titled "Keeping in Good Health".',
    tone: 'teal',
  },
  'health-home-nursing': {
    url: 'https://blossom.primal.net/9d17d4e02026c5251a11544ac64fa7a40ff0570b9dd9eb20950545dacc64315f.jpg',
    alt: 'Vintage-style poster of two glass bottles on a sunlit windowsill in muted sage tones, titled "The Physician\'s Home Helper".',
    tone: 'sage',
  },
  hospitality: {
    url: 'https://blossom.primal.net/de9c1ace304fd1ae1528868ef53cc41556e63bc8aa329af98eb27c1903a13d92.jpg',
    alt: 'Vintage-style poster of a rose-covered porch at golden hour with two rocking chairs and an open door, titled "Making the House a Home".',
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
