/**
 * SAHMstr Home Economics Curriculum
 *
 * All prose in this directory is original writing produced for SAHMstr.
 *
 * The *structure* is deliberately modeled on the mid-century American home
 * economics textbook tradition — in particular "Today's Home Living" (Justin &
 * Rust, J. B. Lippincott, 1947), a Kansas State College high school text whose
 * table of contents we used as a scope-and-sequence reference. That tradition
 * organized instruction into broad UNITS, and divided each unit into numbered
 * PROBLEMS, each phrased as a plain question a household actually has to
 * answer, followed by suggested activities for the student.
 *
 * We keep that shape because it is genuinely good pedagogy: a question invites
 * thought where a heading only announces a topic. What we have changed is the
 * answer. Each problem states the enduring principle, then works out how it
 * holds up in a world of engineered persuasion, subscription ownership,
 * custodial everything, and a currency that quietly loses value.
 *
 * The ordering below follows the arc of the original: begin with the family and
 * the person, then the running of a household, then the dwelling, then money
 * and consumption, then children, then health, and close by widening the frame
 * to the systems the household sits inside. That final unit is ours — see
 * provenance.ts for what we changed and why.
 */

import type { CurriculumModule, UnitDefinition } from './types';
import { getUnitTone, TONE_INK, TONE_WASH } from './posters';

import { successfulFamily } from './successfulFamily';
import { growingUp } from './growingUp';
import { management } from './management';
import { house } from './house';
import { houseCare } from './houseCare';
import { food } from './food';
import { textiles } from './textiles';
import { householdFinance } from './householdFinance';
import { consumer } from './consumer';
import { youngChild } from './youngChild';
import { childDevelopment } from './childDevelopment';
import { hospitality } from './hospitality';
import { health } from './health';
import { nursing } from './nursing';
import { digital } from './digital';
import { protocols } from './protocols';

/**
 * Units in teaching order. Unit numbers are derived from this array, so
 * reordering here renumbers the whole curriculum consistently.
 */
const UNITS: UnitDefinition[] = [
  // The person and the family
  successfulFamily,
  growingUp,

  // Running a household
  management,
  house,
  houseCare,
  food,
  textiles,

  // Money and consumption
  householdFinance,
  consumer,

  // Children
  youngChild,
  childDevelopment,

  // The household outward
  hospitality,

  // Health
  health,
  nursing,

  // Records, keys, and the systems the household sits inside
  digital,
  protocols,
];

export const CURRICULUM: CurriculumModule[] = UNITS.map((unit, i) => {
  const tone = getUnitTone(unit.id);
  return {
    ...unit,
    number: i + 1,
    tone,
    wash: TONE_WASH[tone],
    ink: TONE_INK[tone],
  };
});

/** Find a unit by its id */
export function getModule(id: string): CurriculumModule | undefined {
  return CURRICULUM.find((m) => m.id === id);
}

/** Total problem count across the curriculum */
export const TOTAL_LESSONS = CURRICULUM.reduce((sum, m) => sum + m.lessons.length, 0);

export { PROVENANCE } from './provenance';
export {
  HERO_POSTER,
  SECTION_POSTERS,
  UNIT_POSTERS,
  POSTER_GALLERY,
  TONE_WASH,
  TONE_INK,
  getUnitPoster,
  getUnitTone,
} from './posters';
export type { Poster, PosterTone } from './posters';
export type { Lesson, CurriculumModule, UnitDefinition } from './types';
