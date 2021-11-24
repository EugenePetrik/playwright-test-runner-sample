/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Page } from '@playwright/test';
import { logger } from '../../../configs';
import { ArticleBlock } from '../../components';
import { profile } from '../../../elements/profile';

export class FavoritedArticles {
  readonly page: Page;
  readonly articleBlock: ArticleBlock;

  constructor(page: Page) {
    this.page = page;
    this.articleBlock = new ArticleBlock(this.page);
  }

  public async clickFavoritedArticlesTab(): Promise<void> {
    logger.debug('Click on the "Favorited Articles" tab on the Profile page');

    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click(profile.tabs.favoritedArticles),
    ]);
  }

  async mockFavoritedArticlesResponse(data: any): Promise<void> {
    logger.debug(`Mock API data for the Favorited Articles request - /api/articles?favorited=`);

    await this.page.route('**/articles?offset=0&limit=5&favorited=**', (route: any) => {
      route.fulfill({
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        contentType: 'application/json; charset=utf-8',
        body: JSON.stringify(data),
      });
    });
  }
}
