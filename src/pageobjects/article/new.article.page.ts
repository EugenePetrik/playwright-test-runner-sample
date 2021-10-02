import type { Page } from '@playwright/test';
import type { IArticle } from '../../utils/types';
import { logger, timeouts } from '../../configs';
import { BasePage } from '../base.page';
import { articles } from '../../elements/articles';

export class NewArticlePage extends BasePage {
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  public async open(): Promise<void> {
    logger.debug('Open the New Article page');
    await super.open('/editor/');
  }

  public async getArticleTitlePlaceholder(): Promise<string> {
    const articleTitlePlaceholder = await this.page.getAttribute(articles.new.titleInput,
      'placeholder');
    logger.debug(`Article title placeholder is ${articleTitlePlaceholder} on the New Article page`);
    return articleTitlePlaceholder;
  }

  public async getArticleDescriptionPlaceholder(): Promise<string> {
    const articleDescriptionPlaceholder = await this.page.getAttribute(articles.new.descriptionInput,
      'placeholder');
    logger.debug(`Article description placeholder is ${articleDescriptionPlaceholder} on the New Article page`);
    return articleDescriptionPlaceholder;
  }

  public async getArticleBodyPlaceholder(): Promise<string> {
    const articleBodyPlaceholder = await this.page.getAttribute(articles.new.bodyInput,
      'placeholder');
    logger.debug(`Article body placeholder is ${articleBodyPlaceholder} on the New Article page`);
    return articleBodyPlaceholder;
  }

  public async getArticleTagsPlaceholder(): Promise<string> {
    const articleTagsPlaceholder = await this.page.getAttribute(articles.new.tagsInput,
      'placeholder');
    logger.debug(`Article tags placeholder is ${articleTagsPlaceholder} on the New Article page`);
    return articleTagsPlaceholder;
  }

  public async createNewArticleWith(article: IArticle): Promise<void> {
    logger.debug(`Create a new article with - ${JSON.stringify(article)}`);

    const { title, description, body, tagList } = article;

    await this.page.fill(articles.new.titleInput, title);
    await this.page.fill(articles.new.descriptionInput, description);
    await this.page.fill(articles.new.bodyInput, body);

    for await (const tag of tagList) {
      await this.page.fill(articles.new.tagsInput, tag);
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(timeouts.element);
    }

    await Promise.all([
      this.page.waitForNavigation(),
      await this.page.click(articles.new.publishArticleButton),
    ]);
  }
}
