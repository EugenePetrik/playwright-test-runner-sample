import type { Page } from '@playwright/test';
import { logger } from '../../configs';
import { articleBlock } from '../../elements/components/article.block';

export class ArticleBlock {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async getArticlesLength(): Promise<number> {
    await this.page.waitForSelector(articleBlock.preview);
    const articlesLength = (await this.page.$$(articleBlock.preview)).length;
    logger.debug(`Articles length - ${articlesLength}`);
    return articlesLength;
  }

  public async getArticleTitles(): Promise<string[]> {
    await this.page.waitForSelector(articleBlock.preview);
    const articlesTitles = await Promise.all(
      (
        await this.page.$$(articleBlock.title)
      ).map(async item => {
        return (await item.textContent()).trim();
      }),
    );
    logger.debug(`Articles titles - ${articlesTitles.join(', ')}`);
    return articlesTitles;
  }

  public async getArticlesEmptyText(): Promise<string> {
    await this.page.waitForSelector(articleBlock.emptyText);
    const articlesEmptyText = (await this.page.textContent(articleBlock.emptyText)).trim();
    logger.debug(`Articles empty text is ${articlesEmptyText}`);
    return articlesEmptyText;
  }
}
