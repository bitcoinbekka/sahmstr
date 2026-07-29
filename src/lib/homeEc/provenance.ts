/**
 * Provenance note, surfaced in the UI so readers know exactly what this
 * material is and what it is not.
 */
export const PROVENANCE = {
  reference: {
    title: "Today's Home Living",
    authors: 'Margaret M. Justin and Lucile Osborn Rust',
    publisher: 'J. B. Lippincott Company',
    year: '1947',
    note: 'A high school home economics text from the School of Home Economics at Kansas State College, itself the fourth edition of a book first published in 1929. Its seventeen units covered the family, growing up, home management, housing, the care of the house, the use of time, family income, the family as a consumer, heredity and environment, the care of the young child, child development, guiding the child\'s learning, the community\'s responsibility for children, health, home nursing, care of the patient, and how the home and community work together.',
    url: 'https://archive.org/details/todayshomeliving00just',
  },
  statement:
    'This curriculum is original writing. We used the 1947 text as a scope-and-sequence reference — for its subject areas, and for its practice of framing each lesson as a plain question followed by suggested activities — because that structure is genuinely better pedagogy than a list of topics. None of its text is reproduced here. The principles are described in our own words, and every modern application, practice item, and activity was written for this project.',
  divergence:
    'We depart from the source in three ways. Its assumptions about what a woman might want from her life were narrow, and we have kept its questions while discarding those assumptions. Its medical and nutritional guidance has in many cases been revised or overturned, and we have not repeated it — the health material here is general household practice and defers to current medical advice. And the final unit is entirely ours: where the original closed by asking how the household cooperates with systems it depends on, we ask what changes when the most important of those systems are open protocols a family can participate in rather than merely consume.',
} as const;
