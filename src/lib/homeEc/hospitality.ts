import type { UnitDefinition } from './types';

/** All prose original. Structure follows the classic home economics scope-and-sequence; see provenance.ts. */
export const hospitality: UnitDefinition = {
    id: 'hospitality',
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
};
