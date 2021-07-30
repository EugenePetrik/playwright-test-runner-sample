import type { Page } from '@playwright/test';
import { logger } from '../../../../configs';
import { articles } from '../../../../elements/articles';

export class Banner {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async getArticleTitle(): Promise<string> {
    const articleTitle = await this.page.textContent(articles.details.banner.title);
    logger.debug(`Article title is ${articleTitle} on the Article Details page`);
    return articleTitle;
  }

  public async isEditArticleButtonDisplayed(): Promise<boolean> {
    const isEditArticleButtonDisplayed = await this.page.isVisible(
      articles.details.banner.editArticleButton,
    );
    logger.debug(
      `Edit Article button is ${
        isEditArticleButtonDisplayed ? 'visible' : 'not visible'
      } on the Article Details page`,
    );
    return isEditArticleButtonDisplayed;
  }

  public async isDeleteArticleButtonDisplayed(): Promise<boolean> {
    const isDeleteArticleButtonDisplayed = await this.page.isVisible(
      articles.details.banner.editArticleButton,
    );
    logger.debug(
      `Delete Article button is ${
        isDeleteArticleButtonDisplayed ? 'visible' : 'not visible'
      } on the Article Details page`,
    );
    return isDeleteArticleButtonDisplayed;
  }

  public async isAuthorAvatarDisplayed(): Promise<boolean> {
    const isAuthorAvatarDisplayed = await this.page.isVisible(articles.details.banner.authorAvatar);
    logger.debug(
      `Author avatar is ${
        isAuthorAvatarDisplayed ? 'visible' : 'not visible'
      } on the Article Details page`,
    );
    return isAuthorAvatarDisplayed;
  }

  public async getAuthorName(): Promise<string> {
    const authorName = (await this.page.textContent(articles.details.banner.authorName)).trim();
    logger.debug(`Author name is ${authorName} on the Article Details page`);
    return authorName;
  }

  public async getArticleDate(): Promise<string> {
    const articleDate = await this.page.textContent(articles.details.banner.articleDate);
    logger.debug(`Article date is ${articleDate} on the Article Details page`);
    return articleDate;
  }

  public async clickDeleteArticleButton(): Promise<void> {
    logger.debug('Click on the Delete Article button on the Article Details page');
    await this.page.click(articles.details.banner.deleteArticleButton);
  }
}
