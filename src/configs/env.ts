import { bool, cleanEnv, num, str, url } from 'envalid';

export const env = cleanEnv(process.env, {
  APP_URL: url({
    default: 'https://demo.learnwebdriverio.com',
    desc: 'App URL to be tested',
  }),
  API_URL: url({
    default: 'https://conduit-api.learnwebdriverio.com',
    desc: 'API URL to be tested',
  }),
  API_PREFIX_PATH: str({
    default: '/api',
    desc: 'Prefix part in url path to be prepended to all requests',
  }),
  HEADLESS: bool({
    default: false,
    desc: 'Headless browser enabled',
  }),
  SLOW_MO: num({
    default: 100,
    desc: 'Emplicit wait',
  }),
  RETRIES: num({
    default: 0,
    desc: 'Number of retires',
  }),
  WORKERS: num({
    default: 1,
    desc: 'Number of workers',
  }),
  VIEWPORT_WIDTH: num({
    default: 1920,
    desc: 'Web browser viewport width',
  }),
  VIEWPORT_HEIGHT: num({
    default: 1080,
    desc: 'Web browser viewport height',
  }),
  IGNORE_HTTP_ERRORS: bool({
    default: true,
    desc: 'Ignore HTTP errors',
  }),
});
