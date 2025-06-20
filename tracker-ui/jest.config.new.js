export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/main.jsx',
    '!src/tests/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      lines: 80,
      branches: 80,
      functions: 80,
      statements: 80
    }
  },
  testMatch: [
    '<rootDir>/src/tests/**/*.test.{js,jsx}',
    '<rootDir>/src/**/*.test.{js,jsx}'
  ],
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }]
  },
  extensionsToTreatAsEsm: ['.jsx'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  }
};
