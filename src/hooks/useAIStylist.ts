import { useCallback, useState } from 'react';
import { useShakespeare, type ChatMessage } from '@/hooks/useShakespeare';
import { useAIModels } from '@/hooks/useAIModels';
import { useWardrobe } from '@/hooks/useWardrobe';
import type { Season, Occasion, WardrobeItem } from '@/lib/wardrobeTypes';
import {
  buildOutfitSystemPrompt,
  buildOutfitUserPrompt,
  parseOutfitResponse,
  buildAutoTagSystemPrompt,
  buildAutoTagUserPrompt,
  parseAutoTagResponse,
  type AIOutfit,
  type AIItemTags,
  type WeatherContext,
} from '@/lib/stylistPrompts';

/** An AI outfit with its item references resolved */
export interface ResolvedAIOutfit extends AIOutfit {
  items: WardrobeItem[];
}

export interface GenerateOutfitsParams {
  season: Season;
  occasion: Occasion;
  weather?: WeatherContext | null;
  notes?: string;
  count?: number;
}

export function useAIStylist() {
  const { items, profile } = useWardrobe();
  const { selectedModel, visionModel } = useAIModels();
  const { sendChatMessage } = useShakespeare();

  const [outfits, setOutfits] = useState<ResolvedAIOutfit[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const [isTagging, setIsTagging] = useState(false);
  const [tagError, setTagError] = useState<string | null>(null);

  /** Ask the AI to build outfits from the user's closet */
  const generateOutfits = useCallback(
    async ({ season, occasion, weather, notes, count = 3 }: GenerateOutfitsParams) => {
      if (!selectedModel) {
        setGenerateError('No AI model available. Please try again in a moment.');
        return;
      }
      if (items.length < 2) {
        setGenerateError('Add at least two items to your closet first.');
        return;
      }

      setIsGenerating(true);
      setGenerateError(null);

      try {
        const messages: ChatMessage[] = [
          { role: 'system', content: buildOutfitSystemPrompt() },
          {
            role: 'user',
            content: buildOutfitUserPrompt({ items, profile, season, occasion, weather, notes, count }),
          },
        ];

        const response = await sendChatMessage(messages, selectedModel.id, {
          temperature: 0.8,
          max_tokens: 2000,
        });

        const raw = response.choices?.[0]?.message?.content;
        const text = typeof raw === 'string'
          ? raw
          : Array.isArray(raw)
            ? raw.map((p) => p.text ?? '').join('')
            : '';

        const validIds = new Set(items.map((i) => i.id));
        const parsed = parseOutfitResponse(text, validIds);

        if (parsed.length === 0) {
          setGenerateError(
            'The stylist had trouble putting looks together. Try again, or pick a different model.',
          );
          setOutfits([]);
          return;
        }

        const itemMap = new Map(items.map((i) => [i.id, i]));
        const resolved: ResolvedAIOutfit[] = parsed.map((outfit) => ({
          ...outfit,
          items: outfit.itemIds
            .map((id) => itemMap.get(id))
            .filter((i): i is WardrobeItem => !!i),
        }));

        setOutfits(resolved);
      } catch (err) {
        setGenerateError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        setOutfits([]);
      } finally {
        setIsGenerating(false);
      }
    },
    [selectedModel, items, profile, sendChatMessage],
  );

  /** Analyze a clothing photo and return suggested tags */
  const autoTagImage = useCallback(
    async (imageUrl: string): Promise<AIItemTags | null> => {
      const model = visionModel ?? selectedModel;
      if (!model) {
        setTagError('No AI model available for image analysis.');
        return null;
      }

      setIsTagging(true);
      setTagError(null);

      try {
        const messages: ChatMessage[] = [
          { role: 'system', content: buildAutoTagSystemPrompt() },
          {
            role: 'user',
            content: [
              { type: 'text', text: buildAutoTagUserPrompt() },
              { type: 'image_url', image_url: { url: imageUrl } },
            ],
          },
        ];

        const response = await sendChatMessage(messages, model.id, {
          temperature: 0.3,
          max_tokens: 700,
        });

        const raw = response.choices?.[0]?.message?.content;
        const text = typeof raw === 'string'
          ? raw
          : Array.isArray(raw)
            ? raw.map((p) => p.text ?? '').join('')
            : '';

        const tags = parseAutoTagResponse(text);
        if (!tags) {
          setTagError("Couldn't read the photo details. Please fill the fields in manually.");
          return null;
        }
        return tags;
      } catch (err) {
        setTagError(err instanceof Error ? err.message : 'Image analysis failed.');
        return null;
      } finally {
        setIsTagging(false);
      }
    },
    [visionModel, selectedModel, sendChatMessage],
  );

  const clearOutfits = useCallback(() => {
    setOutfits([]);
    setGenerateError(null);
  }, []);

  return {
    // Outfit generation
    outfits,
    generateOutfits,
    clearOutfits,
    isGenerating,
    generateError,
    // Auto-tagging
    autoTagImage,
    isTagging,
    tagError,
    // Meta
    hasVisionModel: !!visionModel,
  };
}
