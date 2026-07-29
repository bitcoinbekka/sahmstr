/**
 * SAHMstr Home Economics Curriculum
 *
 * All prose in this file is original writing produced for SAHMstr.
 *
 * The *structure* is deliberately modeled on the mid-century American home
 * economics textbook tradition — in particular "Today's Home Living" (Justin &
 * Rust, J. B. Lippincott, 1947), a Kansas State College high-school text whose
 * table of contents we used as a scope-and-sequence reference. That tradition
 * organized instruction into broad UNITS, and divided each unit into numbered
 * PROBLEMS, each phrased as a plain question a household actually has to
 * answer — "How shall the responsibilities of the home be distributed?" —
 * followed by suggested activities for the student.
 *
 * We keep that shape because it is genuinely good pedagogy: a question invites
 * thought where a heading only announces a topic. What we have changed is the
 * answer. Each lesson states the enduring principle, then works out how it
 * holds up in a world of engineered persuasion, subscription ownership,
 * custodial everything, and a currency that quietly loses value — and what a
 * household that intends to hold its own money, records, and skills should do
 * instead.
 *
 * See PROVENANCE at the bottom of this file.
 */

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
  /** Optional connection to bitcoin / sovereignty thinking */
  sovereignNote?: string;
  /** Suggested activities, in the tradition of end-of-problem exercises */
  activities?: string[];
}

export interface CurriculumModule {
  id: string;
  number: number;
  title: string;
  tagline: string;
  description: string;
  /** The unit's opening passage, meant to be read before the lessons */
  opening?: string;
  /** Lucide icon name */
  icon: string;
  /** Tailwind gradient classes for the module badge */
  gradient: string;
  lessons: Lesson[];
}

export const CURRICULUM: CurriculumModule[] = [
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'household-finance',
    number: 1,
    title: 'Household Finance',
    tagline: 'The household as an economy',
    description:
      'Classic home economics treated the household as a productive economic unit, not merely a place where wages are spent. This module recovers that view and extends it to money that cannot be quietly debased.',
    opening:
      'The older texts began where we no longer think to begin: with the household itself as an economic institution. Not a place where income arrives and disappears, but a going concern — with labor, inventory, capital equipment, records, and output. A homemaker was understood to be managing that concern, and the coursework treated her accordingly. What follows recovers that framing and then asks a question those books did not have to ask, because in their decade the answer was still mostly yes: will the money you set aside still be worth something when you need it?',
    icon: 'Wallet',
    gradient: 'from-amber-500 to-orange-600',
    lessons: [
      {
        id: 'household-as-economy',
        question: 'What does your household actually produce?',
        title: 'Your Home Is a Productive Economy',
        summary:
          'Learn to see the household as a place that creates value, not just consumes it.',
        classicPrinciple:
          'Older home economics texts opened with a claim modern culture has largely forgotten: the home is a site of production. Bread baked, garments mended, vegetables grown, and children taught are all real output. A homemaker was understood to be managing a small enterprise with a budget, inventory, labor, and capital equipment.',
        modernApplication:
          'When you price your own labor honestly, decisions get clearer. A loaf of good sourdough might cost seven dollars at a bakery and about eighty cents in flour, water, and salt. That difference is not a hobby — it is production. The same logic applies to mending instead of replacing, cooking instead of ordering, and growing instead of buying.',
        practice: [
          'List every good or service your household currently produces rather than purchases.',
          'For three of them, calculate the retail price versus your true input cost.',
          'Track the hours involved so you know your effective hourly return — some tasks are worth outsourcing, and that is fine.',
          'Identify one new item worth producing at home this month, and one worth buying instead.',
        ],
        sovereignNote:
          'Household production is the original form of financial independence. Every good you can make is a good no one can price you out of.',
        activities: [
          'Keep a one-week production log. Write down everything your household made rather than bought, and what the retail equivalent would have cost.',
          'Ask an older relative what their mother produced at home that you now purchase. Note which of those things you would actually want back.',
          'Choose one item you buy weekly and make it yourself three times. Decide honestly, after the third attempt, whether it belongs in your household.',
        ],
      },
      {
        id: 'envelope-to-allocation',
        question: 'How shall every dollar be assigned before it is spent?',
        title: 'From Envelope Budgeting to Deliberate Allocation',
        summary:
          'The envelope system still works. Here is why, and how to run it with modern accounts.',
        classicPrinciple:
          'The envelope method asked you to divide cash into labeled envelopes at the start of each period — food, rent, clothing, savings, giving — and to spend only what each envelope held. Its power was never the paper. It was the friction: you could see the money leaving, and an empty envelope was an unambiguous answer.',
        modernApplication:
          'Digital spending removes that friction by design. Rebuild it deliberately using separate accounts or a simple ledger, with a firm rule that categories do not borrow from one another mid-month. The goal is not restriction for its own sake — it is making every dollar assigned before it is spent, so spending becomes a decision rather than a drift.',
        practice: [
          'Write down every expense category your household actually has, including irregular ones like car repair and gifts.',
          'Assign every dollar of expected income to a category before the month begins.',
          'Give irregular expenses their own monthly amount so they never arrive as emergencies.',
          'Review weekly, not daily — frequent enough to correct, rare enough to sustain.',
        ],
        activities: [
          'Run one month with physical cash in labeled envelopes for your three most leak-prone categories. Note where the friction changed your behavior.',
          'Total your irregular annual expenses — insurance, tuition, registration, gifts, repairs — and divide by twelve. Compare that figure to what you currently set aside.',
          'Write your household spending plan on a single sheet of paper and post it where both adults can see it.',
        ],
      },
      {
        id: 'household-accounts',
        question: 'How does keeping accounts actually help the family?',
        title: 'Keeping Accounts Worth Keeping',
        summary:
          'Records exist to answer questions. Decide the questions first.',
        classicPrinciple:
          'Account-keeping had a whole unit devoted to it, and the texts were careful to explain the purpose rather than just the method. Records were not kept for their own sake or out of scrupulosity. They were kept so that a family could see where its money actually went, compare that against what it intended, and make the next year better than the last.',
        modernApplication:
          'Automated tools now categorize spending for you, which sounds like progress and often is not — a report you did not build is a report you do not absorb. Keep records simple enough that you will actually maintain them, and specific enough to answer the two or three questions you genuinely have. Everything beyond that is bookkeeping theater.',
        practice: [
          'Decide the questions your records must answer before choosing how to keep them.',
          'Record spending by category, not by merchant. The merchant tells you nothing.',
          'Reconcile monthly against reality, and note the gap between plan and outcome without excusing it.',
          'Keep an annual one-page summary. Year-over-year comparison is where records earn their keep.',
        ],
        sovereignNote:
          'Prefer records you hold and can export over dashboards you merely visit. An account you do not control can revoke your history.',
        activities: [
          'Track every expenditure for two full months without changing any behavior. Resist optimizing until you have the data.',
          'At the end, sort your categories largest to smallest. Most households are surprised by third place.',
          'Write down the three questions you want your records to answer next year, and design the simplest system that answers them.',
        ],
      },
      {
        id: 'saving-in-hard-money',
        question: 'Where should savings be kept so they hold their value?',
        title: 'Saving in Money That Holds Its Value',
        summary:
          'Classic texts urged thrift. They assumed the savings would still be worth something.',
        classicPrinciple:
          'Thrift was treated as a moral and practical virtue: spend less than you earn, and set the difference aside for the future. The advice was sound, and it rested on an assumption that went unstated because it was still largely true — that money set aside would retain its purchasing power.',
        modernApplication:
          'That assumption no longer holds. Savings held in a currency whose supply expands steadily will lose purchasing power over time, which quietly punishes exactly the behavior thrift recommends. This is why the question "where do I save?" now matters as much as "how much do I save?" A fixed-supply asset like bitcoin addresses the storage problem specifically.',
        practice: [
          'Look up what a specific grocery basket cost ten and twenty years ago versus today.',
          'Separate your reserves by job: near-term spending money, an emergency buffer, and long-horizon savings.',
          'Keep the emergency buffer in something stable and immediately accessible.',
          'For long-horizon savings, learn how self-custody works before committing meaningful amounts.',
        ],
        sovereignNote:
          'Thrift and sound money are complements. Saving diligently in a depreciating currency is rowing hard against a current.',
        activities: [
          'Find a household expense with a long public price history — postage, milk, a movie ticket — and chart it across fifty years.',
          'Ask a grandparent what a week of groceries cost when they married, and what they earned. Convert both into hours of work.',
          'Practice a full self-custody backup and recovery with a trivial amount before it matters. Do it twice.',
        ],
      },
      {
        id: 'credit-and-obligation',
        question: 'What use shall the family make of credit?',
        title: 'Credit, Debt, and Future Claims',
        summary:
          'Borrowing is a claim on work you have not done yet. Price it that way.',
        classicPrinciple:
          'Credit was treated soberly, as a tool with narrow legitimate uses and a real cost. The texts distinguished carefully between borrowing for something durable and productive and borrowing for consumption, and they insisted that the total finance cost be calculated in full before signing anything.',
        modernApplication:
          'Consumer credit is now the default rather than the exception, embedded in checkout flows and split into payments designed to feel weightless. The old arithmetic still applies and is now easier to run: compute the total you will actually pay, and translate the interest into hours of your own labor. Framed as hours, most consumer debt loses its appeal immediately.',
        practice: [
          'Before borrowing, calculate the total cost including all fees and the full interest over the term.',
          'Convert the interest into hours of household labor at your real effective rate.',
          'Distinguish borrowing for a productive asset from borrowing for consumption, and treat the second as a warning.',
          'Never finance anything that depreciates faster than you can repay it.',
        ],
        sovereignNote:
          'Debt denominated in a depreciating currency behaves strangely — it can erode in real terms while the payments still constrain your choices. Understand both effects before drawing conclusions.',
        activities: [
          'Take one installment offer you have actually seen and compute the effective annual rate behind it.',
          'List every recurring obligation your household has committed to and total the monthly figure. Note what share of income is already spoken for.',
          'Write down the conditions under which your household would borrow. Agree on them in advance, in writing.',
        ],
      },
      {
        id: 'teaching-children-money',
        question: 'How shall children be taught the nature of money?',
        title: 'Teaching Children the Nature of Money',
        summary: 'Raise children who understand value, not just price.',
        classicPrinciple:
          'Children were given small sums and real responsibility for them early, on the theory that money sense is a practiced skill rather than an inherited one. Chores connected effort to reward, and a child who spent everything immediately learned the lesson while the stakes were still measured in pennies.',
        modernApplication:
          'Keep the mechanics — earn, decide, live with the outcome — and add one question earlier generations did not need to ask: what is money, and why does this piece of paper work? Children handle this question well, often better than adults, because they have not yet learned to assume the answer is obvious.',
        practice: [
          'Tie a small, predictable earning opportunity to real work at home.',
          'Use three visible containers: spend, save, give. Visibility does the teaching.',
          'Let a poor purchase stand. The regret is the curriculum.',
          'Around age eight or nine, introduce scarcity with something physical — divide a fixed number of tokens and try to "make more."',
        ],
        activities: [
          'Give a child a fixed sum and full authority over one real household purchase, including the right to choose badly.',
          'Play a trading game with a fixed supply of tokens, then secretly double the supply mid-game and let them discover what happened to prices.',
          'Have an older child price the same grocery list at two stores and keep the difference.',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'food-nutrition',
    number: 2,
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
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'textiles-clothing',
    number: 3,
    title: 'Textiles & Clothing Care',
    tagline: 'Make it last, make it fit, make it yours',
    description:
      'Fiber knowledge, laundry science, mending, and building a wardrobe that serves you — the skills that make clothing an asset rather than a recurring expense.',
    opening:
      'Clothing was studied as a material with properties, not as a mood. Students learned what fibers were, how each behaved under water and heat and friction, and therefore how to wash, press, store, and repair them. The result was a household in which garments lasted years and were expected to. Nothing about that knowledge has expired. What changed is that garments are now built to a price and sold on a feeling, which makes knowing the material the single most useful defense a buyer has.',
    icon: 'Scissors',
    gradient: 'from-violet-500 to-purple-600',
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
      {
        id: 'clothing-children',
        question: 'How shall children be clothed without constant replacement?',
        title: 'Clothing Children Sensibly',
        summary:
          'Room to grow, fabrics that survive, and clothes a child can manage alone.',
        classicPrinciple:
          'Children\'s clothing was treated as its own design problem, with specific criteria: it had to allow free movement, tolerate hard wear and frequent washing, and — importantly — be manageable by the child, so that dressing and undressing built independence rather than requiring an adult.',
        modernApplication:
          'Children still outgrow clothing faster than they wear it out, which makes durability worth paying for only where it survives to a second or third child. The self-management criterion is the one most often forgotten and matters most: fastenings a four-year-old can work are worth more to a household than anything about how the garment photographs.',
        practice: [
          'Choose fastenings the child can operate without help, and expect them to.',
          'Buy hard-wearing fabric for knees and elbows; economize where wear is light.',
          'Keep a labeled bin of outgrown clothing sorted by size for the next child or a neighbor.',
          'Prefer a small number of good, comfortable garments over a full drawer of thin ones.',
        ],
        sovereignNote:
          'Hand-me-down networks among neighbors are mutual aid in its plainest form — and they cost nothing but the willingness to give first.',
        activities: [
          'Time how long it takes your child to dress unaided, then change one fastening and time it again.',
          'Sort outgrown clothing by size into labeled bins and give the surplus to a specific family rather than a donation bin.',
          'Track which garments survived to a second child and note what they had in common.',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'home-management',
    number: 4,
    title: 'Home Management',
    tagline: 'Systems, not willpower',
    description:
      'Work simplification, routines, time management, and household records — the organizational backbone that keeps a home running without exhausting the person running it.',
    opening:
      'This was the most quietly radical part of the old curriculum. It took the efficiency studies then being applied to factories and turned them on the kitchen — counting steps, timing tasks, mapping the actual path a woman walked to make a meal, and then redesigning the room so she walked less. The premise was that a homemaker\'s energy is a finite resource worth engineering around, and that fatigue is usually a design failure rather than a personal one. That premise deserves reviving.',
    icon: 'ClipboardList',
    gradient: 'from-emerald-500 to-teal-600',
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
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'house-and-home',
    number: 5,
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
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'caring-for-the-house',
    number: 6,
    title: 'Caring for the House',
    tagline: 'Maintenance, cleaning, pests, and safety',
    description:
      'What upkeep a dwelling requires, how to clean effectively rather than constantly, keeping pests out, and making a home genuinely safe for children.',
    opening:
      'An entire unit was given to the care of the house — surfaces, furnishings, equipment, utensils, laundry, stains, pests, and safety — on the understanding that a household which maintains what it owns spends far less than one which replaces it. Cleaning was taught as chemistry and sequence, not as effort. And the safety instruction was blunt in a way modern advice rarely is, because the hazards it named were the ones that actually injured children.',
    icon: 'SprayCan',
    gradient: 'from-cyan-500 to-sky-700',
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
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'health-home-nursing',
    number: 7,
    title: 'Health & Home Nursing',
    tagline: 'Competent care at home',
    description:
      'Home nursing basics, a properly stocked medicine chest, sick-room management, and knowing clearly when to seek professional care.',
    opening:
      'Three full units concerned health: staying well, assisting the physician at home, and caring for a patient. That last one is nearly extinct as a taught skill and remains entirely relevant, because most illness is still managed at home by someone with no training. The old material was careful about its own limits — it taught observation, comfort, and infection control, and it named plainly the signs that meant sending for a doctor. That combination of competence and humility is exactly right.',
    icon: 'HeartPulse',
    gradient: 'from-sky-500 to-blue-600',
    lessons: [
      {
        id: 'the-medicine-chest',
        question: 'How shall the home medicine chest be planned?',
        title: 'A Properly Stocked Medicine Chest',
        summary: 'Assemble it before you need it, and know what each item is for.',
        classicPrinciple:
          'Households maintained a deliberate set of supplies for illness and injury, kept in one known location, checked periodically, and stored out of children\'s reach. The emphasis was on knowing how to use each item rather than simply owning it.',
        modernApplication:
          'The principle holds exactly. Assemble supplies calmly in advance, because the moment you need them is the worst moment to be reading labels or driving to a pharmacy. Review contents twice a year and replace what has expired.',
        practice: [
          'Keep wound care, a reliable thermometer, and any prescribed family medications together in one place.',
          'Write dosages for each child by current weight and post them inside the cabinet door.',
          'Check expiration dates on a fixed schedule, such as when clocks change.',
          'Take a hands-on first aid and infant CPR course — reading is not sufficient for these.',
        ],
        activities: [
          'Empty your medicine cabinet entirely, discard what has expired, and rebuild it from a written list.',
          'Post current weight-based dosages for each child inside the cabinet door and update them at each birthday.',
          'Book a hands-on first aid and CPR course and put the date on the family calendar.',
        ],
      },
      {
        id: 'caring-for-the-sick',
        question: 'How shall we care for someone who is ill at home?',
        title: 'Caring for Someone Who Is Ill',
        summary: 'Comfort, hydration, rest, and careful observation.',
        classicPrinciple:
          'Home nursing instruction covered the practical management of illness: keeping the sick person comfortable and hydrated, maintaining a restful environment, controlling the spread of infection within the household, and observing symptoms accurately over time.',
        modernApplication:
          'Most ordinary illness is still managed at home, and it is managed better when someone knows what they are doing. Careful observation matters most — a written record of temperature, fluids, and symptoms is far more useful to a clinician than a recollection.',
        practice: [
          'Keep a simple written log of temperature, fluid intake, and symptoms with times.',
          'Prioritize hydration in small, frequent amounts over large infrequent ones.',
          'Separate towels, cups, and bedding to limit spread within the household.',
          'Learn the specific warning signs for your children\'s ages that mean call now.',
        ],
        activities: [
          'Make a blank illness log sheet now and keep copies with the thermometer.',
          'The next time someone is ill, keep the log and bring it to the appointment. Note whether the clinician used it.',
          'Set up a designated sick-room arrangement — where, which linens, which cup — before you need it.',
        ],
      },
      {
        id: 'the-sickroom',
        question: 'What makes a satisfactory sickroom?',
        title: 'Arranging the Sickroom',
        summary:
          'Quiet, air, light, reachable things, and containment of infection.',
        classicPrinciple:
          'The sickroom had its own detailed treatment: a quiet room with fresh air and controllable light, the bed positioned so the patient could see out but not be disturbed, everything needed within reach, and a deliberate arrangement for handling linens and waste so illness did not travel through the household.',
        modernApplication:
          'In a small home this becomes a corner rather than a room, and the principles compress well: one location, one set of linens and dishes, everything within arm\'s reach, air moving, light the patient controls, and hand washing enforced at the boundary. Containment is what keeps one sick child from becoming four.',
        practice: [
          'Designate one location and keep the patient there rather than migrating around the house.',
          'Put everything needed within the patient\'s reach: water, tissues, a bowl, a light they control.',
          'Keep the air moving and let the patient control the light and the blankets.',
          'Enforce hand washing at the room boundary, and keep that patient\'s linens and dishes separate.',
        ],
        activities: [
          'Decide now where your sickroom will be and what goes in it, then write the list.',
          'Assemble a sick-care basket — thermometer, log sheets, bowl, cloths, electrolyte supplies — and store it complete.',
          'After the next household illness, note how far it spread and which containment step failed.',
        ],
      },
      {
        id: 'knowing-when-to-call',
        question: 'When does home care end and professional care begin?',
        title: 'Knowing When to Call for Help',
        summary: 'Home care has limits. Recognize them in advance.',
        classicPrinciple:
          'Home nursing texts were explicit that the household\'s role had boundaries, and they named the signs that meant a physician was needed. Competence included knowing where competence ended.',
        modernApplication:
          'This is more important now that a search engine will happily supply a diagnosis. Establish your escalation thresholds in advance, in writing, while you are calm — then follow them without renegotiating at two in the morning.',
        practice: [
          'Ask your pediatrician directly which symptoms warrant an immediate call at each age.',
          'Post that list somewhere visible, along with the numbers to call.',
          'Do not use the internet to talk yourself out of a threshold you already set.',
          'Trust a strong instinct that something is wrong, even without a symptom you can name.',
        ],
        activities: [
          'At your next appointment, ask specifically what warrants a call, an urgent visit, and an emergency at each child\'s age. Write the answers down.',
          'Post the list and the phone numbers where a tired adult will find them at 3 a.m.',
          'Discuss the thresholds with your spouse so both of you can act without debate.',
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
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'hospitality',
    number: 8,
    title: 'Hospitality & Community',
    tagline: 'The home as a gathering place',
    description:
      'Hosting without strain, table setting, genuine courtesy, and building the kind of local relationships that function as real security.',
    opening:
      'Hospitality earned a place in the management unit, and the question the text asked about it is a good one: how does hospitality justify the time, effort, and money it costs? The answer given was not about entertaining well. It was that a household embedded in a web of local relationships is a stronger household — and that those relationships are built by feeding people, repeatedly and without ceremony.',
    icon: 'Users',
    gradient: 'from-fuchsia-500 to-pink-600',
    lessons: [
      {
        id: 'hosting-without-strain',
        question: 'How does hospitality justify the time, effort, and money it costs?',
        title: 'Hosting Without Strain',
        summary: 'Plan the work backward so you are present when guests arrive.',
        classicPrinciple:
          'Entertaining was taught as a planning exercise. You worked backward from the arrival time, prepared everything possible in advance, and chose dishes that tolerated delay — so that the host could actually be with the guests rather than trapped in the kitchen.',
        modernApplication:
          'Social media has inflated the perceived standard for hosting to the point that many people simply stop. The corrective is to lower the production and raise the frequency: simple food served often builds far more genuine community than an elaborate meal once a year.',
        practice: [
          'Choose dishes that hold well and can be finished ahead of time.',
          'Write a backward schedule from arrival, including when you stop cooking.',
          'Set the table and stage serving pieces the night before.',
          'Serve something simple more often instead of something impressive rarely.',
        ],
        activities: [
          'Invite one household for a deliberately simple meal within the next two weeks.',
          'Write a backward schedule before your next gathering and note whether you were actually present for it.',
          'Keep one reliable, cheap, make-ahead meal for guests and use it repeatedly without apology.',
        ],
      },
      {
        id: 'the-table',
        question: 'Why does a set table change the meal?',
        title: 'The Table and Why It Matters',
        summary: 'A set table changes how people behave around it.',
        classicPrinciple:
          'Table setting was taught in detail, but the reasoning was social rather than decorative: a properly set table signals that the gathering matters, and people rise to meet that signal. Shared meals were understood as the mechanism by which families and communities maintain themselves.',
        modernApplication:
          'The formal arrangement is largely optional now. The underlying finding is not: households that eat together at a set table talk more and linger longer. This costs nothing and is one of the few interventions with an outsized return on family life.',
        practice: [
          'Eat at least one meal a day at a table, with devices elsewhere.',
          'Let children set it — imperfectly is fine, and it becomes their ritual.',
          'Use the good dishes on ordinary days.',
          'Protect the lingering time after the food is gone. That is where the conversation happens.',
        ],
        activities: [
          'Set the table properly for one ordinary weeknight meal and note how long the family stayed seated.',
          'Assign table setting to a child as their permanent task.',
          'Use your best dishes for a full week of ordinary meals and observe what changes.',
        ],
      },
      {
        id: 'mutual-aid',
        question: 'What does the household owe its neighbors, and they it?',
        title: 'Neighbors, Mutual Aid, and Real Security',
        summary: 'The most reliable safety net is the one that lives nearby.',
        classicPrinciple:
          'Home economics assumed a household sat inside a web of local obligation — neighbors who traded surplus, watched children, brought meals during illness, and helped with work too large for one family. This was treated as ordinary infrastructure.',
        modernApplication:
          'Much of that has been replaced by paid services and institutions, which work until they do not. Rebuilding local reciprocity is slow and cannot be purchased, which is exactly why it holds when other systems fail. Value-for-value exchange is this same instinct, expressed digitally.',
        practice: [
          'Learn the names of the people on your street. Start there.',
          'Give first and without accounting — surplus produce, a meal, an hour of childcare.',
          'Say yes when someone offers help. Refusing it prevents the relationship from forming.',
          'Find or start a small recurring gathering. Consistency matters more than size.',
        ],
        sovereignNote:
          'Peer-to-peer is not only a technical description. A community that can meet its own needs locally is genuinely harder to disrupt.',
        activities: [
          'Learn and write down the names of five neighbors within a month.',
          'Give something away to a neighbor this week with no expectation and no mention of return.',
          'Accept the next offer of help you receive, even if you do not need it. Notice what it does to the relationship.',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'child-development',
    number: 9,
    title: 'Child Development & Family Life',
    tagline: 'Raising capable people',
    description:
      'Age-appropriate responsibility, the home as a first classroom, guiding behavior, and passing on skills and values deliberately rather than by accident.',
    opening:
      'Four units of the original text concerned children — their care, their physical and mental development, the guidance of their learning, and the community\'s obligations to them. It was the largest single subject in the book, which tells you what the field considered its central work. The material was developmental rather than sentimental: it described what a child could do at each stage and what the household owed them, and it assumed the answer involved real responsibility rather than entertainment.',
    icon: 'Baby',
    gradient: 'from-indigo-500 to-blue-700',
    lessons: [
      {
        id: 'age-appropriate-work',
        question: 'What real work can a child do at each age?',
        title: 'Real Work at Every Age',
        summary: 'Competence is built by contributing, not by being managed.',
        classicPrinciple:
          'Child study included detailed expectations for what children could genuinely contribute at each stage. The framing was developmental: children who do real work that the family visibly depends on develop competence and a sense of belonging that praise cannot manufacture.',
        modernApplication:
          'Children are now often scheduled and entertained rather than needed. Restoring genuine contribution is one of the highest-leverage things available in family life — and it happens to make the household run better as a side effect.',
        practice: [
          'Give even toddlers real tasks: carrying, sorting, wiping, putting away.',
          'Let the work actually matter, so its absence is noticed.',
          'Teach the skill properly instead of assigning and correcting.',
          'Name the contribution specifically rather than praising generally.',
        ],
        activities: [
          'Write down what each child could genuinely own at their current age, then compare it to what they do.',
          'Add one real, consequential task per child this month and hold it for a season.',
          'Deliberately leave one of their tasks undone by you and let the household notice its absence.',
        ],
      },
      {
        id: 'habits-and-routine',
        question: 'How does regularity aid a child\'s health and habits?',
        title: 'Regularity and the Forming of Habits',
        summary:
          'Predictable rhythms do quietly what discipline does loudly.',
        classicPrinciple:
          'Considerable attention went to regularity — consistent times for meals, sleep, and daily care — on the grounds that predictable rhythm supports a child\'s physical health and makes good habits form almost without instruction. Habit was understood as the mechanism by which a child\'s behavior becomes their own rather than a response to supervision.',
        modernApplication:
          'The core observation has held up well: sleep timing, meal timing, and predictable sequence account for an enormous share of a young child\'s behavior. Before treating a behavior problem as a discipline problem, check the schedule. The old advice avoids a great deal of modern conflict simply by removing the negotiation.',
        practice: [
          'Fix sleep and meal times first and hold them. Most other things improve on their own.',
          'Use consistent sequences so transitions do not require an argument.',
          'Build the habit through repetition rather than explanation, then explain once it is established.',
          'When behavior degrades, examine sleep, food, and schedule before anything else.',
        ],
        activities: [
          'Log one week of a difficult child\'s sleep and meal times against their worst moments and look for the pattern.',
          'Hold one bedtime to the minute for two weeks and note what changed.',
          'Establish one fixed sequence — the same order, every time — for your hardest daily transition.',
        ],
      },
      {
        id: 'guiding-behavior',
        question: 'Why do children act as they do, and how is discipline an aid in learning?',
        title: 'Guiding Behavior',
        summary:
          'Behavior is information. Discipline is instruction, not retribution.',
        classicPrinciple:
          'The guidance unit began by asking why children behave as they do, and treated behavior as caused rather than chosen at random — by fatigue, hunger, developmental stage, unmet need, or something learned from adults. Discipline was framed as part of learning: its purpose was to teach a child to govern himself, which meant consistency mattered more than severity.',
        modernApplication:
          'This is very close to current thinking, arrived at decades earlier and stated more plainly. Ask what the behavior is accomplishing before responding to it. Consistency, natural consequence, and explanation carry the instruction; escalation mostly teaches a child what escalation looks like, because they are always studying you.',
        practice: [
          'Ask what need or state the behavior is expressing before deciding on a response.',
          'Be consistent rather than severe. Predictability is the part that teaches.',
          'Let natural consequences do the work whenever they are safe to allow.',
          'Repair afterward, explicitly, and name what you would do differently.',
        ],
        activities: [
          'Track one recurring difficult behavior for a week — time, context, what preceded it — and look for the cause.',
          'Choose one consequence and apply it identically five times without variation. Note the effect of consistency alone.',
          'Apologize specifically to a child for one of your own reactions and watch what they do with it.',
        ],
      },
      {
        id: 'home-as-classroom',
        question: 'What does the household itself teach?',
        title: 'The Home as First Classroom',
        summary: 'Ordinary household work teaches more than it appears to.',
        classicPrinciple:
          'The household was understood as an educational environment in its own right. Cooking teaches measurement, fractions, and chemistry. Sewing teaches geometry and sequencing. Gardening teaches biology and patience. Budgeting teaches arithmetic with real consequences attached.',
        modernApplication:
          'This remains one of the strongest arguments for including children in household work even when it slows you down. The learning is embedded, the motivation is intrinsic, and the results are immediate — a combination formal instruction struggles to reproduce.',
        practice: [
          'Cook with children and let them do the actual measuring.',
          'Let them handle money in real transactions and count the change.',
          'Grow something, and let them own its outcome including failure.',
          'Answer the question they asked, then let them try it themselves.',
        ],
        activities: [
          'Have a child double a recipe and do the arithmetic themselves, including the errors.',
          'Give a child a plant or a row and full responsibility for it through one season.',
          'Let a child pay in cash and verify the change for a month of small purchases.',
        ],
      },
      {
        id: 'music-books-nature',
        question: 'How do music, books, art, and nature contribute to a child\'s learning?',
        title: 'Music, Books, Art, and Nature',
        summary:
          'A curated environment shapes taste more effectively than instruction does.',
        classicPrinciple:
          'A full problem was devoted to the contribution of music, literature, and art, and another to what a child learns from the natural world. The assumption was that these are formative rather than decorative — that a child raised among good books, real music, and unstructured time outdoors develops attention and taste that cannot be taught directly.',
        modernApplication:
          'A child\'s environment is now curated by recommendation engines optimized for engagement, which is not the same as formation. Choosing the inputs yourself is the whole task: physical books within reach, music that was played rather than generated for retention, and time outdoors long enough to become boring, because boredom is where attention is built.',
        practice: [
          'Keep good physical books within a child\'s reach and let them choose freely among them.',
          'Play real music at home, and let children see instruments being played badly.',
          'Give unstructured outdoor time long enough to pass through boredom.',
          'Choose the inputs deliberately rather than letting a recommendation engine choose them.',
        ],
        sovereignNote:
          'Attention is formed in childhood. A child who can be bored without a screen has been given something that cannot be purchased later.',
        activities: [
          'Read aloud to your children every day for a month, past the age you think it stops mattering.',
          'Spend one afternoon outdoors with nothing planned and nothing brought. Note how long until they invent something.',
          'Replace one hour of screen time with an instrument, a book, or a walk for two weeks and observe the difference.',
        ],
      },
      {
        id: 'transmitting-values',
        question: 'How are values actually passed on?',
        title: 'Passing On What Matters',
        summary: 'Values transfer through practice and explanation, not announcement.',
        classicPrinciple:
          'Family life education held that values are transmitted through daily practice, repetition, and explicit discussion — not through occasional pronouncement. Children absorb what is consistently done and openly reasoned about.',
        modernApplication:
          'Children now form views inside an information environment their parents do not control. That makes explanation more important, not less: doing the right thing while narrating why builds reasoning they can carry into contexts you will never see.',
        practice: [
          'Explain your reasoning out loud, including financial and ethical tradeoffs.',
          'Let children see you make hard choices, and hear why.',
          'Establish family practices with stated reasons behind them.',
          'Admit when you were wrong, and say what you changed.',
        ],
        activities: [
          'Narrate one real household financial decision out loud in front of your children, including what you gave up.',
          'Write down the three things you most want your children to carry, then name what in your week actually teaches them.',
          'Tell a child about a decision you got wrong and what it cost.',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'consumer-education',
    number: 10,
    title: 'Consumer Education',
    tagline: 'Buy well, or not at all',
    description:
      'Evaluating quality, resisting engineered persuasion, understanding true cost, the ethics of consumption, and knowing when repair beats replacement.',
    opening:
      'The consumer unit is the one that reads as most startlingly current. It taught students to analyze advertising, to distinguish claim from evidence, to weigh the moral responsibilities of a buyer, and to know what protections existed and what they were worth. It was, in plain terms, media literacy — taught to teenagers in the 1940s, and largely dropped since, at exactly the moment the persuasion industry became personalized, continuous, and very hard to see.',
    icon: 'ShoppingBag',
    gradient: 'from-yellow-500 to-amber-600',
    lessons: [
      {
        id: 'judging-quality',
        question: 'How can quality be judged before buying?',
        title: 'Judging Quality Before You Buy',
        summary: 'Learn the physical markers that predict how long a thing will last.',
        classicPrinciple:
          'Consumer education taught students to evaluate goods on construction rather than presentation: seam allowance and stitch density in clothing, joinery in furniture, material weight and finish in tools. Price was treated as one signal among several, not a proxy for quality.',
        modernApplication:
          'This skill is more valuable now that marketing budgets frequently exceed manufacturing budgets. Knowing what a well-made seam or a proper joint looks like lets you find genuine value at any price point — and recognize expensive things that are simply expensive.',
        practice: [
          'Learn the quality markers for the three categories you buy most often.',
          'Turn garments inside out and inspect the seams before purchasing.',
          'Check how furniture is joined rather than how it is finished.',
          'Calculate cost per use rather than purchase price.',
        ],
        activities: [
          'Pick the three categories you buy most and learn one reliable construction marker for each.',
          'Compare a well-made and a poorly made version of the same item side by side and write down every difference you can see.',
          'Examine the item in your home that has lasted longest and identify why.',
        ],
      },
      {
        id: 'resisting-persuasion',
        question: 'How is the consumer influenced by advertising and salesmanship?',
        title: 'Recognizing Engineered Persuasion',
        summary: 'Name the technique and it loses most of its force.',
        classicPrinciple:
          'Students were taught to analyze advertising directly — to identify the emotional appeal being made, separate factual claims from suggestion, and notice what the advertisement carefully avoided saying.',
        modernApplication:
          'The techniques are now personalized, continuous, and often indistinguishable from content. Artificial urgency, manufactured social proof, and algorithmic targeting all work best on people who have not named them. Naming them restores a great deal of resistance.',
        practice: [
          'Impose a waiting period on discretionary purchases above a set amount.',
          'Ask what emotion an advertisement is targeting, and whether it existed beforehand.',
          'Treat urgency itself as a warning sign rather than information.',
          'Shop from a written list, and buy from the list.',
        ],
        sovereignNote:
          'Attention is the currency being spent on you. Spending it deliberately is the same discipline as spending money deliberately.',
        activities: [
          'Take five advertisements you encountered today and write down the emotion each targeted and the claim each avoided making.',
          'Teach a child to identify sponsored content and see how quickly they get good at it.',
          'Apply a seven-day waiting period to every discretionary purchase for a month and record what you no longer wanted.',
        ],
      },
      {
        id: 'true-cost',
        question: 'What does a thing really cost to own?',
        title: 'The True Cost of Ownership',
        summary: 'Purchase price is the beginning of the calculation, not the end.',
        classicPrinciple:
          'Household purchasing decisions were taught as total-cost problems: acquisition price plus operating cost, maintenance, expected lifespan, and disposal. A cheaper item that fails sooner or costs more to run was correctly identified as the more expensive choice.',
        modernApplication:
          'Subscriptions, consumables, and deliberately short product lifespans make this analysis more necessary than ever. Many modern goods are priced low at purchase precisely because the real revenue comes later — in refills, fees, or replacement.',
        practice: [
          'Before buying, estimate lifespan, running cost, and repair availability.',
          'Check whether replacement parts exist and what they cost.',
          'Audit every recurring subscription twice a year and cancel by default.',
          'Prefer goods that can be repaired, even at a higher initial price.',
        ],
        activities: [
          'List every subscription your household pays and total the annual figure. Cancel anything you cannot justify out loud.',
          'For one recent purchase, compute the full cost of ownership over its likely life.',
          'Find a product in your home whose consumables cost more than the device did.',
        ],
      },
      {
        id: 'consumer-responsibility',
        question: 'What moral responsibilities has the consumer?',
        title: 'The Ethics of Buying',
        summary:
          'Every purchase is a vote for how a thing gets made.',
        classicPrinciple:
          'The unit included a problem on the consumer\'s moral responsibilities, which is remarkable to find in a high-school text. Buying was treated as an act with consequences beyond the buyer: it sustains particular producers, particular labor conditions, and particular uses of resources, and the buyer bears some responsibility for what their money supports.',
        modernApplication:
          'Supply chains are now long enough to make this genuinely hard, and much of the available information is marketing. The honest version is modest and still worth doing: buy less, buy locally where you can verify something, buy durable, and be suspicious of virtue that arrives as a label. Consuming less is the one lever that is never in doubt.',
        practice: [
          'Prefer producers you can actually verify — local, small, or transparent about how they work.',
          'Treat ethical labeling as marketing until you have checked it.',
          'Buy fewer, better, longer-lasting things. This is the reliable version of ethical consumption.',
          'Pay makers directly when you can. Fewer intermediaries means more of it reaches the work.',
        ],
        sovereignNote:
          'Value-for-value and direct payment let you support the maker rather than the platform. Where you can pay the person directly, do.',
        activities: [
          'Trace one everyday item back as far as you can and note where the trail goes cold.',
          'Buy one thing directly from its maker this month and compare the experience.',
          'Choose one category and commit to buying nothing new in it for three months.',
        ],
      },
      {
        id: 'repair-or-replace',
        question: 'Shall we repair, replace, or do without?',
        title: 'Repair, Replace, or Do Without',
        summary: 'A third option exists, and it is frequently the right one.',
        classicPrinciple:
          'Repair was the default and replacement the exception. Goods were built to be serviced, and households expected to maintain what they owned rather than cycle through it.',
        modernApplication:
          'Much of this has inverted, but less completely than it appears — a great deal of what gets discarded is repairable by someone willing to look up a guide and try. And the third option is genuinely underrated: sometimes the honest answer is that you do not need to own one at all.',
        practice: [
          'Look up a repair guide before accepting that something is finished.',
          'Learn the few repairs relevant to what you own most of.',
          'Borrow or share for anything you need rarely.',
          'Before replacing, ask honestly whether you need the item at all.',
        ],
        activities: [
          'Attempt one repair you would previously have written off, and finish it even if it fails.',
          'Find the three tools you own that you use less than once a year and arrange to borrow instead.',
          'Choose one broken thing and decide deliberately among repair, replace, and do without — then write down why.',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'digital-household',
    number: 11,
    title: 'The Digital Household',
    tagline: 'The unit the old books could not write',
    description:
      'Records, identity, communication, and money now live on machines you may or may not control. This module applies the same standards the old curriculum applied to the pantry and the account book.',
    opening:
      'Every other module in this curriculum has an ancestor. This one does not. But the questions it asks are the oldest ones in the field, only relocated: where are the household\'s records kept, who holds the keys, what happens if a supplier fails, and what can be lost in a single bad afternoon. A household that would not keep its only copy of the deed in a neighbor\'s desk should think carefully about where its photographs, messages, and money actually live.',
    icon: 'ShieldCheck',
    gradient: 'from-slate-500 to-zinc-700',
    lessons: [
      {
        id: 'where-records-live',
        question: 'Where do the household\'s records actually live?',
        title: 'Custody of Your Own Records',
        summary:
          'If you cannot produce it without permission, you do not hold it.',
        classicPrinciple:
          'The household kept its own records — accounts, deeds, certificates, correspondence, photographs — in a known place, in its own possession, with the important ones duplicated. Custody was physical and therefore obvious. Nobody had to be told that the family papers belonged in the family\'s own drawer.',
        modernApplication:
          'Most households now hold almost nothing. Photographs, messages, documents, and financial history sit on machines belonging to companies, retrievable only with permission that can be withdrawn by policy change, billing failure, or error. The old standard applies unchanged: keep your own copy, in your own possession, and test that you can actually read it.',
        practice: [
          'Inventory what matters — photographs, documents, records, correspondence — and note where the only copy lives.',
          'Keep at least one copy on storage you physically possess, in formats that open without a subscription.',
          'Follow the old rule: three copies, two kinds of media, one kept elsewhere.',
          'Test a restore annually. An untested backup is a belief, not a backup.',
        ],
        sovereignNote:
          'Self-custody is the same idea whether it applies to savings or to your daughter\'s baby photographs: possession you can verify, not access you have been granted.',
        activities: [
          'List everything irreplaceable your household owns digitally and write down where the only copy is.',
          'Perform a full export of your photographs to storage you physically hold, then open ten of them from it.',
          'Attempt to restore one important file from your backup without using the original service.',
        ],
      },
      {
        id: 'keys-and-identity',
        question: 'Who holds the keys to the household\'s accounts?',
        title: 'Keys, Access, and Succession',
        summary:
          'Plan for the day someone else has to get in — including after you are gone.',
        classicPrinciple:
          'Household management included legal and business procedures: knowing where the deed and the policies were, understanding what a contract obligated you to, and making sure a surviving spouse could actually find and operate the family\'s affairs. Competence meant the household did not depend on one person\'s memory.',
        modernApplication:
          'This is now largely a question of keys and credentials, and it is handled badly nearly everywhere. Households are routinely one lost phone or one death away from losing access to their money, records, and correspondence. Write down where access lives, ensure a second trusted adult can reach it, and be specific about what happens if you cannot be asked.',
        practice: [
          'Make sure at least one other trusted adult can access what the household would need immediately.',
          'Keep recovery material — codes, seed phrases, keys — offline, duplicated, and stored in separate physical places.',
          'Write a plain-language sheet explaining where things are and how to reach them.',
          'Never let a single device be the only path to anything that matters.',
        ],
        sovereignNote:
          'Self-custody without a succession plan is not sovereignty; it is a single point of failure with better marketing. Redundancy is the whole discipline.',
        activities: [
          'Write the one-page "if something happens to me" sheet this week and tell your spouse where it is.',
          'Verify that a second adult can independently reach the household\'s essential accounts and funds.',
          'Store one duplicate of critical recovery material in a second physical location.',
        ],
      },
      {
        id: 'household-communication',
        question: 'Who can read the family\'s correspondence?',
        title: 'Private Correspondence',
        summary:
          'A sealed letter was the default. Restore that expectation deliberately.',
        classicPrinciple:
          'Household correspondence was private by default and by physical fact. A letter was sealed, a conversation happened in a room, and the household\'s affairs were its own unless it chose otherwise. Privacy required no effort because it was the natural state of the medium.',
        modernApplication:
          'The default has inverted: most family communication passes through systems that read it to sell against it, and the record is permanent. Choosing end-to-end encrypted tools for family matters is not suspicion, it is the digital equivalent of sealing an envelope. Teach children that the default is now exposure and that privacy is something you select.',
        practice: [
          'Use end-to-end encrypted messaging for family and financial matters.',
          'Assume anything else is recorded permanently and could be read by someone you did not choose.',
          'Teach children early that most platforms are not private, and what the difference looks like.',
          'Share less by default, especially photographs of children.',
        ],
        sovereignNote:
          'Open protocols mean your correspondence and relationships are not hostage to one company\'s decisions. Portability is a privacy feature.',
        activities: [
          'Move your family\'s group conversation to an encrypted tool and keep it there for a month.',
          'Search your own name and your children\'s and note what a stranger can assemble.',
          'Decide as a household what you will not post about your children, and write it down.',
        ],
      },
      {
        id: 'attention-and-screens',
        question: 'How shall the household govern its own attention?',
        title: 'Governing the Household\'s Attention',
        summary:
          'Apply work simplification to the thing that consumes the most hours.',
        classicPrinciple:
          'The management units treated time and energy as measurable resources: you counted where they went, found the waste, and redesigned the process. Nobody was expected to be more disciplined; the environment was changed so that less discipline was required.',
        modernApplication:
          'Turn that method on the screens. Measure honestly first — the number is usually startling — then change the environment rather than relying on resolve, because the systems on the other side are engineered by professionals and will win a contest of willpower. Move the device, delete the account, charge the phone in another room. Design, not virtue.',
        practice: [
          'Measure actual screen time for a week before attempting to change it.',
          'Change the environment rather than your intentions: move the device, remove the app, add friction.',
          'Establish times and rooms where devices are simply not present.',
          'Model it visibly. Children calibrate to what adults do, not what they permit.',
        ],
        sovereignNote:
          'Attention is the household resource most systematically extracted and the one least often accounted for. Budget it like money.',
        activities: [
          'Record your household\'s true weekly screen total and write it on the same sheet as your monthly budget.',
          'Charge every phone outside the bedrooms for two weeks and note the effect on sleep.',
          'Declare one device-free room and one device-free hour, and hold both for a month.',
        ],
      },
      {
        id: 'money-you-hold',
        question: 'What does it mean to hold your own money?',
        title: 'Custody of the Household\'s Money',
        summary:
          'The oldest household question, asked about a new kind of asset.',
        classicPrinciple:
          'Savings had a physical location and the household knew it. Cash in a drawer, a passbook at a named bank, a bond in a box. Whatever the risks, the question "where is our money?" had a concrete answer that any adult in the family could give.',
        modernApplication:
          'For most households the honest answer is now "in someone else\'s ledger, and I trust them." That may be an acceptable arrangement, but it should be a decision rather than an assumption. Self-custody restores a concrete answer, and it comes with a real obligation: you become responsible for backups, for redundancy, and for making sure your family can recover without you.',
        practice: [
          'For each pool of household savings, write down who actually holds it and what would have to happen for you to lose access.',
          'Learn self-custody properly with a trivial amount first, and practice recovery until it is boring.',
          'Keep amounts appropriate to your skill. Increase the amount as your competence increases, not before.',
          'Document it well enough that your spouse could recover the funds without you and without a tutorial.',
        ],
        sovereignNote:
          'Holding your own keys is the modern form of a very old household virtue: knowing where your savings are, and not needing anyone\'s permission to reach them.',
        activities: [
          'Write down every place your household holds value and who controls each. Mark which require permission to access.',
          'Do a full practice recovery from your backup material, using only what you have written down.',
          'Walk your spouse through a recovery start to finish while you stay silent.',
        ],
      },
    ],
  },
];

/** Find a module by its id */
export function getModule(id: string): CurriculumModule | undefined {
  return CURRICULUM.find((m) => m.id === id);
}

/** Total lesson count across the curriculum */
export const TOTAL_LESSONS = CURRICULUM.reduce((sum, m) => sum + m.lessons.length, 0);

/**
 * Provenance note, surfaced in the UI so readers know exactly what this is
 * and what it is not.
 */
export const PROVENANCE = {
  reference: {
    title: "Today's Home Living",
    authors: 'Margaret M. Justin and Lucile Osborn Rust',
    publisher: 'J. B. Lippincott Company',
    year: '1947',
    note: 'A high-school home economics text from Kansas State College, itself the fourth edition of a book first published in 1929. Its scope covered family life, growing up, home management, housing, house care, use of time, family income, consumer education, heredity and environment, child care and development, community responsibility, health, home nursing, and the relationship between home and community.',
    url: 'https://archive.org/details/todayshomeliving00just',
  },
  statement:
    'This curriculum is original writing. We used the 1947 text as a scope-and-sequence reference — for its subject areas, and for its practice of framing each lesson as a plain question followed by suggested activities — because that structure is genuinely better pedagogy than a list of topics. None of its text is reproduced here. The principles are described in our own words, and every modern application, practice item, and activity was written for this project.',
} as const;
