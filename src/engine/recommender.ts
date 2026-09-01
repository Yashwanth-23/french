import { CEFRLevel, DailyTask, Milestone, ResourceItem, SkillType, MediaFormat, ExamTarget } from '../types/curriculum';
import { UserPreferences, UserProfile } from '../types/preferences';
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

interface SkillSlotConfig {
  skill: SkillType;
  actionTitle: string;
  minMinutes: number;
  weight: number;
  nature: string;
  mandatory: boolean;
  instructions: string;
  indianLearnerNote: string;
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
        indianLearnerNote: 'Nasal vowels match Hindi Chandrabindu (माँ, चाँद). Consonants T/D are dental (tongue on front teeth), not retroflex.',
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
        indianLearnerNote: 'Never learn a noun without its article (un/une or le/la). Hindi speakers: inanimate objects have gender just like in Hindi.'
      },
      {
        skill: 'Conjugation',
        actionTitle: 'Subject Pronouns & Present Tense of ÊTRE and AVOIR',
        minMinutes: 10,
        weight: 0.30,
        nature: 'drill_conjugation',
        mandatory: true,
        instructions: 'Write out and recite the full present tense conjugations of ÊTRE (to be) and AVOIR (to have).',
        indianLearnerNote: 'Tu = तू/तुम (informal for friends/family); Vous = आप (formal for strangers/superiors).'
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
        indianLearnerNote: 'English Latin cognates (-tion, -able) carry over directly into French with minor accent tweaks.'
      },
      {
        skill: 'Conjugation',
        actionTitle: 'Mandatory Conjugation Floor: Regular -ER Verbs & Passé Composé',
        minMinutes: 15,
        weight: 0.30,
        nature: 'drill_conjugation',
        mandatory: true,
        instructions: 'Do 10 rapid-fire drills on Le Conjugueur. Master DR & MRS VANDERTRAMP movement verbs that take Être in Passé Composé.',
        indianLearnerNote: 'Passé Composé represents a completed past action (मैंने खाया / I ate).'
      },
      {
        skill: 'CO',
        actionTitle: 'Comprehensible Input: Active Auditory Parsing',
        minMinutes: 15,
        weight: 0.30,
        nature: 'passive_input',
        mandatory: false,
        instructions: 'Listen to slow, graded French audio without English subtitles. Focus on identifying sentence boundaries and verb endings.',
        indianLearnerNote: 'French is SVO (Subject-Verb-Object) like English. Avoid putting verbs at the end as in Hindi/Telugu.'
      },
      {
        skill: 'Grammar',
        actionTitle: 'Grammar Focus: Negation Structures & Article Rules',
        minMinutes: 10,
        weight: 0.20,
        nature: 'drill_conjugation',
        mandatory: false,
        instructions: 'Study negation sandwich rules (ne + verb + pas / jamais / rien) and partitive articles (du, de la, des).',
        indianLearnerNote: 'Negation hugs the conjugated verb: "Je ne mange pas" (I do not eat).'
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
        indianLearnerNote: 'Shadowing eliminates choppy Indian syllable timing and builds authentic French breath-group flow.',
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
        indianLearnerNote: 'Imparfait = background description (हो रहा था); Passé Composé = punctual completed event (हुआ).'
      },
      {
        skill: 'Vocab',
        actionTitle: 'Anki 5000 Lexical Expansion (A2 Transition)',
        minMinutes: 10,
        weight: 0.15,
        nature: 'srs_retrieval',
        mandatory: true,
        instructions: 'Review daily flashcards. Add 5 newly discovered idioms or expressions from today\'s podcast transcript.',
        indianLearnerNote: 'Learn verb prepositions: "penser à" (to think about) vs "parler de" (to talk about).'
      },
      {
        skill: 'CE',
        actionTitle: 'Dictation (Dictée) & Reading Comprehension',
        minMinutes: 10,
        weight: 0.20,
        nature: 'drill_conjugation',
        mandatory: false,
        instructions: 'Complete one short dictation on Podcast Français Facile to verify silent letter spelling and past participle agreements.',
        indianLearnerNote: 'Dictations bridge the gap between French phonetics and complex silent-letter orthography.'
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
        indianLearnerNote: 'Develops the rapid ear-parsing ability needed for TEF/TCF Compréhension Orale.',
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
        indianLearnerNote: 'High-frequency Canadian words: "le char" (car), "magasiner" (shopping), "la fin de semaine" (weekend).'
      },
      {
        skill: 'EO',
        actionTitle: 'Subjunctive & Argumentative Discourse Connectors',
        minMinutes: 15,
        weight: 0.25,
        nature: 'production_prompt',
        mandatory: true,
        instructions: 'Form 3 complex sentences using Subjunctive triggers ("Il faut que...", "Bien que...") and logical connectors ("En revanche", "Par conséquent").',
        indianLearnerNote: 'Subjunctive conveys subjective mood (doubt, necessity, desire), not objective facts.'
      },
      {
        skill: 'Vocab',
        actionTitle: 'Anki 5000 Lexicon Depth Review',
        minMinutes: 10,
        weight: 0.15,
        nature: 'srs_retrieval',
        mandatory: false,
        instructions: 'Sustain active vocabulary retention across public policy, health, economy, and environmental domains.',
        indianLearnerNote: 'Focus on nominalization: converting verbs to formal nouns (détruire -> la destruction).'
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
        indianLearnerNote: 'TEF: Single-pass audio only (take fast notes). TCF: Continuous 35m pacing.'
      },
      {
        skill: 'EO',
        actionTitle: 'Expression Orale Simulation: Section A & B Roleplays',
        minMinutes: 25,
        weight: 0.30,
        nature: 'production_prompt',
        mandatory: true,
        instructions: 'Section A: Ask 10 rapid formal questions (Vous). Section B: Deliver a 5-minute persuasive speech to a friend (Tu) overcoming 3 objections.',
        indianLearnerNote: 'Section A = formal VOUS (आप); Section B = informal TU (तू/तुम). Never mix registers.'
      },
      {
        skill: 'EE',
        actionTitle: 'Expression Écrite Simulation: 200-Word Formal Letter',
        minMinutes: 15,
        weight: 0.25,
        nature: 'production_prompt',
        mandatory: true,
        instructions: 'Draft a formal argumentative letter to the editor. Incorporate at least 4 logical connectors and 1 subjunctive structure.',
        indianLearnerNote: 'Maintain formal register from salutation to sign-off ("Je vous prie d\'agréer...").'
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

  const rule = ALLOCATION_RULES[level] || ALLOCATION_RULES.A0;
  const tasks: DailyTask[] = [];
  const usedResourceIds = new Set<string>();

  // Helper: Find best matching resource without duplicate assignment
  const findBestResource = (
    skill: SkillType,
    mustBeDialect?: 'Quebecois',
    preferredFormatList: MediaFormat[] = preferredFormats
  ): ResourceItem => {
    // Score all resources
    const scored = resources.map(r => {
      let score = 0;

      // Penalize heavily if already assigned today
      if (usedResourceIds.has(r.id)) {
        score -= 200;
      }

      // Skill Matching (Primary is mandatory for high score)
      if (r.primarySkill === skill) {
        score += 100;
      } else if (r.secondarySkills && r.secondarySkills.includes(skill)) {
        score += 40;
      } else {
        score -= 100; // Skill mismatch penalty
      }

      // CEFR Level Match
      if (r.cefrLevels.includes(level)) {
        score += 50;
      }

      // Format Preference Match
      if (preferredFormatList.includes(r.format)) {
        score += 25;
      }

      // Dialect Match
      if (mustBeDialect) {
        if (r.dialect === mustBeDialect) score += 80;
        else score -= 50;
      }

      // Core Resource Boost
      if (r.isMandatoryCore) {
        score += 10;
      }

      return { resource: r, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const chosen = scored[0]?.resource || resources[0];
    usedResourceIds.add(chosen.id);
    return chosen;
  };

  // Build each configured slot
  rule.slots.forEach((slot, idx) => {
    let allocatedMinutes = Math.max(slot.minMinutes, Math.round(availableMinutes * slot.weight));

    // Dialect requirement for Canadian accent training
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
      notesForIndianLearner: slot.indianLearnerNote,
      isShadowing: slot.isShadowing || slot.nature === 'active_shadowing'
    });
  });

  // Normalize total minutes to match user's budget
  const totalGen = tasks.reduce((sum, t) => sum + t.durationMinutes, 0);
  if (totalGen !== availableMinutes && tasks.length > 0) {
    const diff = availableMinutes - totalGen;
    tasks[0].durationMinutes = Math.max(10, tasks[0].durationMinutes + diff);
  }

  // Calculate active output %
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
  dailyMinutes: number
): { monthsRemaining: number; targetDateFormatted: string; totalHoursNeeded: number } {
  const milestoneIndex = milestones.findIndex(m => m.id === currentMilestoneId);
  const remainingMilestones = milestones.slice(milestoneIndex >= 0 ? milestoneIndex : 0);

  const totalHoursNeeded = remainingMilestones.reduce((sum, m) => sum + m.targetHoursFloor, 0);
  const dailyHours = dailyMinutes / 60;
  const daysRemaining = Math.ceil(totalHoursNeeded / dailyHours);
  const monthsRemaining = Math.max(1, Math.round(daysRemaining / 30));

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysRemaining);

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
