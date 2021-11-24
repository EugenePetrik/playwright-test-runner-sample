/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Page } from '@playwright/test';
import { logger } from '../../../configs';
import { home } from '../../../elements/home';
import { ArticleBlock } from '../../components';

export class YourFeed {
  readonly page: Page;
  readonly articleBlock: ArticleBlock;

  constructor(page: Page) {
    this.page = page;
    this.articleBlock = new ArticleBlock(this.page);
  }

  public async clickYourFeedTab(): Promise<void> {
    logger.debug('Click on the "Global Feed" tab on the Home page');

    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click(home.tabs.yourFeed)
    ]);
  }

  public async isYourFeedTabDisplayed(): Promise<boolean> {
    const isYourFeedTabDisplayed = await this.page.isVisible(home.tabs.yourFeed);
    logger.debug(`Your Feed tab is ${isYourFeedTabDisplayed ? 'visible' : 'not visible'} on the Home page`);
    return isYourFeedTabDisplayed;
  }

  async mockYourFeedResponse(data: any): Promise<void> {
    logger.debug(`Mock API data for the Your Feed request - /api/articles/feed?offset=0&limit=10`);

    await this.page.route('**/api/articles/feed?offset=0&limit=10', (route: any) => {
      route.fulfill({
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        contentType: 'application/json; charset=utf-8',
        body: JSON.stringify(data),
      });
    });
  }
}
