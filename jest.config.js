const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', 
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
  },
  testMatch: ['**/__test__/**/*.test.[jt]s?(x)'],
};

module.exports = createJestConfig(customJestConfig);
