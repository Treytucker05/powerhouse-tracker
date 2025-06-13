export default {
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.js'],  // tell Jest that plain .js files are ESM
  transform: {}                     // no Babel; Node handles the syntax
};
