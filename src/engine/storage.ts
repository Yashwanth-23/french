import { UserProfile, UserPreferences } from '../types/preferences';

const STORAGE_KEY = 'french_mastery_profiles_cloud_backup_v2';
const ACTIVE_PROFILE_KEY = 'french_mastery_active_slug_v2';

export const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: 'vasir',
    name: 'Vasir',
    tagline: '2.0h / Day • TEF Canada Focus',
    preferences: {
      dailyTimeMinutes: 120,
      preferredFormats: ['audio_transcript', 'podcast', 'youtube'],
      startingLevel: 'A0',
      targetExamDateMonths: 16,
      targetExam: 'TEF_Canada',
      skillFrictions: ['EO', 'CO', 'Conjugation']
    },
    currentMilestoneId: 'milestone-a0',
    completedMilestoneIds: [],
    activeTaskQueue: [],
    completedHistory: [],
    totalMinutesLogged: 0,
    streakDays: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    bookmarkedResourceIds: ['innerfrench-podcast', 'rfi-journal-facile', 'tv5-tcf-simulator'],
    customNotes: {}
  }
];

export function getStoredProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_PROFILES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === 'object') return Object.values(parsed);
    return DEFAULT_PROFILES;
  } catch (err) {
    return DEFAULT_PROFILES;
  }
}

export function saveProfiles(profiles: UserProfile[]): void {
  const map: Record<string, UserProfile> = {};
  profiles.forEach(p => { map[p.id] = p; });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getActiveProfile(): UserProfile {
  const profiles = getStoredProfiles();
  const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
  const matched = profiles.find(p => p.id === activeId);
  return matched || profiles[0] || DEFAULT_PROFILES[0];
}

export function setActiveProfile(id: string): void {
  localStorage.setItem(ACTIVE_PROFILE_KEY, id);
}

export function updateActiveProfile(updater: (prev: UserProfile) => UserProfile): UserProfile {
  const profiles = getStoredProfiles();
  const active = getActiveProfile();
  const updated = updater(active);
  const newProfiles = profiles.map(p => (p.id === updated.id ? updated : p));
  saveProfiles(newProfiles);
  return updated;
}
