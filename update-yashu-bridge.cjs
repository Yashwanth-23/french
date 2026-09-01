const { createClient } = require('@supabase/supabase-js');

const url = 'https://erxokhhjrbwxxvxmhrqc.supabase.co';
const key = 'sb_publishable_CIywJk0ES3t3N4K2ssY1Lg_3fKCqVBR';
const supabase = createClient(url, key);

(async () => {
  console.log('Refreshing @yashu profile with English default + Telugu anchor in Supabase...');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', 'yashu')
    .maybeSingle();

  if (profile) {
    const updatedQueue = [
      {
        id: 'task-a0-vocab-1',
        title: 'Anki SRS Lexical Retrieval: Numbers & Basic Nouns',
        resourceId: 'anki-5000-deck',
        resourceTitle: 'Anki French Top 5000 Frequency Vocabulary Deck',
        resourceUrl: 'https://ankiweb.net/shared/decks?search=french+5000',
        durationMinutes: 36,
        skill: 'Vocab',
        nature: 'srs_retrieval',
        instructions: 'Review 15 new flashcards with native audio playback. Pronounce each card aloud immediately after hearing it.',
        completed: false,
        notesForIndianLearner: 'Every French noun has grammatical gender (masculine or feminine). Always memorize nouns with their article (un/une, le/la), never alone. • 💡 Telugu Anchor: Inanimate objects in Telugu are neuter (అచేతనం), but in French they must be masculine (un) or feminine (une).'
      },
      {
        id: 'task-a0-conjugation-2',
        title: 'Subject Pronouns & Present Tense of ÊTRE and AVOIR',
        resourceId: 'le-conjugueur',
        resourceTitle: 'Le Conjugueur & Bescherelle Drills',
        resourceUrl: 'https://leconjugueur.lefigaro.fr/',
        durationMinutes: 36,
        skill: 'Conjugation',
        nature: 'drill_conjugation',
        instructions: 'Write out and recite the full present tense conjugations of ÊTRE (to be) and AVOIR (to have).',
        completed: false,
        notesForIndianLearner: 'Tu = informal "you" (friends/family); Vous = formal "you" (strangers, superiors, and TEF/TCF examiners). Never mix registers in exams. • 💡 Telugu Anchor: Tu = నువ్వు (informal); Vous = మీరు (formal).'
      }
    ];

    await supabase
      .from('profiles')
      .update({
        secondary_language_bridge: 'telugu',
        active_task_queue: updatedQueue
      })
      .eq('id', 'yashu');

    console.log('✓ Successfully refreshed @yashu profile in Supabase!');
  }
})();
