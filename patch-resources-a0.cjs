const fs = require('fs');
const path = require('path');

const resourcesPath = path.join(__dirname, 'src', 'data', 'resources.json');
const resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'));

// Ensure foundation resources include A0
resources.forEach(r => {
  if (r.id === 'anki-5000-deck' && !r.cefrLevels.includes('A0')) {
    r.cefrLevels.unshift('A0');
  }
  if (r.id === 'le-conjugueur' && !r.cefrLevels.includes('A0')) {
    r.cefrLevels.unshift('A0');
  }
  if (r.id === 'lawless-french' && !r.cefrLevels.includes('A0')) {
    r.cefrLevels.unshift('A0');
  }
});

fs.writeFileSync(resourcesPath, JSON.stringify(resources, null, 2), 'utf8');
console.log('Successfully updated resources.json with A0 foundational levels!');
