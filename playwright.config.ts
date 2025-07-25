import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/environment';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: env.isParallel(),
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: env.isCI(),
  /* Retry on CI only */
  retries: env.isCI() ? env.getRetries() : 0,
  /* Opt out of parallel tests on CI. */
  workers: env.isCI() ? 1 : env.getWorkers(),
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: env.getBaseUrl(),
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: env.shouldTraceOnFailure() ? 'on-first-retry' : 'off',
    /* Take screenshot on failure */
    screenshot: env.shouldTakeScreenshotOnFailure() ? 'only-on-failure' : 'off',
    /* Record video on failure */
    video: env.shouldRecordVideoOnFailure() ? 'retain-on-failure' : 'off',
    /* Global timeout for actions */
    actionTimeout: env.getTimeout(),
    /* Global timeout for navigation */
    navigationTimeout: env.getTimeout(),
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
}); 