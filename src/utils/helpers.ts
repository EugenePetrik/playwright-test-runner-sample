import type { Page } from '@playwright/test';
import type { IArticle, IUser, UserResponse } from './types';
import { env, logger, timeouts } from '../configs';
import { ApiClient } from '../api/client';

export async function createUser(user: IUser): Promise<UserResponse> {
  logger.debug(`Sign up user via API with - ${JSON.stringify(user)}`);
  return await ApiClient.unauthorized().user.register(user);
}
