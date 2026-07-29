import type { UnitDefinition } from './types';

/** All prose original. Structure follows the classic home economics scope-and-sequence; see provenance.ts. */
export const food: UnitDefinition = {
    id: 'food-nutrition',
    title: 'Food & Nutrition',
    tagline: 'Feeding a family well, on purpose',
    description:
      'Meal planning, cooking from staples, food preservation, and nutrition fundamentals — the skills that turn a grocery budget into a well-fed household.',
    opening:
      'Food was the oldest subject in the field and the one most thoroughly taught, on the reasonable grounds that a household eats every day whether or not anyone has planned for it. The instruction was unglamorous and sequential: plan, provision, cook, preserve, and account for what was spent. None of it assumed a delivery service, a freezer aisle, or a phone. That independence is precisely what makes it worth relearning.',
    icon: 'UtensilsCrossed',
    gradient: 'from-rose-500 to-red-600',
    lessons: [
      {
        id: 'planning-the-week',
        question: 'How shall the week be planned before you shop?',
        title: 'Planning the Week Before You Shop',
        summary:
          'The single highest-return habit in household food management.',
        classicPrinciple:
          'Menu planning was taught as a discipline with a specific order of operations: plan the week, build the list from the plan, shop the list, and cook the plan. Working in that sequence eliminated the two largest sources of waste — food bought without a purpose, and purposeful meals missing one ingredient.',
        modernApplication:
          'Grocery stores are now engineered to defeat unplanned shoppers, which makes the old discipline more valuable rather than less. A written plan is also a defense against the expensive late-afternoon decision to order in, because the answer to "what is for dinner" is already settled.',
        practice: [
          'Plan around a protein and a vegetable first, then fill in the starch.',
          'Repeat one or two reliable meals every week — variety is overrated on a Tuesday.',
          'Build the shopping list directly from the plan, aisle by aisle.',
          'Schedule one intentional leftovers night. It is planning, not failure.',
        ],
        activities: [
          'Plan and shop one full week from a written list. Record what you spent and what spoiled.',
          'Do the following week without a plan and compare both figures honestly.',
          'Build a standing rotation of ten dinners your household reliably eats, and post it inside a cabinet door.',
        ],
      },
      {
        id: 'cooking-from-staples',
        question: 'Can dinner be made without a trip to the store?',
        title: 'Cooking From Staples',
        summary:
          'Build a pantry that can produce dinner without a shopping trip.',
        classicPrinciple:
          'A well-stocked pantry of flour, rice, dried beans, oats, oil, salt, and preserved goods was considered basic household infrastructure. From those staples a competent cook could produce a great many meals, which meant the household was not dependent on any particular week going smoothly.',
        modernApplication:
          'Staple cooking is dramatically cheaper per serving than convenience food, and it makes your household resilient to supply disruptions, weather, illness, and lean months. It also means fewer trips out with small children — a benefit no cookbook mentions but every mother understands.',
        practice: [
          'Stock the foundation first: a flour, a grain, a dried legume, cooking fat, salt, and acid.',
          'Learn five meals you can make entirely from shelf-stable ingredients.',
          'Rotate stock so the oldest is used first — label with the purchase month.',
          'Add depth gradually rather than buying a year of food at once.',
        ],
        sovereignNote:
          'A full pantry is a buffer. It converts a supply shock or a hard month from a crisis into an inconvenience.',
        activities: [
          'Go one full week cooking only from what you already have. Note the first thing you genuinely missed.',
          'Calculate the cost per serving of a staple meal versus its convenience equivalent.',
          'Inventory your pantry on paper and identify which single addition would most expand what you can cook.',
        ],
      },
      {
        id: 'preserving-the-harvest',
        question: 'How shall food be kept for the months when it is scarce?',
        title: 'Preserving the Harvest',
        summary:
          'Freezing, fermenting, drying, and canning — with safety first.',
        classicPrinciple:
          'Preservation was taught as a seasonal rhythm: buy or grow at peak abundance when quality is highest and price lowest, then store it for the months when neither is true. The methods were specific and the safety rules were non-negotiable.',
        modernApplication:
          'The economics still work — seasonal produce at its peak is both better and cheaper. Start with freezing, which is nearly foolproof, then move to fermentation, then drying. Pressure canning is genuinely worth learning but demands current, tested procedures.',
        practice: [
          'Begin with freezing: blanch vegetables briefly, cool fast, portion flat, label with the date.',
          'Try one simple ferment such as salted cabbage before attempting anything else.',
          'For any canning, follow current tested guidelines from a food safety authority — this is not a place for improvisation or heirloom recipes.',
          'Keep a written record of what you put up and how quickly your family actually ate it.',
        ],
        activities: [
          'Preserve one thing at its seasonal peak this year and record the cost per jar or bag against the off-season retail price.',
          'Compare your local produce prices across four months for a single item and find the trough.',
          'Learn one method properly from a current, tested source before attempting a second.',
        ],
      },
      {
        id: 'nutrition-fundamentals',
        question: 'What foods are actually necessary for health?',
        title: 'Nutrition Without the Noise',
        summary: 'Durable principles that outlast diet trends.',
        classicPrinciple:
          'Nutrition education centered on building balanced meals from recognizable food groups, with attention to variety across the week rather than perfection at any single meal. The framing was practical: feed the family well within the budget available.',
        modernApplication:
          'Nutrition advice now arrives as a firehose of contradictory claims, much of it attached to something for sale. The stable core has barely moved: mostly whole foods, adequate protein, plenty of vegetables, and enough fat to make it satisfying. Judge the week, not the plate.',
        practice: [
          'Anchor each meal with a protein and at least one vegetable.',
          'Aim for variety across the week instead of an ideal single meal.',
          'Read ingredient lists rather than front-of-package claims.',
          'Involve children in cooking — participation moves the needle more than persuasion.',
        ],
        activities: [
          'Photograph one week of dinners and assess the week as a whole rather than any single meal.',
          'Take five packaged items from your kitchen and read the full ingredient list aloud. Note which surprised you.',
          'Trace one nutrition claim you believe back to its source and see who funded it.',
        ],
      },
      {
        id: 'feeding-on-less',
        question: 'How shall the family eat well when the money is short?',
        title: 'Eating Well on Less',
        summary:
          'Cost per serving, cheap protein, and stretching without deprivation.',
        classicPrinciple:
          'The texts were written for households of ordinary and often modest means, and they treated feeding a family adequately within a real budget as the central problem rather than an unfortunate constraint. Cheaper cuts, dried legumes, seasonal produce, and skilled cooking were how that problem was solved.',
        modernApplication:
          'The cheapest calories available today are also the least nourishing, which is a genuinely new difficulty. The old answers still work and require skill instead of money: legumes and eggs for protein, tougher cuts cooked long, seasonal vegetables, and enough technique that inexpensive ingredients taste like a meal someone chose to make.',
        practice: [
          'Calculate cost per serving rather than cost per package.',
          'Learn to cook dried legumes well — this single skill has an outsized effect on a food budget.',
          'Master two long-cooked methods that make inexpensive cuts genuinely good.',
          'Buy produce in season and preserve the surplus rather than paying the off-season premium.',
        ],
        activities: [
          'Plan a week of dinners at a fixed low cost per serving and actually cook it. Record what your family thought.',
          'Price the same amount of protein from six different sources and rank them by cost.',
          'Cook one tough cut with a long method and serve it without comment. Note the reaction.',
        ],
      },
    ],
};
