import type { Page } from '@playwright/test';
import type { IArticle } from '../../utils/types';
import { logger } from '../../configs';
import { BasePage } from '../base.page';
import { articles } from '../../elements/articles';

export class EditArticlePage extends BasePage {
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  public async open(articleSlug: string): Promise<void> {
    logger.debug(`Open the Edit Article page for article - ${articleSlug}`);
    await super.open(`/editor/${articleSlug}`);
  }

  public async getArticleTitle(): Promise<string> {
    const articleTitle = await this.page.$eval(
      articles.edit.titleInput,
      (element: HTMLInputElement) => element.value,
    );
    logger.debug(`Article title is ${articleTitle} on the Edit Article page`);
    return articleTitle;
  }

  public async getArticleDescription(): Promise<string> {
    const articleDescription = await this.page.$eval(
      articles.edit.descriptionInput,
      (element: HTMLInputElement) => element.value,
    );
    logger.debug(`Article description is ${articleDescription} on the Edit Article page`);
    return articleDescription;
  }

  public async getArticleBody(): Promise<string> {
    const articleBody = await this.page.$eval(
      articles.edit.bodyInput,
      (element: HTMLInputElement) => element.value,
    );
    logger.debug(`Article body is ${articleBody} on the Edit Article page`);
    return articleBody;
  }

  public async getArticleTagsPlaceholder(): Promise<string> {
    const articleTagsPlaceholder = this.page.getAttribute(articles.edit.tagsInput, 'placeholder');
    logger.debug(`Article tags placeholder is ${articleTagsPlaceholder} on the Edit Article page`);
    return articleTagsPlaceholder;
  }

  public async getArticleTags(): Promise<string[]> {
    const articleTags = Promise.all(
      (await this.page.$$(articles.edit.addedTags)).map(async item => {
        return (await item.textContent()).trim();
      }),
    );
    logger.debug(`Article tags are ${(await articleTags).join(', ')} on the Edit Article page`);
    return articleTags;
  }

  public async editArticleWith(article: IArticle): Promise<void> {
    const { title, description, body, tagList } = article;

    logger.debug(`Edit an article with - ${JSON.stringify(article)}`);

    await this.page.fill(articles.edit.titleInput, title);
    await this.page.fill(articles.edit.descriptionInput, description);
    await this.page.fill(articles.edit.bodyInput, body);

    for await (const tag of tagList) {
      await this.page.fill(articles.edit.tagsInput, tag);
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(300);
    }

    await this.page.click(articles.edit.publishArticleButton);
  }
}
