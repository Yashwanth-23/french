const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'engine', 'dataService.ts');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  "const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';",
  "const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Updated dataService.ts to support both ANON_KEY and PUBLISHABLE_KEY.');
