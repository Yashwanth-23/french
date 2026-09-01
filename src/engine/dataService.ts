import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, UserPreferences, StudyLogEntry, SecondaryLanguageBridge } from '../types/preferences';
import { MediaFormat } from '../types/curriculum';
import { DailyTask } from '../types/curriculum';
import { generateDailyPlan } from './recommender';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('your-project'));

let supabase: SupabaseClient | null = null;
if (isSupabaseConfigured) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const LOCAL_BACKUP_KEY = 'french_mastery_profiles_cloud_backup_v2';
const ACTIVE_SLUG_KEY = 'french_mastery_active_slug_v2';

// --- Local Storage Cache & Fallback Helpers ---

function getLocalBackupProfiles(): Record<string, UserProfile> {
  try {
    const raw = localStorage.getItem(LOCAL_BACKUP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveLocalBackupProfiles(profiles: Record<string, UserProfile>): void {
  localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(profiles));
}

// Convert DB row to UserProfile
function rowToProfile(row: any): UserProfile {
  let preferredFormats: MediaFormat[] = ['podcast', 'youtube'];
  let secondaryLanguageBridge: SecondaryLanguageBridge = 'none';

  if (Array.isArray(row.preferred_formats)) {
    preferredFormats = row.preferred_formats;
  } else if (row.preferred_formats && typeof row.preferred_formats === 'object') {
    preferredFormats = row.preferred_formats.list || ['podcast', 'youtube'];
    secondaryLanguageBridge = row.preferred_formats.bridge || 'none';
  }

  return {
    id: row.id,
    name: row.name,
    tagline: `${(row.daily_time_minutes / 60).toFixed(1)}h / Day • ${row.target_exam?.replace('_', ' ') || 'TEF'} Focus`,
    preferences: {
      dailyTimeMinutes: row.daily_time_minutes,
      preferredFormats,
      startingLevel: row.starting_level || 'A0',
      targetExamDateMonths: 16,
      targetExam: row.target_exam || 'TEF_Canada',
      secondaryLanguageBridge,
      skillFrictions: ['EO', 'Conjugation']
    },
    currentMilestoneId: row.current_milestone_id || 'milestone-a0',
    completedMilestoneIds: row.completed_milestone_ids || [],
    activeTaskQueue: row.active_task_queue || [],
    completedHistory: row.completed_history || [],
    totalMinutesLogged: row.total_minutes_logged || 0,
    streakDays: row.streak_days || 0,
    lastActiveDate: row.last_active_date || new Date().toISOString().split('T')[0],
    bookmarkedResourceIds: row.bookmarked_resource_ids || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// Convert UserProfile to DB row
function profileToRow(profile: UserProfile): any {
  return {
    id: profile.id,
    name: profile.name,
    target_exam: profile.preferences.targetExam,
    daily_time_minutes: profile.preferences.dailyTimeMinutes,
    preferred_formats: {
      list: profile.preferences.preferredFormats,
      bridge: profile.preferences.secondaryLanguageBridge || 'none'
    },
    starting_level: profile.preferences.startingLevel,
    current_milestone_id: profile.currentMilestoneId,
    completed_milestone_ids: profile.completedMilestoneIds,
    active_task_queue: profile.activeTaskQueue,
    completed_history: profile.completedHistory,
    total_minutes_logged: profile.totalMinutesLogged,
    streak_days: profile.streakDays,
    last_active_date: profile.lastActiveDate,
    bookmarked_resource_ids: profile.bookmarkedResourceIds,
    updated_at: new Date().toISOString()
  };
}

// --- Slug Generation & Collision Defense ---

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'learner';
}

export async function checkSlugAvailable(slug: string, currentEditingId?: string): Promise<boolean> {
  if (currentEditingId && slug === currentEditingId) {
    return true; // You own this slug!
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', slug)
        .maybeSingle();
      if (error) return true;
      return !data;
    } catch (e) {
      return true;
    }
  } else {
    const local = getLocalBackupProfiles();
    return !local[slug];
  }
}

export async function generateUniqueSlug(baseName: string): Promise<string> {
  let candidate = slugify(baseName);
  let isAvailable = await checkSlugAvailable(candidate);
  if (isAvailable) return candidate;

  let counter = 2;
  while (counter < 20) {
    const nextCandidate = `${candidate}-${counter}`;
    if (await checkSlugAvailable(nextCandidate)) {
      return nextCandidate;
    }
    counter++;
  }

  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${candidate}-${randomSuffix}`;
}

// --- Core Data Service Methods ---

export async function fetchProfile(slug: string): Promise<UserProfile | null> {
  if (!slug) return null;

  // 1. Try Supabase Cloud DB
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', slug)
        .maybeSingle();

      if (data && !error) {
        const profile = rowToProfile(data);
        const local = getLocalBackupProfiles();
        local[slug] = profile;
        saveLocalBackupProfiles(local);
        localStorage.setItem(ACTIVE_SLUG_KEY, slug);
        return profile;
      }
    } catch (err) {
      console.warn('Supabase fetch error', err);
    }
  }

  // 2. Check Local Backup Cache
  const local = getLocalBackupProfiles();
  if (local[slug]) {
    localStorage.setItem(ACTIVE_SLUG_KEY, slug);
    return local[slug];
  }

  return null;
}

export async function saveProfileToCloud(profile: UserProfile): Promise<UserProfile> {
  const updatedProfile = {
    ...profile,
    updatedAt: new Date().toISOString()
  };

  // 1. Save to Local Cache
  const local = getLocalBackupProfiles();
  local[profile.id] = updatedProfile;
  saveLocalBackupProfiles(local);
  localStorage.setItem(ACTIVE_SLUG_KEY, profile.id);

  // 2. Sync to Supabase Cloud DB
  if (isSupabaseConfigured && supabase) {
    try {
      const row = profileToRow(updatedProfile);
      const { error } = await supabase
        .from('profiles')
        .upsert(row);

      if (error) {
        console.error('Error saving profile to Supabase:', error.message);
      }
    } catch (err) {
      console.warn('Cloud sync offline; stored in local cache', err);
    }
  }

  return updatedProfile;
}

export async function createCloudProfile(
  name: string,
  preferences: UserPreferences,
  desiredSlug?: string
): Promise<UserProfile> {
  const slug = desiredSlug ? slugify(desiredSlug) : await generateUniqueSlug(name);

  const initialProfileSkeleton: UserProfile = {
    id: slug,
    name: name.trim(),
    tagline: `${(preferences.dailyTimeMinutes / 60).toFixed(1)}h / Day • ${preferences.targetExam.replace('_', ' ')} Focus`,
    preferences,
    currentMilestoneId: `milestone-${preferences.startingLevel.toLowerCase()}`,
    completedMilestoneIds: [],
    activeTaskQueue: [],
    completedHistory: [],
    totalMinutesLogged: 0,
    streakDays: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    bookmarkedResourceIds: []
  };

  const generatedPlan = generateDailyPlan(initialProfileSkeleton);
  initialProfileSkeleton.activeTaskQueue = generatedPlan.tasks;

  return await saveProfileToCloud(initialProfileSkeleton);
}

// Update existing profile WITHOUT erasing progress
export async function updateExistingProfilePreferences(
  existingProfile: UserProfile,
  updatedName: string,
  updatedPreferences: UserPreferences
): Promise<UserProfile> {
  const updatedProfileSkeleton: UserProfile = {
    ...existingProfile,
    name: updatedName.trim(),
    tagline: `${(updatedPreferences.dailyTimeMinutes / 60).toFixed(1)}h / Day • ${updatedPreferences.targetExam.replace('_', ' ')} Focus`,
    preferences: updatedPreferences,
    currentMilestoneId: `milestone-${updatedPreferences.startingLevel.toLowerCase()}`
    // Notice: totalMinutesLogged, completedHistory, streakDays, and bookmarks are 100% PRESERVED!
  };

  // Generate refreshed queue matching new format/time/language preferences
  const generatedPlan = generateDailyPlan(updatedProfileSkeleton);
  updatedProfileSkeleton.activeTaskQueue = generatedPlan.tasks;

  return await saveProfileToCloud(updatedProfileSkeleton);
}

export async function completeTaskAndLog(slug: string, taskId: string): Promise<UserProfile | null> {
  const profile = await fetchProfile(slug);
  if (!profile) return null;

  const taskIndex = profile.activeTaskQueue.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return profile;

  const task = profile.activeTaskQueue[taskIndex];

  const logEntry: StudyLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    taskId: task.id,
    taskTitle: task.title,
    resourceTitle: task.resourceTitle,
    skill: task.skill,
    durationMinutes: task.durationMinutes,
    completedAt: new Date().toISOString()
  };

  const nextQueue = profile.activeTaskQueue.filter(t => t.id !== taskId);
  const nextHistory = [logEntry, ...(profile.completedHistory || [])];
  const nextMinutes = (profile.totalMinutesLogged || 0) + task.durationMinutes;

  const todayStr = new Date().toISOString().split('T')[0];
  let nextStreak = profile.streakDays || 1;
  if (profile.lastActiveDate !== todayStr) {
    nextStreak += 1;
  }

  const updatedProfile: UserProfile = {
    ...profile,
    activeTaskQueue: nextQueue,
    completedHistory: nextHistory,
    totalMinutesLogged: nextMinutes,
    streakDays: nextStreak,
    lastActiveDate: todayStr
  };

  return await saveProfileToCloud(updatedProfile);
}

export async function appendBonusTasksInCloud(slug: string, additionalMinutes: number = 30): Promise<UserProfile | null> {
  const profile = await fetchProfile(slug);
  if (!profile) return null;

  const tempProfile: UserProfile = {
    ...profile,
    preferences: {
      ...profile.preferences,
      dailyTimeMinutes: additionalMinutes
    }
  };

  const newPlan = generateDailyPlan(tempProfile);

  const bonusTasks = newPlan.tasks.map((t, idx) => ({
    ...t,
    id: `task-bonus-${Date.now()}-${idx + 1}`,
    title: `[Sprint] ${t.title}`
  }));

  const updatedProfile: UserProfile = {
    ...profile,
    activeTaskQueue: [...profile.activeTaskQueue, ...bonusTasks]
  };

  return await saveProfileToCloud(updatedProfile);
}

export async function regenerateQueueInCloud(slug: string): Promise<UserProfile | null> {
  const profile = await fetchProfile(slug);
  if (!profile) return null;

  const newPlan = generateDailyPlan(profile);
  const updatedProfile: UserProfile = {
    ...profile,
    activeTaskQueue: newPlan.tasks
  };

  return await saveProfileToCloud(updatedProfile);
}

export function getActiveSlugFromUrlOrStorage(): string | null {
  const params = new URLSearchParams(window.location.search);
  const urlUser = params.get('user');
  if (urlUser) return urlUser;
  return localStorage.getItem(ACTIVE_SLUG_KEY);
}
