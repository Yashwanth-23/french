const fs = require('fs');
const path = require('path');

const recommenderPath = path.join(__dirname, 'src', 'engine', 'recommender.ts');
let content = fs.readFileSync(recommenderPath, 'utf8');

const updatedFunc = `export function calculateEstimatedTargetDate(
  currentMilestoneId: string,
  dailyMinutes: number,
  targetMonthsPreference?: number
): { monthsRemaining: number; targetDateFormatted: string; totalHoursNeeded: number } {
  const milestoneIndex = milestones.findIndex(m => m.id === currentMilestoneId);
  const remainingMilestones = milestones.slice(milestoneIndex >= 0 ? milestoneIndex : 0);

  const totalHoursNeeded = remainingMilestones.reduce((sum, m) => sum + m.targetHoursFloor, 0);
  
  let monthsRemaining = 12;
  const targetDate = new Date();

  if (targetMonthsPreference && targetMonthsPreference > 0) {
    monthsRemaining = targetMonthsPreference;
    targetDate.setMonth(targetDate.getMonth() + targetMonthsPreference);
  } else {
    const dailyHours = Math.max(0.5, dailyMinutes / 60);
    const daysRemaining = Math.ceil(totalHoursNeeded / dailyHours);
    monthsRemaining = Math.max(1, Math.round(daysRemaining / 30));
    targetDate.setDate(targetDate.getDate() + daysRemaining);
  }

  const targetDateFormatted = targetDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });

  return {
    monthsRemaining,
    targetDateFormatted,
    totalHoursNeeded
  };
}`;

content = content.replace(/export function calculateEstimatedTargetDate[\s\S]*?^}/m, updatedFunc);
fs.writeFileSync(recommenderPath, content, 'utf8');
console.log('Successfully updated calculateEstimatedTargetDate in recommender.ts');
