#!/usr/bin/env node
import { execSync } from 'child_process';

console.log('📦 Dependency status');
try {
  execSync('npm outdated', { stdio: 'inherit' });
} catch (error) {
  // npm outdated exits with code 1 when outdated packages are found, which is normal
  if (error.status !== 1) {
    console.error('Error checking outdated packages:', error.message);
  }
}

console.log('\n🔒 Security audit');
try {
  execSync('npm audit', { stdio: 'inherit' });
} catch (error) {
  // npm audit may exit with non-zero code when vulnerabilities are found
  if (error.status !== 0) {
    console.log('(Some security issues may have been found - check output above)');
  }
}
