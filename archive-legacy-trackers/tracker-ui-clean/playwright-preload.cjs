// Prevent @vitest/expect from loading when Playwright runs
const Module = require('module');

// Monkey-patch Object.defineProperty to prevent the symbol redefinition error
const originalDefineProperty = Object.defineProperty;
Object.defineProperty = function(obj, prop, descriptor) {
  // If this is trying to define the Jest matchers symbol that already exists, make it configurable
  if (typeof prop === 'symbol' && prop.toString().includes('$$jest-matchers-object')) {
    if (obj.hasOwnProperty(prop)) {
      // Make the existing property configurable so it can be redefined
      try {
        originalDefineProperty.call(this, obj, prop, { 
          ...descriptor, 
          configurable: true 
        });
        return obj;
      } catch (e) {
        // If that fails, just return the object as-is
        return obj;
      }
    }
  }
  return originalDefineProperty.call(this, obj, prop, descriptor);
};
