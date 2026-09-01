const fs = require('fs');
const path = require('path');

const resourcesPath = path.join(__dirname, 'src', 'data', 'resources.json');
const resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'));

// Fix verified URLs
resources.forEach(r => {
  if (r.id === 'le-conjugueur') {
    r.url = 'https://leconjugueur.lefigaro.fr/';
  }
  if (r.id === 'french-sounds-phonetics') {
    r.url = 'https://www.youtube.com/@frenchsounds';
  }
  if (r.id === 'tv5-tcf-simulator') {
    r.url = 'https://apprendre.tv5monde.com/fr/exercices/tcf';
  }
});

fs.writeFileSync(resourcesPath, JSON.stringify(resources, null, 2), 'utf8');
console.log('Successfully updated canonical URLs in resources.json!');
