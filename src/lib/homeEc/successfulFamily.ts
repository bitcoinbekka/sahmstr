import type { UnitDefinition } from './types';

/**
 * Unit: The Successful Family
 *
 * Structurally modeled on the opening unit of the classic curriculum, which
 * began — before any technique — by asking what a family is, what it does for
 * its members, and what it owes the community around it. All prose original.
 */
export const successfulFamily: UnitDefinition = {
  id: 'successful-family',
  title: 'The Successful Family',
  tagline: 'What a household is for',
  description:
    'Before budgets or menus or floor plans: what a family actually is, what it does for the people in it, and why the old books insisted on asking that first.',
  opening:
    'The classic texts opened here, and the choice was deliberate. Before teaching a single practical skill they asked what a family is, what makes one succeed, and what it owes the community around it. The reasoning was that technique without purpose produces an efficient household nobody wants to live in. That order of operations is worth restoring. Everything else in this curriculum — every account book, pantry, and maintenance schedule — is instrumental. This unit is about the thing it is all instrumental to.',
  icon: 'Heart',
  gradient: 'from-red-500 to-rose-700',
  lessons: [
    {
      id: 'what-a-family-does',
      question: 'What does a successful family do for its members?',
      title: 'What a Family Is For',
      summary:
        'Belonging, formation, security, and a place where you are not being evaluated.',
      classicPrinciple:
        'The old texts answered this functionally rather than sentimentally. A family provides physical care and economic security; it forms character and transmits skills and values; it offers affection and belonging that is not conditional on performance; and it is where a person is first taught how to live with other people. Success was measured against those functions, not against appearances.',
      modernApplication:
        'That list is still the right one, and it is useful precisely because it is unglamorous. A household can be prosperous, tidy, and well-scheduled while failing at most of it. Run your own family against the functions honestly and the answer usually points somewhere specific — often toward unstructured time together, which is the input almost every function requires and the first thing a busy household cuts.',
      practice: [
        'Name the functions your household is genuinely performing well, and the one it is not.',
        'Protect unstructured time together. Most of these functions require it and none of them can be scheduled tightly.',
        'Make sure affection in your home is visibly unconditional on achievement.',
        'Judge your family by what it produces in its people, not by how it presents.',
      ],
      activities: [
        'Write down what you want your children to say about their childhood in thirty years. Compare it to how last week actually went.',
        'Ask each family member what they think the family is best at. The answers are usually not what the adults expect.',
        'Identify the single function your household is weakest at and change one recurring thing this month.',
      ],
    },
    {
      id: 'family-patterns',
      question: 'What determines our family pattern?',
      title: 'Choosing Your Pattern Deliberately',
      summary:
        'Every household inherits a template. Decide which parts you are keeping.',
      classicPrinciple:
        'Students were asked to examine what shapes a family\'s particular pattern — the culture it sits in, its economic circumstances, its religious and ethnic inheritance, and above all the families the parents themselves grew up in. The point of the exercise was awareness: a pattern you can see is a pattern you can choose about.',
      modernApplication:
        'Most couples merge two inherited templates without ever discussing them, and then argue about the specifics for years — how holidays work, what money means, whether conflict is voiced or swallowed, what a Sunday is for. Naming the inheritance out loud converts a decade of friction into a single afternoon\'s conversation. Keep deliberately, discard deliberately.',
      practice: [
        'Each adult writes down how their family of origin handled money, conflict, holidays, and affection.',
        'Compare the two lists and mark each item: keeping, discarding, or inventing something new.',
        'Notice which patterns you are repeating without having chosen them.',
        'Decide what is distinctly yours, and say it out loud to your children.',
      ],
      activities: [
        'Both adults answer the same ten questions about their childhood households separately, then trade papers.',
        'List your family\'s three strongest traditions and trace where each came from.',
        'Invent one tradition that belongs to no previous generation and start it this year.',
      ],
    },
    {
      id: 'attitudes-and-relationships',
      question: 'How do the attitudes of family members affect family life?',
      title: 'Attitude as a Household Condition',
      summary:
        'The emotional weather of a home is set by the adults, whether or not they intend it.',
      classicPrinciple:
        'A full problem was given to attitudes, on the observation that a family\'s daily temper is largely set by how its members habitually treat one another — the tone of ordinary requests, whether irritation is aired or absorbed, whether people assume goodwill. Attitude was treated as something practiced rather than felt.',
      modernApplication:
        'This holds up well and is one of the few genuinely high-leverage things available. Children calibrate to the adults\' baseline, not to their instructions. The practicable version is narrow and boring: how you greet people, how you ask for things, whether you repair after conflict, and whether the house has a default assumption of goodwill. It is a practice, not a personality.',
      practice: [
        'Watch how you make ordinary requests for one day. Tone carries more than content.',
        'Repair after conflict explicitly and in front of the children.',
        'Greet people when they enter a room. It is a small thing that compounds.',
        'Address irritation early and plainly, before it becomes the room\'s atmosphere.',
      ],
      activities: [
        'Count your corrections and your appreciations toward one child over a single day.',
        'Repair one old, unaddressed friction with a family member this week.',
        'Ask your spouse what your household\'s emotional default is. Listen without defending it.',
      ],
    },
    {
      id: 'family-and-community',
      question: 'Why is family life important to the community?',
      title: 'The Family Inside a Community',
      summary:
        'Households are the units communities are actually made of.',
      classicPrinciple:
        'The texts argued that a community is only as sound as the families composing it, and that families therefore have obligations outward — raising people who can be relied upon, participating in local institutions, and helping neighbors as a matter of course rather than charity. The household was framed as a public good, not a private retreat.',
      modernApplication:
        'The modern default is the opposite: the family as a fortress, with outward obligations outsourced to institutions and paid services. That arrangement is efficient and brittle. Households that know their neighbors, contribute locally, and can be called on in an emergency build a form of security no service sells — and the children raised inside that arrangement learn something no curriculum teaches.',
      practice: [
        'Contribute to one local institution — a school, a congregation, a library, a volunteer body.',
        'Be a household others can call on, and let it be known that you are.',
        'Include children in what you give outward, so they see it as ordinary.',
        'Treat helping neighbors as routine rather than exceptional.',
      ],
      sovereignNote:
        'Local, voluntary, reciprocal — these describe both a healthy neighborhood and a peer-to-peer network. Resilience in both cases comes from many small connections rather than one large provider.',
      activities: [
        'Identify one local institution your family will support this year and commit to something specific.',
        'Do one act of neighborly help with your children present and participating.',
        'List who would help your household in a genuine emergency. If the list is short, that is the finding.',
      ],
    },
  ],
};
