// Debug file path resolution
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const targetFile = resolve(__dirname, 'js/algorithms/dataExport.js');
console.log('Resolved file path:', targetFile);

// Try to read the actual file content
import { readFileSync } from 'fs';
try {
  const content = readFileSync(targetFile, 'utf8');
  console.log('File exists and is readable');
  console.log('First 500 chars:');
  console.log(content.substring(0, 500));
  
  // Check if our debug logs are in the file
  if (content.includes('=== EXPORTCHART FUNCTION CALLED FROM DATAEXPORT.JS ===')) {
    console.log('✅ Our debug logs found in the file');
  } else {
    console.log('❌ Our debug logs NOT found in the file');
  }
} catch (error) {
  console.log('Error reading file:', error.message);
}
