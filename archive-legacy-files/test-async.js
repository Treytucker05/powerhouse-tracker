// Simple test with explicit module resolution
async function testExportChart() {
  try {
    console.log('About to import module...');
    
    const module = await import('./js/algorithms/dataExport.js');
    console.log('Module imported successfully');
    console.log('Module object:', module);
    console.log('Available exports:', Object.keys(module));
    
    if (module.exportChart) {
      console.log('exportChart function found!');
      console.log('Testing with invalid data...');
      
      const result = module.exportChart({ type: 'unknown' }, { format: 'svg' });
      console.log('Result:', JSON.stringify(result, null, 2));
      
      if (result.success === false) {
        console.log('✅ SUCCESS - Function returned false as expected');
      } else {
        console.log('❌ FAILED - Function returned true instead of false');
      }
    } else {
      console.log('❌ exportChart function not found in module');
      console.log('Available functions:', Object.keys(module).filter(key => typeof module[key] === 'function'));
    }
  } catch (error) {
    console.error('Error during test:', error);
  }
}

testExportChart();
