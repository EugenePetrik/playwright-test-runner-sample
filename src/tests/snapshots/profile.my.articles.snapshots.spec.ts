import { test, expect } from '@playwright/test';
import faker from 'faker';
import { ProfilePage } from '../../pageobjects/profile';
import { createUser, signInUser } from '../../utils/api';
import type { IUser } from '../../utils/types';
import userResponse from '../../data/mock/user.json';
import profilesResponse from '../../data/mock/profiles.json';
import myArticlesResponse from '../../data/mock/my.articles.json';
import myArticlesEmptyResponse from '../../data/mock/my.articles.empty.json';

test.describe('Profile page > My articles - snapshots', () => {
  let profilePage: ProfilePage;

  const user: IUser = {
    email: `test${new Date().getTime() / 1000}@example.com`,
    password: faker.internet.password(),
    username: faker.internet.userName().replace(/[_'.]/g, '').toLowerCase().slice(0, 10),
  };

  test.beforeAll(async () => {
    await createUser(user);
  });

  test.beforeEach(async ({ page }) => {
    profilePage = new ProfilePage(page);
    await signInUser(page, user);
  });

  test.describe('with articles', () => {
    test.beforeEach(async () => {
      await profilePage.mockUserResponse(userResponse);
      await profilePage.mockProfilesResponse(profilesResponse);
      await profilePage.myArticles.mockMyArticlesResponse(myArticlesResponse);
      await profilePage.open(user.username);
    });

    test('should open the page', async ({ page }) => {
      await expect(await page.screenshot()).toMatchSnapshot('profile-page-my-articles-with-articles.png');
    });
  });

  test.describe('without articles', () => {
    test.beforeEach(async () => {
      await profilePage.mockUserResponse(userResponse);
      await profilePage.mockProfilesResponse(profilesResponse);
      await profilePage.myArticles.mockMyArticlesResponse(myArticlesEmptyResponse);
      await profilePage.open(user.username);
    });

    test('should open the page', async ({ page }) => {
      await expect(await page.screenshot()).toMatchSnapshot('profile-page-my-articles-without-articles.png',);
    });
  });
});
