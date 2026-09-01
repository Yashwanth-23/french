const fs = require('fs');
const path = require('path');

const dataServicePath = path.join(__dirname, 'src', 'engine', 'dataService.ts');
let content = fs.readFileSync(dataServicePath, 'utf8');

content = content.replace(
  `import { UserProfile, UserPreferences, StudyLogEntry } from '../types/preferences';`,
  `import { UserProfile, UserPreferences, StudyLogEntry, SecondaryLanguageBridge } from '../types/preferences';
import { MediaFormat } from '../types/curriculum';`
);

fs.writeFileSync(dataServicePath, content, 'utf8');
console.log('Successfully fixed imports in dataService.ts');
