import { PlaywrightTestConfig } from '@playwright/test';
import { devices } from 'playwright';
import * as dotenv from 'dotenv';
import { env, timeouts } from './src/configs';

dotenv.config({ path: `${__dirname}/.env` });

const config: PlaywrightTestConfig = {
  testDir: 'src/tests',

  testMatch: 'src/tests/**/*.spec.ts',

  timeout: timeouts.test,

  retries: env.RETRIES,
  workers: env.WORKERS,

  use: {
    launchOptions: {
      slowMo: env.SLOW_MO,
    },

    baseURL: env.APP_URL,

    headless: env.HEADLESS,
    ignoreHTTPSErrors: env.IGNORE_HTTP_ERRORS,

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'Chromium',
      use: {
        browserName: 'chromium',
        viewport: {
          width: env.VIEWPORT_WIDTH,
          height: env.VIEWPORT_HEIGHT,
        },
      },
    },
    {
      name: 'Firefox',
      use: {
        browserName: 'firefox',
        viewport: {
          width: env.VIEWPORT_WIDTH,
          height: env.VIEWPORT_HEIGHT,
        },
      },
    },
    {
      name: 'WebKit',
      use: {
        browserName: 'webkit',
        viewport: {
          width: env.VIEWPORT_WIDTH,
          height: env.VIEWPORT_HEIGHT,
        },
      },
    },
    {
      name: 'Pixel 4',
      use: {
        locale: 'fr-FR',
        geolocation: { longitude: 48.858455, latitude: 2.294474 },
        permissions: ['geolocation'],

        browserName: 'chromium',
        ...devices['Pixel 4'],
      },
    },
    {
      name: 'iPhone 11',
      use: {
        locale: 'fr-FR',
        geolocation: { longitude: 48.858455, latitude: 2.294474 },
        permissions: ['geolocation'],

        browserName: 'webkit',
        ...devices['iPhone 11'],
      },
    },
  ],

  expect: {
    toMatchSnapshot: { threshold: 0.3 },
  },
};

export default config;
