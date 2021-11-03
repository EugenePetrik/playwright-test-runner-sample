import { test, expect } from '@playwright/test';
import faker from 'faker';
import dayjs from 'dayjs';
import { env } from '../../../configs';
import { ApiHelper } from '../../../utils/api.helper';
import { ArticleDetailsPage } from '../../../pageobjects/article';
import type { IArticle, IComment, IUser } from '../../../utils/types';

test.describe('Delete article comment', () => {
  let articleDetailsPage: ArticleDetailsPage;
  let articleSlug: string;

  const user: IUser = {
    email: `test${new Date().getTime() / 1000}@example.com`,
    password: faker.internet.password(),
    username: faker.internet.userName().replace(/[_'.]/g, '').toLowerCase().slice(0, 10),
  };

  const article: IArticle = {
    title: faker.lorem.words(),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
    tagList: [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()],
  };

  const comment: IComment = {
    body: faker.lorem.sentence(),
  };

  test.beforeAll(async () => {
    await ApiHelper.createUser(user);
    articleSlug = await ApiHelper.createArticleWithComment(user, article, comment);
  });

  test.beforeEach(async ({ page }) => {
    articleDetailsPage = new ArticleDetailsPage(page);

    await ApiHelper.loginToApp(page, user);
    
    await articleDetailsPage.open(articleSlug);
  });

  test('should open the page', async () => {
    const pageUrl = await articleDetailsPage.getPageUrl();
    expect(pageUrl).toEqual(`${env.APP_URL}/articles/${articleSlug}`);

    const pageTitle = await articleDetailsPage.getPageTitle();
    expect(pageTitle).toEqual('Conduit');

    const commentPlaceholder = await articleDetailsPage.addCommentForm.getCommentPlaceholder();
    expect(commentPlaceholder).toEqual('Write a comment...');

    const isPostCommentButtonDisplayed =
      await articleDetailsPage.addCommentForm.isPostCommentButtonDisplayed();
    expect(isPostCommentButtonDisplayed).toBeTruthy;

    const commentBody = await articleDetailsPage.comment.getCommentBody();
    expect(commentBody).toEqual(comment.body);

    const isCommentAuthorAvatarDisplayed =
      await articleDetailsPage.comment.isCommentAuthorAvatarDisplayed();
    expect(isCommentAuthorAvatarDisplayed).toBeTruthy;

    const commentAuthorName = await articleDetailsPage.comment.getCommentAuthorName();
    expect(commentAuthorName).toEqual(user.username);

    const commentDatePosted = await articleDetailsPage.comment.getCommentDatePosted();
    expect(commentDatePosted).toEqual(dayjs().format('MMMM D, YYYY'));

    const isDeleteCommentButtonDisplayed =
      await articleDetailsPage.comment.isDeleteCommentButtonDisplayed();
    expect(isDeleteCommentButtonDisplayed).toBeTruthy;
  });

  test('should delete article comment', async () => {
    await articleDetailsPage.comment.deleteArticleComment();

    const isArticleCommentDisplayed = await articleDetailsPage.comment.isArticleCommentDisplayed();
    expect(isArticleCommentDisplayed).toBeFalsy;
  });
});
