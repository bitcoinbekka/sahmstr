import { describe, it, expect } from 'vitest';
import {
  TYPE_SETTINGS,
  TYPE_SETTING_LIST,
  DEFAULT_TYPE_SETTING,
  applyTypeSetting,
  isTypeSettingId,
  bootstrapTypeSetting,
} from './typeSettings';

describe('typeSettings', () => {
  it('every setting declares a display, body and slab face', () => {
    for (const setting of Object.values(TYPE_SETTINGS)) {
      expect(setting.display, `${setting.id} display`).toBeTruthy();
      expect(setting.body, `${setting.id} body`).toBeTruthy();
      expect(setting.slab, `${setting.id} slab`).toBeTruthy();
    }
  });

  it('every setting falls back to a generic family', () => {
    // If a webfont fails to load the text must still render in something.
    for (const setting of Object.values(TYPE_SETTINGS)) {
      expect(setting.display, `${setting.id} display`).toMatch(
        /serif|sans-serif/,
      );
      expect(setting.body, `${setting.id} body`).toMatch(/serif|sans-serif/);
    }
  });

  it('the list contains every setting exactly once', () => {
    const ids = TYPE_SETTING_LIST.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBe(Object.keys(TYPE_SETTINGS).length);
  });

  it('the default setting exists', () => {
    expect(TYPE_SETTINGS[DEFAULT_TYPE_SETTING]).toBeDefined();
  });

  it('validates ids', () => {
    expect(isTypeSettingId('didone')).toBe(true);
    expect(isTypeSettingId('helvetica')).toBe(false);
    expect(isTypeSettingId(undefined)).toBe(false);
    expect(isTypeSettingId(42)).toBe(false);
  });

  it('writes the font variables onto the document root', () => {
    applyTypeSetting('egyptian');

    const root = document.documentElement;
    expect(root.style.getPropertyValue('--font-display')).toContain('Alfa Slab');
    expect(root.dataset.type).toBe('egyptian');
  });

  it('does not throw on an unknown id', () => {
    // @ts-expect-error deliberately invalid, as could arrive from storage
    expect(() => applyTypeSetting('nonesuch')).not.toThrow();
  });

  it('bootstraps without throwing when storage holds junk', () => {
    localStorage.setItem('sahmstr:type-setting:v1', '{{{not json');
    expect(() => bootstrapTypeSetting()).not.toThrow();
    localStorage.clear();
  });
});
