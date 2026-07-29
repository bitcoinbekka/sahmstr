import type { UnitDefinition } from './types';

/**
 * Unit: Growing Up
 *
 * Structurally modeled on the classic unit that addressed the student directly
 * — maturity, friendship, courtship, and choosing work — rather than addressing
 * her as a future homemaker. All prose original.
 */
export const growingUp: UnitDefinition = {
  id: 'growing-up',
  title: 'Growing Up',
  tagline: 'Becoming a person worth being',
  description:
    'Maturity, friendship, courtship, and choosing work. The unit the old books addressed to the young woman herself — and the one worth handing to a daughter.',
  opening:
    'This unit is unusual in the old curriculum because it addresses the student as herself rather than as a future homemaker. It asked what growing up actually means, what kind of person she wanted to become, how to build friendships worth having, how to think about courtship, and what she wanted to do with her life. Those questions were considered part of home economics because the field understood that the quality of a household depends first on the maturity of the people who form it. We have kept the questions, and answered them for a young woman who will be forming a household inside an economy her grandmother would not recognize.',
  icon: 'Sprout',
  gradient: 'from-lime-500 to-green-700',
  lessons: [
    {
      id: 'what-growing-up-means',
      question: 'What does growing up actually mean?',
      title: 'The Marks of Maturity',
      summary:
        'Not age, and not independence. The capacity to carry weight on purpose.',
      classicPrinciple:
        'Maturity was defined by observable behavior rather than age: taking responsibility for your own actions without deflecting, controlling impulse in service of a longer aim, tolerating frustration without collapse, considering others in your decisions, and being reliable — doing what you said you would when nobody is checking. Growing up was framed as a set of practicable capacities.',
      modernApplication:
        'Those markers have not aged at all, and the list is more useful than the vaguer language now in circulation, because each item can be practiced. Delayed gratification in particular has become a genuinely countercultural skill: nearly every system a young person touches is engineered to deliver reward immediately and to make waiting feel unnecessary. The ability to hold out for something better is now both rarer and more valuable.',
      practice: [
        'Do what you said you would do, especially in small things nobody is tracking.',
        'When something goes wrong, state your own part in it first and without qualification.',
        'Practice waiting on purpose for things you could have immediately.',
        'Sit with frustration long enough to act well rather than quickly.',
      ],
      sovereignNote:
        'Saving is delayed gratification with a ledger attached. The person who can wait has an enormous advantage over one who cannot, in character and in capital alike.',
      activities: [
        'Keep every commitment you make for one week, however small, and note where it was hard.',
        'Choose something you want and deliberately wait a month for it. Notice what the waiting does.',
        'Write down the five marks of maturity and rate yourself honestly on each. Pick the lowest and work on it.',
      ],
    },
    {
      id: 'friendships-worth-having',
      question: 'How can you build friendships worthy of a grownup?',
      title: 'Friendships Worth Having',
      summary:
        'Few, chosen, tended, and in person where possible.',
      classicPrinciple:
        'Friendship was taught as a skill with practicable components: being genuinely interested in others, keeping confidences, being loyal in someone\'s absence, tolerating difference, and doing the maintenance work — showing up, remembering, following through. Popularity was distinguished sharply from friendship, and the texts were clear about which mattered.',
      modernApplication:
        'That distinction is now the entire lesson. A generation has been handed instruments that measure popularity precisely and friendship not at all, and the measurable thing crowds out the valuable one. The old advice is exactly right and harder to follow: choose few, invest deeply, meet in person, and be the kind of friend who is loyal when the person is not in the room.',
      practice: [
        'Invest deeply in a small number of friendships rather than lightly in many.',
        'Be loyal in a friend\'s absence. This is most of what friendship actually is.',
        'Do the unglamorous maintenance: initiate, remember, follow through, show up.',
        'Prioritize seeing people in person, even when it is inconvenient.',
      ],
      activities: [
        'Name three friendships worth keeping for life and do one concrete thing for each this month.',
        'Initiate a plan in person rather than waiting to be invited, three times this month.',
        'Go a week without checking any follower or engagement count and note what you think about instead.',
      ],
    },
    {
      id: 'courtship-and-marriage',
      question: 'How shall friendships with men be built, and marriage approached?',
      title: 'Courtship, Character, and Choosing Well',
      summary:
        'The single decision with the largest effect on the household you will run.',
      classicPrinciple:
        'Courtship was addressed frankly and at length. Students were told to evaluate character over charm, to observe how a man treated people he owed nothing to, to discuss money, children, faith, and work before committing, and to allow enough time for a real pattern to become visible. Marriage was framed as the most consequential economic and personal decision a person makes, and worth deliberating accordingly.',
      modernApplication:
        'This is the advice that has held up best and is offered least. Every element of it still applies, and one thing has changed for the better: the specific conversations are now easier to have early. Talk about money, debt, children, work, faith, and where you intend to live before you are committed rather than after. A partner unwilling to discuss those things plainly has told you something important.',
      practice: [
        'Watch how someone treats people who can do nothing for them. That is the character.',
        'Discuss money, debt, children, faith, and work explicitly before committing.',
        'Give it enough time to see a pattern rather than a performance.',
        'Notice whether you are more yourself around this person or less.',
        'Take seriously the observations of people who love you.',
      ],
      sovereignNote:
        'Marriage is the merger of two balance sheets and two sets of habits. A shared understanding of money — what it is, how it is saved, what it is for — prevents more conflict than any budget.',
      activities: [
        'Write down what you actually require in a spouse, distinct from what you find attractive. Keep the list.',
        'Have the money conversation early and in specifics: debts, incomes, savings, and what each of you thinks money is for.',
        'Observe a couple whose marriage you admire and identify what they concretely do.',
      ],
    },
    {
      id: 'choosing-work',
      question: 'What do you want to do when you are grown?',
      title: 'Choosing Work, and Work You Can Carry',
      summary:
        'Consider portability, skill, and what happens when a child arrives.',
      classicPrinciple:
        'The texts treated vocational choice seriously and asked students to weigh aptitude, interest, preparation required, and how the work would fit alongside a family. That last consideration was assumed rather than argued, and while the assumptions of the era were narrow, the underlying question was a real one that has not gone away.',
      modernApplication:
        'The question deserves asking without the old constraints, because the answer now has better options. Skills that are portable, that can be done from home, that scale with competence rather than hours, and that do not require permission from a single employer are worth disproportionate weight — particularly for anyone who intends to have children. Trades, crafts, writing, design, and anything sold directly to people who want it all qualify.',
      practice: [
        'Weight portability heavily. Work you can carry across cities and seasons of life is worth more than it pays.',
        'Build skills that compound rather than credentials that expire.',
        'Prefer arrangements where you can be paid directly by people who value the work.',
        'Assume you will want flexibility later, and build toward it before you need it.',
      ],
      sovereignNote:
        'Being paid directly — for a good, a craft, or a service — is the most durable form of work. Open payment rails mean no intermediary can stand between you and someone who wants to pay you.',
      activities: [
        'List your marketable skills and mark each as portable or location-bound.',
        'Talk to a woman ten years ahead of you who has both work and children. Ask what she would do differently.',
        'Earn your first payment directly from a customer for something you made or did. Note what it changes.',
      ],
    },
  ],
};
