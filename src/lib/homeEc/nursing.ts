import type { UnitDefinition } from './types';

/** All prose original. Structure follows the classic home economics scope-and-sequence; see provenance.ts. */
export const nursing: UnitDefinition = {
    id: 'health-home-nursing',
    title: 'Caring for the Sick at Home',
    tagline: 'Competent care, and knowing its limits',
    description:
      'The medicine chest, managing an illness at home, arranging a sickroom, and recognizing clearly when a household\'s competence ends.',
    opening:
      'Two units covered this ground: being a home helper to the physician, and caring for the patient. Home nursing is nearly extinct as a taught skill and remains entirely relevant, because most illness is still managed at home by someone with no training at all. The old material was careful about its own limits — it taught observation, comfort, and infection control, and it named plainly the signs that meant sending for a doctor. That combination of competence and humility is exactly right. This is general household practice, not medical advice.',
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
    ],
};
