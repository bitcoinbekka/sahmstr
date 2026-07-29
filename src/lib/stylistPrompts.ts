/** Prompt builders and response parsers for the AI Stylist */

import type {
  WardrobeItem,
  StyleProfile,
  Season,
  Occasion,
  ClothingCategory,
  ColorFamily,
  Pattern,
  ClothingStyle,
} from './wardrobeTypes';
import {
  CLOTHING_CATEGORIES,
  SUBCATEGORIES,
  COLOR_FAMILIES,
  PATTERNS,
  CLOTHING_STYLES,
  SEASONS,
  OCCASIONS,
  SKIN_TONES,
  SKIN_UNDERTONES,
  BODY_TYPES,
} from './wardrobeTypes';

/** Weather context passed into the stylist */
export interface WeatherContext {
  temperatureF: number;
  condition: string;
  locationName?: string;
}

/** A single AI-generated outfit */
export interface AIOutfit {
  title: string;
  itemIds: string[];
  whyItWorks: string;
  stylingTips: string;
  colorNote: string;
}

/** AI-suggested tags for a clothing photo */
export interface AIItemTags {
  name: string;
  category: ClothingCategory;
  subcategory: string;
  color: string;
  colorFamily: ColorFamily;
  pattern: Pattern;
  style: ClothingStyle[];
  season: Season[];
  occasion: Occasion[];
}

// --- Helpers -------------------------------------------------------------

const validCategories = CLOTHING_CATEGORIES.map((c) => c.value);
const validColorFamilies = COLOR_FAMILIES.map((c) => c.value);
const validPatterns = PATTERNS.map((p) => p.value);
const validStyles = CLOTHING_STYLES.map((s) => s.value);
const validSeasons = SEASONS.map((s) => s.value);
const validOccasions = OCCASIONS.map((o) => o.value);

/**
 * Extract a JSON object/array from a model response that may be wrapped in
 * markdown code fences or surrounded by prose.
 */
export function extractJSON<T>(raw: string): T | null {
  if (!raw) return null;

  // Strip markdown code fences
  let text = raw.trim();
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  // Direct parse attempt
  try {
    return JSON.parse(text) as T;
  } catch {
    // Fall through to bracket scanning
  }

  // Find the first balanced { } or [ ] block
  for (const [open, close] of [['{', '}'], ['[', ']']] as const) {
    const start = text.indexOf(open);
    if (start === -1) continue;
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let i = start; i < text.length; i++) {
      const ch = text[i];
      if (escaped) { escaped = false; continue; }
      if (ch === '\\') { escaped = true; continue; }
      if (ch === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (ch === open) depth++;
      else if (ch === close) {
        depth--;
        if (depth === 0) {
          const candidate = text.slice(start, i + 1);
          try {
            return JSON.parse(candidate) as T;
          } catch {
            break;
          }
        }
      }
    }
  }

  return null;
}

function coerceEnum<T extends string>(value: unknown, valid: readonly T[], fallback: T): T {
  if (typeof value !== 'string') return fallback;
  const normalized = value.toLowerCase().trim().replace(/\s+/g, '-');
  const found = valid.find((v) => v === normalized);
  return found ?? fallback;
}

function coerceEnumArray<T extends string>(value: unknown, valid: readonly T[], fallback: T[]): T[] {
  if (!Array.isArray(value)) return fallback;
  const result = value
    .filter((v): v is string => typeof v === 'string')
    .map((v) => v.toLowerCase().trim().replace(/\s+/g, '-'))
    .filter((v): v is T => (valid as readonly string[]).includes(v));
  return result.length > 0 ? result : fallback;
}

// --- Outfit generation ---------------------------------------------------

/** Compact description of an item for the prompt */
function describeItem(item: WardrobeItem): string {
  return [
    `id:${item.id}`,
    `"${item.name}"`,
    `${item.category}/${item.subcategory}`,
    `color:${item.color || item.colorFamily} (${item.colorFamily} family)`,
    `pattern:${item.pattern}`,
    `styles:[${item.style.join(', ')}]`,
    `seasons:[${item.season.join(', ')}]`,
    `occasions:[${item.occasion.join(', ')}]`,
  ].join(' | ');
}

export function buildOutfitSystemPrompt(): string {
  return `You are an expert personal stylist for SAHMstr, a community of stay-at-home moms. You create practical, flattering, real-life outfits from the clothes a woman already owns.

Your styling principles:
- Work ONLY with the items provided. Never invent items she doesn't own.
- Prioritize comfort and practicality — these women are chasing kids, cooking, and running errands.
- Apply real color theory: consider undertone harmony, value contrast, and balance.
- Avoid pairing two busy patterns unless one is clearly a subtle accent.
- Respect her stated style preferences and modesty needs.
- Be warm, encouraging, and specific — never generic filler like "this looks great!"

Respond with ONLY valid JSON. No markdown fences, no commentary before or after.`;
}

export function buildOutfitUserPrompt(params: {
  items: WardrobeItem[];
  profile: StyleProfile;
  season: Season;
  occasion: Occasion;
  weather?: WeatherContext | null;
  notes?: string;
  count: number;
}): string {
  const { items, profile, season, occasion, weather, notes, count } = params;

  const skinToneLabel = SKIN_TONES.find((t) => t.value === profile.skinTone)?.label ?? profile.skinTone;
  const undertoneLabel = SKIN_UNDERTONES.find((u) => u.value === profile.skinUndertone)?.label ?? profile.skinUndertone;
  const bodyTypeLabel = BODY_TYPES.find((b) => b.value === profile.bodyType)?.label ?? profile.bodyType;
  const occasionLabel = OCCASIONS.find((o) => o.value === occasion)?.label ?? occasion;

  const lines: string[] = [];

  lines.push('## Her Style Profile');
  lines.push(`- Skin tone: ${skinToneLabel}`);
  lines.push(`- Undertone: ${undertoneLabel}`);
  if (profile.bodyType !== 'prefer-not-to-say') {
    lines.push(`- Body type: ${bodyTypeLabel}`);
  }
  lines.push(`- Preferred styles: ${profile.preferredStyles.join(', ') || 'no strong preference'}`);
  if (profile.colorPreferences.length > 0) {
    lines.push(`- Loves these color families: ${profile.colorPreferences.join(', ')}`);
  }
  if (profile.avoidColors.length > 0) {
    lines.push(`- AVOID these color families: ${profile.avoidColors.join(', ')}`);
  }

  lines.push('');
  lines.push('## Context');
  lines.push(`- Season: ${season}`);
  lines.push(`- Occasion: ${occasionLabel}`);
  if (weather) {
    lines.push(`- Current weather: ${Math.round(weather.temperatureF)}°F, ${weather.condition}${weather.locationName ? ` in ${weather.locationName}` : ''}`);
    lines.push('  Dress appropriately for this actual temperature — recommend layers if it is cold.');
  }
  if (notes?.trim()) {
    lines.push(`- Her special request: "${notes.trim()}"`);
  }

  lines.push('');
  lines.push(`## Her Closet (${items.length} items)`);
  for (const item of items) {
    lines.push(`- ${describeItem(item)}`);
  }

  lines.push('');
  lines.push(`## Your Task`);
  lines.push(`Create ${count} distinct outfits. Each outfit must use only item ids from her closet above.`);
  lines.push('Use a different core combination for each outfit — do not just swap one accessory.');
  lines.push('');
  lines.push('Return this exact JSON shape:');
  lines.push(`{
  "outfits": [
    {
      "title": "A short evocative name for the look",
      "itemIds": ["exact-id-from-closet", "another-exact-id"],
      "whyItWorks": "2-3 sentences on why this combination flatters her and suits the occasion.",
      "stylingTips": "Specific actionable advice — how to tuck, cuff, layer, roll sleeves, belt it, etc.",
      "colorNote": "One sentence about how these colors work with her ${undertoneLabel.toLowerCase()} undertone."
    }
  ]
}`);

  return lines.join('\n');
}

export function parseOutfitResponse(raw: string, validIds: Set<string>): AIOutfit[] {
  const parsed = extractJSON<{ outfits?: unknown } | unknown[]>(raw);
  if (!parsed) return [];

  const rawOutfits = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as { outfits?: unknown }).outfits)
      ? (parsed as { outfits: unknown[] }).outfits
      : [];

  const results: AIOutfit[] = [];

  for (const entry of rawOutfits) {
    if (!entry || typeof entry !== 'object') continue;
    const o = entry as Record<string, unknown>;

    const ids = Array.isArray(o.itemIds)
      ? o.itemIds.filter((id): id is string => typeof id === 'string' && validIds.has(id))
      : [];

    // Need at least 2 real items to be a usable outfit
    if (ids.length < 2) continue;

    results.push({
      title: typeof o.title === 'string' && o.title.trim() ? o.title.trim() : 'Styled Look',
      itemIds: Array.from(new Set(ids)),
      whyItWorks: typeof o.whyItWorks === 'string' ? o.whyItWorks.trim() : '',
      stylingTips: typeof o.stylingTips === 'string' ? o.stylingTips.trim() : '',
      colorNote: typeof o.colorNote === 'string' ? o.colorNote.trim() : '',
    });
  }

  return results;
}

// --- Auto-tagging from photo --------------------------------------------

export function buildAutoTagSystemPrompt(): string {
  return `You analyze photos of clothing items and return structured metadata. Respond with ONLY valid JSON — no markdown fences, no commentary.`;
}

export function buildAutoTagUserPrompt(): string {
  return `Look at this clothing item photo and identify its attributes.

Return this exact JSON shape:
{
  "name": "Short descriptive name, e.g. 'Cream cable-knit sweater'",
  "category": one of ${JSON.stringify(validCategories)},
  "subcategory": "The specific garment type",
  "color": "The main color in plain words, e.g. 'dusty rose'",
  "colorFamily": one of ${JSON.stringify(validColorFamilies)},
  "pattern": one of ${JSON.stringify(validPatterns)},
  "style": array of 1-3 from ${JSON.stringify(validStyles)},
  "season": array of 1-4 from ${JSON.stringify(validSeasons)},
  "occasion": array of 1-3 from ${JSON.stringify(validOccasions)}
}

Valid subcategory values depend on the category:
${CLOTHING_CATEGORIES.map((c) => `- ${c.value}: ${JSON.stringify(SUBCATEGORIES[c.value])}`).join('\n')}

Pick the subcategory that best matches from the list for your chosen category.`;
}

export function parseAutoTagResponse(raw: string): AIItemTags | null {
  const parsed = extractJSON<Record<string, unknown>>(raw);
  if (!parsed || typeof parsed !== 'object') return null;

  const category = coerceEnum(parsed.category, validCategories, 'tops');
  const allowedSubs = SUBCATEGORIES[category];

  // Match subcategory case-insensitively against the allowed list
  let subcategory = allowedSubs[0];
  if (typeof parsed.subcategory === 'string') {
    const needle = parsed.subcategory.toLowerCase().trim();
    const match = allowedSubs.find((s) => s.toLowerCase() === needle)
      ?? allowedSubs.find((s) => s.toLowerCase().includes(needle) || needle.includes(s.toLowerCase()));
    if (match) subcategory = match;
  }

  return {
    name: typeof parsed.name === 'string' && parsed.name.trim()
      ? parsed.name.trim().slice(0, 60)
      : subcategory,
    category,
    subcategory,
    color: typeof parsed.color === 'string' ? parsed.color.trim().slice(0, 40) : '',
    colorFamily: coerceEnum(parsed.colorFamily, validColorFamilies, 'neutral'),
    pattern: coerceEnum(parsed.pattern, validPatterns, 'solid'),
    style: coerceEnumArray(parsed.style, validStyles, ['casual']),
    season: coerceEnumArray(parsed.season, validSeasons, ['spring', 'summer', 'fall', 'winter']),
    occasion: coerceEnumArray(parsed.occasion, validOccasions, ['everyday']),
  };
}
