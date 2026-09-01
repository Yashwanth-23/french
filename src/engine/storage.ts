import { UserProfile, UserPreferences } from '../types/preferences';

const STORAGE_KEY = 'french_mastery_profiles_cloud_backup_v2';
const ACTIVE_PROFILE_KEY = 'french_mastery_active_slug_v2';

export function getStoredProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === 'object') return Object.values(parsed);
    return [];
  } catch (err) {
    return [];
  }
}

export function saveProfiles(profiles: UserProfile[]): void {
  const map: Record<string, UserProfile> = {};
  profiles.forEach(p => { map[p.id] = p; });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getActiveProfile(): UserProfile | null {
  const profiles = getStoredProfiles();
  const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
  const matched = profiles.find(p => p.id === activeId);
  return matched || profiles[0] || null;
}

export function setActiveProfile(id: string): void {
  localStorage.setItem(ACTIVE_PROFILE_KEY, id);
}
