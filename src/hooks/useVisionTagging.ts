/**
 * useVisionTagging — one hook, two roads to the same result.
 *
 * Photo tagging can run two ways, and this hook picks the right one:
 *
 *   1. **BYOK (bring your own key).** If the owner has saved an API key for an
 *      OpenAI-compatible vision provider (xAI/Grok, OpenAI, OpenRouter, …) in
 *      Settings, we call that provider directly from the browser. No wallet, no
 *      sats — the key pays. Right for a personal or single-operator site.
 *      See `src/lib/aiVision.ts` and ADR-016.
 *
 *   2. **contextVM (sovereign, pay-per-use).** Otherwise we fall back to the
 *      sats-native contextVM path (`useContextVMVision`), where the user's
 *      Lightning wallet pays a server per photo and no key exists in the bundle.
 *
 * The two paths share one shape — `tagImage(imageUrl, instruction) → text` — so
 * the wardrobe and pantry dialogs don't care which one is active. This hook
 * exposes a `mode` so the UI can adjust its copy (a wallet is only relevant to
 * the contextVM path).
 */

import { useCallback, useMemo, useState } from 'react';
import {
  loadVisionConfig,
  isVisionConfigured,
  visionComplete,
} from '@/lib/aiVision';
import { useContextVMVision } from '@/hooks/useContextVMVision';
import type { VisionResult } from '@/hooks/useContextVMVision';

/** Which backend is currently in play. */
export type VisionMode = 'byok' | 'contextvm';

/** The stages the shared AITagButton understands. */
type Stage = 'idle' | 'sending' | 'awaiting-payment' | 'paying' | 'thinking' | 'done' | 'error';

export function useVisionTagging() {
  // The contextVM path is always instantiated (hooks can't be conditional), but
  // we only use it when no BYOK key is configured.
  const cvm = useContextVMVision();

  // Read the BYOK config fresh each render so saving a key in Settings takes
  // effect without a reload. (localStorage read is cheap.)
  const byokConfig = loadVisionConfig();
  const byokReady = isVisionConfigured(byokConfig);

  const mode: VisionMode = byokReady ? 'byok' : 'contextvm';

  // --- BYOK-local state (mirrors the contextVM hook's surface) ---
  const [byokStage, setByokStage] = useState<Stage>('idle');
  const [byokError, setByokError] = useState<string | null>(null);

  const resetByok = useCallback(() => {
    setByokStage('idle');
    setByokError(null);
  }, []);

  const tagImageByok = useCallback(
    async (imageUrl: string, instruction: string): Promise<VisionResult | null> => {
      setByokError(null);
      const config = loadVisionConfig();
      if (!isVisionConfigured(config) || !config) {
        setByokError('No AI provider is set up. Add a key in Settings.');
        setByokStage('error');
        return null;
      }
      setByokStage('thinking');
      try {
        const text = await visionComplete({ config, imageUrl, instruction });
        setByokStage('done');
        return { text, paidSats: 0 };
      } catch (err) {
        setByokError(err instanceof Error ? err.message : 'The AI request failed.');
        setByokStage('error');
        return null;
      }
    },
    [],
  );

  // --- Unified surface, chosen by mode ---
  return useMemo(() => {
    if (mode === 'byok') {
      return {
        mode,
        tagImage: tagImageByok,
        stage: byokStage,
        error: byokError,
        paidSats: 0,
        reset: resetByok,
        isConfigured: true,
        isBusy: byokStage === 'thinking',
        /** BYOK needs no wallet, so report "ready" to the button. */
        hasWallet: true,
      };
    }
    return {
      mode,
      tagImage: cvm.tagImage,
      stage: cvm.stage,
      error: cvm.error,
      paidSats: cvm.paidSats,
      reset: cvm.reset,
      isConfigured: cvm.isConfigured,
      isBusy: cvm.isBusy,
      hasWallet: undefined as boolean | undefined, // filled by caller via useWallet
    };
  }, [mode, tagImageByok, byokStage, byokError, resetByok, cvm]);
}
