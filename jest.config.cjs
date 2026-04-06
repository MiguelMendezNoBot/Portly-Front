/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.test.[tj]s?(x)',
    '**/test/**/*.test.[tj]s?(x)',
  ],
  setupFiles: ['<rootDir>/src/test/jest.polyfills.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.jest.json',
      },
    ],
  },
};