/**
 * Shared types for the SAHMstr home economics curriculum.
 *
 * The curriculum is split across one file per unit in this directory. See
 * `index.ts` for the assembled ordering and `provenance.ts` for a statement of
 * what this material is and what it is not.
 */

import type { UnitIconName } from './icons';

export interface Lesson {
  id: string;
  /** The lesson framed as a question, in the classic "problem" style */
  question: string;
  /** Short display title */
  title: string;
  summary: string;
  /** The timeless principle, as classic home economics taught it */
  classicPrinciple: string;
  /** How it applies today, with a sovereignty lens */
  modernApplication: string;
  /** Concrete things to actually do */
  practice: string[];
  /** Optional connection to bitcoin / nostr / sovereignty thinking */
  sovereignNote?: string;
  /** Suggested activities, in the tradition of end-of-problem exercises */
  activities?: string[];
}

/** A unit, minus its number — numbers are derived from ordering in index.ts */
export interface UnitDefinition {
  id: string;
  title: string;
  tagline: string;
  description: string;
  /** The unit's opening passage, meant to be read before the problems */
  opening?: string;
  /**
   * Icon key from the registry in `icons.ts`. Typed, so an unregistered name is
   * a build error rather than a runtime crash.
   */
  icon: UnitIconName;
  /** Tailwind gradient classes for the unit badge */
  gradient: string;
  /**
   * True for units with no ancestor in the classic curriculum — these are
   * marked in the UI so readers know the difference.
   */
  isNew?: boolean;
  lessons: Lesson[];
}

/** A unit with its derived number, as consumed by the UI */
export interface CurriculumModule extends UnitDefinition {
  number: number;
}
