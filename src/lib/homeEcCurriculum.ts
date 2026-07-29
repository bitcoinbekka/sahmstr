/**
 * The curriculum now lives in `src/lib/homeEc/`, one file per unit.
 * This module re-exports it so existing imports keep working.
 */
export {
  CURRICULUM,
  getModule,
  TOTAL_LESSONS,
  PROVENANCE,
} from './homeEc';

export type { Lesson, CurriculumModule, UnitDefinition } from './homeEc';
