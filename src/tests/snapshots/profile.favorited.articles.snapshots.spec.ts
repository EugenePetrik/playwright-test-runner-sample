import { test, expect } from '@playwright/test';
import faker from 'faker';
import { ProfilePage } from '../../pageobjects/profile';
import { createUser, signInUser } from '../../utils/api';
import type { IUser } from '../../utils/types';
import userResponse from '../../data/mock/user.json';
import profilesResponse from '../../data/mock/profiles.json';
import favoritedArticlesResponse from '../../data/mock/favorited.articles.json';
import favoritedArticlesEmptyResponse from '../../data/mock/favorited.articles.empty.json';

test.describe('Profile page > Favorited articles - snapshots', () => {
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
      await profilePage.favoritedArticles.mockFavoritedArticlesResponse(favoritedArticlesResponse);
      await profilePage.open(user.username);
      await profilePage.favoritedArticles.clickFavoritedArticlesTab();
    });

    test('should open the page', async ({ page }) => {
      await expect(await page.screenshot()).toMatchSnapshot('profile-page-favorited-with-articles.png');
    });
  });

  test.describe('without articles', () => {
    test.beforeEach(async () => {
      await profilePage.mockUserResponse(userResponse);
      await profilePage.mockProfilesResponse(profilesResponse);
      await profilePage.favoritedArticles.mockFavoritedArticlesResponse(favoritedArticlesEmptyResponse,);
      await profilePage.open(user.username);
      await profilePage.favoritedArticles.clickFavoritedArticlesTab();
    });

    test('should open the page', async ({ page }) => {
      await expect(await page.screenshot()).toMatchSnapshot('profile-page-favorited-without-articles.png',);
    });
  });
});
