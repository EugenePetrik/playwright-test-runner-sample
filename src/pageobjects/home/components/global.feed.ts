import type { Page } from '@playwright/test';
import { logger } from '../../../configs';
import { home } from '../../../elements/home';
import { ArticleBlock } from '../../components';

export class GlobalFeed {
  readonly page: Page;
  readonly articleBlock: ArticleBlock;

  constructor(page: Page) {
    this.page = page;
    this.articleBlock = new ArticleBlock(this.page);
  }

  public async clickGlobalFeedTab(): Promise<void> {
    logger.debug('Click on the "Global Feed" tab on the Home page');

    await Promise.all([this.page.waitForNavigation(), await this.page.click(home.tabs.globalFeed)]);
  }

  async mockGlobalFeedResponse(data: any): Promise<void> {
    logger.debug(`Mock API data for the Global Feed request - /api/articles?offset=0&limit=10`);

    await this.page.route('**/api/articles?offset=0&limit=10', route => {
      route.fulfill({
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        contentType: 'application/json; charset=utf-8',
        body: JSON.stringify(data),
      });
    });
  }
}
