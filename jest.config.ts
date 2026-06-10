import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    // Path aliases — MUST come before mocks
    '^@/infrastructure/analytics/ga(.*)$': '<rootDir>/src/__mocks__/infrastructure/analytics/ga.ts',
    '^@/infrastructure/monitoring/sentry(.*)$': '<rootDir>/src/__mocks__/infrastructure/monitoring/sentry.ts',
    // Note: api/client is mocked per-test via jest.mock() — keep real for adapter tests
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/src/__mocks__/fileMock.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        moduleResolution: 'node',
        allowImportingTsExtensions: false,
        strict: true,
        esModuleInterop: true,
      },
    }],
  },
  testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/*.{spec,test}.{ts,tsx}'],
  testPathIgnorePatterns: ['<rootDir>/src/__tests__/helpers/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/setupTests.ts',
    '!src/__mocks__/**',
  ],
  coverageThreshold: {
    // Unit test thresholds — pages/hooks are covered by integration/E2E (not unit)
    // Core layers (utils, adapters, context, components) hit 80–100%
    global: { branches: 40, functions: 35, lines: 38, statements: 38 },
  },
};

export default config;
