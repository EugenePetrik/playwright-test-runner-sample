import type { Page } from '@playwright/test';
import type { IArticle, IComment, IUser } from './types';
import { logger, timeouts } from '../configs';
import { ApiClient } from '../api/client';

export class ApiHelper {
  public static async createUser(user: IUser): Promise<string> {
    logger.debug(`Sign up user via API with - ${JSON.stringify(user)}`);

    const response = await ApiClient.unauthorized().user.register(user);

    const jwtToken = response?.user?.token;

    if (jwtToken) {
      logger.debug(`User JWT Token - ${jwtToken}`);
    } else {
      throw new Error('Did not receive user JWT Token in response');
    }

    return jwtToken;
  }

  public static async signInUser(user: IUser): Promise<string> {
    logger.debug(`Sign in user via API with - ${JSON.stringify(user)}`);

    const jwtToken = await ApiClient.unauthorized().user.login(user);

    if (jwtToken) {
      logger.debug(`User JWT Token - ${jwtToken}`);
    } else {
      throw new Error('Did not receive user JWT Token in response');
    }

    return jwtToken;
  }

  public static async loginToApp(page: Page, user: IUser): Promise<void> {
    const jwtToken = await this.signInUser(user);

    logger.debug('Open Home page');

    await page.goto('/', {
      timeout: timeouts.wait,
      waitUntil: 'networkidle',
    });

    logger.debug('Add JWT Token to Local Storage');

    await page.evaluate(async (token) => {
      window.localStorage.setItem('id_token', token);
    }, jwtToken);

    logger.debug('Reload the page after adding the JWT Token');

    await page.reload({
      timeout: timeouts.wait,
      waitUntil: 'networkidle',
    });
  }

  public static async createArticle(user: IUser, article: IArticle): Promise<string> {
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

  public static async createFavoriteArticle(user: IUser, article: IArticle): Promise<string> {
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

  public static async createArticleWithComment(user: IUser,
    article: IArticle,
    comment: IComment): Promise<string> {

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

  public static async deleteArticle(articleSlug: string, user: IUser): Promise<void> {
    logger.debug(`Sign in user via API with - ${JSON.stringify(user)}`);

    const client = await ApiClient.loginAs(user);
  
    logger.debug(`Delete an article via API with slug - ${articleSlug}`);

    await client.article.deleteArticle(articleSlug);
  
    logger.debug(`Article with slug - ${articleSlug} removed`);
  }
}
