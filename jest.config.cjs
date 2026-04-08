/* global module */
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.[tj]s?(x)'],
  setupFiles: ['<rootDir>/src/test/jest.polyfills.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '\\.(css|less|scss|svg|png|jpg)$': 'identity-obj-proxy',
    '^.*api\\.constants(\\.[jt]s)?$':
      '<rootDir>/src/modules/profile/presentation/constants/__mocks__/api.constants.mock.ts',
    '^.*oauth\\.constants(\\.[jt]s)?$':
      '<rootDir>/src/modules/auth/presentation/constants/__mocks__/oauth.constants.mock.ts',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.jest.json',
        diagnostics: false,
      },
    ],
  },
};
