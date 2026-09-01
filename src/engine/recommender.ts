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

// Data-driven pedagogical allocation weights per CEFR level
interface PhaseAllocationRule {
  skillWeights: { skill: SkillType; minMinutes: number; weight: number; nature: string; mandatory: boolean }[];
  instructionTemplates: Record<string, string>;
}

const ALLOCATION_RULES: Record<CEFRLevel, PhaseAllocationRule> = {
  A0: {
    skillWeights: [
      { skill: 'Phonetics', minMinutes: 15, weight: 0.45, nature: 'active_shadowing', mandatory: true },
      { skill: 'Vocab', minMinutes: 10, weight: 0.25, nature: 'srs_retrieval', mandatory: true },
      { skill: 'Conjugation', minMinutes: 10, weight: 0.30, nature: 'drill_conjugation', mandatory: true },
    ],
    instructionTemplates: {
      Phonetics: 'Mouth anatomy & French nasal vowels (an/en, in, on, un). Pronounce without touching the tongue to the palate, similar to Hindi Chandrabindu.',
      Vocab: 'Review new Anki cards with native audio. Lock in noun gender with articles (un/une, le/la).',
      Conjugation: 'Drill present tense of ÊTRE & AVOIR. Remember Tu = तू/तुम (informal) and Vous = आप (formal).'
    }
  },
  A1: {
    skillWeights: [
      { skill: 'Vocab', minMinutes: 10, weight: 0.20, nature: 'srs_retrieval', mandatory: true },
      { skill: 'Conjugation', minMinutes: 15, weight: 0.30, nature: 'drill_conjugation', mandatory: true },
      { skill: 'CO', minMinutes: 15, weight: 0.30, nature: 'passive_input', mandatory: false },
      { skill: 'Grammar', minMinutes: 10, weight: 0.20, nature: 'drill_conjugation', mandatory: false },
    ],
    instructionTemplates: {
      Vocab: 'Anki active recall session. Target 15 new words + all pending reviews.',
      Conjugation: 'Mandatory conjugation floor: Regular -ER verbs and Passé Composé with Être (DR & MRS VANDERTRAMP).',
      CO: 'Comprehensible Input: Listen actively for sentence structures and verb endings without English subtitles.',
      Grammar: 'Study negative structures (ne... pas, ne... jamais) and definite vs partitive articles.'
    }
  },
  A2: {
    skillWeights: [
      { skill: 'EO', minMinutes: 25, weight: 0.40, nature: 'active_shadowing', mandatory: true },
      { skill: 'Conjugation', minMinutes: 15, weight: 0.25, nature: 'drill_conjugation', mandatory: true },
      { skill: 'Vocab', minMinutes: 10, weight: 0.15, nature: 'srs_retrieval', mandatory: true },
      { skill: 'CE', minMinutes: 10, weight: 0.20, nature: 'drill_conjugation', mandatory: false },
    ],
    instructionTemplates: {
      EO: 'Vocal Shadowing with Audio + Transcript: Listen, pause, and record yourself reading aloud simultaneously to master liaison and breath groups.',
      Conjugation: 'Past tense differentiation: Imparfait (habitual/background) vs Passé Composé (punctual action). Replace nouns with COD/COI pronouns.',
      Vocab: 'Anki SRS lexical expansion: Add words extracted from today\'s podcast transcript.',
      CE: 'Dictation (dictée) & reading comprehension: Verify agreement of past participles and silent letter spelling.'
    }
  },
  B1: {
    skillWeights: [
      { skill: 'CO', minMinutes: 25, weight: 0.35, nature: 'active_shadowing', mandatory: true },
      { skill: 'CO', minMinutes: 15, weight: 0.25, nature: 'passive_input', mandatory: true }, // Canadian accent slot
      { skill: 'EO', minMinutes: 15, weight: 0.25, nature: 'production_prompt', mandatory: true },
      { skill: 'Vocab', minMinutes: 10, weight: 0.15, nature: 'srs_retrieval', mandatory: false },
    ],
    instructionTemplates: {
      CO: 'Real-time News Shadowing (RFI): Listen to the 10-minute international bulletin at native speed while reading the transcript.',
      EO: 'Subjunctive & Argumentation drills: Form 3 complex sentences expressing opinion and necessity with connectors (En revanche, Néanmoins).',
      Vocab: 'Sustain 4,000+ active lexicon using Anki retrieval.'
    }
  },
  B2: {
    skillWeights: [
      { skill: 'Exam_Mock', minMinutes: 35, weight: 0.45, nature: 'timed_mock', mandatory: true },
      { skill: 'EO', minMinutes: 25, weight: 0.30, nature: 'production_prompt', mandatory: true },
      { skill: 'EE', minMinutes: 15, weight: 0.25, nature: 'production_prompt', mandatory: true },
    ],
    instructionTemplates: {
      Exam_Mock: 'Timed Mock Simulation: Complete one listening or reading series under computerized exam room conditions without pausing.',
      EO: 'Expression Orale Simulation: Section A (Inquiry / 5 mins / Vous) & Section B (Persuasion / 10 mins / Tu).',
      EE: 'Expression Écrite Simulation: Draft a 200-word formal argumentative letter incorporating at least 4 logical connectors.'
    }
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

  // Helper: Find best matching resource using weighted scoring
  const findBestResource = (
    skill: SkillType,
    mustBeDialect?: 'Quebecois',
    preferredFormatList: MediaFormat[] = preferredFormats
  ): ResourceItem => {
    // Score all available resources
    const scored = resources.map(r => {
      let score = 0;
      // CEFR Match
      if (r.cefrLevels.includes(level)) score += 50;
      // Skill Match
      if (r.primarySkill === skill) score += 40;
      else if (r.secondarySkills && r.secondarySkills.includes(skill)) score += 20;
      // Format Preference Match
      if (preferredFormatList.includes(r.format)) score += 25;
      // Dialect Match
      if (mustBeDialect && r.dialect === mustBeDialect) score += 60;
      // Mandatory Core Boost
      if (r.isMandatoryCore) score += 10;
      return { resource: r, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.resource || resources[0];
  };

  // Generate slots from phase rules
  rule.skillWeights.forEach((slot, idx) => {
    let allocatedMinutes = Math.max(slot.minMinutes, Math.round(availableMinutes * slot.weight));

    // Special dialect handling for B1/B2 Canadian accent exposure
    const isCanadianSlot = level === 'B1' && idx === 1;
    const res = isCanadianSlot 
      ? findBestResource('CO', 'Quebecois', preferredFormats)
      : findBestResource(slot.skill, undefined, preferredFormats);

    let instruction = rule.instructionTemplates[slot.skill] || res.description;

    // Adapt instruction for exam target
    if (slot.skill === 'Exam_Mock') {
      if (targetExam === 'TEF_Canada') {
        instruction += ' (TEF Canada Protocol: Single-pass audio only; no second chance playback).';
      } else if (targetExam === 'TCF_Canada') {
        instruction += ' (TCF Canada Protocol: Mixed audio playback; manage 35-minute continuous pacing).';
      }
    }

    const isShadowing = slot.nature === 'active_shadowing' || slot.skill === 'EO' && (level === 'A2' || level === 'B1');

    tasks.push({
      id: `task-${level.toLowerCase()}-${slot.skill.toLowerCase()}-${idx + 1}`,
      title: `${res.title.split('(')[0].trim()}`,
      resourceId: res.id,
      resourceTitle: res.title,
      resourceUrl: res.url,
      durationMinutes: allocatedMinutes,
      skill: slot.skill,
      nature: slot.nature as any,
      instructions: instruction,
      completed: false,
      notesForIndianLearner: res.notesForIndianLearners,
      isShadowing
    });
  });

  // Normalize total minutes to match availableMinutes
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
