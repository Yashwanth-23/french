import { CEFRLevel, MediaFormat, SkillType, ExamTarget, DailyTask } from './curriculum';

export type LinguisticAnchor = 'telugu' | 'hindi' | 'universal_english';

export interface StudyLogEntry {
  id: string;
  taskId: string;
  taskTitle: string;
  resourceTitle: string;
  skill: SkillType;
  durationMinutes: number;
  completedAt: string;
}

export interface UserPreferences {
  dailyTimeMinutes: number; // 30, 60, 90, 120, 180
  preferredFormats: MediaFormat[]; // ['podcast', 'youtube', 'web_app', 'book_pdf']
  startingLevel: CEFRLevel; // 'A0', 'A1', 'A2', 'B1'
  targetExamDateMonths: number; // 6, 12, 16, 24
  targetExam: ExamTarget; // 'TEF_Canada' | 'TCF_Canada' | 'Universal_B2'
  linguisticAnchor: LinguisticAnchor; // 'telugu' | 'hindi' | 'universal_english'
  skillFrictions: SkillType[];
}

export interface UserProfile {
  id: string;
  name: string;
  tagline: string;
  preferences: UserPreferences;
  currentMilestoneId: string;
  completedMilestoneIds: string[];
  activeTaskQueue: DailyTask[];
  completedHistory: StudyLogEntry[];
  totalMinutesLogged: number;
  streakDays: number;
  lastActiveDate: string;
  bookmarkedResourceIds: string[];
  createdAt?: string;
  updatedAt?: string;
}
