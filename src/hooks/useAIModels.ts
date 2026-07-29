import { useQuery } from '@tanstack/react-query';
import { useShakespeare, type Model } from '@/hooks/useShakespeare';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useCallback, useMemo } from 'react';

export interface ModelInfo extends Model {
  /** Total cost per token (prompt + completion) */
  totalCost: number;
  /** True when the model costs nothing to use */
  isFree: boolean;
  /** Heuristic: model likely accepts image inputs */
  supportsVision: boolean;
}

/** Keywords that suggest a model can process images */
const VISION_HINTS = [
  'vision', 'image', 'multimodal', 'visual', 'omni',
  'gpt-4o', 'gpt-4.1', 'gpt-5', 'claude', 'gemini', 'llava', 'pixtral', 'qwen-vl', 'qwen2-vl',
];

function analyzeModel(model: Model): ModelInfo {
  const prompt = parseFloat(model.pricing?.prompt ?? '0') || 0;
  const completion = parseFloat(model.pricing?.completion ?? '0') || 0;
  const totalCost = prompt + completion;

  const haystack = `${model.id} ${model.name} ${model.description ?? ''}`.toLowerCase();
  const supportsVision = VISION_HINTS.some((hint) => haystack.includes(hint));

  return {
    ...model,
    totalCost,
    isFree: prompt === 0 && completion === 0,
    supportsVision,
  };
}

/**
 * Fetches available AI models and remembers the user's selection.
 */
export function useAIModels() {
  const { user } = useCurrentUser();
  const { getAvailableModels } = useShakespeare();
  const [savedModelId, setSavedModelId] = useLocalStorage<string>('sahmstr-ai-model', '');

  const query = useQuery({
    queryKey: ['ai-models', user?.pubkey],
    queryFn: async () => {
      const response = await getAvailableModels();
      return response.data
        .map(analyzeModel)
        .sort((a, b) => {
          // Free models first, then cheapest
          if (a.isFree !== b.isFree) return a.isFree ? -1 : 1;
          return a.totalCost - b.totalCost;
        });
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });

  const models = query.data ?? [];

  /** The currently selected model, falling back to the cheapest available */
  const selectedModel = useMemo(() => {
    if (models.length === 0) return null;
    return models.find((m) => m.id === savedModelId) ?? models[0];
  }, [models, savedModelId]);

  /** Best model for image analysis — prefers free vision models */
  const visionModel = useMemo(() => {
    if (models.length === 0) return null;
    // If the user's pick handles vision, respect it
    if (selectedModel?.supportsVision) return selectedModel;
    return models.find((m) => m.supportsVision) ?? null;
  }, [models, selectedModel]);

  const selectModel = useCallback((id: string) => {
    setSavedModelId(id);
  }, [setSavedModelId]);

  return {
    models,
    selectedModel,
    visionModel,
    selectModel,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
  };
}
