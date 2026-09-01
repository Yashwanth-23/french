const fs = require('fs');
const path = require('path');

const dailyMissionPath = path.join(__dirname, 'src', 'components', 'DailyMission.tsx');
let content = fs.readFileSync(dailyMissionPath, 'utf8');

content = content.replace(
  `  const targetInfo = calculateEstimatedTargetDate(
    activeProfile.currentMilestoneId,
    activeProfile.preferences.dailyTimeMinutes
  );`,
  `  const targetInfo = calculateEstimatedTargetDate(
    activeProfile.currentMilestoneId,
    activeProfile.preferences.dailyTimeMinutes,
    activeProfile.preferences.targetExamDateMonths
  );`
);

fs.writeFileSync(dailyMissionPath, content, 'utf8');
console.log('Successfully updated DailyMission.tsx to pass targetExamDateMonths!');
