import { defineConfig, devices } from '@playwright/test';

const cleanBaseURL = (url: string) => url.replace(/\/+$/, '');

const BASE_URL = cleanBaseURL(process.env.BASE_URL || 'http://127.0.0.1:8080');
const API_BASE_URL = cleanBaseURL(
  process.env.API_BASE_URL || process.env.API_URL || 'http://127.0.0.1:8080'
);
const FRONTEND_BASE_URL = cleanBaseURL(
  process.env.FRONTEND_BASE_URL || 'http://127.0.0.1:3000'
);

if (API_BASE_URL.endsWith('/api/v1')) {
  throw new Error(
    `API_BASE_URL must not include /api/v1 because routes already include it. Current: ${API_BASE_URL}`
  );
}

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  workers: process.env.CI ? 1 : 2,
  retries: process.env.CI ? 1 : 0,

  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'api',
      testMatch: /tests\/api\/.*\.spec\.ts/,
      use: {
        baseURL: API_BASE_URL,
      },
    },
    {
      name: 'frontend',
      testMatch: /tests\/(?!api\/).*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: FRONTEND_BASE_URL,
      },
    },
  ],
});