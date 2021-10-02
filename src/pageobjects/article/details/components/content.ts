import type { Page } from '@playwright/test';
import { logger } from '../../../../configs';
import { articles } from '../../../../elements/articles';

export class Content {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async getArticleBody(): Promise<string> {
    const articleBody = await this.page.textContent(articles.details.content.body);
    logger.debug(`Article body is ${articleBody} on the Article Details page`);
    return articleBody;
  }

  public async getArticleTags(): Promise<string[]> {
    const articleTags = await Promise.all((
      await this.page.$$(articles.details.content.tags)
    ).map(async (item) => {
      return (await item.textContent()).trim();
    }),);
    logger.debug(`Article tags are ${articleTags.join(', ')} on the Article Details page`);
    return articleTags;
  }

  public async isEditArticleButtonDisplayed(): Promise<boolean> {
    const isEditArticleButtonDisplayed = await this.page.isVisible(articles.details.content.editArticleButton);
    logger.debug(`Edit Article button is ${
      isEditArticleButtonDisplayed ? 'visible' : 'not visible'
    } on the Article Details page`);
    return isEditArticleButtonDisplayed;
  }

  public async isDeleteArticleButtonDisplayed(): Promise<boolean> {
    const isDeleteArticleButtonDisplayed = await this.page.isVisible(articles.details.content.deleteArticleButton);
    logger.debug(`Delete Article button is ${
      isDeleteArticleButtonDisplayed ? 'visible' : 'not visible'
    } on the Article Details page`);
    return isDeleteArticleButtonDisplayed;
  }

  public async isAuthorAvatarDisplayed(): Promise<boolean> {
    const isAuthorAvatarDisplayed = await this.page.isVisible(articles.details.content.authorAvatar);
    logger.debug(`Author avatar is ${
      isAuthorAvatarDisplayed ? 'visible' : 'not visible'
    } on the Article Details page`);
    return isAuthorAvatarDisplayed;
  }

  public async getAuthorName(): Promise<string> {
    const authorName = (await this.page.textContent(articles.details.content.authorName)).trim();
    logger.debug(`Author name is ${authorName} on the Article Details page`);
    return authorName;
  }

  public async getArticleDate(): Promise<string> {
    const articleDate = await this.page.textContent(articles.details.content.articleDate);
    logger.debug(`Article date is ${articleDate} on the Article Details page`);
    return articleDate;
  }
}
