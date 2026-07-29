/** Wardrobe & Style types and constants */

export interface WardrobeItem {
  id: string;
  imageUrl: string;
  category: ClothingCategory;
  subcategory: string;
  color: string;
  colorFamily: ColorFamily;
  pattern: Pattern;
  style: ClothingStyle[];
  season: Season[];
  occasion: Occasion[];
  name: string;
  createdAt: number;
}

export interface StyleProfile {
  skinTone: SkinTone;
  skinUndertone: SkinUndertone;
  preferredStyles: ClothingStyle[];
  bodyType: BodyType;
  colorPreferences: ColorFamily[];
  avoidColors: ColorFamily[];
}

export interface OutfitSuggestion {
  id: string;
  top: WardrobeItem;
  bottom: WardrobeItem;
  layer?: WardrobeItem;
  shoes?: WardrobeItem;
  accessories?: WardrobeItem;
  score: number;
  reasoning: string;
  season: Season;
  occasion: Occasion;
}

// --- Enums & Constants ---

export type ClothingCategory =
  | 'tops'
  | 'bottoms'
  | 'dresses'
  | 'outerwear'
  | 'shoes'
  | 'accessories';

export const CLOTHING_CATEGORIES: { value: ClothingCategory; label: string }[] = [
  { value: 'tops', label: 'Tops' },
  { value: 'bottoms', label: 'Bottoms' },
  { value: 'dresses', label: 'Dresses' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'accessories', label: 'Accessories' },
];

export const SUBCATEGORIES: Record<ClothingCategory, string[]> = {
  tops: ['T-Shirt', 'Blouse', 'Sweater', 'Tank Top', 'Cardigan', 'Hoodie', 'Button-Up', 'Crop Top', 'Tunic', 'Polo'],
  bottoms: ['Jeans', 'Skirt', 'Shorts', 'Leggings', 'Trousers', 'Maxi Skirt', 'Midi Skirt', 'Culottes', 'Cargo Pants', 'Joggers'],
  dresses: ['Maxi Dress', 'Midi Dress', 'Mini Dress', 'Wrap Dress', 'Shirt Dress', 'Sundress', 'Sweater Dress', 'A-Line Dress'],
  outerwear: ['Jacket', 'Coat', 'Blazer', 'Vest', 'Cardigan', 'Denim Jacket', 'Parka', 'Trench Coat', 'Poncho', 'Shawl'],
  shoes: ['Sneakers', 'Boots', 'Sandals', 'Flats', 'Heels', 'Loafers', 'Mules', 'Ankle Boots', 'Slides', 'Espadrilles'],
  accessories: ['Scarf', 'Hat', 'Belt', 'Bag', 'Jewelry', 'Sunglasses', 'Watch', 'Hair Accessory'],
};

export type ColorFamily =
  | 'neutral'
  | 'warm'
  | 'cool'
  | 'earth'
  | 'pastel'
  | 'bright'
  | 'dark'
  | 'jewel';

export const COLOR_FAMILIES: { value: ColorFamily; label: string; swatches: string[] }[] = [
  { value: 'neutral', label: 'Neutrals', swatches: ['#FFFFFF', '#F5F0EB', '#C8BEB5', '#8B8680', '#2C2C2C', '#000000'] },
  { value: 'warm', label: 'Warm Tones', swatches: ['#D4583A', '#E87A3F', '#F5A623', '#D4A96A', '#C9835E'] },
  { value: 'cool', label: 'Cool Tones', swatches: ['#4A90D9', '#7BB3E0', '#5B7FA5', '#6E8CA0', '#92B4C8'] },
  { value: 'earth', label: 'Earth Tones', swatches: ['#8B6F47', '#6B4423', '#A0855B', '#5C4033', '#8D7254'] },
  { value: 'pastel', label: 'Pastels', swatches: ['#FFD1DC', '#FFDAB9', '#E6E6FA', '#B2F2E8', '#FFFACD'] },
  { value: 'bright', label: 'Bright & Bold', swatches: ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF'] },
  { value: 'dark', label: 'Dark & Moody', swatches: ['#1C1C1E', '#2C2C2E', '#3A3A3C', '#1B2A4A', '#2D1B2E'] },
  { value: 'jewel', label: 'Jewel Tones', swatches: ['#50C878', '#0F52BA', '#9B111E', '#7B1FA2', '#E0115F'] },
];

export type Pattern = 'solid' | 'stripes' | 'plaid' | 'floral' | 'polka-dot' | 'animal-print' | 'geometric' | 'abstract' | 'other';

export const PATTERNS: { value: Pattern; label: string }[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'stripes', label: 'Stripes' },
  { value: 'plaid', label: 'Plaid / Checkered' },
  { value: 'floral', label: 'Floral' },
  { value: 'polka-dot', label: 'Polka Dot' },
  { value: 'animal-print', label: 'Animal Print' },
  { value: 'geometric', label: 'Geometric' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'other', label: 'Other' },
];

export type ClothingStyle =
  | 'casual'
  | 'classic'
  | 'boho'
  | 'minimalist'
  | 'cottage-core'
  | 'modest'
  | 'sporty'
  | 'elegant'
  | 'western'
  | 'vintage'
  | 'preppy'
  | 'streetwear';

export const CLOTHING_STYLES: { value: ClothingStyle; label: string; description: string }[] = [
  { value: 'casual', label: 'Casual', description: 'Everyday comfortable looks' },
  { value: 'classic', label: 'Classic', description: 'Timeless, polished pieces' },
  { value: 'boho', label: 'Boho', description: 'Free-spirited, flowing fabrics' },
  { value: 'minimalist', label: 'Minimalist', description: 'Clean lines, neutral palette' },
  { value: 'cottage-core', label: 'Cottage Core', description: 'Romantic, pastoral, vintage charm' },
  { value: 'modest', label: 'Modest', description: 'Conservative, covered-up elegance' },
  { value: 'sporty', label: 'Sporty', description: 'Athletic-inspired, active wear' },
  { value: 'elegant', label: 'Elegant', description: 'Sophisticated, dressy pieces' },
  { value: 'western', label: 'Western', description: 'Country-inspired, boots & denim' },
  { value: 'vintage', label: 'Vintage', description: 'Retro-inspired, thrifted gems' },
  { value: 'preppy', label: 'Preppy', description: 'Polished, collegiate vibe' },
  { value: 'streetwear', label: 'Streetwear', description: 'Trendy, urban casual' },
];

export type Season = 'spring' | 'summer' | 'fall' | 'winter';

export const SEASONS: { value: Season; label: string; icon: string }[] = [
  { value: 'spring', label: 'Spring', icon: '🌸' },
  { value: 'summer', label: 'Summer', icon: '☀️' },
  { value: 'fall', label: 'Fall', icon: '🍂' },
  { value: 'winter', label: 'Winter', icon: '❄️' },
];

export type Occasion = 'everyday' | 'date-night' | 'church' | 'outdoor' | 'work-from-home' | 'errands' | 'special-event' | 'holiday';

export const OCCASIONS: { value: Occasion; label: string }[] = [
  { value: 'everyday', label: 'Everyday' },
  { value: 'date-night', label: 'Date Night' },
  { value: 'church', label: 'Church / Sunday' },
  { value: 'outdoor', label: 'Outdoor / Active' },
  { value: 'work-from-home', label: 'Work from Home' },
  { value: 'errands', label: 'Errands & School Runs' },
  { value: 'special-event', label: 'Special Event' },
  { value: 'holiday', label: 'Holiday / Seasonal' },
];

export type SkinTone = 'fair' | 'light' | 'light-medium' | 'medium' | 'medium-tan' | 'olive' | 'tan' | 'deep';

export const SKIN_TONES: { value: SkinTone; label: string; hex: string }[] = [
  { value: 'fair', label: 'Fair', hex: '#FDEBD3' },
  { value: 'light', label: 'Light', hex: '#F5D5B8' },
  { value: 'light-medium', label: 'Light Medium', hex: '#E8C4A0' },
  { value: 'medium', label: 'Medium', hex: '#D4A574' },
  { value: 'medium-tan', label: 'Medium Tan', hex: '#C49060' },
  { value: 'olive', label: 'Olive', hex: '#B8945F' },
  { value: 'tan', label: 'Tan', hex: '#A07040' },
  { value: 'deep', label: 'Deep', hex: '#6B4226' },
];

export type SkinUndertone = 'warm' | 'cool' | 'neutral';

export const SKIN_UNDERTONES: { value: SkinUndertone; label: string; description: string }[] = [
  { value: 'warm', label: 'Warm', description: 'Golden, peachy, or yellow undertones. Veins appear greenish.' },
  { value: 'cool', label: 'Cool', description: 'Pink, red, or bluish undertones. Veins appear blue/purple.' },
  { value: 'neutral', label: 'Neutral', description: 'Mix of warm and cool. Veins appear blue-green.' },
];

export type BodyType = 'pear' | 'apple' | 'hourglass' | 'rectangle' | 'inverted-triangle' | 'prefer-not-to-say';

export const BODY_TYPES: { value: BodyType; label: string }[] = [
  { value: 'hourglass', label: 'Hourglass' },
  { value: 'pear', label: 'Pear' },
  { value: 'apple', label: 'Apple' },
  { value: 'rectangle', label: 'Rectangle' },
  { value: 'inverted-triangle', label: 'Inverted Triangle' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

// --- Color harmony for outfit matching ---

/** Colors that complement each skin undertone */
export const UNDERTONE_COLOR_HARMONY: Record<SkinUndertone, ColorFamily[]> = {
  warm: ['warm', 'earth', 'jewel', 'bright'],
  cool: ['cool', 'pastel', 'jewel', 'dark'],
  neutral: ['neutral', 'cool', 'warm', 'earth', 'pastel', 'jewel'],
};

/** Color families that pair well together */
export const COLOR_PAIRINGS: Record<ColorFamily, ColorFamily[]> = {
  neutral: ['warm', 'cool', 'earth', 'pastel', 'bright', 'dark', 'jewel', 'neutral'],
  warm: ['neutral', 'earth', 'jewel', 'dark', 'warm'],
  cool: ['neutral', 'pastel', 'dark', 'jewel', 'cool'],
  earth: ['neutral', 'warm', 'dark', 'jewel', 'earth'],
  pastel: ['neutral', 'cool', 'pastel'],
  bright: ['neutral', 'dark', 'bright'],
  dark: ['neutral', 'warm', 'cool', 'earth', 'bright', 'pastel', 'jewel', 'dark'],
  jewel: ['neutral', 'dark', 'earth', 'jewel'],
};

/** Season-appropriate categories */
export const SEASON_WEIGHTS: Record<Season, Record<ClothingCategory, number>> = {
  spring: { tops: 1, bottoms: 1, dresses: 1.2, outerwear: 0.7, shoes: 1, accessories: 1 },
  summer: { tops: 1, bottoms: 1, dresses: 1.5, outerwear: 0.2, shoes: 1, accessories: 1.2 },
  fall: { tops: 1, bottoms: 1, dresses: 0.8, outerwear: 1.5, shoes: 1, accessories: 1.2 },
  winter: { tops: 1, bottoms: 1, dresses: 0.6, outerwear: 1.8, shoes: 1, accessories: 1.3 },
};
