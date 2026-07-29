import { useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  DEFAULT_TYPE_SETTING,
  TYPE_SETTINGS,
  TYPE_SETTING_STORAGE_KEY,
  applyTypeSetting,
  isTypeSettingId,
  type TypeSettingId,
} from '@/lib/typeSettings';

/**
 * The active typographic setting.
 *
 * Persists to localStorage and writes the font variables onto the document
 * root, so the choice survives a reload. On return visits the saved setting is
 * applied ahead of first render by bootstrapTypeSetting() in main.tsx.
 */
export function useTypeSetting() {
  const [stored, setStored] = useLocalStorage<TypeSettingId>(
    TYPE_SETTING_STORAGE_KEY,
    DEFAULT_TYPE_SETTING,
  );

  // Guard against a stale or hand-edited value in storage.
  const settingId = isTypeSettingId(stored) ? stored : DEFAULT_TYPE_SETTING;

  useEffect(() => {
    applyTypeSetting(settingId);
  }, [settingId]);

  const setSetting = useCallback(
    (id: TypeSettingId) => {
      setStored(id);
      // Apply straight away so the change is felt on click, not on next paint.
      applyTypeSetting(id);
    },
    [setStored],
  );

  return {
    settingId,
    setting: TYPE_SETTINGS[settingId],
    setSetting,
  };
}
