import { test, expect } from '@playwright/test';
import faker from 'faker';
import { env } from '../../../configs';
import { ApiHelper } from '../../../utils/api.helper';
import { HomePage } from '../../../pageobjects/home';
import { ArticleDetailsPage } from '../../../pageobjects/article';
import type { IArticle, IUser } from '../../../utils/types';

test.describe('Delete an article', () => {
  let articleDetailsPage: ArticleDetailsPage;
  let homePage: HomePage;
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
    articleDetailsPage = new ArticleDetailsPage(page);
    homePage = new HomePage(page);

    await ApiHelper.loginToApp(page, user);
    
    await articleDetailsPage.open(articleSlug);
  });

  test('should open the page', async () => {
    const pageUrl = await articleDetailsPage.getPageUrl();
    expect(pageUrl).toEqual(`${env.APP_URL}/articles/${articleSlug}`);

    const pageTitle = await articleDetailsPage.getPageTitle();
    expect(pageTitle).toEqual('Conduit');

    const articleTitle = await articleDetailsPage.banner.getArticleTitle();
    expect(articleTitle).toEqual(article.title);

    const articleBody = await articleDetailsPage.content.getArticleBody();
    expect(articleBody).toEqual(article.body);

    const articleTags = await articleDetailsPage.content.getArticleTags();
    expect(articleTags).toEqual(article.tagList);
  });

  test('should remove an article', async () => {
    await articleDetailsPage.banner.clickDeleteArticleButton();

    const pageUrl = await homePage.getPageUrl();
    expect(pageUrl).toEqual(`${env.APP_URL}/`);

    const pageTitle = await homePage.getPageTitle();
    expect(pageTitle).toEqual('Conduit');

    const articlesTitles = await homePage.globalFeed.articleBlock.getArticleTitles();
    expect(articlesTitles).not.toContain(article.title);
  });
});
