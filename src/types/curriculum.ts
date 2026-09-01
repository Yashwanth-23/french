export type CEFRLevel = 'A0' | 'A1' | 'A2' | 'B1' | 'B2';

export type ExamTarget = 'TEF_Canada' | 'TCF_Canada' | 'Universal_B2';

export type SkillType =
  | 'CO' // Compréhension Orale (Listening)
  | 'CE' // Compréhension Écrite (Reading)
  | 'EO' // Expression Orale (Speaking / Shadowing)
  | 'EE' // Expression Écrite (Writing)
  | 'Grammar'
  | 'Conjugation'
  | 'Vocab'
  | 'Phonetics'
  | 'Exam_Mock';

export type MediaFormat =
  | 'podcast'
  | 'youtube'
  | 'book_pdf'
  | 'web_app'
  | 'flashcards'
  | 'audio_transcript';

export type Dialect = 'Metropolitan' | 'Quebecois' | 'Neutral_International';

export type ActivityNature =
  | 'passive_input'
  | 'active_shadowing'
  | 'srs_retrieval'
  | 'drill_conjugation'
  | 'production_prompt'
  | 'timed_mock';

export type ResourceDepth =
  | 'official_orientation_sample' // Official 1-2 past tests from exam bodies
  | 'deep_practice_bank'          // High-volume mock question simulator
  | 'structured_curriculum'       // Step-by-step learning modules
  | 'targeted_drill';             // Rapid-fire skills/flashcards

export interface ResourceItem {
  id: string;
  title: string;
  creatorOrSource: string;
  url: string;
  badge?: string;
  cefrLevels: CEFRLevel[];
  primarySkill: SkillType;
  secondarySkills?: SkillType[];
  format: MediaFormat;
  dialect: Dialect;
  activityNature: ActivityNature;
  depth: ResourceDepth;
  estimatedMinutesPerSession: number;
  isMandatoryCore: boolean;
  prerequisiteMilestoneIds: string[];
  description: string;
  whyItWorks: string;
  depthDisclaimer?: string;
  notesForIndianLearners?: string;
  actionGuide?: string;
}

export interface Milestone {
  id: string;
  level: CEFRLevel;
  title: string;
  phaseLabel: string;
  targetHoursFloor: number;
  targetHoursOptimized: number;
  description: string;
  grammarKeypoints: string[];
  vocabTargetCount: number;
  activeRequirements: string[];
  recommendedResourceIds: string[];
}

export interface DailyTask {
  id: string;
  title: string;
  resourceId?: string;
  resourceTitle: string;
  resourceUrl?: string;
  durationMinutes: number;
  skill: SkillType;
  nature: ActivityNature;
  instructions: string;
  completed: boolean;
  notesForIndianLearner?: string;
  isShadowing?: boolean;
}

export interface IndianBridgeConcept {
  id: string;
  topic: string;
  category: 'Grammar' | 'Phonetics' | 'Vocabulary' | 'Sociolinguistics';
  frenchConcept: string;
  hindiAnalogy: string;
  teluguAnalogy: string;
  englishAnalogy: string;
  exampleFrench: string;
  exampleHindi: string;
  exampleTelugu: string;
  exampleEnglish: string;
  practicalTip: string;
}

export interface DiagnosticQuestion {
  id: string;
  level: CEFRLevel;
  skill: SkillType;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ExamTemplateSection {
  id: string;
  section: 'EO_SectionA' | 'EO_SectionB' | 'EE_SectionA' | 'EE_SectionB' | 'TCF_EO_Task1' | 'TCF_EO_Task2' | 'TCF_EO_Task3' | 'TCF_EE_Task1' | 'TCF_EE_Task2' | 'TCF_EE_Task3';
  examType: 'TEF_Canada' | 'TCF_Canada';
  title: string;
  timeLimitMinutes: number;
  wordCountTarget?: string;
  objective: string;
  structuralFormula: string[];
  essentialConnectors: { french: string; english: string; example: string }[];
  modelScriptSnippet: string;
  samplePrompt: string;
  gradingCriteria: string[];
}
