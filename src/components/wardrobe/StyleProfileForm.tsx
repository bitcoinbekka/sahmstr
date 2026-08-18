import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import { useWardrobe } from '@/hooks/useWardrobe';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import type { StyleProfile } from '@/lib/wardrobeTypes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  SKIN_TONES,
  SKIN_UNDERTONES,
  BODY_TYPES,
  CLOTHING_STYLES,
  COLOR_FAMILIES,
  UNDERTONE_COLOR_HARMONY,
} from '@/lib/wardrobeTypes';
import type { SkinTone, SkinUndertone, BodyType, ClothingStyle, ColorFamily } from '@/lib/wardrobeTypes';

export function StyleProfileForm() {
  const { profile, updateProfile: persistProfile } = useWardrobe();

  // The form has no Save button — every change persists to localStorage
  // immediately. That silent save felt broken, so we flash a "Saved" indicator
  // whenever a change lands, and state up front that it saves automatically.
  const [justSaved, setJustSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateProfile = useCallback(
    (updates: Partial<StyleProfile>) => {
      persistProfile(updates);
      setJustSaved(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setJustSaved(false), 1800);
    },
    [persistProfile],
  );

  // Clean up the pending timeout on unmount.
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const toggleStyle = (style: ClothingStyle) => {
    const newStyles = profile.preferredStyles.includes(style)
      ? profile.preferredStyles.filter((s) => s !== style)
      : [...profile.preferredStyles, style];
    updateProfile({ preferredStyles: newStyles });
  };

  const toggleColorPref = (color: ColorFamily) => {
    const newColors = profile.colorPreferences.includes(color)
      ? profile.colorPreferences.filter((c) => c !== color)
      : [...profile.colorPreferences, color];
    // Remove from avoidColors if adding to preferences
    const newAvoid = profile.avoidColors.filter((c) => c !== color);
    updateProfile({ colorPreferences: newColors, avoidColors: newAvoid });
  };

  const toggleAvoidColor = (color: ColorFamily) => {
    const newAvoid = profile.avoidColors.includes(color)
      ? profile.avoidColors.filter((c) => c !== color)
      : [...profile.avoidColors, color];
    // Remove from preferences if adding to avoid
    const newPrefs = profile.colorPreferences.filter((c) => c !== color);
    updateProfile({ avoidColors: newAvoid, colorPreferences: newPrefs });
  };

  const recommendedPalettes = UNDERTONE_COLOR_HARMONY[profile.skinUndertone] || [];

  return (
    <div className="space-y-6">
      {/* Auto-save notice + live "Saved" confirmation. The form has no Save
          button by design; this makes the silent persistence visible. */}
      <div className="sticky top-2 z-10 flex items-center justify-between gap-3 rounded-xl border-2 border-primary/25 bg-background/90 px-4 py-3 shadow-sm backdrop-blur">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
          <span>
            Your profile saves automatically and stays private on this device —
            it is never published.
          </span>
        </p>
        <span
          className={`flex items-center gap-1.5 text-sm font-medium text-primary transition-opacity duration-300 ${
            justSaved ? 'opacity-100' : 'opacity-0'
          }`}
          aria-live="polite"
        >
          <Check className="h-4 w-4" />
          Saved
        </span>
      </div>

      {/* Skin Tone & Undertone */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Skin Tone & Undertone</CardTitle>
          <CardDescription>
            This helps us suggest colors that will look amazing on you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Skin Tone</Label>
            <div className="flex flex-wrap gap-3">
              {SKIN_TONES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => updateProfile({ skinTone: t.value as SkinTone })}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                    profile.skinTone === t.value ? 'border-primary shadow-md' : 'border-transparent hover:border-border'
                  }`}
                >
                  <span
                    className="h-10 w-10 rounded-full border border-border shadow-sm"
                    style={{ background: t.hex }}
                  />
                  <span className="text-xs font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Undertone</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SKIN_UNDERTONES.map((u) => (
                <button
                  key={u.value}
                  onClick={() => updateProfile({ skinUndertone: u.value as SkinUndertone })}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    profile.skinUndertone === u.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                  }`}
                >
                  <p className="font-semibold mb-1">{u.label}</p>
                  <p className="text-xs text-muted-foreground">{u.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Recommended palette based on undertone */}
          <div className="bg-muted rounded-xl p-4 space-y-2">
            <p className="text-sm font-medium">Recommended Color Palettes for Your Undertone</p>
            <div className="flex flex-wrap gap-2">
              {COLOR_FAMILIES.filter((c) => recommendedPalettes.includes(c.value)).map((c) => (
                <div key={c.value} className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-lg border">
                  <span className="flex gap-0.5">
                    {c.swatches.slice(0, 3).map((s) => (
                      <span key={s} className="h-3 w-3 rounded-full border border-border" style={{ background: s }} />
                    ))}
                  </span>
                  <span className="text-xs font-medium">{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Body Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Body Type</CardTitle>
          <CardDescription>
            Optional - helps us suggest the most flattering silhouettes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={profile.bodyType} onValueChange={(v) => updateProfile({ bodyType: v as BodyType })}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BODY_TYPES.map((b) => (
                <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Preferred Styles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Your Style</CardTitle>
          <CardDescription>
            Select the styles that speak to you (pick as many as you like)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {CLOTHING_STYLES.map((s) => (
              <button
                key={s.value}
                onClick={() => toggleStyle(s.value)}
                className={`text-left p-3 rounded-xl border-2 transition-all ${
                  profile.preferredStyles.includes(s.value) ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                }`}
              >
                <p className="font-medium text-sm">{s.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Color Preferences</CardTitle>
          <CardDescription>
            Tell us which colors you love and which ones you avoid
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Colors I Love</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_FAMILIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => toggleColorPref(c.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all text-sm ${
                    profile.colorPreferences.includes(c.value) ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                  }`}
                >
                  <span className="flex gap-0.5">
                    {c.swatches.slice(0, 3).map((s) => (
                      <span key={s} className="h-3 w-3 rounded-full border border-border" style={{ background: s }} />
                    ))}
                  </span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Colors I Avoid</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_FAMILIES.map((c) => (
                <Badge
                  key={c.value}
                  variant={profile.avoidColors.includes(c.value) ? 'destructive' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleAvoidColor(c.value)}
                >
                  {c.label}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
