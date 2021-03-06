import { test, expect } from '@playwright/test';
import faker from 'faker';
import { env } from '../../../configs';
import { HomePage } from '../../../pageobjects/home';
import { ApiHelper } from '../../../utils/api.helper';
import type { IUser, IArticle } from '../../../utils/types';

test.describe('Home page for authorized user', () => {
  let homePage: HomePage;

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
    await ApiHelper.createFavoriteArticle(user, article);
  });

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await ApiHelper.loginToApp(page, user);
  });

  test('should have navigation bar', async () => {
    const pageUrl = await homePage.getPageUrl();
    expect(pageUrl).toEqual(`${env.APP_URL}/`);

    const pageTitle = await homePage.getPageTitle();
    expect(pageTitle).toEqual('Conduit');

    const isBrandLogoDisplayed = await homePage.navBar.isBrandLogoDisplayed();
    expect(isBrandLogoDisplayed).toBeTruthy;

    const brandLogoLink = await homePage.navBar.getBrandLogoLink();
    expect(brandLogoLink).toEqual('/');
  });

  test('should have navigation bar links', async () => {
    const navbarLinksText = await homePage.navBar.getNavLinksText();
    expect(navbarLinksText).toEqual(['Home', 'New Article', 'Settings', user.username]);
  });

  test('should have banner', async () => {
    const brandNameText = await homePage.banner.getBrandNameText();
    expect(brandNameText).toEqual('conduit');

    const brandDescriptionText = await homePage.banner.getBrandDescriptionText();
    expect(brandDescriptionText).toEqual('A place to share your knowledge.');
  });

  test('should have your feed', async () => {
    await homePage.yourFeed.clickYourFeedTab();

    const articlesEmptyText = await homePage.yourFeed.articleBlock.getArticlesEmptyText();
    expect(articlesEmptyText).toEqual('No articles are here... yet.');
  });

  test('should have global feed', async () => {
    const articlesLength = await homePage.globalFeed.articleBlock.getArticlesLength();
    expect(articlesLength).toBeGreaterThan(0);

    const articlesTitles = await homePage.globalFeed.articleBlock.getArticleTitles();
    expect(articlesTitles).toContain(article.title);
  });

  test('should have popular tags', async () => {
    const popularTagsTitleText = await homePage.popularTags.getPopularTagsTitleText();
    expect(popularTagsTitleText).toEqual('Popular Tags');

    const popularTagsLength = await homePage.popularTags.getPopularTagsLength();
    expect(popularTagsLength).toBeGreaterThan(0);

    const popularTagsTitles = await homePage.popularTags.getPopularTagsTitles();
    expect(popularTagsTitles).toContain(article.tagList[0]);
  });

  test('should have footer', async () => {
    const isBrandLogoVisible = await homePage.footer.isBrandLogoDisplayed();
    expect(isBrandLogoVisible).toBeTruthy;

    const brandLogoLink = await homePage.footer.getBrandLogoLink();
    expect(brandLogoLink).toEqual('/');

    const actualFooterText = await homePage.footer.getFooterText();
    expect(actualFooterText).toContain('An interactive learning project from');
    expect(actualFooterText).toContain('Thinkster. Code & design licensed under MIT.');
  });
});
