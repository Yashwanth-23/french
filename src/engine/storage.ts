import { UserProfile, UserPreferences } from '../types/preferences';

const STORAGE_KEY = 'french_mastery_profiles_v1';
const ACTIVE_PROFILE_KEY = 'french_mastery_active_id_v1';

export const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: 'profile-primary-2h',
    name: 'My Master Plan (Target: Dec 2027)',
    tagline: '2.0h / Day • Podcast & Active Vocal Shadowing Focus',
    preferences: {
      dailyTimeMinutes: 120,
      preferredFormats: ['audio_transcript', 'podcast', 'youtube'],
      startingLevel: 'A0',
      targetExamDateMonths: 16,
      targetExam: 'Universal_B2',
      skillFrictions: ['EO', 'CO', 'Conjugation']
    },
    currentMilestoneId: 'milestone-a0',
    completedMilestoneIds: [],
    completedTaskIdsForToday: [],
    streakDays: 4,
    lastActiveDate: new Date().toISOString().split('T')[0],
    bookmarkedResourceIds: ['innerfrench-podcast', 'rfi-journal-facile', 'tv5-tcf-simulator'],
    customNotes: {}
  },
  {
    id: 'profile-friend-1h',
    name: "Friend's Balanced Plan",
    tagline: '1.0h / Day • Books, Web Drills & Video Focus',
    preferences: {
      dailyTimeMinutes: 60,
      preferredFormats: ['web_app', 'youtube', 'book_pdf'],
      startingLevel: 'A0',
      targetExamDateMonths: 18,
      targetExam: 'TEF_Canada',
      skillFrictions: ['Grammar', 'Conjugation']
    },
    currentMilestoneId: 'milestone-a0',
    completedMilestoneIds: [],
    completedTaskIdsForToday: [],
    streakDays: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    bookmarkedResourceIds: ['lawless-french', 'le-conjugueur', 'tv5-tcf-simulator'],
    customNotes: {}
  }
];

export function getStoredProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROFILES));
      return DEFAULT_PROFILES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PROFILES;
  } catch (err) {
    console.error('Failed to parse profiles from localStorage', err);
    return DEFAULT_PROFILES;
  }
}

export function saveProfiles(profiles: UserProfile[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export function getActiveProfile(): UserProfile {
  const profiles = getStoredProfiles();
  const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
  const matched = profiles.find(p => p.id === activeId);
  if (matched) return matched;
  const fallback = profiles[0] || DEFAULT_PROFILES[0];
  localStorage.setItem(ACTIVE_PROFILE_KEY, fallback.id);
  return fallback;
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

export function createNewProfile(
  name: string,
  tagline: string,
  preferences: UserPreferences
): UserProfile {
  const profiles = getStoredProfiles();
  const newProfile: UserProfile = {
    id: `profile-${Date.now()}`,
    name,
    tagline,
    preferences,
    currentMilestoneId: `milestone-${preferences.startingLevel.toLowerCase()}`,
    completedMilestoneIds: [],
    completedTaskIdsForToday: [],
    streakDays: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    bookmarkedResourceIds: [],
    customNotes: {}
  };
  const updatedList = [...profiles, newProfile];
  saveProfiles(updatedList);
  setActiveProfile(newProfile.id);
  return newProfile;
}

export function deleteProfile(id: string): UserProfile {
  const profiles = getStoredProfiles();
  const filtered = profiles.filter(p => p.id !== id);
  const safeList = filtered.length > 0 ? filtered : DEFAULT_PROFILES;
  saveProfiles(safeList);
  const nextActive = safeList[0];
  setActiveProfile(nextActive.id);
  return nextActive;
}

export function encodeProfileForSharing(profile: UserProfile): string {
  const payload = {
    name: profile.name,
    preferences: profile.preferences,
    level: profile.currentMilestoneId
  };
  return btoa(encodeURIComponent(JSON.stringify(payload)));
}

export function decodeSharedProfile(encoded: string): Partial<UserProfile> | null {
  try {
    const jsonStr = decodeURIComponent(atob(encoded));
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('Invalid shared profile token', e);
    return null;
  }
}
