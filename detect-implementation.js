/**
 * Implementation Detection Script
 * Run this in your browser console to identify which program design implementation you're using
 */

console.log('🔍 DETECTING CURRENT IMPLEMENTATION...');
console.log('=====================================');

// Check current URL
console.log('📍 Current URL:', window.location.href);
console.log('📍 Current Path:', window.location.pathname);
console.log('📍 Current Host:', window.location.host);

// Check for React elements
const reactElements = document.querySelectorAll('[data-reactroot], [data-react-*]');
console.log('⚛️ React Elements Found:', reactElements.length);

// Check for specific text content from your screenshots
const textChecks = [
    'Goals Summary',
    'Assessment Summary',
    'Program Design Goals',
    'Specific Program Objectives',
    'Program Overview Integration',
    'Next: Block Sequencing',
    'Experience Level',
    'Primary Goal',
    'Bodybuilding/Physique'
];

console.log('📝 TEXT CONTENT ANALYSIS:');
textChecks.forEach(text => {
    const found = document.body.innerText.includes(text);
    console.log(`   "${text}": ${found ? '✅ FOUND' : '❌ NOT FOUND'}`);
});

// Check for specific UI elements
console.log('🎨 UI ELEMENT ANALYSIS:');
console.log('   Tabs found:', document.querySelectorAll('[role="tab"], .tab, [class*="tab"]').length);
console.log('   Buttons found:', document.querySelectorAll('button').length);
console.log('   Navigation found:', document.querySelectorAll('nav, [class*="nav"]').length);

// Check for framework indicators
console.log('🔧 FRAMEWORK DETECTION:');
console.log('   React:', !!window.React || !!document.querySelector('[data-reactroot]'));
console.log('   Vue:', !!window.Vue);
console.log('   Angular:', !!window.ng);

// Check for build indicators
console.log('🏗️ BUILD DETECTION:');
console.log('   Minified scripts:', document.querySelectorAll('script[src*=".min.js"], script[src*="ProgramDesignWorkspace"]').length);
console.log('   Source maps:', document.querySelectorAll('link[href*=".map"]').length);

// Check for development indicators
console.log('🔨 DEVELOPMENT DETECTION:');
console.log('   localhost:', window.location.hostname === 'localhost');
console.log('   dev server ports:', ['3000', '5173', '8080'].includes(window.location.port));
console.log('   HMR indicators:', !!window.__webpack_dev_server__ || !!window.__vite_plugin_react_preamble_installed__);

// Try to find the button that's not working
const nextButtons = Array.from(document.querySelectorAll('button')).filter(btn =>
    btn.innerText.includes('Next') || btn.innerText.includes('Block Sequencing')
);

console.log('🔘 NEXT BUTTON ANALYSIS:');
nextButtons.forEach((btn, index) => {
    console.log(`   Button ${index + 1}:`);
    console.log(`     Text: "${btn.innerText}"`);
    console.log(`     Disabled: ${btn.disabled}`);
    console.log(`     Classes: ${btn.className}`);
    console.log(`     Style cursor: ${getComputedStyle(btn).cursor}`);
    console.log(`     Click handlers: ${btn.onclick ? 'onclick present' : 'no onclick'}`);
    console.log(`     Event listeners: ${getEventListeners ? Object.keys(getEventListeners(btn)).length : 'N/A'}`);
});

console.log('=====================================');
console.log('🎯 RECOMMENDATION:');

if (window.location.hostname === 'localhost') {
    console.log('✅ You appear to be on a development server');
    console.log('💡 The issue is likely in the source code we modified');
} else if (window.location.pathname.includes('.html') || window.location.pathname.includes('/docs/')) {
    console.log('⚠️ You appear to be viewing a built/static version');
    console.log('💡 Changes to source code require rebuilding');
} else {
    console.log('❓ Implementation unclear - please check the URL and context');
}

console.log('=====================================');
