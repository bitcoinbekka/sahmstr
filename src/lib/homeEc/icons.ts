import {
  Wallet,
  UtensilsCrossed,
  Scissors,
  ClipboardList,
  HeartPulse,
  Users,
  Baby,
  ShoppingBag,
  Home,
  SprayCan,
  ShieldCheck,
  Heart,
  Sprout,
  Activity,
  Network,
  BookOpen,
  Lightbulb,
  type LucideIcon,
} from 'lucide-react';

/**
 * The single registry of icons available to curriculum units.
 *
 * Units reference icons by key. Because `UnitIconName` is derived from this
 * object, a typo or an icon that isn't imported here is a TypeScript error at
 * build time rather than a runtime crash — which is exactly the failure we hit
 * when an icon name was referenced in unit data but missing from a page's local
 * lookup map.
 *
 * To add an icon: import it above and add it here. Nowhere else.
 */
export const UNIT_ICONS = {
  Wallet,
  UtensilsCrossed,
  Scissors,
  ClipboardList,
  HeartPulse,
  Users,
  Baby,
  ShoppingBag,
  Home,
  SprayCan,
  ShieldCheck,
  Heart,
  Sprout,
  Activity,
  Network,
  BookOpen,
} as const satisfies Record<string, LucideIcon>;

export type UnitIconName = keyof typeof UNIT_ICONS;

/** Resolve a unit icon name to a component, falling back to a safe default. */
export function resolveUnitIcon(name: UnitIconName | string): LucideIcon {
  return (UNIT_ICONS as Record<string, LucideIcon>)[name] ?? Lightbulb;
}
