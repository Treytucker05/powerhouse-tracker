/* bump the date stamp in docs/gap-analysis.md */
import fs from 'fs';
const file = 'docs/gap-analysis.md';
const md  = fs.readFileSync(file,'utf8');
const out = md.replace(/(_Last updated: )\d{4}-\d{2}-\d{2}(_)/,
                       `$1${new Date().toISOString().split('T')[0]}$2`);
fs.writeFileSync(file,out);
console.log('📝 gap-analysis.md timestamp updated');
