import { expect, test } from '@playwright/test';
import faker from 'faker';
import { ArticleDetailsPage } from '../../pageobjects/article';
import { createUser, createArticle, signInUser } from '../../utils/api';
import type { IArticle, IUser } from '../../utils/types';
import userResponse from '../../data/mock/user.json';
import detailsArticleResponse from '../../data/mock/article.json';
import commentsResponse from '../../data/mock/comments.json';

test.describe('Article Details page - snapshots', () => {
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

  test.beforeAll(async () => {
    await createUser(user);
    articleSlug = await createArticle(user, article);
  });

  test.beforeEach(async ({ page }) => {
    articleDetailsPage = new ArticleDetailsPage(page);

    await signInUser(page, user);
    await articleDetailsPage.mockUserResponse(userResponse);
    await articleDetailsPage.mockDetailsArticleResponse(detailsArticleResponse);
    await articleDetailsPage.comment.mockCommentsResponse(commentsResponse);
    await articleDetailsPage.open(articleSlug);
  });

  test('should open the page', async ({ page }) => {
    expect(await page.screenshot()).toMatchSnapshot('details-article-page.png', { threshold: 0.1 });
  });
});
