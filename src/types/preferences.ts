import { CEFRLevel, MediaFormat, SkillType, ExamTarget, DailyTask } from './curriculum';

export interface StudyLogEntry {
  id: string;
  taskId: string;
  taskTitle: string;
  resourceTitle: string;
  skill: SkillType;
  durationMinutes: number;
  completedAt: string; // ISO date-time string
}

export interface UserPreferences {
  dailyTimeMinutes: number; // 30, 60, 90, 120, 180
  preferredFormats: MediaFormat[]; // e.g. ['podcast', 'youtube', 'web_app']
  startingLevel: CEFRLevel; // 'A0', 'A1', 'A2', 'B1'
  targetExamDateMonths: number; // 12, 16, 24
  targetExam: ExamTarget; // 'TEF_Canada' | 'TCF_Canada' | 'Universal_B2'
  skillFrictions: SkillType[]; // ['EO', 'Conjugation', 'CO']
}

export interface UserProfile {
  id: string; // Unique slug (e.g. "vasir", "rahul-tef")
  name: string;
  tagline: string;
  preferences: UserPreferences;
  currentMilestoneId: string;
  completedMilestoneIds: string[];
  
  // Rolling continuous backlog & lifetime history
  activeTaskQueue: DailyTask[];
  completedHistory: StudyLogEntry[];
  totalMinutesLogged: number;

  streakDays: number;
  lastActiveDate: string;
  bookmarkedResourceIds: string[];
  diagnosticScore?: number;
  customNotes?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}
