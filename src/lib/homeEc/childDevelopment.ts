import type { UnitDefinition } from './types';

/** All prose original. Structure follows the classic home economics scope-and-sequence; see provenance.ts. */
export const childDevelopment: UnitDefinition = {
    id: 'child-development',
    title: 'How the Child Develops',
    tagline: 'Raising capable people',
    description:
      'Age-appropriate responsibility, the home as a first classroom, guiding behavior, and passing on skills and values deliberately rather than by accident.',
    opening:
      'Four units of the original text concerned children — their care, their physical and mental development, the guidance of their learning, and the community\'s obligations to them. It was the largest single subject in the book, which tells you what the field considered its central work. The material was developmental rather than sentimental: it described what a child could do at each stage and what the household owed them, and it assumed the answer involved real responsibility rather than entertainment.',
    icon: 'GraduationCap',
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
};
