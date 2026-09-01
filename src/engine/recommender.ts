import { CEFRLevel, DailyTask, Milestone, ResourceItem, SkillType, MediaFormat, ExamTarget } from '../types/curriculum';
import { UserPreferences, UserProfile, SecondaryLanguageBridge } from '../types/preferences';
import resourcesData from '../data/resources.json';
import milestonesData from '../data/milestones.json';

const resources = resourcesData as ResourceItem[];
const milestones = milestonesData as Milestone[];

export interface DailyPlanResult {
  tasks: DailyTask[];
  totalMinutes: number;
  phaseSummary: string;
  focusDistribution: Record<string, number>;
  activeOutputPercentage: number;
}

interface MultiLingualBridgeNote {
  englishBase: string;
  telugu?: string;
  hindi?: string;
  tamil?: string;
  spanish?: string;
}

interface SkillSlotConfig {
  skill: SkillType;
  actionTitle: string;
  directLessonUrl: string;
  directLessonTitle: string;
  minMinutes: number;
  weight: number;
  nature: string;
  mandatory: boolean;
  instructions: string;
  bridgeNotes: MultiLingualBridgeNote;
  isShadowing?: boolean;
}

interface PhaseAllocationRule {
  slots: SkillSlotConfig[];
}

const ALLOCATION_RULES: Record<CEFRLevel, PhaseAllocationRule> = {
  A0: {
    slots: [
      {
        skill: 'Phonetics',
        actionTitle: 'Mouth Anatomy & Nasal Vowel Drills (an/en, on, in, un)',
        directLessonUrl: 'https://www.youtube.com/results?search_query=French+Sounds+nasal+vowels+an+in+on+un',
        directLessonTitle: 'French Sounds: 4 Nasal Vowels (AN, IN, ON, UN) Cross-Section Masterclass',
        minMinutes: 15,
        weight: 0.40,
        nature: 'active_shadowing',
        mandatory: true,
        instructions: 'Watch the 12-minute mouth anatomy breakdown. Practice the 4 nasal vowels in front of a mirror with air escaping through both nose and mouth.',
        bridgeNotes: {
          englishBase: 'French T/D are dental (tongue pressed on upper front teeth). Nasal vowels release air through nose and mouth simultaneously without sounding final N/M.',
          telugu: 'Matches dental Telugu త/ద (not retroflex ట/డ), and nasal resonance vibrates like తెలుగు అనునాసికాలు.',
          hindi: 'Matches Hindi dental त/द (not ट/ड) and Chandrabindu nasalization (माँ, चाँद).',
          tamil: 'Pronounce dental த/த without English aspiration.',
          spanish: 'Dental /t/ and /d/ are identical to Spanish "todo".'
        },
        isShadowing: true
      },
      {
        skill: 'Vocab',
        actionTitle: 'Anki SRS Lexical Retrieval: Numbers & Basic Nouns',
        directLessonUrl: 'https://ankiweb.net/shared/info/893324022',
        directLessonTitle: 'Anki French Top 5000 Audio Frequency Deck',
        minMinutes: 10,
        weight: 0.30,
        nature: 'srs_retrieval',
        mandatory: true,
        instructions: 'Review 15 new flashcards with native audio playback. Pronounce each card aloud immediately after hearing it.',
        bridgeNotes: {
          englishBase: 'Every French noun has grammatical gender (masculine or feminine). Always memorize nouns with their article (un/une, le/la), never alone.',
          telugu: 'Inanimate objects in Telugu are neuter (అచేతనం), but in French they must be masculine (un) or feminine (une). Always attach the article.',
          hindi: 'Inanimate objects have gender just like in Hindi (किताब f, कमरा m).',
          spanish: 'Gender matches Romance patterns (el libro / le livre, la mesa / la table).'
        }
      },
      {
        skill: 'Conjugation',
        actionTitle: 'Subject Pronouns & Present Tense of ÊTRE and AVOIR',
        directLessonUrl: 'https://leconjugueur.lefigaro.fr/conjugaison/verbe/etre.html',
        directLessonTitle: 'Le Conjugueur: ÊTRE & AVOIR Full Present Tense Paradigm',
        minMinutes: 10,
        weight: 0.30,
        nature: 'drill_conjugation',
        mandatory: true,
        instructions: 'Recite and write out full present tense conjugations of ÊTRE (to be) and AVOIR (to have) until recall is instantaneous.',
        bridgeNotes: {
          englishBase: 'Tu = informal "you" (friends/family); Vous = formal "you" (strangers, superiors, and TEF/TCF examiners). Never mix registers in exams.',
          telugu: 'Tu = నువ్వు (informal); Vous = మీరు (formal).',
          hindi: 'Tu = तू/तुम (informal); Vous = आप (formal).',
          tamil: 'Tu = நீ (informal); Vous = நீங்கள் (formal).',
          spanish: 'Tu = Tú (informal); Vous = Usted (formal).'
        }
      }
    ]
  },
  A1: {
    slots: [
      {
        skill: 'Vocab',
        actionTitle: 'Anki Spaced Retrieval: 1,000 High-Frequency Words',
        directLessonUrl: 'https://ankiweb.net/shared/info/893324022',
        directLessonTitle: 'Anki 1000 Core Vocabulary Frequency Cards',
        minMinutes: 10,
        weight: 0.20,
        nature: 'srs_retrieval',
        mandatory: true,
        instructions: 'Complete daily due cards on Anki. Focus on household items, food, professions, and travel vocabulary.',
        bridgeNotes: {
          englishBase: 'Cognate shortcut: Over 35% of English vocabulary derives from French/Latin (-tion, -able, -ty -> -té). Use your English foundation as a massive accelerator.',
          telugu: 'Use English Latin cognates (-tion -> -tion, -ty -> -té) to rapidly build your passive reading bank without rote memorization.',
          hindi: 'English cognates (-tion, -able) carry over directly with minor accent adjustments.'
        }
      },
      {
        skill: 'Conjugation',
        actionTitle: 'Mandatory Conjugation Floor: Regular -ER Verbs & Passé Composé',
        directLessonUrl: 'https://leconjugueur.lefigaro.fr/frlesverbes.php',
        directLessonTitle: 'Lawless French: Passé Composé with Avoir & Être (Interactive Guide)',
        minMinutes: 15,
        weight: 0.30,
        nature: 'drill_conjugation',
        mandatory: true,
        instructions: 'Master regular -ER endings (-e, -es, -e, -ons, -ez, -ent) and the DR & MRS VANDERTRAMP movement verbs taking Être in Passé Composé.',
        bridgeNotes: {
          englishBase: 'Passé Composé expresses completed past actions (I ate / I went). Movement verbs use Être as the auxiliary (Je suis allé = I went).',
          telugu: 'Passé Composé = punctual completed past (నేను తిన్నాను / నేను వెళ్లాను).',
          hindi: 'Passé Composé = punctual completed past (मैंने खाया / मैं गया).'
        }
      },
      {
        skill: 'CO',
        actionTitle: 'Comprehensible Input: Active Auditory Parsing',
        directLessonUrl: 'https://www.youtube.com/results?search_query=Super+Easy+French+1+introducing+yourself',
        directLessonTitle: 'Super Easy French 1: Se Présenter / Introducing Yourself (Slow French + Subtitles)',
        minMinutes: 15,
        weight: 0.30,
        nature: 'passive_input',
        mandatory: false,
        instructions: 'Watch this exact 8-minute introductory dialogue. Listen once without subtitles, then re-watch with French subtitles to map sounds to words.',
        bridgeNotes: {
          englishBase: 'French follows strict SVO (Subject-Verb-Object) word order in declarative sentences, just like English.',
          telugu: 'Unlike Telugu (SOV where the verb comes at the end), French places the verb directly after the subject (SVO).',
          hindi: 'Unlike Hindi (SOV), French places verbs directly after subjects (SVO).'
        }
      },
      {
        skill: 'Grammar',
        actionTitle: 'Grammar Focus: Negation Structures & Article Rules',
        directLessonUrl: 'https://www.podcastfrancaisfacile.com/grammaire',
        directLessonTitle: 'Lawless French: Negative Adverbs (ne... pas, ne... jamais, ne... rien)',
        minMinutes: 10,
        weight: 0.20,
        nature: 'drill_conjugation',
        mandatory: false,
        instructions: 'Study the negation sandwich formula (ne + [verb] + pas / jamais / rien) and complete the 5 interactive check questions.',
        bridgeNotes: {
          englishBase: 'French negation wraps around the conjugated verb like a sandwich: "ne + [verb] + pas / jamais / rien".',
          telugu: 'Negation wraps around the verb: "Je ne mange pas" (నేను తినడం లేదు).',
          hindi: 'Negation wraps around the verb: "Je ne mange pas" (मैं नहीं खा रहा हूँ).'
        }
      }
    ]
  },
  A2: {
    slots: [
      {
        skill: 'EO',
        actionTitle: 'Active Vocal Shadowing: InnerFrench + Synchronized Transcript',
        directLessonUrl: 'https://innerfrench.com/',
        directLessonTitle: 'InnerFrench Episode 01: "Apprendre le français" (Player & Free PDF Transcript)',
        minMinutes: 25,
        weight: 0.40,
        nature: 'active_shadowing',
        mandatory: true,
        instructions: 'Open Episode 01. 1. Listen to a 3-minute snippet. 2. Read transcript aloud simultaneously matching Hugo\'s pace and liaison. 3. Record yourself on your phone.',
        bridgeNotes: {
          englishBase: 'Vocal shadowing builds authentic French breath-group flow and enforces liaison (linking silent final consonants to following vowel sounds).',
          telugu: 'Vocal shadowing trains your tongue to link words smoothly instead of pausing between individual syllables.',
          hindi: 'Shadowing prevents syllable-chopping and develops smooth native liaison flow.'
        },
        isShadowing: true
      },
      {
        skill: 'Conjugation',
        actionTitle: 'Grammar & Verb Tense: Imparfait vs Passé Composé',
        directLessonUrl: 'https://leconjugueur.lefigaro.fr/frlesverbes.php',
        directLessonTitle: 'Lawless French: Passé Composé vs Imparfait Comparison & Quiz',
        minMinutes: 15,
        weight: 0.25,
        nature: 'drill_conjugation',
        mandatory: true,
        instructions: 'Drill Imparfait endings (-ais, -ait, -ions, -iez, -aient) vs Passé Composé. Complete the online contrast exercise.',
        bridgeNotes: {
          englishBase: 'Imparfait describes continuous past states or habits (I was doing / I used to do); Passé Composé narrates punctual completed events (I did).',
          telugu: 'Imparfait = ongoing past or habit (చేస్తూ ఉండేవాడిని); Passé Composé = finished event (చేశాను).',
          hindi: 'Imparfait = background/habit (कर रहा था); Passé Composé = finished event (किया).'
        }
      },
      {
        skill: 'Vocab',
        actionTitle: 'Anki 5000 Lexical Expansion (A2 Transition)',
        directLessonUrl: 'https://ankiweb.net/shared/info/893324022',
        directLessonTitle: 'Anki 5000 A2 Lexical Transition Cards',
        minMinutes: 10,
        weight: 0.15,
        nature: 'srs_retrieval',
        mandatory: true,
        instructions: 'Review daily flashcards. Add 5 newly discovered idioms from today\'s podcast transcript.',
        bridgeNotes: {
          englishBase: 'Always learn verbs with their dependent prepositions ("penser à" vs "parler de") to ensure correct pronoun substitution (y vs en).',
          telugu: 'Learn verbs with prepositions: "penser à" (ఆలోచించడం) vs "parler de" (మాట్లాడటం).',
          hindi: 'Learn verbs with prepositions: "penser à" (సోచనా) vs "parler de" (బాత్ కర్నా).'
        }
      },
      {
        skill: 'CE',
        actionTitle: 'Dictation (Dictée) & Reading Comprehension',
        directLessonUrl: 'https://www.podcastfrancaisfacile.com/grammaire',
        directLessonTitle: 'Podcast Français Facile: Graded A2 Audio Dictation & Answer Checker',
        minMinutes: 10,
        weight: 0.20,
        nature: 'drill_conjugation',
        mandatory: false,
        instructions: 'Play the audio dictation. Write what you hear on paper without looking at the solution, then verify your silent letter agreements.',
        bridgeNotes: {
          englishBase: 'Dictation practice bridges the gap between spoken French sounds and silent grammatical agreements in written French (e.g. plural -s, feminine -e).',
          telugu: 'Dictations teach you to handle silent French letters (D,P,S,T,X,Z) accurately in spelling.',
          hindi: 'Dictations train you to spell silent past participle agreements correctly.'
        }
      }
    ]
  },
  B1: {
    slots: [
      {
        skill: 'CO',
        actionTitle: 'RFI News Shadowing: Real-Time International Tempo',
        directLessonUrl: 'https://francaisfacile.rfi.fr/fr/podcasts/journal-en-fran%C3%A7ais-facile/',
        directLessonTitle: 'RFI: Latest 10-Minute Journal en français facile + Synchronized Script',
        minMinutes: 25,
        weight: 0.35,
        nature: 'active_shadowing',
        mandatory: true,
        instructions: 'Listen to today\'s 10-minute RFI bulletin. Read transcript aloud with the audio at 1.0x speed. Extract 5 journalistic collocations.',
        bridgeNotes: {
          englishBase: 'RFI training conditions your ear to parse rapid, authentic journalistic speech without pausing, essential for NCLC 7 listening speed.',
          telugu: 'RFI develops the fast ear-parsing speed required for Canadian NCLC 7 Compréhension Orale.',
          hindi: 'RFI conditions your ear for rapid TEF/TCF exam audio tempo.'
        },
        isShadowing: true
      },
      {
        skill: 'CO',
        actionTitle: 'Québécois Dialect & Accent Ear Calibration',
        directLessonUrl: 'https://www.youtube.com/results?search_query=Wandering+French+Quebecois+pronunciation+rules',
        directLessonTitle: 'Wandering French: 10 Phonetic Keys to Understand Canadian French & Affrication',
        minMinutes: 15,
        weight: 0.25,
        nature: 'passive_input',
        mandatory: true,
        instructions: 'Watch this exact 14-minute Canadian French phonetics breakdown. Note the affrication of t/d into ts/dz and regional slang.',
        bridgeNotes: {
          englishBase: 'Canadian French features regular affrication of /t/ and /d/ before high vowels (tu -> [tsy], dire -> [dzir]) and unique everyday terms (char = car, fin de semaine = weekend).',
          telugu: 'Canadian French turns T/D before I/U into "ts/dz" (e.g. "tu" sounds like "tsu"). Look out for "le char" (car).',
          hindi: 'Canadian French affricates t/d before i/u (tu -> tsu) and uses regional vocabulary.'
        }
      },
      {
        skill: 'EO',
        actionTitle: 'Subjunctive & Argumentative Discourse Connectors',
        directLessonUrl: 'https://www.podcastfrancaisfacile.com/grammaire',
        directLessonTitle: 'Lawless French: The Subjunctive Mood (Triggers, Conjugations & Quiz)',
        minMinutes: 15,
        weight: 0.25,
        nature: 'production_prompt',
        mandatory: true,
        instructions: 'Form 3 complex sentences using Subjunctive triggers ("Il faut que...", "Bien que...") and logical connectors ("En revanche", "Par conséquent").',
        bridgeNotes: {
          englishBase: 'The Subjunctive expresses subjective mood (necessity, doubt, emotion: "Il faut que je fasse...") rather than objective facts.',
          telugu: 'Subjunctive conveys necessity and subjective intent (అవసరం, కోరిక: "ఇలా చేయాల్సి ఉంది").',
          hindi: 'Subjunctive expresses necessity and subjective feeling ("यह ज़रूरी है कि...").'
        }
      },
      {
        skill: 'Vocab',
        actionTitle: 'Anki 5000 Lexicon Depth Review',
        directLessonUrl: 'https://ankiweb.net/shared/info/893324022',
        directLessonTitle: 'Anki 5000 B1 Public Policy & Economy Deck',
        minMinutes: 10,
        weight: 0.15,
        nature: 'srs_retrieval',
        mandatory: false,
        instructions: 'Sustain active vocabulary retention across public policy, health, economy, and environmental domains.',
        bridgeNotes: {
          englishBase: 'Master nominalization (converting action verbs into formal nouns: réduire -> la réduction) for high B2 writing scores.',
          telugu: 'Practice nominalization: converting verbs to formal nouns (détruire -> la destruction) for writing.',
          hindi: 'Practice nominalization: converting verbs into formal nouns for higher B2 writing scores.'
        }
      }
    ]
  },
  B2: {
    slots: [
      {
        skill: 'Exam_Mock',
        actionTitle: 'Timed Exam Simulation (Compréhension Orale & Écrite)',
        directLessonUrl: 'https://www.france-education-international.fr/hub/tcf',
        directLessonTitle: 'TV5Monde: 40-Question Timed B1/B2 Listening & Reading Mock Exam',
        minMinutes: 35,
        weight: 0.45,
        nature: 'timed_mock',
        mandatory: true,
        instructions: 'Complete a full timed listening or reading series under computerized exam room conditions without pause.',
        bridgeNotes: {
          englishBase: 'TEF Canada Listening is strictly single-pass (audio plays once only). TCF Canada has mixed playback with continuous 35m pacing.',
          telugu: 'TEF: Audio plays strictly once (take notes fast). TCF: Mixed audio playback with 35m pacing.',
          hindi: 'TEF: Single-pass audio only (take fast notes). TCF: Continuous 35m pacing.'
        }
      },
      {
        skill: 'EO',
        actionTitle: 'Expression Orale Simulation: Section A & B Roleplays',
        directLessonUrl: 'https://www.youtube.com/results?search_query=French+School+TV+TEF+Expression+Orale+Section+A',
        directLessonTitle: 'French School TV: TEF/TCF Canada Speaking Section A & B Formula Masterclass',
        minMinutes: 25,
        weight: 0.30,
        nature: 'production_prompt',
        mandatory: true,
        instructions: 'Section A: Ask 10 rapid formal questions (Vous). Section B: Deliver a 5-minute persuasive speech to a friend (Tu) overcoming 3 objections.',
        bridgeNotes: {
          englishBase: 'Section A requires strictly formal VOUS (formal inquiry with examiner); Section B requires informal TU (persuading a friend). Never mix registers in exams.',
          telugu: 'Section A = formal VOUS (మీరు); Section B = informal TU (నువ్వు). Never mix registers.',
          hindi: 'Section A = formal VOUS (आप); Section B = informal TU (तू/तुम). Never mix registers.'
        }
      },
      {
        skill: 'EE',
        actionTitle: 'Expression Écrite Simulation: 200-Word Formal Letter',
        directLessonUrl: 'https://www.podcastfrancaisfacile.com/grammaire',
        directLessonTitle: 'Lawless French: Formal Letter Writing Formulas & Sign-offs',
        minMinutes: 15,
        weight: 0.25,
        nature: 'production_prompt',
        mandatory: true,
        instructions: 'Draft a formal argumentative letter to the editor. Incorporate at least 4 logical connectors and 1 subjunctive structure.',
        bridgeNotes: {
          englishBase: 'Maintain strict formal register from opening to closing formula ("Je vous prie d\'agréer..."). Structure arguments with clear logical connectors.',
          telugu: 'Maintain formal register from salutation to sign-off ("Je vous prie d\'agréer...").',
          hindi: 'Maintain formal register from salutation to sign-off.'
        }
      }
    ]
  }
};

function formatBridgeNote(
  bridgeNotes: MultiLingualBridgeNote,
  secondaryBridge?: SecondaryLanguageBridge
): string {
  const base = bridgeNotes.englishBase;
  if (!secondaryBridge || secondaryBridge === 'none') {
    return base;
  }

  const nativeText = bridgeNotes[secondaryBridge];
  if (nativeText) {
    const label = secondaryBridge.charAt(0).toUpperCase() + secondaryBridge.slice(1);
    return `${base} • 💡 ${label} Anchor: ${nativeText}`;
  }

  return base;
}

export function generateDailyPlan(profile: UserProfile): DailyPlanResult {
  const { preferences, currentMilestoneId } = profile;
  const currentMilestone = milestones.find(m => m.id === currentMilestoneId) || milestones[0];
  const level = currentMilestone.level;
  const availableMinutes = preferences.dailyTimeMinutes;
  const preferredFormats = preferences.preferredFormats || ['podcast', 'youtube'];
  const targetExam = preferences.targetExam || 'Universal_B2';
  const secondaryBridge: SecondaryLanguageBridge = preferences.secondaryLanguageBridge || 'none';

  const rule = ALLOCATION_RULES[level] || ALLOCATION_RULES.A0;
  const tasks: DailyTask[] = [];
  const usedResourceIds = new Set<string>();

  const findBestResource = (
    skill: SkillType,
    mustBeDialect?: 'Quebecois',
    preferredFormatList: MediaFormat[] = preferredFormats
  ): ResourceItem => {
    const scored = resources.map(r => {
      let score = 0;
      if (usedResourceIds.has(r.id)) score -= 200;
      if (r.primarySkill === skill) score += 100;
      else if (r.secondarySkills && r.secondarySkills.includes(skill)) score += 40;
      else score -= 100;

      if (r.cefrLevels.includes(level)) score += 50;
      const userSelectableFormats: MediaFormat[] = ['podcast', 'youtube', 'web_app', 'book_pdf'];
      if (preferredFormatList.includes(r.format)) {
        score += 60;
      } else if (userSelectableFormats.includes(r.format)) {
        score -= 80;
      }
      if (mustBeDialect) {
        if (r.dialect === mustBeDialect) score += 80;
        else score -= 50;
      }
      if (r.isMandatoryCore) score += 10;
      return { resource: r, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const chosen = scored[0]?.resource || resources[0];
    usedResourceIds.add(chosen.id);
    return chosen;
  };

  rule.slots.forEach((slot, idx) => {
    let allocatedMinutes = Math.max(slot.minMinutes, Math.round(availableMinutes * slot.weight));

    const isCanadianSlot = level === 'B1' && idx === 1;
    const res = isCanadianSlot
      ? findBestResource('CO', 'Quebecois', preferredFormats)
      : findBestResource(slot.skill, undefined, preferredFormats);

    let instruction = slot.instructions;
    if (slot.skill === 'Exam_Mock') {
      if (targetExam === 'TEF_Canada') {
        instruction += ' (TEF Canada Protocol: Single-pass audio only; no second chance playback).';
      } else if (targetExam === 'TCF_Canada') {
        instruction += ' (TCF Canada Protocol: Mixed audio playback; manage 35-minute continuous pacing).';
      }
    }

    const note = formatBridgeNote(slot.bridgeNotes, secondaryBridge);

    // Exact direct lesson URL takes highest precedence so user opens the exact lesson, not a generic playlist
    const exactUrl = slot.directLessonUrl || res.url;
    const exactTitle = slot.directLessonTitle || res.title;

    tasks.push({
      id: `task-${level.toLowerCase()}-${slot.skill.toLowerCase()}-${idx + 1}`,
      title: slot.actionTitle,
      resourceId: res.id,
      resourceTitle: exactTitle,
      resourceUrl: exactUrl,
      durationMinutes: allocatedMinutes,
      skill: slot.skill,
      nature: slot.nature as any,
      instructions: instruction,
      completed: false,
      notesForIndianLearner: note,
      isShadowing: slot.isShadowing || slot.nature === 'active_shadowing'
    });
  });

  const totalGen = tasks.reduce((sum, t) => sum + t.durationMinutes, 0);
  if (totalGen !== availableMinutes && tasks.length > 0) {
    const diff = availableMinutes - totalGen;
    tasks[0].durationMinutes = Math.max(10, tasks[0].durationMinutes + diff);
  }

  const activeMinutes = tasks
    .filter(t => ['active_shadowing', 'drill_conjugation', 'production_prompt', 'timed_mock'].includes(t.nature))
    .reduce((acc, t) => acc + t.durationMinutes, 0);

  const activeOutputPercentage = Math.round((activeMinutes / availableMinutes) * 100);

  return {
    tasks,
    totalMinutes: tasks.reduce((sum, t) => sum + t.durationMinutes, 0),
    phaseSummary: currentMilestone.phaseLabel,
    focusDistribution: {
      activeMinutes,
      passiveMinutes: availableMinutes - activeMinutes
    },
    activeOutputPercentage
  };
}

export function calculateEstimatedTargetDate(
  currentMilestoneId: string,
  dailyMinutes: number,
  targetMonthsPreference?: number
): { monthsRemaining: number; targetDateFormatted: string; totalHoursNeeded: number } {
  const milestoneIndex = milestones.findIndex(m => m.id === currentMilestoneId);
  const remainingMilestones = milestones.slice(milestoneIndex >= 0 ? milestoneIndex : 0);

  const totalHoursNeeded = remainingMilestones.reduce((sum, m) => sum + m.targetHoursFloor, 0);
  
  let monthsRemaining = 12;
  const targetDate = new Date();

  if (targetMonthsPreference && targetMonthsPreference > 0) {
    monthsRemaining = targetMonthsPreference;
    targetDate.setMonth(targetDate.getMonth() + targetMonthsPreference);
  } else {
    const dailyHours = Math.max(0.5, dailyMinutes / 60);
    const daysRemaining = Math.ceil(totalHoursNeeded / dailyHours);
    monthsRemaining = Math.max(1, Math.round(daysRemaining / 30));
    targetDate.setDate(targetDate.getDate() + daysRemaining);
  }

  const targetDateFormatted = targetDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });

  return {
    monthsRemaining,
    targetDateFormatted,
    totalHoursNeeded
  };
}
