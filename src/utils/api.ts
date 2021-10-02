import type { Page } from '@playwright/test';
import type { IArticle, IComment, IUser, UserResponse } from './types';
import { logger, timeouts } from '../configs';
import { ApiClient } from '../api/client';

export async function createUser(user: IUser): Promise<UserResponse> {
  logger.debug(`Sign up user via API with - ${JSON.stringify(user)}`);
  return await ApiClient.unauthorized().user.register(user);
}

export async function signInUser(page: Page, user: IUser): Promise<void> {
  logger.debug(`Sign in user via API with - ${JSON.stringify(user)}`);
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
  await page.evaluate(async (token) => {
    await window.localStorage.setItem('id_token', token);
  }, jwtToken);

  logger.debug('Reload the page after adding the JWT Token');
  await page.reload({
    timeout: timeouts.wait,
    waitUntil: 'networkidle',
  });
}

export async function createUserAndSignIn(page: Page, user: IUser): Promise<void> {
  logger.debug(`Sign up user via API with - ${JSON.stringify(user)}`);
  const client = await ApiClient.unauthorized().user.register(user);

  const jwtToken = client?.user?.token;

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
  await page.evaluate(async (token) => {
    await window.localStorage.setItem('id_token', token);
  }, jwtToken);

  logger.debug('Reload the page after adding the JWT Token');
  await page.reload({
    timeout: timeouts.wait,
    waitUntil: 'networkidle',
  });
}

export async function createArticle(user: IUser, article: IArticle): Promise<string> {
  logger.debug(`Sign in user via API with - ${JSON.stringify(user)}`);
  const client = await ApiClient.loginAs(user);

  logger.debug(`Create a new article via API with - ${JSON.stringify(article)}`);
  const newArticle = await client.article.createArticle(article);

  const articleSlug = newArticle?.article?.slug;

  if (articleSlug) {
    logger.debug(`Article slug is ${articleSlug}`);
  } else {
    throw new Error('Did not receive the article slug in response');
  }

  return articleSlug;
}

export async function createFavoriteArticle(user: IUser, article: IArticle): Promise<string> {
  logger.debug(`Sign in user via API with - ${JSON.stringify(user)}`);
  const client = await ApiClient.loginAs(user);

  logger.debug(`Create a new article via API with - ${JSON.stringify(article)}`);
  const newArticle = await client.article.createArticle(article);

  const articleSlug = newArticle?.article?.slug;

  if (articleSlug) {
    logger.debug(`Article slug is ${articleSlug}`);
  } else {
    throw new Error('Did not receive the article slug in response');
  }

  logger.debug('Add an article to favorite');
  await client.article.addArticleToFavorite(articleSlug);

  return articleSlug;
}

export async function createArticleWithComment(user: IUser, article: IArticle, comment: IComment,): Promise<string> {
  logger.debug(`Sign in user via API with - ${JSON.stringify(user)}`);
  const client = await ApiClient.loginAs(user);

  logger.debug(`Create a new article via API with - ${JSON.stringify(article)}`);
  const newArticle = await client.article.createArticle(article);

  const articleSlug = newArticle?.article?.slug;

  if (articleSlug) {
    logger.debug(`Article slug is ${articleSlug}`);
  } else {
    throw new Error('Did not receive the article slug in response');
  }

  logger.debug(`Add a comment - ${JSON.stringify(comment)} to an article`);
  await client.comment.createComment(articleSlug, comment);

  return articleSlug;
}

export async function deleteArticle(articleSlug: string, user: IUser): Promise<void> {
  logger.debug(`Sign in user via API with - ${JSON.stringify(user)}`);
  const client = await ApiClient.loginAs(user);

  logger.debug(`Delete an article via API with slug - ${articleSlug}`);
  await client.article.deleteArticle(articleSlug);

  logger.debug(`Article with slug - ${articleSlug} removed`);
}
