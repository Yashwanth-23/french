const fs = require('fs');

const current = JSON.parse(fs.readFileSync('./src/data/resources.json', 'utf8'));

const newAdditions = [
  {
    id: 'francais-interactif-ut',
    title: 'Français Interactif (UT Austin Open Curriculum)',
    creatorOrSource: 'University of Texas at Austin / COERLL',
    url: 'https://www.laits.utexas.edu/fi/',
    badge: 'University Open Course',
    cefrLevels: ['A0', 'A1', 'A2', 'B1'],
    primarySkill: 'Grammar',
    secondarySkills: ['CO', 'Vocab', 'Phonetics'],
    format: 'web_app',
    dialect: 'Neutral_International',
    activityNature: 'structured_curriculum',
    depth: 'structured_curriculum',
    estimatedMinutesPerSession: 30,
    isMandatoryCore: false,
    prerequisiteMilestoneIds: [],
    description: 'Complete university-grade open educational textbook and audio curriculum covering A0 through B1 with video dialogues and structured grammar exercises.',
    whyItWorks: 'Zero paywall, highly organized progression developed by academic linguists for non-native speakers.',
    notesForIndianLearners: 'Comprehensive foundation covering verb paradigms, dental pronunciation, and social registers from Day 1.'
  },
  {
    id: 'dli-gloss',
    title: 'GLOSS Defense Language Institute Audio Repository',
    creatorOrSource: 'DLIFLC (US Defense Language Institute)',
    url: 'https://gloss.dliflc.edu/',
    badge: 'Military Grade Listening',
    cefrLevels: ['B1', 'B2'],
    primarySkill: 'CO',
    secondarySkills: ['CE', 'Vocab'],
    format: 'web_app',
    dialect: 'Neutral_International',
    activityNature: 'timed_mock',
    depth: 'deep_practice_bank',
    estimatedMinutesPerSession: 30,
    isMandatoryCore: false,
    prerequisiteMilestoneIds: ['milestone-a2'],
    description: 'Authentic listening and reading modules extracted from real French radio broadcasts, press articles, and television debates with synchronized transcripts.',
    whyItWorks: 'Trains rapid unscripted listening comprehension at exact ILR / CEFR B1-B2 benchmarks.',
    notesForIndianLearners: 'Builds the stamina needed to parse fast international broadcasts without getting overwhelmed by fast accents.'
  },
  {
    id: 'podcast-francais-facile',
    title: 'Podcast Français Facile (Dialogues & Dictations)',
    creatorOrSource: 'Vincent Durrenberger',
    url: 'https://www.podcastfrancaisfacile.com/',
    badge: 'Dictées & Graded Audio',
    cefrLevels: ['A1', 'A2', 'B1'],
    primarySkill: 'CE',
    secondarySkills: ['CO', 'Grammar'],
    format: 'audio_transcript',
    dialect: 'Neutral_International',
    activityNature: 'drill_conjugation',
    depth: 'deep_practice_bank',
    estimatedMinutesPerSession: 20,
    isMandatoryCore: false,
    prerequisiteMilestoneIds: ['milestone-a0'],
    description: 'Hundreds of graded audio dialogues with full transcripts and crucial dictation (dictée) exercises to master French spelling agreements.',
    whyItWorks: 'Dictations bridge the gap between spoken sounds and silent letters in French orthography.',
    notesForIndianLearners: 'Essential for mastering silent past participle agreements (-s, -e, -ent).'
  },
  {
    id: 'reverso-context',
    title: 'Reverso Context Concordance Engine',
    creatorOrSource: 'Reverso Softissimo',
    url: 'https://context.reverso.net/',
    badge: 'Writing Concordance',
    cefrLevels: ['A1', 'A2', 'B1', 'B2'],
    primarySkill: 'EE',
    secondarySkills: ['Vocab', 'Grammar'],
    format: 'web_app',
    dialect: 'Neutral_International',
    activityNature: 'srs_retrieval',
    depth: 'targeted_drill',
    estimatedMinutesPerSession: 15,
    isMandatoryCore: false,
    prerequisiteMilestoneIds: [],
    description: 'Search millions of bilingual real-world sentence pairs from official documents, subtitles, and publications to find natural collocations.',
    whyItWorks: 'Prevents literal translation mistakes and teaches authentic B2 discourse connectors in context.',
    notesForIndianLearners: 'Use this whenever writing formal letters for TEF/TCF to verify exact verb prepositions.'
  },
  {
    id: 'easy-french-yt',
    title: 'Easy French (Authentic Street Interviews)',
    creatorOrSource: 'Easy Languages',
    url: 'https://www.youtube.com/@EasyFrench',
    badge: 'Dual Subtitle Immersion',
    cefrLevels: ['A2', 'B1', 'B2'],
    primarySkill: 'CO',
    secondarySkills: ['EO', 'Vocab'],
    format: 'youtube',
    dialect: 'Metropolitan',
    activityNature: 'active_shadowing',
    depth: 'deep_practice_bank',
    estimatedMinutesPerSession: 20,
    isMandatoryCore: false,
    prerequisiteMilestoneIds: ['milestone-a1'],
    description: 'Authentic street interviews across Paris and francophone cities with dual French and English subtitles.',
    whyItWorks: 'Exposes your ear to real-world spoken contractions (chuis, dropped ne, fast rhythm) before exam testing.',
    notesForIndianLearners: 'Shadow the speakers to pick up natural rhythm and informal Parisian liaisons.'
  },
  {
    id: 'readlang-web',
    title: 'Readlang Web Reader & Vocab Importer',
    creatorOrSource: 'Readlang / Steve Ridout',
    url: 'https://readlang.com/',
    badge: '1-Click Reading Ext',
    cefrLevels: ['A2', 'B1', 'B2'],
    primarySkill: 'CE',
    secondarySkills: ['Vocab'],
    format: 'web_app',
    dialect: 'Neutral_International',
    activityNature: 'srs_retrieval',
    depth: 'targeted_drill',
    estimatedMinutesPerSession: 20,
    isMandatoryCore: false,
    prerequisiteMilestoneIds: ['milestone-a1'],
    description: 'Click any word on French websites (Le Monde, Radio-Canada) to translate in-context and automatically export flashcards to Anki.',
    whyItWorks: 'Enables friction-free reading of native articles months earlier than standard textbook methods.',
    notesForIndianLearners: 'Use this to read Canadian immigration articles and Radio-Canada news without stopping every sentence.'
  }
];

// Add unique items only
newAdditions.forEach(item => {
  if (!current.some(c => c.id === item.id)) {
    current.push(item);
  }
});

fs.writeFileSync('./src/data/resources.json', JSON.stringify(current, null, 2), 'utf8');
console.log(`Updated resources.json: Now contains ${current.length} verified resources!`);
