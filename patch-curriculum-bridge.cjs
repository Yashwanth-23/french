const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'types', 'curriculum.ts');
let content = fs.readFileSync(filePath, 'utf8');

const replacement = `export interface IndianBridgeConcept {
  id: string;
  topic: string;
  category: 'Grammar' | 'Phonetics' | 'Vocabulary' | 'Sociolinguistics';
  frenchConcept: string;
  englishAnalogy: string;
  spanishAnalogy?: string;
  hindiAnalogy?: string;
  teluguAnalogy?: string;
  exampleFrench: string;
  exampleEnglish: string;
  exampleSpanish?: string;
  exampleHindi?: string;
  exampleTelugu?: string;
  practicalTip: string;
}`;

content = content.replace(/export interface IndianBridgeConcept[\s\S]*?^}/m, replacement);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated IndianBridgeConcept interface in curriculum.ts');
