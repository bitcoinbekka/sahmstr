import type { UnitDefinition } from './types';

/** All prose original. Structure follows the classic home economics scope-and-sequence; see provenance.ts. */
export const management: UnitDefinition = {
    id: 'home-management',
    title: 'Home Management',
    tagline: 'Systems, not willpower',
    description:
      'Work simplification, routines, time management, and household records — the organizational backbone that keeps a home running without exhausting the person running it.',
    opening:
      'This was the most quietly radical part of the old curriculum. It took the efficiency studies then being applied to factories and turned them on the kitchen — counting steps, timing tasks, mapping the actual path a woman walked to make a meal, and then redesigning the room so she walked less. The premise was that a homemaker\'s energy is a finite resource worth engineering around, and that fatigue is usually a design failure rather than a personal one. That premise deserves reviving.',
    icon: 'ClipboardList',
    lessons: [
      {
        id: 'goals-of-management',
        question: 'What is a home actually being managed toward?',
        title: 'What Management Is For',
        summary:
          'Efficiency is a means. Decide what it is a means to.',
        classicPrinciple:
          'Before any technique, the texts asked what the household was managing toward. Management was defined as the use of available resources — time, energy, money, skill, equipment — to reach ends the family had actually chosen. A spotless house that exhausted its keeper was not good management, because it had optimized something nobody selected.',
        modernApplication:
          'This question is more necessary now, because the standards on offer come from strangers. A feed will supply you with an aesthetic, a schedule, and a level of tidiness, all calibrated to hold attention rather than to serve your family. Naming your own ends is what makes it possible to decline theirs, and to know which corners are yours to cut.',
        practice: [
          'Write down what you want your home to be for. Three or four things, in plain words.',
          'For each recurring task, name which of those ends it serves. Some will serve none.',
          'Decide in advance which standards you are deliberately not meeting.',
          'Revisit the list twice a year — the answer changes as children grow.',
        ],
        sovereignNote:
          'A household with its own stated standards is much harder to sell things to. Most marketing works by supplying the standard first.',
        activities: [
          'Write your household\'s four aims on one card and post it somewhere you will see it while working.',
          'List every recurring chore and mark each as serving an aim, serving a habit, or serving an audience.',
          'Eliminate one task in the last category for a month and see whether anyone notices.',
        ],
      },
      {
        id: 'work-simplification',
        question: 'How can the work of the home be lessened?',
        title: 'Work Simplification',
        summary:
          'Redesign the task before you try harder at it.',
        classicPrinciple:
          'Home management borrowed directly from industrial efficiency study. Students mapped the actual motions of a recurring task, counted the steps, and redesigned the process — storing tools where they are used, grouping like work together, and eliminating unnecessary movement.',
        modernApplication:
          'This applies immediately to any task you repeat daily. If making school lunches takes eleven trips across the kitchen, the problem is the layout, not your energy. Fixing the process once pays out every single day, which is a far better return than resolving to be more disciplined.',
        practice: [
          'Pick your most-repeated task and count the actual steps and trips it requires.',
          'Relocate supplies to the point of use — even if it means duplicating cheap items.',
          'Group similar work into one session rather than scattering it.',
          'Remove one step permanently, then re-time the task.',
        ],
        activities: [
          'Draw the path you walk while making breakfast, marking every trip. Then redesign the storage and draw it again.',
          'Time one daily task before and after changing where its supplies live. Multiply the saving by three hundred and sixty-five.',
          'Move one frequently used item to its point of use and leave it there for a month.',
        ],
      },
      {
        id: 'conserving-energy',
        question: 'How shall the homemaker conserve energy and sustain zest?',
        title: 'Conserving Your Own Energy',
        summary:
          'Working height, posture, sitting down, and the honest limits of a day.',
        classicPrinciple:
          'The texts treated the homemaker\'s physical energy as a resource to be managed like any other, and were specific about it: correct working heights, sitting for tasks that permit it, alternating heavy work with light, and building genuine rest into the day rather than hoping for leftovers. Fatigue was framed as a management failure, not a character defect.',
        modernApplication:
          'This framing has been almost entirely replaced by the language of self-care, which tends to mean purchasing something. The original version is better because it is structural: adjust the counter height, sit to fold, alternate the heavy and the light, and stop before you are finished rather than after you are empty. Zest — their word — is a resource you can protect by design.',
        practice: [
          'Check the working height of the surfaces you use most; adjust the surface or your posture.',
          'Sit for every task that permits sitting. There are more of them than you think.',
          'Alternate heavy and light work rather than stacking the hard things together.',
          'Put one genuine rest into the day at a fixed time, and defend it.',
        ],
        activities: [
          'Note the time of day your energy actually falls, then move your heaviest task away from it.',
          'Sit down for one task you have always done standing and note whether the work suffered.',
          'Stop your household work at a set hour for one week, unfinished, and observe what actually broke.',
        ],
      },
      {
        id: 'routines-that-survive',
        question: 'How shall the day be planned so it survives a hard one?',
        title: 'Routines That Survive Real Life',
        summary: 'Build for the hard days, not the ideal ones.',
        classicPrinciple:
          'Households ran on assigned rhythms — particular work on particular days. The specific schedule mattered less than its predictability: everyone knew what happened when, and nothing critical depended on someone remembering.',
        modernApplication:
          'A routine calibrated to your best day will fail on your worst, which is precisely when you need it. Design the minimum viable version first — the handful of things that must happen for tomorrow to function — and treat everything beyond that as optional.',
        practice: [
          'Define a "bare minimum day": the few tasks that genuinely cannot slide.',
          'Anchor routines to fixed events like meals and bedtime rather than clock times.',
          'Assign recurring work to specific days so decisions are made in advance.',
          'Build in genuine slack. A schedule with no margin is a schedule that breaks.',
        ],
        activities: [
          'Write your bare-minimum day on a card and put it on the refrigerator for the next hard week.',
          'Assign each weekday one piece of recurring work and hold it for a month.',
          'Deliberately leave one afternoon a week entirely unscheduled and protect it for eight weeks.',
        ],
      },
      {
        id: 'distributing-responsibility',
        question: 'How shall the responsibilities of the home be distributed?',
        title: 'Distributing the Work Fairly',
        summary:
          'Name every task, assign it to a person, and stop negotiating nightly.',
        classicPrinciple:
          'The texts asked directly how household responsibility should be divided among family members, and treated the answer as a matter for explicit agreement rather than assumption. Work was to be named, matched to capability, and assigned — not absorbed silently by whoever noticed it first.',
        modernApplication:
          'Most household conflict about chores is really about invisible work: the noticing, planning, and remembering that never appears on any list. Writing down every task, including the mental ones, and assigning each to a named person ends more arguments than any conversation about fairness in the abstract.',
        practice: [
          'Write down every recurring household task, including the invisible ones — scheduling, remembering, tracking, deciding.',
          'Assign each to one named person who owns it completely, including the noticing.',
          'Review the division out loud every few months, as seasons and workloads change.',
          'Do not reassign silently. Renegotiate openly or resentment does it for you.',
        ],
        activities: [
          'Both adults independently list every household task and who does it, then compare the two lists. The gaps are the conversation.',
          'Add the invisible tasks explicitly — appointments, gifts, forms, refills — and assign each an owner.',
          'Trade two tasks between adults for one month and discuss what each learned.',
        ],
      },
      {
        id: 'household-records',
        question: 'What records should a household keep?',
        title: 'Household Records and Inventory',
        summary: 'Write down what you own, what it cost, and when it needs attention.',
        classicPrinciple:
          'Careful records were standard practice: household accounts, inventories of durable goods, receipts, warranties, and maintenance schedules. The purpose was straightforward — a household that knows what it owns and what things cost makes better decisions than one operating on memory.',
        modernApplication:
          'Most households still cannot answer basic questions about their own possessions and spending. A simple inventory improves insurance outcomes, prevents duplicate buying, and makes maintenance proactive rather than reactive. Keep at least one copy offline.',
        practice: [
          'Photograph major possessions and note purchase date and price.',
          'Track actual spending for two full months before attempting to optimize it.',
          'Keep a maintenance calendar for filters, batteries, servicing, and seasonal tasks.',
          'Store one copy of critical records offline, and tell your spouse where it is.',
        ],
        sovereignNote:
          'Records you hold yourself cannot be lost when a service shuts down or an account is closed.',
        activities: [
          'Walk through your home with a camera and record every room. Store the file somewhere that is not only in the cloud.',
          'Build a one-page maintenance calendar for the year and put it where the tools are.',
          'Ask yourself three questions about your own possessions — cost, purchase date, warranty status — and see whether you can answer any.',
        ],
      },
      {
        id: 'delegation-and-training',
        question: 'How is delegating work an act of teaching?',
        title: 'Delegation as Teaching',
        summary: 'Children doing real work badly is the point.',
        classicPrinciple:
          'Household work was distributed across the family, with tasks matched to age and capability. This was framed as education rather than assistance — the child is learning household competence, and the labor saved is a secondary benefit.',
        modernApplication:
          'Doing everything yourself is faster this week and costlier over years. A seven-year-old who folds towels imperfectly is on the way to being a twelve-year-old who genuinely helps. Accepting imperfect work is the tuition payment for that outcome.',
        practice: [
          'Assign each child one task they own completely, not one they assist with.',
          'Teach the task fully once, then step back and let the standard be theirs.',
          'Resist redoing their work in front of them.',
          'Increase responsibility as competence grows, and say so out loud.',
        ],
        activities: [
          'Teach one child one task properly, start to finish, then hand it over entirely for a month without correction.',
          'Write down what each child could reasonably own at their age and compare it to what they currently do.',
          'Let a child plan and cook one family dinner, including the shopping list.',
        ],
      },
      {
        id: 'leisure-and-rest',
        question: 'Why is planning for leisure essential to good management?',
        title: 'Planning for Leisure',
        summary:
          'Rest that is not scheduled does not happen. Neither does anything worth remembering.',
        classicPrinciple:
          'Leisure had its own place in the management unit, on the argument that recreation and rest are requirements of a functioning household rather than rewards for finishing the work — which is never finished. Family recreation in particular was planned deliberately, because unplanned leisure tends to become whatever is easiest.',
        modernApplication:
          'Unplanned leisure now reliably becomes a screen, because a great deal of engineering has gone into making that the path of least resistance. Deciding in advance what your family will do with an evening is the entire intervention. It need not be elaborate; it needs only to be chosen rather than defaulted into.',
        practice: [
          'Schedule family recreation the way you schedule obligations, and treat it as equally firm.',
          'Choose the activity in advance so the default never gets to decide.',
          'Keep something ready that requires no setup — a card deck, a walk route, an unfinished puzzle.',
          'Protect one block of your own leisure that belongs to nobody else.',
        ],
        activities: [
          'Log how your household actually spends its evenings for one week, without judgment.',
          'Plan one evening a week in advance for a month and note which were remembered afterward.',
          'Put every device in one basket for a single evening and see what the family does instead.',
        ],
      },
    ],
};
