// Debug the full file content around exportChart
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const targetFile = resolve(__dirname, 'js/algorithms/dataExport.js');

try {
  const content = readFileSync(targetFile, 'utf8');
  
  // Find the exportChart function
  const exportChartIndex = content.indexOf('export function exportChart');
  if (exportChartIndex !== -1) {
    console.log('Found exportChart function at index:', exportChartIndex);
    const functionContent = content.substring(exportChartIndex, exportChartIndex + 1000);
    console.log('Function content:');
    console.log(functionContent);
  } else {
    console.log('exportChart function not found');
  }
  
} catch (error) {
  console.log('Error:', error.message);
}
