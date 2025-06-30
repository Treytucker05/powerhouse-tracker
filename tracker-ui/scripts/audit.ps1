npm exec --package depcheck -- depcheck --json > audit-unused-packages.json

Get-ChildItem -Recurse -Include *.js,*.jsx,*.ts,*.tsx `
| % { $_.FullName } `
| npx ts-node - <<'TS'
import { readFileSync } from 'fs', { resolve, dirname } from 'path';
const files = readFileSync(0,'utf8').trim().split('\n');
const imports = new Set<string>();
files.forEach(f=>{
  const src = readFileSync(f,'utf8');
  src.match(/from ["']([^"']+)["']/g)?.forEach(m=>{
    const p=(m.split("'")[1]||m.split('"')[1]);
    if(p?.startsWith('.')) imports.add(resolve(dirname(f),p));
  });
});
const unused = files.filter(f=>![...imports].some(i=>f.startsWith(i)));
require('fs').writeFileSync('audit-unused-files.json',JSON.stringify(unused,null,2));
TS

Get-ChildItem src -Recurse -Include *.css `
| % { $_.FullName } `
| npx tailwindcss -i - -o nul --report:all --content "./src/**/*.{js,jsx,ts,tsx}" 2>&1 `
| Select-String "WARNING" | Set-Content audit-unused-classes.txt
