import { expect, test } from '@playwright/test';
import { HomePage } from '../../pageobjects/home';
import globalFeedResponse from '../../data/mock/global.feed.json';
import globalFeedEmptyResponse from '../../data/mock/global.feed.empty.json';
import popularTagsResponse from '../../data/mock/tags.json';
import popularTagsEmptyResponse from '../../data/mock/tags.empty.json';

test.describe('Home page > Global feed - snapshots', () => {
  let homePage: HomePage;

  test.describe('with articles', () => {
    test.beforeEach(async ({ page }) => {
      homePage = new HomePage(page);
      await homePage.globalFeed.mockGlobalFeedResponse(globalFeedResponse);
      await homePage.popularTags.mockPopularTagsResponse(popularTagsResponse);
      await homePage.open();
    });

    test('should open the page', async ({ page }) => {
      await expect(await page.screenshot()).toMatchSnapshot('home-page-global-feed-with-articles.png', {
        threshold: 0.2,
      });
    });
  });

  test.describe('without articles', () => {
    test.beforeEach(async ({ page }) => {
      homePage = new HomePage(page);
      await homePage.globalFeed.mockGlobalFeedResponse(globalFeedEmptyResponse);
      await homePage.popularTags.mockPopularTagsResponse(popularTagsEmptyResponse);
      await homePage.open();
    });

    test('should open the page', async ({ page }) => {
      await expect(await page.screenshot()).toMatchSnapshot('home-page-global-feed-without-articles.png');
    });
  });
});
