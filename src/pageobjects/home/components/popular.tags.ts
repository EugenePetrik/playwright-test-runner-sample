/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Page } from '@playwright/test';
import { logger } from '../../../configs';
import { home } from '../../../elements/home';

export class PopularTags {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async getPopularTagsTitleText(): Promise<string> {
    const popularTagsTitle = (await this.page.textContent(home.popularTags.title)).trim();
    logger.debug(`Popular tags title is ${popularTagsTitle} on the Home page`);
    return popularTagsTitle;
  }

  public async getPopularTagsLength(): Promise<number> {
    const popularTagsLength = (await this.page.$$(home.popularTags.tags)).length;
    logger.debug(`Popular tags length is ${popularTagsLength} on the Home page`);
    return popularTagsLength;
  }

  public async getPopularTagsTitles(): Promise<string[]> {
    const tagsTitles = await Promise.all((
      await this.page.$$(home.popularTags.tags)
    ).map(async (item) => {
      return (await item.textContent()).trim();
    }));
    logger.debug(`Popular tags titles - ${tagsTitles.join(', ')} on the Home page`);
    return tagsTitles;
  }

  public async getPopularTagsEmptyText(): Promise<string> {
    const popularTagsEmptyText = (await this.page.textContent(home.popularTags.emptyText)).trim();
    logger.debug(`Popular tags empty text is ${popularTagsEmptyText} on the Home page`);
    return popularTagsEmptyText;
  }

  async mockPopularTagsResponse(data: any): Promise<void> {
    logger.debug(`Mock API data for the Popular Tags request - /api/tags/`);

    await this.page.route('**/api/tags/', (route) => {
      route.fulfill({
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        contentType: 'application/json; charset=utf-8',
        body: JSON.stringify(data),
      });
    });
  }
}
