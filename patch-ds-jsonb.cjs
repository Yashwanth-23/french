const fs = require('fs');
const path = require('path');

const dataServicePath = path.join(__dirname, 'src', 'engine', 'dataService.ts');
let content = fs.readFileSync(dataServicePath, 'utf8');

// Update rowToProfile
const rowToProfileReplacement = `function rowToProfile(row: any): UserProfile {
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
    tagline: \`\${(row.daily_time_minutes / 60).toFixed(1)}h / Day • \${row.target_exam?.replace('_', ' ') || 'TEF'} Focus\`,
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
}`;

content = content.replace(/function rowToProfile[\s\S]*?^}/m, rowToProfileReplacement);

// Update profileToRow
const profileToRowReplacement = `function profileToRow(profile: UserProfile): any {
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
}`;

content = content.replace(/function profileToRow[\s\S]*?^}/m, profileToRowReplacement);

fs.writeFileSync(dataServicePath, content, 'utf8');
console.log('Successfully updated rowToProfile and profileToRow in dataService.ts');
