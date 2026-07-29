import type { UnitDefinition } from './types';

/** All prose original. Structure follows the classic home economics scope-and-sequence; see provenance.ts. */
export const house: UnitDefinition = {
    id: 'house-and-home',
    title: 'Making the House a Home',
    tagline: 'Housing, furnishing, and what a dwelling owes its family',
    description:
      'Choosing where to live, what a house must actually provide, how to furnish it deliberately, and why the arrangement of rooms shapes the life lived in them.',
    opening:
      'Two full units of the old text concerned the dwelling itself: what housing must provide, how much of the family income it should absorb, how to read a floor plan, and how to furnish rooms so they serve the people in them. The instruction was unsentimental. A house was equipment for living, to be judged by whether it worked. That is a useful corrective now, when the housing conversation is conducted almost entirely in the language of appreciation and appearance.',
    icon: 'Home',
    gradient: 'from-stone-500 to-amber-700',
    lessons: [
      {
        id: 'housing-essentials',
        question: 'What must a house actually provide?',
        title: 'What a Dwelling Owes Its Family',
        summary:
          'Shelter, light, air, water, safety, storage, and space to be alone.',
        classicPrinciple:
          'The essentials were enumerated plainly: sound shelter, safe water, working sanitation, adequate light and ventilation, sufficient space for the number of people, storage, and provision for both family gathering and individual privacy. These were the criteria by which a dwelling was judged adequate, and anything beyond them was understood as preference.',
        modernApplication:
          'That list remains the honest one, and running your own house against it is clarifying. Most dissatisfaction with a home turns out to concern one or two specific failures — no storage, no quiet, poor light — which can often be addressed directly and cheaply. Renovation and relocation are frequently answers to a question nobody stated.',
        practice: [
          'Score your dwelling against the essentials one by one and write down where it genuinely fails.',
          'Fix the specific failure rather than the general feeling. Light, storage, and quiet are usually solvable.',
          'Make sure every person has somewhere they can be alone, even if it is small.',
          'Judge a prospective home by the same list before considering anything else.',
        ],
        activities: [
          'Walk each room and note its light, air, storage, and noise. Rank the rooms by which fails worst.',
          'Give one family member who lacks it a defined private space, however small, and observe the effect over a month.',
          'Write your own housing requirements list before you next look at a listing, and refuse to be talked off it.',
        ],
      },
      {
        id: 'cost-of-housing',
        question: 'What should the family spend on housing?',
        title: 'What Housing Should Cost',
        summary:
          'Rent, buy, and the total burden a dwelling places on a household.',
        classicPrinciple:
          'Housing expenditure was treated as a proportion of family income, with the total burden calculated in full: not just rent or payment, but taxes, insurance, utilities, upkeep, and the cost of getting to work. Renting and owning were compared on the merits for a given family rather than treated as a moral hierarchy.',
        modernApplication:
          'Housing now consumes a far larger share of income than those texts contemplated, which makes the full-burden calculation more important, not less. Run every candidate — rent or purchase — as a total monthly figure including upkeep and commuting, and be honest that a large mortgage is a claim on many years of future work.',
        practice: [
          'Calculate the total monthly burden of your housing: payment, taxes, insurance, utilities, upkeep, commuting.',
          'Express that figure as a share of take-home income, and as hours of work per month.',
          'When comparing rent and purchase, include maintenance and opportunity cost on both sides.',
          'Leave margin. A housing cost that requires everything to go right is a fragile arrangement.',
        ],
        sovereignNote:
          'Housing is the largest illiquid position most households hold. Understand how much of your future labor it has already committed.',
        activities: [
          'Total twelve months of every housing-related expense, including repairs you have forgotten.',
          'Convert your annual housing cost into weeks of household labor.',
          'Model your housing cost against a twenty percent income reduction and see whether the arrangement survives.',
        ],
      },
      {
        id: 'reading-a-house-plan',
        question: 'How shall a house plan be judged?',
        title: 'Reading a Floor Plan',
        summary:
          'Circulation, work centers, and why some rooms fight the family in them.',
        classicPrinciple:
          'Students learned to read floor plans critically: where traffic would pass, whether the kitchen work centers formed a sensible sequence, how far the door was from the food, whether rooms could be used for more than one thing, and where noise would carry. A plan was evaluated by the life it would permit.',
        modernApplication:
          'Almost nobody now evaluates a home this way, which is why so many well-finished houses are tiring to live in. Trace the paths your household actually walks — waking, feeding, leaving, bathing, sleeping — and look for the collisions. Many can be fixed by moving furniture and storage rather than walls.',
        practice: [
          'Sketch your floor plan and draw the routes your household walks each morning.',
          'Look for collision points where two activities compete for one space at the same hour.',
          'Reorganize storage so the things used in a room live in that room.',
          'When viewing a home, walk your actual routines through the plan before admiring the finishes.',
        ],
        activities: [
          'Draw your home\'s plan from memory, then correct it by walking through. The errors show you what you ignore.',
          'Rearrange one room to remove a daily collision and live with it for two weeks.',
          'Watch where your household naturally congregates and stop fighting it — furnish that room for it.',
        ],
      },
      {
        id: 'choosing-furnishings',
        question: 'How shall furnishings be chosen?',
        title: 'Furnishing Deliberately',
        summary:
          'Buy for use and durability first, then for how it looks together.',
        classicPrinciple:
          'Furnishing was taught as a planned, staged expenditure. You determined what a room needed to do, bought the pieces essential to that use first, chose for construction and durability, and accepted a sparse room in the meantime rather than filling it cheaply. Coherence came from restraint rather than from matching sets.',
        modernApplication:
          'The pressure to complete a room immediately is now considerable, and the goods available to do it cheaply are largely disposable. Staged furnishing is still correct: buy the few pieces that get real daily use as well as you can afford, leave the gaps visible, and let the room fill slowly with things chosen rather than things available.',
        practice: [
          'Decide what a room must do before buying anything for it.',
          'Buy the pieces that take daily weight — bed, table, seating — at the best quality you can manage.',
          'Leave a room unfinished rather than filling it with what you will replace.',
          'Check construction: joinery, frame, and how it is put together, not the finish.',
        ],
        activities: [
          'Identify the three pieces in your home that take the most daily use and assess whether their quality matches that.',
          'Live with one empty spot for two months instead of filling it, and notice whether you still want the item.',
          'Learn to identify one construction marker — a joint, a frame type — and use it on your next purchase.',
        ],
      },
      {
        id: 'household-equipment',
        question: 'How shall equipment for the home be chosen?',
        title: 'Choosing Equipment That Lasts',
        summary:
          'Repairability, running cost, and resisting the appliance that needs an account.',
        classicPrinciple:
          'Equipment was chosen on stated criteria: what it would be used for, how much it cost to run, how easily it could be cleaned and serviced, whether parts and repair were available, and whether it genuinely saved more labor than it created. Purchase price was one input among several.',
        modernApplication:
          'A new criterion now belongs on that list: does this device require an account, a subscription, or a working internet connection to perform its basic function? An appliance that can be disabled remotely, or bricked when a company loses interest, is not fully yours. Prefer the simpler machine that can be fixed.',
        practice: [
          'Before buying, confirm that replacement parts exist and find out what they cost.',
          'Ask what the device does when the internet is down or the company is gone.',
          'Prefer mechanical simplicity in anything you expect to keep for a decade.',
          'Calculate running cost over expected life, not just purchase price.',
        ],
        sovereignNote:
          'A tool that depends on someone else\'s server is rented, whatever the receipt says. Ownership means it still works when they stop caring.',
        activities: [
          'List every device in your home that requires an account to function fully. Note which of those you would call essential.',
          'Look up the repair manual and parts availability for your most expensive appliance.',
          'Choose one thing to replace with a simpler, non-connected version and note what you actually lost.',
        ],
      },
    ],
};
