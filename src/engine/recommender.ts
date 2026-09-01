import { CEFRLevel, DailyTask, Milestone, ResourceItem, SkillType, MediaFormat } from '../types/curriculum';
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

export function generateDailyPlan(
  profile: UserProfile
): DailyPlanResult {
  const { preferences, currentMilestoneId } = profile;
  const currentMilestone = milestones.find(m => m.id === currentMilestoneId) || milestones[0];
  const level = currentMilestone.level;
  const availableMinutes = preferences.dailyTimeMinutes;
  const preferredFormats = preferences.preferredFormats;

  const tasks: DailyTask[] = [];

  // Helper to find best resource matching level and preferred format
  const findResource = (skill: SkillType, preferredFormatList: MediaFormat[] = preferredFormats): ResourceItem | undefined => {
    // 1. Exact match on skill + level + format
    let match = resources.find(
      r => r.cefrLevels.includes(level) &&
           (r.primarySkill === skill || (r.secondarySkills && r.secondarySkills.includes(skill))) &&
           preferredFormatList.includes(r.format)
    );
    // 2. Fallback to any format for that skill & level
    if (!match) {
      match = resources.find(
        r => r.cefrLevels.includes(level) &&
             (r.primarySkill === skill || (r.secondarySkills && r.secondarySkills.includes(skill)))
      );
    }
    return match;
  };

  // Rule 1: A0 (Phonetics & Orthography)
  if (level === 'A0') {
    const phoneticsRes = resources.find(r => r.id === 'french-sounds-phonetics') || resources[0];
    const srsRes = resources.find(r => r.id === 'anki-5000-deck') || resources[0];
    const conjRes = resources.find(r => r.id === 'le-conjugueur') || resources[0];

    const phoneticsTime = Math.max(15, Math.round(availableMinutes * 0.5));
    const srsTime = Math.max(10, Math.round(availableMinutes * 0.25));
    const conjTime = Math.max(10, availableMinutes - phoneticsTime - srsTime);

    tasks.push({
      id: `task-phonetics-${Date.now()}-1`,
      title: 'French Sounds & Mouth Anatomy (Phonetics Drills)',
      resourceId: phoneticsRes.id,
      resourceTitle: phoneticsRes.title,
      resourceUrl: phoneticsRes.url,
      durationMinutes: phoneticsTime,
      skill: 'Phonetics',
      nature: 'active_shadowing',
      instructions: 'Practice French nasal vowels (an/en, in/ain, on, un) without touching your tongue to the roof of your mouth. Notice similarity to Hindi Chandrabindu.',
      completed: false,
      notesForIndianLearner: 'Dental T/D (teeth contact) vs retroflex Indian sounds. Practice the French R in the back of the throat.'
    });

    tasks.push({
      id: `task-srs-${Date.now()}-2`,
      title: 'Anki 5000 Deck: Foundation Sounds & Numbers',
      resourceId: srsRes.id,
      resourceTitle: srsRes.title,
      resourceUrl: srsRes.url,
      durationMinutes: srsTime,
      skill: 'Vocab',
      nature: 'srs_retrieval',
      instructions: 'Review 15 new flashcards. Always say the French word out loud along with the audio playback.',
      completed: false,
      notesForIndianLearner: 'Never learn a noun without its article (un/une or le/la).'
    });

    if (conjTime > 0) {
      tasks.push({
        id: `task-conj-${Date.now()}-3`,
        title: 'Subject Pronouns & Present of ÊTRE and AVOIR',
        resourceId: conjRes.id,
        resourceTitle: conjRes.title,
        resourceUrl: conjRes.url,
        durationMinutes: conjTime,
        skill: 'Conjugation',
        nature: 'drill_conjugation',
        instructions: 'Recite and write out the full present conjugations of ÊTRE (to be) and AVOIR (to have).',
        completed: false,
        notesForIndianLearner: 'Tu = तू/तुम (informal), Vous = आप (formal/plural).'
      });
    }
  }

  // Rule 2: A1 (Foundations & Regular Verbs)
  else if (level === 'A1') {
    const srsTime = Math.max(10, Math.min(20, Math.round(availableMinutes * 0.2)));
    const conjTime = Math.max(15, Math.round(availableMinutes * 0.3)); // Mandatory conjugation floor
    const audioTime = Math.max(15, Math.round(availableMinutes * 0.3));
    const grammarTime = Math.max(10, availableMinutes - srsTime - conjTime - audioTime);

    const srsRes = resources.find(r => r.id === 'anki-5000-deck') || resources[0];
    const conjRes = resources.find(r => r.id === 'le-conjugueur') || resources[0];
    const audioRes = findResource('CO', preferredFormats) || resources.find(r => r.id === 'coffee-break-french') || resources[0];
    const gramRes = resources.find(r => r.id === 'lawless-french') || resources[0];

    tasks.push({
      id: `task-srs-${Date.now()}-1`,
      title: 'Anki SRS Vocabulary Spaced Retrieval',
      resourceId: srsRes.id,
      resourceTitle: srsRes.title,
      resourceUrl: srsRes.url,
      durationMinutes: srsTime,
      skill: 'Vocab',
      nature: 'srs_retrieval',
      instructions: 'Complete daily due flashcards (target ~15 new + review cards).',
      completed: false
    });

    tasks.push({
      id: `task-conj-${Date.now()}-2`,
      title: 'Mandatory Conjugation Drills: -ER Verbs & Passé Composé',
      resourceId: conjRes.id,
      resourceTitle: conjRes.title,
      resourceUrl: conjRes.url,
      durationMinutes: conjTime,
      skill: 'Conjugation',
      nature: 'drill_conjugation',
      instructions: 'Do 10 rapid conjugation exercises on Le Conjugueur. Focus on DR & MRS VANDERTRAMP verbs taking ÊTRE.',
      completed: false,
      notesForIndianLearner: 'Passé Composé represents a completed action (मैंने खाया).'
    });

    tasks.push({
      id: `task-audio-${Date.now()}-3`,
      title: `Comprehensible Input: ${audioRes.title.split('(')[0]}`,
      resourceId: audioRes.id,
      resourceTitle: audioRes.title,
      resourceUrl: audioRes.url,
      durationMinutes: audioTime,
      skill: 'CO',
      nature: 'passive_input',
      instructions: 'Listen actively without English subtitles. Focus on identifying sentence boundaries and verb tenses.',
      completed: false
    });

    if (grammarTime > 0) {
      tasks.push({
        id: `task-gram-${Date.now()}-4`,
        title: 'Grammar Focus: Negation & Direct Objects',
        resourceId: gramRes.id,
        resourceTitle: gramRes.title,
        resourceUrl: gramRes.url,
        durationMinutes: grammarTime,
        skill: 'Grammar',
        nature: 'drill_conjugation',
        instructions: 'Study negation rules (ne... pas, ne... jamais) and definite vs partitive articles (du, de la, des).',
        completed: false
      });
    }
  }

  // Rule 3: A2 (Conversational Expansion & Vocal Shadowing)
  else if (level === 'A2') {
    const srsTime = Math.min(15, Math.round(availableMinutes * 0.15));
    const shadowTime = Math.max(25, Math.round(availableMinutes * 0.4)); // Mandatory shadowing
    const conjGrammarTime = Math.max(15, Math.round(availableMinutes * 0.25));
    const readingTime = Math.max(10, availableMinutes - srsTime - shadowTime - conjGrammarTime);

    const innerFrenchRes = resources.find(r => r.id === 'innerfrench-podcast') || resources[0];
    const conjRes = resources.find(r => r.id === 'le-conjugueur') || resources[0];
    const srsRes = resources.find(r => r.id === 'anki-5000-deck') || resources[0];
    const pffRes = resources.find(r => r.id === 'podcast-francais-facile') || resources[0];

    tasks.push({
      id: `task-shadow-${Date.now()}-1`,
      title: 'Active Vocal Shadowing: InnerFrench + Transcript',
      resourceId: innerFrenchRes.id,
      resourceTitle: innerFrenchRes.title,
      resourceUrl: innerFrenchRes.url,
      durationMinutes: shadowTime,
      skill: 'EO',
      nature: 'active_shadowing',
      isShadowing: true,
      instructions: '1. Listen to 5 minutes of Hugo Cotton. 2. Read transcript aloud simultaneously matching his rhythm and liaison. 3. Record yourself on your phone.',
      completed: false,
      notesForIndianLearner: 'Vocal shadowing prevents Indian rhythm interference and builds authentic French breath-group pacing.'
    });

    tasks.push({
      id: `task-conj-${Date.now()}-2`,
      title: 'Grammar & Verb Tense: Imparfait vs Passé Composé',
      resourceId: conjRes.id,
      resourceTitle: conjRes.title,
      resourceUrl: conjRes.url,
      durationMinutes: conjGrammarTime,
      skill: 'Conjugation',
      nature: 'drill_conjugation',
      instructions: 'Drill Imparfait endings (-ais, -ais, -ait, -ions, -iez, -aient) vs Passé Composé. Practice COD/COI pronoun replacement.',
      completed: false,
      notesForIndianLearner: 'Imparfait = background description (हो रहा था); Passé Composé = sudden event (हुआ).'
    });

    tasks.push({
      id: `task-srs-${Date.now()}-3`,
      title: 'Anki Spaced Repetition (A2 Expansion)',
      resourceId: srsRes.id,
      resourceTitle: srsRes.title,
      resourceUrl: srsRes.url,
      durationMinutes: srsTime,
      skill: 'Vocab',
      nature: 'srs_retrieval',
      instructions: 'Maintain daily flashcard reviews. Add newly discovered words from the InnerFrench transcript.',
      completed: false
    });

    if (readingTime > 0) {
      tasks.push({
        id: `task-read-${Date.now()}-4`,
        title: 'Dialogues & Dictée Practice',
        resourceId: pffRes.id,
        resourceTitle: pffRes.title,
        resourceUrl: pffRes.url,
        durationMinutes: readingTime,
        skill: 'CE',
        nature: 'drill_conjugation',
        instructions: 'Complete one short dictation on Podcast Français Facile to verify silent letter spelling.',
        completed: false
      });
    }
  }

  // Rule 4: B1 (Subjunctive & News Auditory Parsing)
  else if (level === 'B1') {
    const srsTime = Math.min(15, Math.round(availableMinutes * 0.15));
    const rfiShadowTime = Math.max(25, Math.round(availableMinutes * 0.35));
    const quebecoisTime = Math.max(15, Math.round(availableMinutes * 0.25));
    const writingOrGrammarTime = Math.max(15, availableMinutes - srsTime - rfiShadowTime - quebecoisTime);

    const rfiRes = resources.find(r => r.id === 'rfi-journal-facile') || resources[0];
    const qcRes = resources.find(r => r.id === 'quebecois-wandering-french') || resources[0];
    const srsRes = resources.find(r => r.id === 'anki-5000-deck') || resources[0];
    const vinceRes = resources.find(r => r.id === 'french-school-tv') || resources[0];

    tasks.push({
      id: `task-rfi-${Date.now()}-1`,
      title: 'RFI News Shadowing (Real-Time Tempo + Transcript)',
      resourceId: rfiRes.id,
      resourceTitle: rfiRes.title,
      resourceUrl: rfiRes.url,
      durationMinutes: rfiShadowTime,
      skill: 'CO',
      nature: 'active_shadowing',
      isShadowing: true,
      instructions: 'Listen to today\'s 10-minute bulletin. Shadow aloud with the transcript at 1.0x speed. Extract 5 formal journalistic collocations.',
      completed: false,
      notesForIndianLearner: 'This develops the rapid ear-parsing ability required for TEF Compréhension Orale.'
    });

    tasks.push({
      id: `task-qc-${Date.now()}-2`,
      title: 'Québécois Dialect & Accent Ear Calibration',
      resourceId: qcRes.id,
      resourceTitle: qcRes.title,
      resourceUrl: qcRes.url,
      durationMinutes: quebecoisTime,
      skill: 'CO',
      nature: 'passive_input',
      instructions: 'Watch one breakdown of Canadian French phonetic differences (affrication, diphthongs, and Canadian vocabulary).',
      completed: false,
      notesForIndianLearner: 'Essential for TEF/TCF Canada listening sections containing Montreal/Quebec recordings.'
    });

    tasks.push({
      id: `task-prod-${Date.now()}-3`,
      title: 'Subjonctif & Argumentative Connector Drills',
      resourceId: vinceRes.id,
      resourceTitle: vinceRes.title,
      resourceUrl: vinceRes.url,
      durationMinutes: writingOrGrammarTime,
      skill: 'EO',
      nature: 'production_prompt',
      instructions: 'Write or speak 3 sentences using Subjonctif triggers (\"Il faut que...\", \"Bien que...\") and logical connectors (\"En revanche\", \"Par conséquent\").',
      completed: false
    });

    if (srsTime > 0) {
      tasks.push({
        id: `task-srs-${Date.now()}-4`,
        title: 'Anki 5000 Vocabulary Review',
        resourceId: srsRes.id,
        resourceTitle: srsRes.title,
        resourceUrl: srsRes.url,
        durationMinutes: srsTime,
        skill: 'Vocab',
        nature: 'srs_retrieval',
        instructions: 'Clear daily reviews to sustain lexical depth.',
        completed: false
      });
    }
  }

  // Rule 5: B2 (TEF/TCF Canada Timed Simulation Sprint)
  else {
    const mockTime = Math.max(40, Math.round(availableMinutes * 0.5));
    const speakingTime = Math.max(25, Math.round(availableMinutes * 0.3));
    const writingOrVocabTime = Math.max(15, availableMinutes - mockTime - speakingTime);

    const feiRes = resources.find(r => r.id === 'fei-tcf-samples') || resources.find(r => r.id === 'tv5-tcf-simulator') || resources[0];
    const vinceRes = resources.find(r => r.id === 'french-school-tv') || resources[0];
    const ccipRes = resources.find(r => r.id === 'ccip-tef-samples') || resources[0];

    tasks.push({
      id: `task-mock-${Date.now()}-1`,
      title: 'Official FEI / TV5Monde Timed Exam Simulation',
      resourceId: feiRes.id,
      resourceTitle: feiRes.title,
      resourceUrl: feiRes.url,
      durationMinutes: mockTime,
      skill: 'Exam_Mock',
      nature: 'timed_mock',
      instructions: 'Complete a timed Compréhension Orale or Compréhension Écrite section. Grade errors and analyze why distractors were chosen.',
      completed: false,
      notesForIndianLearner: 'Never replay audio during test simulation. Real TEF audio plays once only.'
    });

    tasks.push({
      id: `task-speaking-${Date.now()}-2`,
      title: 'TEF Expression Orale Section A & B Simulation',
      resourceId: vinceRes.id,
      resourceTitle: vinceRes.title,
      resourceUrl: vinceRes.url,
      durationMinutes: speakingTime,
      skill: 'EO',
      nature: 'production_prompt',
      instructions: 'Section A: Ask 10 rapid questions to an examiner based on a sample ad. Section B: Give a 5-minute persuasive speech to a friend.',
      completed: false,
      notesForIndianLearner: 'Section A = VOUS (formal inquiry). Section B = TU (informal persuasion).'
    });

    tasks.push({
      id: `task-writing-${Date.now()}-3`,
      title: 'Expression Écrite Section B (200-Word Essay)',
      resourceId: ccipRes.id,
      resourceTitle: ccipRes.title,
      resourceUrl: ccipRes.url,
      durationMinutes: writingOrVocabTime,
      skill: 'EE',
      nature: 'production_prompt',
      instructions: 'Draft a formal argumentative letter to the editor. Incorporate at least 4 logical connectors and 1 subjunctive structure.',
      completed: false
    });
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

  // Total realistic hours required from current level to B2
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
