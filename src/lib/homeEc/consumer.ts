import type { UnitDefinition } from './types';

/**
 * Unit: The Family as a Consumer
 *
 * Structurally modeled on the classic consumer unit — which taught quality
 * evaluation, advertising analysis, the buyer's moral responsibilities, and
 * what protections existed — and extended toward peer-to-peer commerce, where
 * the buyer and seller deal with each other directly. All prose original.
 */
export const consumer: UnitDefinition = {
  id: 'consumer-education',
  title: 'The Family as a Consumer',
  tagline: 'Buy well, buy direct, or not at all',
  description:
    'Judging quality, taking an advertisement apart, the ethics of buying — and how a household buys and sells directly, without a platform standing in the middle.',
  opening:
    'This unit reads as the most startlingly current in the old curriculum. It taught teenagers to analyze advertising, to separate a claim from a suggestion, to weigh the moral responsibilities of a buyer, and to know which protections existed and what they were worth. That is media literacy, taught in the 1940s and largely dropped since — at precisely the moment the persuasion industry became personalized, continuous, and hard to see. We have kept all of it and added the part those authors could not have anticipated: that a household can now buy and sell directly, on open protocols, with no company positioned between the two people making the trade.',
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
        'The techniques are now personalized, continuous, and often indistinguishable from content. Artificial urgency, manufactured social proof, and algorithmic targeting all work best on people who have not named them. Naming them restores a great deal of resistance — and it is a teachable skill, which is why this belonged in a school curriculum and should again.',
      practice: [
        'Impose a waiting period on discretionary purchases above a set amount.',
        'Ask what emotion an advertisement is targeting, and whether it existed beforehand.',
        'Treat urgency itself as a warning sign rather than information.',
        'Shop from a written list, and buy from the list.',
      ],
      sovereignNote:
        'Attention is the currency being spent on you. A feed you do not pay for is one where you are the product being sold to someone else.',
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
        'Subscriptions, consumables, and deliberately short product lifespans make this analysis more necessary than ever. Many modern goods are priced low at purchase precisely because the real revenue comes later — in refills, fees, or replacement. Some are not sold to you at all, only licensed, and can be withdrawn.',
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
      id: 'buying-direct',
      question: 'What is gained by buying directly from the maker?',
      title: 'Buying Direct, Without a Middleman',
      summary:
        'Every intermediary is paid out of the gap between what you pay and what the maker gets.',
      classicPrinciple:
        'The texts paid attention to how goods reached the buyer and what each step in the chain added to the price. Local producers, direct purchase, cooperatives, and farm-to-household buying were treated as ordinary options to be evaluated on cost and quality rather than as alternatives to a default.',
      modernApplication:
        'Most household buying now passes through a small number of very large intermediaries that take a substantial cut, set the terms for both sides, and can remove a seller without explanation. Buying direct sends more of your money to the person who did the work, gets you better information about what you are buying, and builds a relationship that a marketplace cannot delete.',
      practice: [
        'For your recurring purchases, find out whether the maker or grower sells directly.',
        'Ask what share of the price the producer actually receives. Many will tell you.',
        'Prefer sellers you can contact and who stand behind the thing themselves.',
        'Pay in a way that settles directly where that option exists.',
      ],
      sovereignNote:
        'Lightning payments settle between two parties without an intermediary who can freeze, reverse, or decline the transaction. For a small maker, that difference is often the whole margin.',
      activities: [
        'Buy one recurring household item directly from its producer and compare total cost and quality.',
        'Find out what percentage a large platform takes from a small seller in a category you buy from.',
        'Identify three producers within driving distance whose goods your household actually uses.',
      ],
    },
    {
      id: 'selling-from-home',
      question: 'How can the household sell what it produces?',
      title: 'Selling What Your Household Makes',
      summary:
        'A stall of your own, on a protocol nobody owns.',
      classicPrinciple:
        'Household production for sale was assumed, not treated as entrepreneurship. Eggs, produce, baked goods, sewing, preserves, and mending were sold or traded locally as a normal supplement to family income, and the texts covered pricing, quality, and dealing fairly with customers as practical matters.',
      modernApplication:
        'Selling from home now means confronting the platform question. Conventional marketplaces give you reach and take a cut, own the relationship with your customer, and can suspend you without recourse. Nostr-based markets such as Plebeian Market work differently: your listings are events you sign with your own key and publish to relays, payment is in bitcoin over Lightning directly to you, and the software can be self-hosted — the shop is yours whether or not any particular company survives.',
      practice: [
        'Start with what you already produce well and in surplus.',
        'Price for the full cost of materials plus your time, and do not apologize for it.',
        'Publish listings signed with your own key so your shop is not hostage to one company.',
        'Keep the relationship with your customers directly — their contact, not a platform\'s.',
        'Take payment in a way that cannot be reversed or withheld by a third party.',
      ],
      sovereignNote:
        'On Nostr, a listing is an event you sign and relays merely carry. Move relays and your shop, reputation, and customer relationships move with you. That portability is what makes the seller sovereign rather than tenant.',
      activities: [
        'Set up a stall on a Nostr marketplace and list one thing your household genuinely produces.',
        'Price one item honestly, including your labor at a real hourly figure, and see whether you would buy it.',
        'Compare the fees, terms, and suspension policies of a conventional marketplace against a self-hosted one.',
      ],
    },
    {
      id: 'trust-without-platform',
      question: 'How is trust established when there is no company vouching for anyone?',
      title: 'Trust Without an Intermediary',
      summary:
        'Reputation, escrow, small first trades, and dealing with people you can find again.',
      classicPrinciple:
        'Commerce ran on reputation and personal knowledge. You dealt with the merchant whose shop was on your street and whose family you knew, and the texts taught buyers to evaluate a seller\'s standing in the community, to understand what a guarantee actually promised, and to know which protections law provided.',
      modernApplication:
        'Peer-to-peer commerce restores both the freedom and the responsibility of that arrangement: no platform arbitrates, so the buyer must think. The workable practices are the old ones — start small with a new counterparty, prefer sellers with a durable identity and history you can inspect, use escrow for anything substantial, and understand that direct settlement means finality. Freedom from a middleman also means freedom from a middleman\'s refunds.',
      practice: [
        'Make a small first trade with any new counterparty before a large one.',
        'Prefer sellers with a long-lived identity and a history you can actually examine.',
        'Use escrow or a mutually trusted third party for anything substantial.',
        'Understand before paying that a direct settlement is final.',
        'Build your own reputation deliberately — it is the collateral you bring to every future trade.',
      ],
      sovereignNote:
        'A Nostr identity accumulates history across every app that uses it, which makes a long record hard to fake and expensive to abandon. Portable reputation is the substitute for a platform\'s guarantee.',
      activities: [
        'Complete one small peer-to-peer purchase end to end and write down what felt uncertain.',
        'Examine a seller\'s history and work out what you can and cannot verify about them.',
        'Learn how escrow works in a peer-to-peer trade before you need it for a large one.',
      ],
    },
    {
      id: 'circular-local-economy',
      question: 'What is gained when a community trades among itself?',
      title: 'The Circular Local Economy',
      summary:
        'Money that circulates locally does more work than money that leaves.',
      classicPrinciple:
        'The community units treated local exchange as ordinary economic life: households traded surplus, bought from neighbors, and used cooperatives, and the money involved largely stayed in the area and was spent again. Nobody framed this as a movement because there was no alternative to frame it against.',
      modernApplication:
        'Almost all household spending now leaves the local economy immediately, which is why the same amount of income supports far less local activity than it once did. Circular economies rebuild that by closing loops deliberately — earning and spending among people who also earn and spend among you. Bitcoin-denominated local trade is one working form of this, and the mechanism is old: buy from your neighbor so your neighbor can buy from you.',
      practice: [
        'Identify which of your regular purchases could come from someone local.',
        'Spend with people who also buy from your household, and close the loop on purpose.',
        'Trade skills and surplus directly where money is not necessary.',
        'Support the small producers you want to still exist in five years, at their prices.',
      ],
      sovereignNote:
        'A circular economy is the same idea as mutual aid, with a unit of account attached. It works because value stays among people who will spend it on each other again.',
      activities: [
        'Track one month of spending and calculate what share left your region entirely.',
        'Find one household that will trade with you in both directions and start.',
        'Organize or join a local market, swap, or trade circle among people you know.',
      ],
    },
    {
      id: 'consumer-responsibility',
      question: 'What moral responsibilities has the consumer?',
      title: 'The Ethics of Buying',
      summary: 'Every purchase is a vote for how a thing gets made.',
      classicPrinciple:
        'The unit included a problem on the consumer\'s moral responsibilities, which is remarkable to find in a high school text. Buying was treated as an act with consequences beyond the buyer: it sustains particular producers, particular labor conditions, and particular uses of resources, and the buyer bears some responsibility for what their money supports.',
      modernApplication:
        'Supply chains are now long enough to make this genuinely hard, and much of the available information is marketing. The honest version is modest and still worth doing: buy less, buy where you can verify something, buy durable, and be suspicious of virtue that arrives as a label. Buying direct helps here too — a seller you can actually talk to is a supply chain you can partly inspect.',
      practice: [
        'Prefer producers you can actually verify — local, small, or transparent about how they work.',
        'Treat ethical labeling as marketing until you have checked it.',
        'Buy fewer, better, longer-lasting things. This is the reliable version of ethical consumption.',
        'Pay makers directly when you can. Fewer intermediaries means more of it reaches the work.',
      ],
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
};
