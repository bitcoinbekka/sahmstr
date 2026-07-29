import type { UnitDefinition } from './types';

/**
 * Unit: Caring for the Young Child
 *
 * Structurally modeled on the classic unit covering the mother's own care
 * before birth, feeding, regularity, cleanliness, clothing, and safeguarding
 * the child's health. All prose original.
 *
 * Note: this material is general household practice, not medical advice.
 * Several problems say so explicitly.
 */
export const youngChild: UnitDefinition = {
  id: 'young-child',
  title: 'Caring for the Young Child',
  tagline: 'The first years, practically',
  description:
    'The mother\'s own care, feeding, regularity, cleanliness, clothing, and safeguarding health — the practical craft of the early years.',
  opening:
    'The old texts devoted an entire unit to the care of the young child and began, sensibly, with the mother herself. Then feeding, the value of regularity, cleanliness, clothing, and the safeguarding of health. Much of the specific medical guidance from that era has been revised or overturned, and we have not repeated it. What survives is the practical craft — the rhythms, the arrangements, the small decisions that make the early years workable — and one thing the old books had that modern parenting advice largely lacks: confidence that this is learnable, ordinary work rather than a specialist field requiring constant consultation.',
  icon: 'Baby',
  gradient: 'from-pink-400 to-rose-600',
  lessons: [
    {
      id: 'care-of-the-mother',
      question: 'What care does the mother need before the baby comes?',
      title: 'Caring for the Mother First',
      summary:
        'Rest, nourishment, preparation, and arranging help before you need it.',
      classicPrinciple:
        'The unit opened with the mother rather than the infant: adequate rest, nourishing food, regular care, moderate activity, and practical preparation of what would be needed. The framing treated her wellbeing as the foundation the child\'s depended on rather than as a secondary consideration.',
      modernApplication:
        'That order of priority is still correct and still routinely inverted, with enormous energy spent on nursery aesthetics and almost none on arranging postpartum help. Do the unglamorous preparation: stock the freezer, name the people who will come, decide who handles what in the first six weeks, and prepare for recovery rather than for the arrival. Follow current medical guidance for the clinical parts — this is a household matter only.',
      practice: [
        'Arrange concrete help for the weeks after birth, by name, before the birth.',
        'Cook and freeze meals in advance. This matters more than almost anything you can buy.',
        'Decide in advance who handles visitors, older children, meals, and nights.',
        'Prepare for your own recovery, not just for the baby\'s arrival.',
      ],
      activities: [
        'Write a list of five people and the specific thing each will do in the first month. Ask them now.',
        'Fill a freezer with two weeks of meals before the due date.',
        'Write down your household\'s plan for the first six weeks and give a copy to whoever will be helping.',
      ],
    },
    {
      id: 'regularity-and-rhythm',
      question: 'How does regularity aid in maintaining the child\'s health?',
      title: 'Regularity and Rhythm',
      summary:
        'Predictable rhythms do quietly what discipline does loudly.',
      classicPrinciple:
        'Considerable attention went to regularity — consistent times for meals, sleep, and daily care — on the grounds that predictable rhythm supports a child\'s physical health and makes good habits form almost without instruction. Habit was understood as the mechanism by which behavior becomes the child\'s own rather than a response to supervision.',
      modernApplication:
        'The core observation has held up well, though the rigid scheduling of that era has rightly been softened toward following the child\'s cues in infancy. Sleep timing, meal timing, and predictable sequence still account for an enormous share of a young child\'s behavior. Before treating a behavior problem as a discipline problem, check the schedule.',
      practice: [
        'Fix sleep and meal times as the child matures and hold them. Most other things improve on their own.',
        'Use consistent sequences so transitions do not require an argument.',
        'Build habits through repetition rather than explanation, then explain once established.',
        'When behavior degrades, examine sleep, food, and schedule before anything else.',
      ],
      activities: [
        'Log one week of a difficult child\'s sleep and meal times against their worst moments and look for the pattern.',
        'Hold one bedtime to the minute for two weeks and note what changed.',
        'Establish one fixed sequence — the same order, every time — for your hardest daily transition.',
      ],
    },
    {
      id: 'feeding-the-child',
      question: 'What food shall be given the child as he grows?',
      title: 'Feeding a Young Child',
      summary:
        'Offer good food without negotiation, and let appetite do its work.',
      classicPrinciple:
        'Infant and child feeding received detailed treatment, with attention to introducing foods gradually, keeping food clean and safely stored, and establishing eating patterns early. Specific recommendations from that era have since been substantially revised, and current medical guidance should govern the clinical questions.',
      modernApplication:
        'What survives is the household approach, and it is the part most modern parents struggle with: the adults decide what is offered and when, and the child decides how much of it to eat. That division ends most mealtime conflict. Serve the family\'s food rather than a separate children\'s menu, expect repeated exposure before acceptance, and refuse to become a short-order cook.',
      practice: [
        'You choose what is served and when; the child chooses how much.',
        'Serve the same food the family is eating rather than a separate menu.',
        'Expect to offer a new food many times before it is accepted. This is normal, not failure.',
        'Do not make food a reward, a punishment, or a negotiation.',
        'Follow current medical guidance on introduction timing, allergens, and safety.',
      ],
      activities: [
        'Serve one family meal with no alternatives offered and no comment on what anyone eats.',
        'Offer a rejected vegetable ten times over a month, prepared differently, and record the outcome.',
        'Eat one meal a day at the table with your child, adults eating the same food.',
      ],
    },
    {
      id: 'cleanliness-and-routine',
      question: 'How shall the young child be kept clean and taught to manage himself?',
      title: 'Cleanliness and Self-Management',
      summary:
        'Arrange the room so the child can do it without you.',
      classicPrinciple:
        'Daily care — bathing, hand washing, dressing, tooth care — was taught with an explicit second aim beyond hygiene: the child should progressively take it over. Routines were arranged so that a small child could reach, manage, and complete their own care, building independence as a byproduct of ordinary maintenance.',
      modernApplication:
        'The insight worth keeping is environmental. A child does for himself whatever the room makes possible: a stool at the sink, a low hook for the towel, clothing in reachable drawers, a step at the toilet. Most struggles over daily care are actually design problems, and adjusting the height of things resolves more of them than any amount of instruction.',
      practice: [
        'Lower or add what the child needs to reach: stool, hooks, drawers, steps.',
        'Fix the sequence of daily care so it runs without prompting.',
        'Let them do it imperfectly rather than doing it for them quickly.',
        'Add one new self-care responsibility as each becomes possible, and say so.',
      ],
      activities: [
        'Go through the bathroom and the child\'s room at their height and change three things they cannot currently reach.',
        'Time the morning routine, then remove one adult step from it and time it again.',
        'Choose one task you currently do for your child and hand it over entirely for two weeks.',
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
    {
      id: 'safeguarding-health',
      question: 'How can the young child\'s health be safeguarded?',
      title: 'Safeguarding a Child\'s Health',
      summary:
        'Records, routine care, a known baseline, and trusting what you observe.',
      classicPrinciple:
        'The unit closed on protecting the child\'s health: regular examination, keeping records of growth, watching for changes, and cooperating with medical care. The emphasis on the parent as an accurate observer — the person who knows the child\'s normal and notices departures from it — was well placed and remains sound.',
      modernApplication:
        'You are still the instrument that notices first, and that is worth taking seriously in an era that encourages outsourcing observation to devices and searches. Know your child\'s baseline — sleep, appetite, temperament, energy — keep your own records, and report changes specifically. Follow current medical guidance for clinical decisions, and give your own observation real weight when you raise it.',
      practice: [
        'Keep your own record of growth, illnesses, and anything you noticed and when.',
        'Learn your child\'s normal well enough to recognize a departure from it.',
        'Report changes specifically and with dates rather than generally.',
        'Say clearly when you believe something is wrong, and do not be talked out of it quickly.',
      ],
      activities: [
        'Start a simple written health record for each child and bring it to the next appointment.',
        'Write down each child\'s baseline — typical sleep, appetite, energy, temperament — and update it yearly.',
        'Practice describing a symptom in specifics: what, when it started, what changed, what helped.',
      ],
    },
  ],
};
