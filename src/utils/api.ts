import type { Page } from '@playwright/test';
import type { IArticle, IUser, UserResponse } from './types';
import { env, logger, timeouts } from '../configs';
import { ApiClient } from '../api/client';

export async function createUser(user: IUser): Promise<UserResponse> {
  logger.debug(`Sign up user via API with - ${JSON.stringify(user)}`);
  return await ApiClient.unauthorized().user.register(user);
}

export async function signInUser(page: Page, user: IUser): Promise<void> {
  logger.debug(`Sign in user via API. Get JWT Token for user - ${user.email}`);
  const jwtToken = await ApiClient.unauthorized().user.login(user);

  if (jwtToken) {
    logger.debug(`User JWT Token - ${jwtToken}`);
  } else {
    throw new Error('Did not receive user JWT Token in response');
  }

  logger.debug('Open Home page');
  await page.goto('/', {
    timeout: timeouts.wait,
    waitUntil: 'networkidle',
  });

  logger.debug('Add JWT Token to Local Storage');
  await page.evaluate(async token => {
    await window.localStorage.setItem('id_token', token);
  }, jwtToken);

  logger.debug('Reload the page after adding the JWT Token');
  await page.reload({
    timeout: timeouts.wait,
    waitUntil: 'networkidle',
  });
}
