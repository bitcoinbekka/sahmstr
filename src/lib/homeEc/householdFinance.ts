import type { UnitDefinition } from './types';

/** All prose original. Structure follows the classic home economics scope-and-sequence; see provenance.ts. */
export const householdFinance: UnitDefinition = {
    id: 'household-finance',
    title: 'Household Finance',
    tagline: 'The household as an economy',
    description:
      'Classic home economics treated the household as a productive economic unit, not merely a place where wages are spent. This module recovers that view and extends it to money that cannot be quietly debased.',
    opening:
      'The older texts began where we no longer think to begin: with the household itself as an economic institution. Not a place where income arrives and disappears, but a going concern — with labor, inventory, capital equipment, records, and output. A homemaker was understood to be managing that concern, and the coursework treated her accordingly. What follows recovers that framing and then asks a question those books did not have to ask, because in their decade the answer was still mostly yes: will the money you set aside still be worth something when you need it?',
    icon: 'Wallet',
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
};
