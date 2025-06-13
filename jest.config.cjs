/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.js'], // treat plain .js files as ES-modules
  transform: {}                    // no Babel
};
