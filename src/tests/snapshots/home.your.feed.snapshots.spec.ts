import { expect, test } from '@playwright/test';
import faker from 'faker';
import { HomePage } from '../../pageobjects/home';
import { createUser, signInUser } from '../../utils/api';
import type { IUser } from '../../utils/types';
import userResponse from '../../data/mock/user.json';
import yourFeedResponse from '../../data/mock/your.feed.json';
import yourFeedEmptyResponse from '../../data/mock/your.feed.empty.json';
import popularTagsResponse from '../../data/mock/tags.json';
import popularTagsEmptyResponse from '../../data/mock/tags.empty.json';

test.describe('Home page > Your feed - snapshots', () => {
  let homePage: HomePage;

  const user: IUser = {
    email: `test${new Date().getTime() / 1000}@example.com`,
    password: faker.internet.password(),
    username: faker.internet.userName().replace(/[_'.]/g, '').toLowerCase().slice(0, 10),
  };

  test.beforeAll(async () => {
    await createUser(user);
  });

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await signInUser(page, user);
  });

  test.describe('with articles', () => {
    test.beforeEach(async () => {
      await homePage.mockUserResponse(userResponse);
      await homePage.yourFeed.mockYourFeedResponse(yourFeedResponse);
      await homePage.popularTags.mockPopularTagsResponse(popularTagsResponse);
      await homePage.open();
      await homePage.yourFeed.clickYourFeedTab();
    });

    test('should open the page', async ({ page }) => {
      expect(await page.screenshot()).toMatchSnapshot('home-page-your-feed-with-articles.png', {
        threshold: 0.2,
      });
    });
  });

  test.describe('without articles', () => {
    test.beforeEach(async () => {
      await homePage.mockUserResponse(userResponse);
      await homePage.yourFeed.mockYourFeedResponse(yourFeedEmptyResponse);
      await homePage.popularTags.mockPopularTagsResponse(popularTagsEmptyResponse);
      await homePage.open();
      await homePage.yourFeed.clickYourFeedTab();
    });

    test('should open the page', async ({ page }) => {
      expect(await page.screenshot()).toMatchSnapshot('home-page-your-feed-without-articles.png');
    });
  });
});
