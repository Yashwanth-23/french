const fs = require('fs');
const path = require('path');

const dataServicePath = path.join(__dirname, 'src', 'engine', 'dataService.ts');
let content = fs.readFileSync(dataServicePath, 'utf8');

content = content.replace(
  `      targetExam: row.target_exam || 'TEF_Canada',
      skillFrictions: ['EO', 'Conjugation']`,
  `      targetExam: row.target_exam || 'TEF_Canada',
      linguisticAnchor: row.linguistic_anchor || 'telugu',
      skillFrictions: ['EO', 'Conjugation']`
);

content = content.replace(
  `    starting_level: profile.preferences.startingLevel,
    current_milestone_id: profile.currentMilestoneId,`,
  `    starting_level: profile.preferences.startingLevel,
    linguistic_anchor: profile.preferences.linguisticAnchor || 'telugu',
    current_milestone_id: profile.currentMilestoneId,`
);

fs.writeFileSync(dataServicePath, content, 'utf8');
console.log('Successfully updated dataService.ts with linguisticAnchor mapping!');
