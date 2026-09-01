const fs = require('fs');
const path = require('path');

// 1. App.tsx
const appPath = path.join(__dirname, 'src', 'App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');
appContent = appContent.replace('Targeting NCLC 7 / B2 • Indian Linguistic Bridge Model', 'Targeting NCLC 7 / B2 • Multilingual Cognitive Model');
fs.writeFileSync(appPath, appContent, 'utf8');

// 2. HelpGuideModal.tsx
const helpPath = path.join(__dirname, 'src', 'components', 'HelpGuideModal.tsx');
let helpContent = fs.readFileSync(helpPath, 'utf8');
helpContent = helpContent.replace("'4. Indian Shortcuts'", "'4. Linguistic Bridges'");
helpContent = helpContent.replace(
  'This platform is engineered specifically for Indian language speakers (Telugu, Hindi, English) targeting <strong className="text-white">NCLC 7 / B2</strong> on the <strong>TEF Canada</strong> or <strong>TCF Canada</strong> exam for Express Entry.',
  'This platform is engineered for global and multilingual candidates (English, Spanish, Telugu, Hindi) targeting <strong className="text-white">NCLC 7 / B2</strong> on the <strong>TEF Canada</strong> or <strong>TCF Canada</strong> exam for Express Entry.'
);
helpContent = helpContent.replace('Indian Language Linguistic Shortcuts', 'Multilingual Linguistic Fast-Track Shortcuts');
fs.writeFileSync(helpPath, helpContent, 'utf8');

// 3. ResourceCatalog.tsx
const catPath = path.join(__dirname, 'src', 'components', 'ResourceCatalog.tsx');
let catContent = fs.readFileSync(catPath, 'utf8');
catContent = catContent.replace('14 verified free resources classified with depth tags and Indian learner structural notes.', '20 verified free resources classified with depth tags and cognitive structural notes.');
catContent = catContent.replace('<strong className="text-sky-300">Indian Learner Insight:</strong>', '<strong className="text-sky-300">Linguistic Insight:</strong>');
fs.writeFileSync(catPath, catContent, 'utf8');

console.log('Successfully updated all user-facing labels to universal phrasing!');
