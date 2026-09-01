import { CEFRLevel, MediaFormat, SkillType, ExamTarget } from './curriculum';

export interface UserPreferences {
  dailyTimeMinutes: number; // 30, 60, 90, 120, 180
  preferredFormats: MediaFormat[]; // e.g. ['podcast', 'youtube', 'web_app']
  startingLevel: CEFRLevel; // 'A0', 'A1', 'A2', 'B1'
  targetExamDateMonths: number; // 12, 16, 24
  targetExam: ExamTarget; // 'TEF_Canada' | 'TCF_Canada' | 'Universal_B2'
  skillFrictions: SkillType[]; // ['EO', 'Conjugation', 'CO']
}

export interface UserProfile {
  id: string;
  name: string;
  tagline: string;
  preferences: UserPreferences;
  currentMilestoneId: string;
  completedMilestoneIds: string[];
  completedTaskIdsForToday: string[];
  streakDays: number;
  lastActiveDate: string;
  bookmarkedResourceIds: string[];
  diagnosticScore?: number;
  customNotes: Record<string, string>;
}
