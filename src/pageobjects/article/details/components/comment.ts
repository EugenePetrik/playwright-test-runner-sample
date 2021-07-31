import type { Page } from '@playwright/test';
import { logger } from '../../../../configs';
import { articles } from '../../../../elements/articles';

export class Comment {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async getCommentBody(): Promise<string> {
    const getCommentBody = this.page.textContent(articles.details.comment.body);
    logger.debug(`Comment body is ${getCommentBody} on the New Article page`);
    return getCommentBody;
  }

  public async isCommentAuthorAvatarDisplayed(): Promise<boolean> {
    const isAuthorAvatarDisplayed = await this.page.isVisible(
      articles.details.comment.authorAvatar,
    );
    logger.debug(
      `Comment author avatar is ${
        isAuthorAvatarDisplayed ? 'visible' : 'not visible'
      } on the Article Details page`,
    );
    return isAuthorAvatarDisplayed;
  }

  public async getCommentAuthorName(): Promise<string> {
    const authorName = (await this.page.textContent(articles.details.comment.authorName)).trim();
    logger.debug(`comment author name is ${authorName} on the Article Details page`);
    return authorName;
  }

  public async getCommentDatePosted(): Promise<string> {
    const commentDate = await this.page.textContent(articles.details.comment.datePosted);
    logger.debug(`Comment date posted is ${commentDate} on the Article Details page`);
    return commentDate;
  }

  public async isDeleteCommentButtonDisplayed(): Promise<boolean> {
    const isDeleteCommentButtonDisplayed = await this.page.isVisible(
      articles.details.comment.deleteComment,
    );
    logger.debug(
      `Delete Comment button is ${
        isDeleteCommentButtonDisplayed ? 'visible' : 'not visible'
      } on the Article Details page`,
    );
    return isDeleteCommentButtonDisplayed;
  }

  public async isArticleCommentDisplayed(): Promise<boolean> {
    const isArticleCommentDisplayed = await this.page.isVisible(articles.details.comment.card);
    logger.debug(
      `Article comment is ${
        isArticleCommentDisplayed ? 'visible' : 'not visible'
      } on the Article Details page`,
    );
    return isArticleCommentDisplayed;
  }

  public async deleteArticleComment(): Promise<void> {
    logger.debug('Delete article comment');

    await Promise.all([
      this.page.waitForResponse('**/comments/**'),
      await this.page.click(articles.details.comment.deleteComment),
    ]);
  }

  async mockCommentsResponse(data: any): Promise<void> {
    logger.debug(`Mock API data for the Comment request - /api/articles/**/comments`);

    await this.page.route('**/api/articles/**/comments', route => {
      route.fulfill({
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        contentType: 'application/json; charset=utf-8',
        body: JSON.stringify(data),
      });
    });
  }
}
