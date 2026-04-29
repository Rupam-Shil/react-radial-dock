import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3217',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm --filter rrd-example-nextjs dev',
    url: 'http://localhost:3217',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }],
});
