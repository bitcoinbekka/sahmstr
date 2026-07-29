import type { UnitDefinition } from './types';

/**
 * Unit: Keeping in Good Health
 *
 * Structurally modeled on the classic health unit — what health is, what
 * determines it, food, daily practices, and how the body is protected from
 * disease. All prose original. General household practice, not medical advice.
 */
export const health: UnitDefinition = {
  id: 'keeping-good-health',
  title: 'Keeping in Good Health',
  tagline: 'The unglamorous inputs',
  description:
    'What determines a household\'s health, the daily practices that account for most of it, and how to think clearly about health information you did not seek out.',
  opening:
    'A full unit was given to staying well, as distinct from treating illness — and it asked the right question first: what actually determines our state of health? The answer given was mostly unexciting. Sleep, food, movement, cleanliness, air, light, and the avoidance of specific known hazards. No single item on that list is interesting enough to sell, which is precisely why the modern information environment talks about everything else. This unit is general household practice, not medical advice; the clinical questions belong with your physician.',
  icon: 'Activity',
  lessons: [
    {
      id: 'what-determines-health',
      question: 'What determines our state of health?',
      title: 'The Inputs That Actually Matter',
      summary:
        'A short, boring list accounts for most of it.',
      classicPrinciple:
        'The texts enumerated the determinants plainly: adequate sleep, sufficient and varied food, daily physical activity, cleanliness, fresh air and daylight, dental care, and the avoidance of known hazards. Inheritance and environment were acknowledged as constraints, but the emphasis fell on the daily practices a household actually controls.',
      modernApplication:
        'That list has survived a great deal of subsequent research nearly intact, which is remarkable and also inconvenient — there is no product in it. Sleep in particular is the input with the largest effect and the one most casually sacrificed. Fix the boring inputs first and most household health questions become smaller.',
      practice: [
        'Treat sleep as the first health intervention, for adults as well as children.',
        'Get daylight early in the day and movement every day, without making either a project.',
        'Handle the routine maintenance: dental care, vision, and the examinations appropriate to your age.',
        'Fix the boring inputs before investigating anything exotic.',
      ],
      activities: [
        'Track your household\'s actual sleep for two weeks and compare it against what each person needs.',
        'Add a daily walk for the whole household and hold it for a month.',
        'Book the routine appointments everyone has been deferring, in one sitting.',
      ],
    },
    {
      id: 'preventing-spread',
      question: 'How can the spread of contagious illness be checked?',
      title: 'Keeping Illness From Spreading',
      summary:
        'Hand washing, air, separation, and surfaces — in that order of usefulness.',
      classicPrinciple:
        'Disease control was taught concretely: hand washing done properly and often, isolating the ill person, keeping their linens and dishes separate, ventilating rooms, and understanding how specific illnesses travel. Households were expected to know the mechanisms rather than simply follow instructions.',
      modernApplication:
        'The mechanisms are better understood now and the ranking has shifted somewhat toward air and hands over surfaces, but the household practices are largely the same. Knowing how a particular illness actually transmits lets you spend effort where it works. Ventilation is the most underused tool available to a household and costs nothing but an open window.',
      practice: [
        'Wash hands properly and at the moments that matter, especially before food and after caring for someone ill.',
        'Move air through the house. Ventilation is cheap and underrated.',
        'Separate the ill person\'s linens, dishes, and towels while illness is active.',
        'Learn how the specific illness in your house transmits, then act on that.',
      ],
      activities: [
        'Time a proper hand wash and teach it to every child in the house.',
        'Open windows across the house daily for two weeks and note whether illness spread differently.',
        'After the next household illness, work out how it travelled and which step would have interrupted it.',
      ],
    },
    {
      id: 'health-information',
      question: 'How shall health claims be judged?',
      title: 'Reading Health Information Critically',
      summary:
        'Apply the consumer unit\'s advertising analysis to health claims.',
      classicPrinciple:
        'The consumer unit taught students to identify who benefits from a claim, to separate evidence from testimony, and to notice what a pitch avoided saying. That analysis was applied directly to patent remedies and health products, which were a live problem then and were treated as such.',
      modernApplication:
        'The same analysis is the single most useful health skill available now, because health content is a large commercial category and much of it is indistinguishable from advice. Ask who profits, whether the claim rests on evidence or on a story, and what is being left out. Be equally skeptical of institutional certainty and of the confident contrarian selling an alternative — both are positions with interests attached.',
      practice: [
        'Ask who benefits financially from a health claim before evaluating the claim.',
        'Distinguish a study from a testimonial, and note the size of any study cited.',
        'Treat confident certainty as a warning sign in either direction.',
        'Bring specific questions to your physician rather than conclusions collected from a search.',
      ],
      sovereignNote:
        'Skepticism cuts both ways. A household that has learned to distrust one authority is a household someone else is already selling to.',
      activities: [
        'Take one health claim you currently believe and trace it to its original source.',
        'Find a supplement advertisement and write down the claim, the evidence offered, and the gap between them.',
        'Write three specific questions for your next appointment before searching anything.',
      ],
    },
    {
      id: 'community-health',
      question: 'How do the home and the community share responsibility for health?',
      title: 'The Household Inside a Community',
      summary:
        'Water, food supply, waste, and the shared systems a home depends on.',
      classicPrinciple:
        'The final unit widened the frame deliberately: a household\'s health depends on systems no household controls — safe water, an inspected food supply, sewage and waste disposal, and coordinated disease control. Students were taught how those systems worked and what part the home played in keeping them working.',
      modernApplication:
        'Most people now have no idea where their water comes from, where their waste goes, or how far their food traveled. That ignorance is comfortable until a system fails. Knowing your own dependencies is the beginning of resilience: learn the sources, understand the failure modes, and hold a modest buffer for each.',
      practice: [
        'Find out where your water comes from and read your utility\'s most recent quality report.',
        'Learn how your household waste and sewage are actually handled.',
        'Keep a genuine water reserve, and know how you would treat water if you had to.',
        'Know which of your food sources are local and could still function if distant ones did not.',
      ],
      sovereignNote:
        'Resilience is not withdrawal from shared systems. It is knowing which ones you depend on, and holding enough buffer to survive a bad week in any of them.',
      activities: [
        'Map your household\'s dependencies on one page: water, power, heat, food, communication, money. Note the buffer you hold for each.',
        'Read your municipal water quality report and note anything you did not know.',
        'Identify the single dependency with the thinnest buffer and improve it this month.',
      ],
    },
  ],
};
