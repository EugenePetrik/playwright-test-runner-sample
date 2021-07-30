import type { Page } from '@playwright/test';
import type { IComment } from '../../../../utils/types';
import { logger } from '../../../../configs';
import { articles } from '../../../../elements/articles';

export class AddCommentForm {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async getCommentPlaceholder(): Promise<string> {
    const getCommentPlaceholder = this.page.getAttribute(
      articles.details.addComment.writeCommentInput,
      'placeholder',
    );
    logger.debug(
      `Article description placeholder is ${getCommentPlaceholder} on the New Article page`,
    );
    return getCommentPlaceholder;
  }

  public async isCommentAuthorAvatarDisplayed(): Promise<boolean> {
    const isCommentAuthorAvatarDisplayed = await this.page.isVisible(
      articles.details.addComment.authorAvatar,
    );
    logger.debug(
      `Comment author avatar is ${
        isCommentAuthorAvatarDisplayed ? 'visible' : 'not visible'
      } on the Article Details page`,
    );
    return isCommentAuthorAvatarDisplayed;
  }

  public async isPostCommentButtonDisplayed(): Promise<boolean> {
    const isPostCommentButtonDisplayed = await this.page.isVisible(
      articles.details.addComment.postCommentButton,
    );
    logger.debug(
      `Post Comment button is ${
        isPostCommentButtonDisplayed ? 'visible' : 'not visible'
      } on the Article Details page`,
    );
    return isPostCommentButtonDisplayed;
  }

  public async addCommentWith(comment: IComment): Promise<void> {
    const { body } = comment;

    logger.debug(`Add comment with - ${JSON.stringify(comment)}`);

    await this.page.fill(articles.details.addComment.writeCommentInput, body);
    await this.page.click(articles.details.addComment.postCommentButton);
  }
}
