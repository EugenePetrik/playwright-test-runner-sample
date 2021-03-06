import { expect, test } from '@playwright/test';
import faker from 'faker';
import { EditArticlePage } from '../../pageobjects/article';
import { ApiHelper } from '../../utils/api.helper';
import type { IArticle, IUser } from '../../utils/types';
import userResponse from '../../data/mock/user.json';
import editArticleResponse from '../../data/mock/article.json';

test.describe('Edit Article page - snapshots', () => {
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
    await ApiHelper.createUser(user);
    articleSlug = await ApiHelper.createArticle(user, article);
  });

  test.beforeEach(async ({ page }) => {
    editArticlePage = new EditArticlePage(page);

    await ApiHelper.loginToApp(page, user);
    await editArticlePage.mockUserResponse(userResponse);
    await editArticlePage.mockEditArticleResponse(editArticleResponse);
    await editArticlePage.open(articleSlug);
  });

  test('should open the page', async ({ page }) => {
    await expect(await page.screenshot()).toMatchSnapshot('edit-article-page.png');
  });
});
