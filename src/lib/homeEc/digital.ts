import type { UnitDefinition } from './types';

/** All prose original. Structure follows the classic home economics scope-and-sequence; see provenance.ts. */
export const digital: UnitDefinition = {
    id: 'digital-household',
    title: 'The Digital Household',
    tagline: 'The unit the old books could not write',
    description:
      'Records, identity, communication, and money now live on machines you may or may not control. This module applies the same standards the old curriculum applied to the pantry and the account book.',
    opening:
      'Every other module in this curriculum has an ancestor. This one does not. But the questions it asks are the oldest ones in the field, only relocated: where are the household\'s records kept, who holds the keys, what happens if a supplier fails, and what can be lost in a single bad afternoon. A household that would not keep its only copy of the deed in a neighbor\'s desk should think carefully about where its photographs, messages, and money actually live.',
    icon: 'ShieldCheck',
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
};
