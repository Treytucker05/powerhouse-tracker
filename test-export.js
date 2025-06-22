// Test file to check exports
try {
  const module = await import('./js/algorithms/dataExport.js');
  console.log('Available exports:', Object.keys(module));
  console.log('exportAllData type:', typeof module.exportAllData);
} catch (error) {
  console.error('Import error:', error.message);
}
