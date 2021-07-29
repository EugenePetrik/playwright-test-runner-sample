import { test, expect } from '@playwright/test';
import faker from 'faker';
import { env } from '../../configs';
import { ProfilePage } from '../../pageobjects/profile';
import { createUser, createArticle, signInUser } from '../../utils/api';
import type { IUser, IArticle } from '../../utils/types';

test.describe('My articles', () => {
  let profilePage: ProfilePage;

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
  });

  test.beforeEach(async ({ page }) => {
    profilePage = new ProfilePage(page);
    await signInUser(page, user);
  });

  test.describe('without articles', () => {
    test.beforeEach(async () => {
      await profilePage.open(user.username);
    });

    test('should not display articles', async () => {
      const articlesEmptyText = await profilePage.myArticles.articleBlock.getArticlesEmptyText();
      expect(articlesEmptyText).toEqual('No articles are here... yet.');
    });
  });

  test.describe('with articles', () => {
    test.beforeAll(async () => {
      await createArticle(user, article);
    });

    test.beforeEach(async () => {
      await profilePage.open(user.username);
    });

    test('should open the page', async () => {
      const username = user.username;

      const isUserImageDisplayed = await profilePage.isUserImageVisible();
      expect(isUserImageDisplayed).toBeTruthy;

      const getUsername = await profilePage.getUsernameText();
      expect(getUsername).toEqual(username);

      const isEditProfileButtonVisible = await profilePage.isEditProfileButtonVisible();
      expect(isEditProfileButtonVisible).toBeTruthy;

      const pageUrl = await profilePage.getPageUrl();
      expect(pageUrl).toEqual(env.APP_URL + `/@${username}`);

      const pageTitle = await profilePage.getPageTitle();
      expect(pageTitle).toEqual('Conduit');
    });

    test('should display articles', async () => {
      const articlesLength = await profilePage.myArticles.articleBlock.getArticlesLength();
      expect(articlesLength).toEqual(1);

      const articlesTitles = await profilePage.myArticles.articleBlock.getArticleTitles();
      expect(articlesTitles).toEqual([article.title]);
    });
  });
});
