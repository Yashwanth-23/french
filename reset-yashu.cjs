const { createClient } = require('@supabase/supabase-js');

const url = 'https://erxokhhjrbwxxvxmhrqc.supabase.co';
const key = 'sb_publishable_CIywJk0ES3t3N4K2ssY1Lg_3fKCqVBR';
const supabase = createClient(url, key);

(async () => {
  console.log('Resetting study hours and history for @yashu in Supabase...');

  const cleanQueue = [
    {
      id: 'task-a0-phonetics-1',
      title: 'Mouth Anatomy & Nasal Vowel Drills (an/en, on, in, un)',
      resourceId: 'french-sounds-phonetics',
      resourceTitle: 'French Sounds & Pronunciation Masterclass',
      resourceUrl: 'https://www.youtube.com/@frenchsounds',
      durationMinutes: 48,
      skill: 'Phonetics',
      nature: 'active_shadowing',
      instructions: 'Practice French nasal vowels in front of a mirror. Air must escape through both mouth and nose without sounding the final N or M consonant.',
      completed: false,
      notesForIndianLearner: 'French T/D are dental (tongue pressed on upper front teeth). Nasal vowels release air through nose and mouth simultaneously without sounding final N/M. • 💡 Telugu Anchor: Matches dental Telugu త/ద (not retroflex ట/డ), and nasal resonance vibrates like తెలుగు అనునాసికాలు.',
      isShadowing: true
    },
    {
      id: 'task-a0-vocab-2',
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
      id: 'task-a0-conjugation-3',
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

  const { data, error } = await supabase
    .from('profiles')
    .update({
      total_minutes_logged: 0,
      completed_history: [],
      streak_days: 1,
      active_task_queue: cleanQueue,
      updated_at: new Date().toISOString()
    })
    .eq('id', 'yashu')
    .select()
    .single();

  if (error) {
    console.error('Error resetting @yashu:', error.message);
  } else {
    console.log('✓ Successfully reset @yashu to clean slate:');
    console.log('  Total Minutes Logged:', data.total_minutes_logged, '(0.0h / 800h)');
    console.log('  Completed History:', data.completed_history.length, 'entries (Study Log 0)');
    console.log('  Active Tasks in Queue:', data.active_task_queue.length, 'items (~120 mins)');
  }
})();
