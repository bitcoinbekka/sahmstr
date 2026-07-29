import type { UnitDefinition } from './types';

/** All prose original. Structure follows the classic home economics scope-and-sequence; see provenance.ts. */
export const houseCare: UnitDefinition = {
    id: 'caring-for-the-house',
    title: 'Caring for the House',
    tagline: 'Maintenance, cleaning, pests, and safety',
    description:
      'What upkeep a dwelling requires, how to clean effectively rather than constantly, keeping pests out, and making a home genuinely safe for children.',
    opening:
      'An entire unit was given to the care of the house — surfaces, furnishings, equipment, utensils, laundry, stains, pests, and safety — on the understanding that a household which maintains what it owns spends far less than one which replaces it. Cleaning was taught as chemistry and sequence, not as effort. And the safety instruction was blunt in a way modern advice rarely is, because the hazards it named were the ones that actually injured children.',
    icon: 'SprayCan',
    lessons: [
      {
        id: 'what-care-the-house-requires',
        question: 'What care does the house require, and how often?',
        title: 'The Maintenance a House Requires',
        summary:
          'A written schedule beats a good memory, and prevents most large repairs.',
        classicPrinciple:
          'House care was organized by frequency: what must be done daily, weekly, seasonally, and annually. The seasonal and annual items — gutters, filters, seals, drains, roof, heating — were the ones that prevented expensive failure, and precisely the ones nobody remembers without a written schedule.',
        modernApplication:
          'This has not changed at all, and the failure mode is identical. Nearly every catastrophic household repair was preceded by a cheap maintenance task that went undone for years. A single sheet of paper listing what happens in which month, kept where the tools are, is one of the highest-return documents a household can own.',
        practice: [
          'Write a maintenance calendar by month: filters, gutters, drains, detectors, seals, servicing.',
          'Do a walkthrough each season looking specifically for water — the most expensive thing that can go wrong quietly.',
          'Keep the schedule where the tools are, not in an app you will stop opening.',
          'Record what you did and when, so the next owner or the next you knows.',
        ],
        activities: [
          'Build a twelve-month maintenance calendar for your specific dwelling this week.',
          'Inspect every place water enters or leaves the house and note anything damp, stained, or slow.',
          'Find out how old your roof, water heater, and heating system are, and write down each expected remaining life.',
        ],
      },
      {
        id: 'cleaning-effectively',
        question: 'How shall the house be cleaned with the least labor?',
        title: 'Cleaning as Chemistry and Sequence',
        summary:
          'Fewer products, correct order, and letting time do the work.',
        classicPrinciple:
          'Cleaning was taught by surface and by soil type: what dissolves grease, what handles mineral deposit, what is safe on which finish, and in what order to work so that you never clean the same surface twice. Understanding the categories meant a household needed few products and less scrubbing.',
        modernApplication:
          'The modern cabinet holds a dozen specialized products doing the work of three, most of them sold on scent and packaging. Learn the small number of real categories — a detergent, an acid, an alkaline cleaner, a disinfectant where genuinely needed — and let dwell time replace effort. Work top to bottom, dry to wet, and never mix products you do not understand.',
        practice: [
          'Reduce to a few products you understand: detergent, an acid for mineral, an alkaline cleaner for grease.',
          'Let cleaners dwell. Time does the work that scrubbing otherwise has to.',
          'Work top to bottom and dry before wet, so you never redo a surface.',
          'Never combine cleaning products unless you know exactly what the combination does.',
        ],
        activities: [
          'Clear out your cleaning cabinet and identify what each remaining product chemically does.',
          'Clean one room top-to-bottom in the correct sequence and time it against your usual approach.',
          'Test dwell time: apply a cleaner and wait ten minutes before touching it. Compare the effort required.',
        ],
      },
      {
        id: 'household-pests',
        question: 'How can the house be kept free of pests?',
        title: 'Keeping Pests Out',
        summary:
          'Exclusion, then sanitation, then — only if needed — treatment.',
        classicPrinciple:
          'Pest control was taught in an order that still holds: first deny entry, then deny food and water, then treat. Sealing gaps, storing food in closed containers, eliminating standing water, and keeping clutter down were understood as the actual work; chemical treatment was the last step, not the first.',
        modernApplication:
          'The order remains correct and is now the mainstream professional view. Households that begin with a spray and skip exclusion and sanitation treat the same problem indefinitely. Find the entry point and the food source — that is the entire job, and it is usually the least appealing part of it.',
        practice: [
          'Seal entry points: gaps at pipes, doors, windows, foundation, and vents.',
          'Store all food, including pet food, in sealed containers.',
          'Eliminate standing water and fix slow leaks promptly.',
          'Treat only after exclusion and sanitation, and follow label directions exactly.',
        ],
        activities: [
          'Inspect the perimeter of your home for gaps larger than a pencil and seal what you find.',
          'Move all pantry staples into sealed containers and note what you discover in the process.',
          'Identify the food or water source sustaining any pest you currently have, before buying anything.',
        ],
      },
      {
        id: 'home-safety',
        question: 'How can the house be made a safe place to live?',
        title: 'Making the Home Safe',
        summary:
          'Falls, fire, poisons, water, and the hazards specific to small children.',
        classicPrinciple:
          'Home safety was covered directly and specifically, hazard by hazard: falls, burns and fire, poisons, electrical faults, and drowning. The approach was systematic — walk the house looking for each category of hazard rather than waiting for something to happen and reacting to it.',
        modernApplication:
          'The specific hazards have shifted somewhat — batteries, detergent packets, furniture tip-overs, medications — but the method is unchanged and still the best available. Get down to a child\'s height and look. Then rehearse the fire exit, because the thing you have practiced is the thing you will do when there is no time to think.',
        practice: [
          'Walk the house at a child\'s eye level, room by room, and remove what you find.',
          'Test smoke and carbon monoxide detectors on a fixed schedule and replace them at end of life.',
          'Anchor tall furniture and televisions to the wall. Tip-overs are both common and preventable.',
          'Store medications and cleaning products locked and high — not merely out of reach.',
          'Practice the fire exit route with every child, including at night.',
        ],
        activities: [
          'Crawl through every room at toddler height and write down everything reachable that should not be.',
          'Run one unannounced fire drill with the whole family and note how long it took.',
          'Check every anchor point on tall furniture, and add the ones that are missing this week.',
        ],
      },
    ],
};
