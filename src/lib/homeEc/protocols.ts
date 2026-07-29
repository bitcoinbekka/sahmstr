import type { UnitDefinition } from './types';

/**
 * Unit: How the Home, the Family, and Open Protocols Work Together
 *
 * Entirely new material with no ancestor in the classic curriculum.
 *
 * This is a deliberate inversion of the old closing unit, which asked how the
 * home and the community worked together — and answered in terms of municipal
 * systems the household depended on but did not control: water, food
 * inspection, sewage, coordinated disease control. Those systems were framed as
 * benevolent infrastructure, and the household's part was to cooperate.
 *
 * We flip it. The infrastructure a modern household depends on is largely
 * privately owned, and cooperation is no longer the only available posture.
 * Open protocols — bitcoin for money, nostr for identity and publishing —
 * change the relationship from dependence to participation. This unit asks what
 * a household does with that.
 */
export const protocols: UnitDefinition = {
  id: 'home-and-protocols',
  title: 'The Home & Open Protocols',
  tagline: 'How household, family, and open networks work together',
  description:
    'The old curriculum closed by asking how the home and community work together, and answered in terms of systems the household depended on. This unit inverts it: what changes when the infrastructure is one your family can participate in rather than only consume.',
  opening:
    'The classic curriculum closed by widening the frame — asking how the household and the wider community worked together, and answering in terms of shared systems: safe water, an inspected food supply, sewage disposal, coordinated public health. Those were framed as benevolent infrastructure, and the household\'s role was to cooperate with them. We are inverting that closing question. The infrastructure a modern household depends on is largely privately owned: the money it saves in, the platforms its relationships live on, the services holding its records. Cooperation is no longer the only available posture, because open protocols now exist for the two most important pieces — money and identity. This unit asks what a family actually does with that.',
  icon: 'Network',
  isNew: true,
  lessons: [
    {
      id: 'what-a-protocol-is',
      question: 'What is a protocol, and why should a household care?',
      title: 'Protocols Versus Platforms',
      summary:
        'A protocol is a shared rule nobody owns. A platform is a landlord.',
      classicPrinciple:
        'Households have always depended on shared standards that no single company controlled — the postal system carried anyone\'s letter, the telephone network connected anyone to anyone, and the language you wrote in belonged to nobody. That kind of infrastructure is boring and reliable precisely because it is not anyone\'s property, and nobody had to think about it.',
      modernApplication:
        'Most of what replaced those things is owned. A platform sets the rules, takes a cut, holds your relationships, and can change the arrangement or remove you without discussion. A protocol is a shared rule instead: email, the web, bitcoin, and nostr all work because many independent parties follow the same specification. The practical test for a household is simple — if this company disappeared tomorrow, do I keep my money, my records, and my relationships?',
      practice: [
        'For each service your family depends on, ask what you keep if the company vanishes.',
        'Prefer tools where your identity, content, and money are portable by design.',
        'Learn the difference between an app and the protocol beneath it. Apps are replaceable; protocols persist.',
        'Treat "we are changing our terms" as a normal event and plan for it in advance.',
      ],
      sovereignNote:
        'Bitcoin and nostr are protocols, not companies. No one grants you an account, and no one can take one away — which is the entire point and also the whole responsibility.',
      activities: [
        'List the ten services your household most depends on and mark each as protocol or platform.',
        'For the three most important, write down exactly what you would lose if they closed tomorrow.',
        'Pick one platform dependency and find the protocol-based alternative. Try it for a month.',
      ],
    },
    {
      id: 'family-money-on-open-rails',
      question: 'How does a family hold and move money on open rails?',
      title: 'The Household Treasury',
      summary:
        'Savings, spending, and allowances when the money is genuinely yours.',
      classicPrinciple:
        'The household kept a purse. Some money was near at hand for daily spending, some was set aside and harder to reach, and the family knew where each was. Separating spending money from savings was the oldest financial discipline there is, and it worked because the separation was physical.',
      modernApplication:
        'The same structure maps cleanly onto bitcoin and Lightning, and the physical separation returns. Long-term savings go into cold storage — held by keys your household controls, deliberately inconvenient to reach. Spending money sits in a Lightning wallet for everyday payments. Allowances and small transfers move instantly and for almost nothing, which makes teaching children with real money genuinely practical for the first time in a while.',
      practice: [
        'Separate the household treasury by function: cold savings, a spending wallet, and a small buffer.',
        'Make long-term savings deliberately inconvenient to reach. Friction is a feature.',
        'Keep only what you would carry in cash in a hot wallet.',
        'Involve both adults in how it is structured, so neither is dependent on the other\'s knowledge.',
        'Use small real transfers to teach children, since the amounts can be tiny.',
      ],
      sovereignNote:
        'A household holding its own keys has restored something ordinary that was lost: savings whose location it knows and whose use requires nobody\'s approval.',
      activities: [
        'Structure your household\'s holdings into named tiers and write down the purpose and access method of each.',
        'Pay a child\'s allowance over Lightning for a month and discuss what they noticed.',
        'Practice moving a small amount from cold storage to spending and back, so the process is familiar.',
      ],
    },
    {
      id: 'family-identity',
      question: 'What does it mean for a family to own its own identity?',
      title: 'Keys as Household Identity',
      summary:
        'One identity, many applications, no landlord.',
      classicPrinciple:
        'A family\'s standing was its own. Its name, reputation, and relationships belonged to it and travelled with it — to a new town, a new church, a new trade. Nobody issued a family its identity, and nobody could revoke it.',
      modernApplication:
        'Online, that stopped being true: identity became a set of accounts issued by companies, each revocable, none portable. A nostr keypair restores the older arrangement. Your identity is a key you hold, your posts and relationships are signed events, and every application that speaks the protocol sees the same you. Change apps and your history follows. That is worth understanding before deciding how your family appears online, and worth setting up carefully — because a key you hold is a key you can lose.',
      practice: [
        'Set up identities deliberately, and back up the keys as carefully as you would a savings key.',
        'Consider what belongs on a public identity and what does not, especially regarding children.',
        'Use a signer extension or hardware rather than pasting keys into applications.',
        'Understand that a compromised key cannot be recovered by customer service. There is none.',
      ],
      sovereignNote:
        'Portable reputation is the practical benefit: a long, verifiable history that no single company can delete, and that follows you to whatever app comes next.',
      activities: [
        'Back up your keys properly, offline and duplicated, then verify the backup works.',
        'Install a signer extension and stop pasting keys into websites entirely.',
        'Decide as a household what you will and will not publish about your children, and write it down.',
      ],
    },
    {
      id: 'household-production-to-market',
      question: 'How does household production reach a market directly?',
      title: 'From Household Production to Open Market',
      summary:
        'The oldest household economy, with the intermediaries removed.',
      classicPrinciple:
        'Households produced surplus and sold it locally — eggs, preserves, sewing, baked goods, mending. This was ordinary supplementary income, and the constraint was reach: you could sell to whoever was within travelling distance and no further.',
      modernApplication:
        'The reach problem was solved by platforms, at the price of a cut, ownership of the customer relationship, and the standing risk of removal. Open protocols solve it without that trade. On a nostr marketplace your listings are signed events published to relays, payment arrives over Lightning directly, and the software can run on hardware in your own home. It is the old household economy with the intermediaries taken out.',
      practice: [
        'Start with genuine surplus from something you already do well.',
        'Publish listings as signed events so your shop is not contingent on one company.',
        'Take payment directly and keep the customer relationship yours.',
        'Reinvest early earnings in tools and skill rather than in scale.',
        'Keep the operation small enough that it remains compatible with your household.',
      ],
      sovereignNote:
        'This is what a circular economy looks like in practice: households producing, selling directly, holding the proceeds in money that keeps its value, and spending it with each other.',
      activities: [
        'List one item your household produces on a Nostr marketplace and see it through to a first sale.',
        'Calculate what a conventional platform would have taken from that sale in fees.',
        'Find another household selling directly and buy something from them.',
      ],
    },
    {
      id: 'community-on-open-networks',
      question: 'How does a household build community on open networks?',
      title: 'Neighbors, Near and Far',
      summary:
        'Open networks are good at finding your people. They are no substitute for the ones nearby.',
      classicPrinciple:
        'The classic closing unit assumed community was geographic. Your neighbors were the people who would bring meals when you were ill, mind your children, and help with work too large for one family, and the household\'s obligations ran to them because there was nobody else.',
      modernApplication:
        'Open networks add something genuinely valuable: they let a household find people who share its convictions when nobody nearby does, which for many families is the difference between isolation and support. But the honest accounting matters. A network cannot bring you a meal. Use open networks for knowledge, encouragement, and trade at a distance — and keep investing in the neighbors who can actually reach your door.',
      practice: [
        'Use open networks to find the people your locality does not supply.',
        'Keep local relationships as the primary investment. Proximity is what makes help possible.',
        'Contribute rather than consume: answer questions, share what worked, publish what you learned.',
        'Be honest about which needs a distant network can meet and which it cannot.',
      ],
      sovereignNote:
        'Value-for-value works at both ranges. Zapping someone whose work helped you and taking a meal to a sick neighbor are the same instinct operating at different distances.',
      activities: [
        'Publish something you have learned that would help another household, and answer whoever replies.',
        'Zap or directly pay three people whose work has actually been useful to you.',
        'For every hour spent on a distant network this month, spend one with someone who lives nearby.',
      ],
    },
    {
      id: 'teaching-children-protocols',
      question: 'What shall children be taught about the systems they will inherit?',
      title: 'Raising Children Who Understand the Machinery',
      summary:
        'They will inherit these systems. Teach them how they work, not which to trust.',
      classicPrinciple:
        'The old unit on community responsibility taught children how public systems worked — where water came from, how food was inspected, what the health authority did — on the principle that a citizen who understands the machinery participates better than one who simply relies on it.',
      modernApplication:
        'Extend that principle to the systems your children will actually inherit. Teach the mechanics: what money is and why its supply matters, what a key is and why holding it matters, the difference between a protocol and a platform, and how to tell when something is engineered to hold their attention. Teach the machinery rather than the conclusions, because the specific tools will change and the reasoning will not.',
      practice: [
        'Teach mechanisms rather than verdicts. A child who understands how a thing works can evaluate the next version of it.',
        'Let them use real money in small amounts and hold their own keys under supervision.',
        'Explain the business model behind anything they use. Ask them who pays and for what.',
        'Model the behavior visibly, including the inconvenient parts.',
        'Let them keep and lose small amounts. A cheap lesson now is worth an expensive one later.',
      ],
      sovereignNote:
        'The goal is not a child who trusts bitcoin or distrusts banks. It is a child who can ask who controls a system, who profits from it, and what happens to them if it fails.',
      activities: [
        'Explain the supply of money to a child using something physical and fixed, then change the supply and let them observe the effect.',
        'Have an older child set up their own keys, back them up, and explain the backup to you.',
        'Pick one app your child uses and work out together exactly how it makes money.',
      ],
    },
    {
      id: 'household-resilience',
      question: 'What does household resilience actually require?',
      title: 'The Resilient Household',
      summary:
        'Map every dependency, then hold a buffer in each.',
      classicPrinciple:
        'The closing unit\'s real lesson was that a household sits inside systems it does not control, and ought to understand them. The old answer was to know how they worked and cooperate with them — which was reasonable, because there was no alternative to a municipal water main.',
      modernApplication:
        'The instruction still holds, and now there is a second move available. Map every dependency — water, power, heat, food, money, communication, records, income — and for each ask who controls it, how it fails, and what buffer you hold. Some can be replaced with something you control. Most cannot, and for those the answer is a buffer. Resilience is not self-sufficiency, which is a fantasy; it is the ability to absorb a failure without a crisis.',
      practice: [
        'Map every dependency on one page: who controls it, how it fails, what buffer you hold.',
        'Hold a real buffer in each: water, food, cash, fuel, medication, savings.',
        'Where a dependency can be replaced with something you control, do it one at a time.',
        'Where it cannot, deepen the buffer and know the failure mode.',
        'Rehearse a failure occasionally. An untested plan is a hope.',
      ],
      sovereignNote:
        'Self-custody, a stocked pantry, local relationships, and offline records are the same strategy applied to different dependencies: hold enough yourself that no single failure becomes an emergency.',
      activities: [
        'Build the one-page dependency map for your household this week and post it where both adults can see it.',
        'Identify your thinnest buffer and fix it this month.',
        'Run one deliberate drill — a day without power, or a week of groceries only from the pantry — and write down what broke.',
      ],
    },
  ],
};
