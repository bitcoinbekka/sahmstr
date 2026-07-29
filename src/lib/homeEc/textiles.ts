import type { UnitDefinition } from './types';

/** All prose original. Structure follows the classic home economics scope-and-sequence; see provenance.ts. */
export const textiles: UnitDefinition = {
    id: 'textiles-clothing',
    title: 'Textiles & Clothing Care',
    tagline: 'Make it last, make it fit, make it yours',
    description:
      'Fiber knowledge, laundry science, mending, and building a wardrobe that serves you — the skills that make clothing an asset rather than a recurring expense.',
    opening:
      'Clothing was studied as a material with properties, not as a mood. Students learned what fibers were, how each behaved under water and heat and friction, and therefore how to wash, press, store, and repair them. The result was a household in which garments lasted years and were expected to. Nothing about that knowledge has expired. What changed is that garments are now built to a price and sold on a feeling, which makes knowing the material the single most useful defense a buyer has.',
    icon: 'Scissors',
    lessons: [
      {
        id: 'know-your-fibers',
        question: 'What is this garment made of, and why does it matter?',
        title: 'Know Your Fibers',
        summary:
          'Everything about caring for a garment follows from what it is made of.',
        classicPrinciple:
          'Textile study came before sewing and laundry for a reason: fiber content determines how a fabric behaves when washed, dried, pressed, and worn. Cotton is durable and absorbent but wrinkles and shrinks. Wool insulates and resists odor but felts with heat and agitation. Linen softens with age. Silk is strong but chemically fussy.',
        modernApplication:
          'Fast fashion has made fiber content the fastest way to judge quality before you buy. Reading the label tells you whether a garment will last five years or five washes — and whether the price makes sense. This one habit changes purchasing more than any style advice.',
        practice: [
          'Read the fiber label on every garment before buying it.',
          'Learn how your five most-worn fabrics behave when washed and dried.',
          'Prefer natural fibers or high-quality blends for pieces you intend to keep.',
          'Wash and dry a new item the way you actually will, before you build outfits around it.',
        ],
        activities: [
          'Sort your own wardrobe by fiber content and note which fibers dominate the pieces that lasted.',
          'In a store, find the same garment style at three price points and compare fiber content and stitch density rather than appearance.',
          'Keep a small swatch of each fiber and test how it responds to water, heat, and stretching.',
        ],
      },
      {
        id: 'laundry-as-science',
        question: 'How shall the laundry be handled so clothing survives it?',
        title: 'Laundry as Applied Science',
        summary: 'Water temperature, agitation, and time — and why heat is the enemy.',
        classicPrinciple:
          'Laundry was taught as a set of variables to control rather than a chore to endure: sort by fiber and color, treat stains before washing, match water temperature to fabric, and dry appropriately. Understanding what each variable does let you solve problems instead of guessing.',
        modernApplication:
          'Most premature clothing failure traces to the dryer. High heat degrades elastic, shrinks natural fibers, and sets stains permanently. Washing cooler and drying gentler — or air-drying entirely — will visibly extend the life of a wardrobe, which is a direct saving.',
        practice: [
          'Treat stains promptly, and always identify the stain type before choosing a method.',
          'Wash most loads cool. Reserve hot water for genuine sanitation needs.',
          'Air-dry knits, elastics, and anything you care about keeping.',
          'Never put heat on a stain you have not removed — it sets it for good.',
        ],
        activities: [
          'Air-dry everything for one month and note the difference in how garments fit and hold shape.',
          'Build a stain chart for your household — the five stains you actually get, and the method for each.',
          'Calculate the annual energy cost of your dryer and weigh it against a drying rack.',
        ],
      },
      {
        id: 'mending-and-alteration',
        question: 'Which repairs will save the most clothing?',
        title: 'Mending and Basic Alteration',
        summary:
          'Four repairs that will save more clothing than any purchase decision.',
        classicPrinciple:
          'Every student learned to reattach a button, close a seam, hem a garment, and patch a worn area. These were not crafts but maintenance — the expected upkeep of a household asset, no more remarkable than tightening a hinge.',
        modernApplication:
          'These four skills still rescue the majority of discarded clothing. A dropped hem or a lost button sends a great many usable garments to landfill. Twenty minutes and a needle recovers full value from something you already own — the highest return available in a wardrobe.',
        practice: [
          'Assemble a small kit: needles, neutral thread, spare buttons, scissors, pins.',
          'Learn a secure button attachment and a slip stitch for hems.',
          'Practice on something you would not mourn before working on a favorite.',
          'Keep a mending basket and set a standing time to empty it, or it becomes storage.',
        ],
        sovereignNote:
          'Repair is quiet independence. Each skill you hold is one less thing you must buy your way out of.',
        activities: [
          'Empty your mending basket completely in one sitting and total the retail value of what you saved.',
          'Teach one child to attach a button and let them repair their own garment.',
          'Take in or hem one item that does not fit and wear it for a week before deciding whether fit was the real problem.',
        ],
      },
      {
        id: 'wardrobe-as-system',
        question: 'How shall a wardrobe be planned rather than accumulated?',
        title: 'The Wardrobe as a System',
        summary: 'Plan a wardrobe the way you plan a pantry.',
        classicPrinciple:
          'Clothing was planned rather than accumulated. You took inventory, identified genuine gaps, and bought deliberately — favoring pieces that combined with what you already owned over pieces that stood alone.',
        modernApplication:
          'This is precisely what the Wardrobe & Style section of SAHMstr automates. Once your closet is catalogued, gaps become visible and impulse purchases lose their appeal, because you can see that the new thing pairs with nothing you own.',
        practice: [
          'Photograph and catalogue what you actually own — most people overestimate their wardrobe.',
          'Identify the real gaps rather than the appealing additions.',
          'Judge a candidate purchase by how many existing pieces it works with.',
          'Buy the best quality you can afford in the pieces you wear most often.',
        ],
        activities: [
          'Catalogue your closet in the Wardrobe section and let it tell you what you actually own.',
          'Turn every hanger backward and reverse it only when worn. After three months, you will know your real wardrobe.',
          'Before your next purchase, write down which five things you own it will be worn with. If you cannot, do not buy it.',
        ],
      },
    ],
};
