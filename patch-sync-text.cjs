const fs = require('fs');
const path = require('path');

// 1. Update DailyMission.tsx
const dmPath = path.join(__dirname, 'src', 'components', 'DailyMission.tsx');
let dmContent = fs.readFileSync(dmPath, 'utf8');

dmContent = dmContent.replace('Access on mobile with link:', 'Access on any device with link:');
dmContent = dmContent.replace("'Copy Mobile Sync Link'", "'Copy My Sync Link'");

fs.writeFileSync(dmPath, dmContent, 'utf8');
console.log('Successfully updated DailyMission.tsx sync bar');

// 2. Update ProfileSwitcher.tsx
const psPath = path.join(__dirname, 'src', 'components', 'ProfileSwitcher.tsx');
let psContent = fs.readFileSync(psPath, 'utf8');

psContent = psContent.replace("'Copy Mobile Link'", "'Copy My Sync Link'");
psContent = psContent.replace("'Copy Mobile Sync Link'", "'Copy My Sync Link'");

fs.writeFileSync(psPath, psContent, 'utf8');
console.log('Successfully updated ProfileSwitcher.tsx sync bar');
