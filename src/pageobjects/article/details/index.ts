import type { Page } from '@playwright/test';
import { logger } from '../../../configs';
import { BasePage } from '../../base.page';
import { AddCommentForm, Banner, Content, Comment } from './components';

export class ArticleDetailsPage extends BasePage {
  readonly page: Page;
  readonly addCommentForm: AddCommentForm;
  readonly banner: Banner;
  readonly content: Content;
  readonly comment: Comment;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.addCommentForm = new AddCommentForm(page);
    this.banner = new Banner(page);
    this.content = new Content(page);
    this.comment = new Comment(page);
  }

  public async open(articleSlug: string): Promise<void> {
    logger.debug(`Open the Article Details page for article - ${articleSlug}`);
    await super.open(`/articles/${articleSlug}`);
  }
}
