import { CEFRLevel, DailyTask, Milestone, ResourceItem, SkillType, MediaFormat, ExamTarget } from '../types/curriculum';
import { UserPreferences, UserProfile, LinguisticAnchor } from '../types/preferences';
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

interface MultiLingualNote {
  telugu: string;
  hindi: string;
  universal_english: string;
}

interface SkillSlotConfig {
  skill: SkillType;
  actionTitle: string;
  minMinutes: number;
  weight: number;
  nature: string;
  mandatory: boolean;
  instructions: string;
  notes: MultiLingualNote;
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
        minMinutes: 15,
        weight: 0.40,
        nature: 'active_shadowing',
        mandatory: true,
        instructions: 'Practice French nasal vowels in front of a mirror. Air must escape through both mouth and nose without sounding the final N or M consonant.',
        notes: {
          telugu: 'Pronounce T/D as dental (తెలుగు త/ద on front teeth), not retroflex (ట/డ). Nasal vowels vibrate through the nasal cavity like తెలుగు అనునాసికాలు.',
          hindi: 'Nasal vowels match Hindi Chandrabindu (माँ, चाँद). Consonants T/D are dental (दंत्य त/द), not retroflex (ट/ड).',
          universal_english: 'Pronounce French T/D with tongue on front teeth (dental). Nasal vowels release air through nose and mouth simultaneously; final N/M is silent.'
        },
        isShadowing: true
      },
      {
        skill: 'Vocab',
        actionTitle: 'Anki SRS Lexical Retrieval: Numbers & Basic Nouns',
        minMinutes: 10,
        weight: 0.30,
        nature: 'srs_retrieval',
        mandatory: true,
        instructions: 'Review 15 new flashcards with native audio playback. Pronounce each card aloud immediately after hearing it.',
        notes: {
          telugu: 'In Telugu, inanimate objects are neuter (అచేతనం). In French, every object is masculine (un/le) or feminine (une/la). Always memorize nouns with their article!',
          hindi: 'Never learn a noun without its article (un/une or le/la). Inanimate objects have gender just like in Hindi (किताब f, कमरा m).',
          universal_english: 'All French nouns have grammatical gender (masculine or feminine). Never memorize a noun in isolation — always learn it with its article (un/une, le/la).'
        }
      },
      {
        skill: 'Conjugation',
        actionTitle: 'Subject Pronouns & Present Tense of ÊTRE and AVOIR',
        minMinutes: 10,
        weight: 0.30,
        nature: 'drill_conjugation',
        mandatory: true,
        instructions: 'Write out and recite the full present tense conjugations of ÊTRE (to be) and AVOIR (to have).',
        notes: {
          telugu: 'Tu = నువ్వు (informal for close friends/family); Vous = మీరు (formal for strangers, superiors, and exam examiners).',
          hindi: 'Tu = तू/तुम (informal for friends/family); Vous = आप (formal for strangers, superiors, and examiners).',
          universal_english: 'Tu = informal "you" (friends/peers); Vous = formal "you" (strangers, officials, and TEF/TCF examiners). Never mix registers in formal tasks.'
        }
      }
    ]
  },
  A1: {
    slots: [
      {
        skill: 'Vocab',
        actionTitle: 'Anki Spaced Retrieval: 1,000 High-Frequency Words',
        minMinutes: 10,
        weight: 0.20,
        nature: 'srs_retrieval',
        mandatory: true,
        instructions: 'Complete daily due cards on Anki. Focus on everyday household items, food, professions, and travel vocabulary.',
        notes: {
          telugu: '35%+ of English Latin words carry directly into French with slight pronunciation changes (-tion, -able, -té). Use your English vocabulary as a massive shortcut.',
          hindi: 'English Latin cognates (-tion, -able) carry over directly into French with minor accent tweaks.',
          universal_english: 'Cognate shortcut: Over 35% of English vocabulary derives from French/Latin (-tion, -able, -ty -> -té). Use this cognate bridge to rapidly expand your passive lexicon.'
        }
      },
      {
        skill: 'Conjugation',
        actionTitle: 'Mandatory Conjugation Floor: Regular -ER Verbs & Passé Composé',
        minMinutes: 15,
        weight: 0.30,
        nature: 'drill_conjugation',
        mandatory: true,
        instructions: 'Do 10 rapid-fire drills on Le Conjugueur. Master DR & MRS VANDERTRAMP movement verbs that take Être in Passé Composé.',
        notes: {
          telugu: 'Passé Composé represents a completed past action (నేను తిన్నాను / I ate). Movement verbs take Être (e.g. Je suis allé = నేను వెళ్లాను).',
          hindi: 'Passé Composé represents a completed past action (मैंने खाया / I ate). Movement verbs use Être as auxiliary.',
          universal_english: 'Passé Composé is the standard past tense for completed punctual events (I ate / I went). Movement verbs use Être as the auxiliary.'
        }
      },
      {
        skill: 'CO',
        actionTitle: 'Comprehensible Input: Active Auditory Parsing',
        minMinutes: 15,
        weight: 0.30,
        nature: 'passive_input',
        mandatory: false,
        instructions: 'Listen to slow, graded French audio without English subtitles. Focus on identifying sentence boundaries and verb endings.',
        notes: {
          telugu: 'French sentence structure is SVO (Subject-Verb-Object) like English. Unlike Telugu (SOV where verb goes at the end), keep the verb immediately after the subject.',
          hindi: 'French is SVO (Subject-Verb-Object) like English. Avoid putting verbs at the end as in Hindi (SOV).',
          universal_english: 'French follows strict SVO (Subject-Verb-Object) syntax in declarative statements. Focus your ears on verb endings to distinguish tense.'
        }
      },
      {
        skill: 'Grammar',
        actionTitle: 'Grammar Focus: Negation Structures & Article Rules',
        minMinutes: 10,
        weight: 0.20,
        nature: 'drill_conjugation',
        mandatory: false,
        instructions: 'Study negation sandwich rules (ne + verb + pas / jamais / rien) and partitive articles (du, de la, des).',
        notes: {
          telugu: 'Negation forms a "sandwich" around the conjugated verb: "Je ne mange pas" (నేను తినట్లేదు).',
          hindi: 'Negation hugs the conjugated verb: "Je ne mange pas" (मैं नहीं खा रहा हूँ).',
          universal_english: 'Standard French negation wraps around the verb like a sandwich: "ne + [verb] + pas / jamais / rien".'
        }
      }
    ]
  },
  A2: {
    slots: [
      {
        skill: 'EO',
        actionTitle: 'Active Vocal Shadowing: InnerFrench + Synchronized Transcript',
        minMinutes: 25,
        weight: 0.40,
        nature: 'active_shadowing',
        mandatory: true,
        instructions: '1. Listen to a 3-minute podcast snippet. 2. Read transcript aloud simultaneously matching native rhythm and liaison. 3. Record yourself on your phone.',
        notes: {
          telugu: 'Vocal shadowing trains your tongue to connect words smoothly (liaison) without chopping syllables into isolated Indian stress beats.',
          hindi: 'Shadowing eliminates choppy syllable timing and builds authentic French breath-group flow.',
          universal_english: 'Vocal shadowing builds authentic French breath-group flow and enforces natural liaison (linking final consonants to following vowels).'
        },
        isShadowing: true
      },
      {
        skill: 'Conjugation',
        actionTitle: 'Grammar & Verb Tense: Imparfait vs Passé Composé',
        minMinutes: 15,
        weight: 0.25,
        nature: 'drill_conjugation',
        mandatory: true,
        instructions: 'Drill Imparfait endings (-ais, -ait, -ions, -iez, -aient) vs Passé Composé. Practice substituting nouns with COD/COI pronouns.',
        notes: {
          telugu: 'Imparfait = ongoing past description or habit (చేస్తూ ఉండేవాడిని / జరుగుతూ ఉంది); Passé Composé = single finished action (చేశాను).',
          hindi: 'Imparfait = background description (हो रहा था); Passé Composé = punctual completed event (हुआ).',
          universal_english: 'Imparfait describes past continuous states or recurring habits (I was doing / I used to do); Passé Composé narrates specific completed events.'
        }
      },
      {
        skill: 'Vocab',
        actionTitle: 'Anki 5000 Lexical Expansion (A2 Transition)',
        minMinutes: 10,
        weight: 0.15,
        nature: 'srs_retrieval',
        mandatory: true,
        instructions: 'Review daily flashcards. Add 5 newly discovered idioms or expressions from today\'s podcast transcript.',
        notes: {
          telugu: 'Learn verb prepositions together with verbs: "penser à" (దాని గురించి ఆలోచించడం) vs "parler de" (దాని గురించి మాట్లాడటం).',
          hindi: 'Learn verb prepositions: "penser à" (to think about) vs "parler de" (to talk about).',
          universal_english: 'Always learn verbs with their dependent prepositions ("penser à" vs "parler de") to ensure correct pronoun replacement (y vs en).'
        }
      },
      {
        skill: 'CE',
        actionTitle: 'Dictation (Dictée) & Reading Comprehension',
        minMinutes: 10,
        weight: 0.20,
        nature: 'drill_conjugation',
        mandatory: false,
        instructions: 'Complete one short dictation on Podcast Français Facile to verify silent letter spelling and past participle agreements.',
        notes: {
          telugu: 'French orthography has many silent letters (D,P,S,T,X,Z). Dictations ensure you connect what you hear to accurate spelling.',
          hindi: 'Dictations bridge the gap between French phonetics and complex silent-letter orthography.',
          universal_english: 'Dictation practice bridges the gap between spoken French phonetics and silent grammatical agreements in written French.'
        }
      }
    ]
  },
  B1: {
    slots: [
      {
        skill: 'CO',
        actionTitle: 'RFI News Shadowing: Real-Time International Tempo',
        minMinutes: 25,
        weight: 0.35,
        nature: 'active_shadowing',
        mandatory: true,
        instructions: 'Listen to today\'s 10-minute RFI bulletin. Read transcript aloud with the audio at 1.0x speed. Extract 5 journalistic collocations.',
        notes: {
          telugu: 'RFI builds the rapid ear-parsing speed required to score NCLC 7 in TEF/TCF Compréhension Orale.',
          hindi: 'Develops the rapid ear-parsing ability needed for TEF/TCF Compréhension Orale.',
          universal_english: 'RFI training conditions your ear to parse rapid, authentic journalistic speech without pausing, essential for NCLC 7.'
        },
        isShadowing: true
      },
      {
        skill: 'CO',
        actionTitle: 'Québécois Dialect & Accent Ear Calibration',
        minMinutes: 15,
        weight: 0.25,
        nature: 'passive_input',
        mandatory: true,
        instructions: 'Watch one breakdown of Canadian French phonetic differences (affrication of t/d into ts/dz, nasal vowel shifts, and regional terms).',
        notes: {
          telugu: 'Canadian French turns T/D before I/U into "ts/dz" (e.g. "tu" sounds like "tsu"). Watch out for Canadian terms: "le char" (car), "magasiner" (shopping).',
          hindi: 'High-frequency Canadian words: "le char" (car), "magasiner" (shopping), "la fin de semaine" (weekend).',
          universal_english: 'Canadian French features regular affrication of /t/ and /d/ before high vowels (tu -> [tsy]) and distinct regional vocabulary.'
        }
      },
      {
        skill: 'EO',
        actionTitle: 'Subjunctive & Argumentative Discourse Connectors',
        minMinutes: 15,
        weight: 0.25,
        nature: 'production_prompt',
        mandatory: true,
        instructions: 'Form 3 complex sentences using Subjunctive triggers ("Il faut que...", "Bien que...") and logical connectors ("En revanche", "Par conséquent").',
        notes: {
          telugu: 'Subjunctive conveys subjective mood (అవసరం, సందేహం, కోరిక: "ఇలా చేయాల్సి ఉంటుంది"), not objective facts.',
          hindi: 'Subjunctive conveys subjective mood (doubt, necessity, desire: "ज़रूरी है कि..."), not objective facts.',
          universal_english: 'The Subjunctive mood is mandatory after expressions of necessity, doubt, emotion, and certain conjunctions (bien que, pour que).'
        }
      },
      {
        skill: 'Vocab',
        actionTitle: 'Anki 5000 Lexicon Depth Review',
        minMinutes: 10,
        weight: 0.15,
        nature: 'srs_retrieval',
        mandatory: false,
        instructions: 'Sustain active vocabulary retention across public policy, health, economy, and environmental domains.',
        notes: {
          telugu: 'Focus on nominalization: converting verbs into formal nouns (détruire -> la destruction) for high-scoring writing.',
          hindi: 'Focus on nominalization: converting verbs to formal nouns (détruire -> la destruction).',
          universal_english: 'Master nominalization (converting action verbs into formal nouns: réduire -> la réduction) for high B2 writing scores.'
        }
      }
    ]
  },
  B2: {
    slots: [
      {
        skill: 'Exam_Mock',
        actionTitle: 'Timed Exam Simulation (Compréhension Orale & Écrite)',
        minMinutes: 35,
        weight: 0.45,
        nature: 'timed_mock',
        mandatory: true,
        instructions: 'Complete a full timed listening or reading series under computerized exam room conditions without pause.',
        notes: {
          telugu: 'TEF: Audio plays strictly once (take notes fast). TCF: Mixed audio playback with 35-minute continuous pacing.',
          hindi: 'TEF: Single-pass audio only (take fast notes). TCF: Continuous 35m pacing.',
          universal_english: 'TEF Canada Listening is strictly single-pass. TCF Canada has mixed single/double pass with rapid continuous pacing.'
        }
      },
      {
        skill: 'EO',
        actionTitle: 'Expression Orale Simulation: Section A & B Roleplays',
        minMinutes: 25,
        weight: 0.30,
        nature: 'production_prompt',
        mandatory: true,
        instructions: 'Section A: Ask 10 rapid formal questions (Vous). Section B: Deliver a 5-minute persuasive speech to a friend (Tu) overcoming 3 objections.',
        notes: {
          telugu: 'Section A = formal VOUS (మీరు); Section B = informal TU (నువ్వు). Never mix registers in the exam!',
          hindi: 'Section A = formal VOUS (आप); Section B = informal TU (तू/तुम). Never mix registers.',
          universal_english: 'Section A requires strictly formal VOUS (formal inquiry); Section B requires informal TU (persuading a friend). Do not cross registers.'
        }
      },
      {
        skill: 'EE',
        actionTitle: 'Expression Écrite Simulation: 200-Word Formal Letter',
        minMinutes: 15,
        weight: 0.25,
        nature: 'production_prompt',
        mandatory: true,
        instructions: 'Draft a formal argumentative letter to the editor. Incorporate at least 4 logical connectors and 1 subjunctive structure.',
        notes: {
          telugu: 'Maintain formal register from salutation to sign-off ("Je vous prie d\'agréer, Madame/Monsieur, l\'expression de mes salutations distinguées").',
          hindi: 'Maintain formal register from salutation to sign-off ("Je vous prie d\'agréer...").',
          universal_english: 'Maintain strict formal register from opening to closing formula ("Je vous prie d\'agréer..."). Structure with clear logical connectors.'
        }
      }
    ]
  }
};

export function generateDailyPlan(profile: UserProfile): DailyPlanResult {
  const { preferences, currentMilestoneId } = profile;
  const currentMilestone = milestones.find(m => m.id === currentMilestoneId) || milestones[0];
  const level = currentMilestone.level;
  const availableMinutes = preferences.dailyTimeMinutes;
  const preferredFormats = preferences.preferredFormats || ['podcast', 'youtube'];
  const targetExam = preferences.targetExam || 'Universal_B2';
  const anchor: LinguisticAnchor = preferences.linguisticAnchor || 'telugu';

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
      if (preferredFormatList.includes(r.format)) score += 25;
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

    const note = slot.notes[anchor] || slot.notes.telugu || slot.notes.universal_english;

    tasks.push({
      id: `task-${level.toLowerCase()}-${slot.skill.toLowerCase()}-${idx + 1}`,
      title: slot.actionTitle,
      resourceId: res.id,
      resourceTitle: res.title,
      resourceUrl: res.url,
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
