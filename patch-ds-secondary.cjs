const fs = require('fs');
const path = require('path');

const dataServicePath = path.join(__dirname, 'src', 'engine', 'dataService.ts');
let content = fs.readFileSync(dataServicePath, 'utf8');

content = content.replace(
  `      linguisticAnchor: row.linguistic_anchor || 'telugu',
      skillFrictions: ['EO', 'Conjugation']`,
  `      secondaryLanguageBridge: row.secondary_language_bridge || 'none',
      skillFrictions: ['EO', 'Conjugation']`
);

content = content.replace(
  `    linguistic_anchor: profile.preferences.linguisticAnchor || 'telugu',
    current_milestone_id: profile.currentMilestoneId,`,
  `    secondary_language_bridge: profile.preferences.secondaryLanguageBridge || 'none',
    current_milestone_id: profile.currentMilestoneId,`
);

fs.writeFileSync(dataServicePath, content, 'utf8');
console.log('Successfully updated dataService.ts with secondaryLanguageBridge mapping!');
