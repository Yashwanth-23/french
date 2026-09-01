const fs = require('fs');
const path = require('path');

// 1. Update DailyMission.tsx
const dmPath = path.join(__dirname, 'src', 'components', 'DailyMission.tsx');
let dmContent = fs.readFileSync(dmPath, 'utf8');

dmContent = dmContent.replace(/Indian Learner Bridge:/g, 'Linguistic Bridge:');
dmContent = dmContent.replace(/Indian Language Shortcuts/g, 'Linguistic Shortcuts');
dmContent = dmContent.replace(/Hindi gender mapping, Tu\/Vous vs Tu\/Aap, Nasal vowel rules./g, 'Compare French with English, Spanish, Telugu, or Hindi.');

fs.writeFileSync(dmPath, dmContent, 'utf8');
console.log('Successfully updated DailyMission.tsx labels');

// 2. Update Navbar.tsx
const navPath = path.join(__dirname, 'src', 'components', 'Navbar.tsx');
let navContent = fs.readFileSync(navPath, 'utf8');

navContent = navContent.replace('Indian Linguistic Engine', 'Multilingual Cognitive Engine');
navContent = navContent.replace("{ id: 'bridges', label: 'Indian Shortcuts', icon: Languages }", "{ id: 'bridges', label: 'Linguistic Bridges', icon: Languages }");

fs.writeFileSync(navPath, navContent, 'utf8');
console.log('Successfully updated Navbar.tsx labels');
