import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { WardrobeItem, StyleProfile, OutfitSuggestion, Season, Occasion, ClothingCategory } from '@/lib/wardrobeTypes';
import {
  UNDERTONE_COLOR_HARMONY,
  COLOR_PAIRINGS,
  SEASON_WEIGHTS,
} from '@/lib/wardrobeTypes';
import { useCallback, useMemo } from 'react';

const DEFAULT_PROFILE: StyleProfile = {
  skinTone: 'medium',
  skinUndertone: 'neutral',
  preferredStyles: ['casual'],
  bodyType: 'prefer-not-to-say',
  colorPreferences: [],
  avoidColors: [],
};

export function useWardrobe() {
  const [items, setItems] = useLocalStorage<WardrobeItem[]>('sahmstr-wardrobe', []);
  const [profile, setProfile] = useLocalStorage<StyleProfile>('sahmstr-style-profile', DEFAULT_PROFILE);

  const addItem = useCallback((item: WardrobeItem) => {
    setItems((prev) => [...prev, item]);
  }, [setItems]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, [setItems]);

  const updateItem = useCallback((id: string, updates: Partial<WardrobeItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  }, [setItems]);

  const updateProfile = useCallback((updates: Partial<StyleProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, [setProfile]);

  const itemsByCategory = useMemo(() => {
    const grouped: Record<ClothingCategory, WardrobeItem[]> = {
      tops: [],
      bottoms: [],
      dresses: [],
      outerwear: [],
      shoes: [],
      accessories: [],
    };
    for (const item of items) {
      grouped[item.category].push(item);
    }
    return grouped;
  }, [items]);

  const generateOutfits = useCallback(
    (season: Season, occasion: Occasion, count = 6): OutfitSuggestion[] => {
      if (items.length < 2) return [];

      const tops = items.filter((i) => i.category === 'tops');
      const bottoms = items.filter((i) => i.category === 'bottoms');
      const dresses = items.filter((i) => i.category === 'dresses');
      const layers = items.filter((i) => i.category === 'outerwear');
      const shoes = items.filter((i) => i.category === 'shoes');
      const accessories = items.filter((i) => i.category === 'accessories');

      const suggestions: OutfitSuggestion[] = [];
      const favoredColors = UNDERTONE_COLOR_HARMONY[profile.skinUndertone] || [];
      const seasonWeights = SEASON_WEIGHTS[season];

      // Score an individual item for the context
      const scoreItem = (item: WardrobeItem, category: ClothingCategory): number => {
        let score = 0;
        // Season match
        if (item.season.includes(season)) score += 3;
        // Occasion match
        if (item.occasion.includes(occasion)) score += 3;
        // Style preference match
        if (item.style.some((s) => profile.preferredStyles.includes(s))) score += 2;
        // Skin undertone color harmony
        if (favoredColors.includes(item.colorFamily)) score += 2;
        // User color preference
        if (profile.colorPreferences.includes(item.colorFamily)) score += 1;
        // Avoid colors penalty
        if (profile.avoidColors.includes(item.colorFamily)) score -= 3;
        // Season category weight
        score *= seasonWeights[category] || 1;
        return score;
      };

      // Score color pairing between two items
      const pairingScore = (a: WardrobeItem, b: WardrobeItem): number => {
        const pairings = COLOR_PAIRINGS[a.colorFamily] || [];
        return pairings.includes(b.colorFamily) ? 2 : -1;
      };

      // --- Generate dress-based outfits ---
      for (const dress of dresses) {
        const dScore = scoreItem(dress, 'dresses');
        // pick a shoe
        const bestShoe = shoes.length > 0
          ? shoes.reduce((best, s) => (scoreItem(s, 'shoes') + pairingScore(dress, s) > scoreItem(best, 'shoes') + pairingScore(dress, best) ? s : best))
          : undefined;
        // pick a layer if fall/winter
        const bestLayer = (season === 'fall' || season === 'winter') && layers.length > 0
          ? layers.reduce((best, l) => (scoreItem(l, 'outerwear') + pairingScore(dress, l) > scoreItem(best, 'outerwear') + pairingScore(dress, best) ? l : best))
          : undefined;
        // pick an accessory
        const bestAccessory = accessories.length > 0
          ? accessories.reduce((best, a) => (scoreItem(a, 'accessories') + pairingScore(dress, a) > scoreItem(best, 'accessories') + pairingScore(dress, best) ? a : best))
          : undefined;

        const totalScore = dScore
          + (bestShoe ? scoreItem(bestShoe, 'shoes') + pairingScore(dress, bestShoe) : 0)
          + (bestLayer ? scoreItem(bestLayer, 'outerwear') + pairingScore(dress, bestLayer) : 0)
          + (bestAccessory ? scoreItem(bestAccessory, 'accessories') + pairingScore(dress, bestAccessory) : 0);

        const reasons: string[] = [];
        if (dress.season.includes(season)) reasons.push(`Perfect for ${season}`);
        if (dress.occasion.includes(occasion)) reasons.push(`great for ${occasion.replace('-', ' ')}`);
        if (favoredColors.includes(dress.colorFamily)) reasons.push(`complements your ${profile.skinUndertone} undertone`);

        suggestions.push({
          id: `dress-${dress.id}`,
          top: dress,
          bottom: dress, // dress serves as both
          layer: bestLayer,
          shoes: bestShoe,
          accessories: bestAccessory,
          score: totalScore,
          reasoning: reasons.length > 0 ? reasons.join(', ') : 'A balanced outfit from your closet',
          season,
          occasion,
        });
      }

      // --- Generate top + bottom outfits ---
      for (const top of tops) {
        for (const bottom of bottoms) {
          const tScore = scoreItem(top, 'tops');
          const bScore = scoreItem(bottom, 'bottoms');
          const colorMatch = pairingScore(top, bottom);

          // Avoid pairing two patterns together (unless one is solid)
          if (top.pattern !== 'solid' && bottom.pattern !== 'solid') continue;

          const bestShoe = shoes.length > 0
            ? shoes.reduce((best, s) => (scoreItem(s, 'shoes') + pairingScore(top, s) > scoreItem(best, 'shoes') + pairingScore(top, best) ? s : best))
            : undefined;

          const bestLayer = (season === 'fall' || season === 'winter') && layers.length > 0
            ? layers.reduce((best, l) => (scoreItem(l, 'outerwear') + pairingScore(top, l) > scoreItem(best, 'outerwear') + pairingScore(top, best) ? l : best))
            : undefined;

          const bestAccessory = accessories.length > 0
            ? accessories.reduce((best, a) => (scoreItem(a, 'accessories') + pairingScore(top, a) > scoreItem(best, 'accessories') + pairingScore(top, best) ? a : best))
            : undefined;

          const totalScore = tScore + bScore + colorMatch
            + (bestShoe ? scoreItem(bestShoe, 'shoes') + pairingScore(top, bestShoe) : 0)
            + (bestLayer ? scoreItem(bestLayer, 'outerwear') + pairingScore(top, bestLayer) : 0)
            + (bestAccessory ? scoreItem(bestAccessory, 'accessories') + pairingScore(top, bestAccessory) : 0);

          const reasons: string[] = [];
          if (colorMatch > 0) reasons.push('Colors pair beautifully');
          if (top.season.includes(season) && bottom.season.includes(season)) reasons.push(`perfect for ${season}`);
          if (top.occasion.includes(occasion)) reasons.push(`great for ${occasion.replace('-', ' ')}`);
          if (top.style.some((s) => profile.preferredStyles.includes(s))) reasons.push('matches your style preferences');
          if (favoredColors.includes(top.colorFamily)) reasons.push(`complements your ${profile.skinUndertone} undertone`);

          suggestions.push({
            id: `${top.id}-${bottom.id}`,
            top,
            bottom,
            layer: bestLayer,
            shoes: bestShoe,
            accessories: bestAccessory,
            score: totalScore,
            reasoning: reasons.length > 0 ? reasons.join(', ') : 'A balanced outfit from your closet',
            season,
            occasion,
          });
        }
      }

      // Sort by score descending and return top N
      suggestions.sort((a, b) => b.score - a.score);
      return suggestions.slice(0, count);
    },
    [items, profile],
  );

  return {
    items,
    profile,
    itemsByCategory,
    addItem,
    removeItem,
    updateItem,
    updateProfile,
    setProfile,
    generateOutfits,
  };
}
