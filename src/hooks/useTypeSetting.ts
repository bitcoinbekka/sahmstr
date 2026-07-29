import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_TYPE_SETTING,
  TYPE_SETTINGS,
  TYPE_SETTING_STORAGE_KEY,
  applyTypeSetting,
  isTypeSettingId,
  type TypeSettingId,
} from '@/lib/typeSettings';

/** Read the saved setting, tolerating anything at all in storage. */
function readStored(): TypeSettingId {
  try {
    const raw = localStorage.getItem(TYPE_SETTING_STORAGE_KEY);
    if (!raw) return DEFAULT_TYPE_SETTING;
    const parsed: unknown = JSON.parse(raw);
    return isTypeSettingId(parsed) ? parsed : DEFAULT_TYPE_SETTING;
  } catch {
    return DEFAULT_TYPE_SETTING;
  }
}

/**
 * The active typographic setting.
 *
 * This hook runs inside the Header, which renders on every page — so a throw
 * here would blank the entire site. It therefore owns its storage access
 * directly and guards every step, rather than depending on a generic helper.
 * The worst case is that the site stays on the default face.
 */
export function useTypeSetting() {
  const [settingId, setSettingId] = useState<TypeSettingId>(readStored);

  // Keep the document in step with the state.
  useEffect(() => {
    applyTypeSetting(settingId);
  }, [settingId]);

  // Follow changes made in another tab.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== TYPE_SETTING_STORAGE_KEY) return;
      setSettingId(readStored());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setSetting = useCallback((id: TypeSettingId) => {
    if (!isTypeSettingId(id)) return;

    setSettingId(id);
    // Apply straight away so the change is felt on click, not on next paint.
    applyTypeSetting(id);

    try {
      localStorage.setItem(TYPE_SETTING_STORAGE_KEY, JSON.stringify(id));
    } catch {
      // Private browsing or a full quota: the choice simply won't persist.
    }
  }, []);

  return {
    settingId,
    setting: TYPE_SETTINGS[settingId] ?? TYPE_SETTINGS[DEFAULT_TYPE_SETTING],
    setSetting,
  };
}
