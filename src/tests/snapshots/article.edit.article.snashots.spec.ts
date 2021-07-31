import { expect, test } from '@playwright/test';
import faker from 'faker';
import { EditArticlePage } from '../../pageobjects/article';
import { createUser, createArticle, signInUser } from '../../utils/api';
import type { IArticle, IUser } from '../../utils/types';
import userResponse from '../../data/mock/user.json';
import editArticleResponse from '../../data/mock/edit.article.json';

test.describe('Edit an article - snapshots', () => {
  let editArticlePage: EditArticlePage;
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
    editArticlePage = new EditArticlePage(page);

    await signInUser(page, user);
    await editArticlePage.mockUserResponse(userResponse);
    await editArticlePage.mockEditArticleResponse(editArticleResponse);
    await editArticlePage.open(articleSlug);
  });

  test('should open the page', async ({ page }) => {
    expect(await page.screenshot()).toMatchSnapshot('edit-article-page.png', { threshold: 0.1 });
  });
});
