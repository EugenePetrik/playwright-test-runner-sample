import { test, expect } from '@playwright/test';
import faker from 'faker';
import { NewArticlePage } from '../../pageobjects/article';
import { createUser, signInUser } from '../../utils/api';
import type { IUser } from '../../utils/types';
import userResponse from '../../data/mock/user.json';

test.describe('Create Article page - snapshots', () => {
  let newArticlePage: NewArticlePage;

  const user: IUser = {
    email: `test${new Date().getTime() / 1000}@example.com`,
    password: faker.internet.password(),
    username: faker.internet.userName().replace(/[_'.]/g, '').toLowerCase().slice(0, 10),
  };

  test.beforeAll(async () => {
    await createUser(user);
  });

  test.beforeEach(async ({ page }) => {
    newArticlePage = new NewArticlePage(page);

    await signInUser(page, user);
    await newArticlePage.mockUserResponse(userResponse);
    await newArticlePage.open();
  });

  test('should open the page', async ({ page }) => {
    await expect(await page.screenshot()).toMatchSnapshot('create-article-page.png');
  });
});
