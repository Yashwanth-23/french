const { createClient } = require('@supabase/supabase-js');

const url = 'https://erxokhhjrbwxxvxmhrqc.supabase.co';
const key = 'sb_publishable_CIywJk0ES3t3N4K2ssY1Lg_3fKCqVBR';
const supabase = createClient(url, key);

(async () => {
  console.log('Updating @yashu profile to Telugu linguistic anchor in Supabase...');

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
        notesForIndianLearner: 'In Telugu, inanimate objects are neuter (అచేతనం). In French, every object is masculine (un/le) or feminine (une/la). Always memorize nouns with their article!'
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
        notesForIndianLearner: 'Tu = నువ్వు (informal for close friends/family); Vous = మీరు (formal for strangers, superiors, and exam examiners).'
      }
    ];

    await supabase
      .from('profiles')
      .update({
        preferred_formats: profile.preferred_formats,
        active_task_queue: updatedQueue
      })
      .eq('id', 'yashu');

    console.log('✓ Successfully updated @yashu task notes with Telugu native analogies!');
  } else {
    console.log('Profile @yashu not found in Supabase (will be updated on browser refresh).');
  }
})();
