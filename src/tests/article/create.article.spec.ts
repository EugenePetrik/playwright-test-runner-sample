import { test, expect } from '@playwright/test';
import faker from 'faker';
import dayjs from 'dayjs';
import { env } from '../../configs';
import { createUser, signInUser } from '../../utils/api';
import { NewArticlePage, ArticleDetailsPage } from '../../pageobjects/article';
import type { IArticle, IUser } from '../../utils/types';

test.describe('Create a new article', () => {
  let newArticlePage: NewArticlePage;
  let articleDetailsPage: ArticleDetailsPage;

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
    newArticlePage = new NewArticlePage(page);
    articleDetailsPage = new ArticleDetailsPage(page);

    await signInUser(page, user);
    await newArticlePage.open();
  });

  test('should open the page', async () => {
    const pageUrl = await newArticlePage.getPageUrl();
    expect(pageUrl).toEqual(`${env.APP_URL}/editor/`);

    const pageTitle = await newArticlePage.getPageTitle();
    expect(pageTitle).toEqual('Conduit');

    const articleTitlePlaceholder = await newArticlePage.getArticleTitlePlaceholder();
    expect(articleTitlePlaceholder).toEqual('Article Title');

    const articleDescriptionPlaceholder = await newArticlePage.getArticleDescriptionPlaceholder();
    expect(articleDescriptionPlaceholder).toEqual(`What's this article about?`);

    const articleBodyPlaceholder = await newArticlePage.getArticleBodyPlaceholder();
    expect(articleBodyPlaceholder).toEqual('Write your article (in markdown)');

    const articleTagsPlaceholder = await newArticlePage.getArticleTagsPlaceholder();
    expect(articleTagsPlaceholder).toEqual('Enter tags');
  });

  test('should create a new article', async () => {
    await newArticlePage.createNewArticleWith(article);

    const articleTitle = await articleDetailsPage.banner.getArticleTitle();
    expect(articleTitle).toEqual(article.title);

    const isAuthorAvatarDisplayedInBanner =
      await articleDetailsPage.banner.isAuthorAvatarDisplayed();
    expect(isAuthorAvatarDisplayedInBanner).toBeTruthy;

    const authorNameInBanner = await articleDetailsPage.banner.getAuthorName();
    expect(authorNameInBanner).toEqual(user.username);

    const articleDateInBanner = await articleDetailsPage.banner.getArticleDate();
    expect(articleDateInBanner).toEqual(dayjs().format('MMMM D, YYYY'));

    const isEditArticleButtonDisplayedInBanner =
      await articleDetailsPage.banner.isEditArticleButtonDisplayed();
    expect(isEditArticleButtonDisplayedInBanner).toBeTruthy;

    const isDeleteArticleButtonDisplayedInBanner =
      await articleDetailsPage.banner.isDeleteArticleButtonDisplayed();
    expect(isDeleteArticleButtonDisplayedInBanner).toBeTruthy;

    const articleBody = await articleDetailsPage.content.getArticleBody();
    expect(articleBody).toEqual(article.body);

    const articleTags = await articleDetailsPage.content.getArticleTags();
    expect(articleTags).toEqual(article.tagList);

    const isAuthorAvatarDisplayedInContent =
      await articleDetailsPage.content.isAuthorAvatarDisplayed();
    expect(isAuthorAvatarDisplayedInContent).toBeTruthy;

    const authorNameInContent = await articleDetailsPage.content.getAuthorName();
    expect(authorNameInContent).toEqual(user.username);

    const articleDateInContent = await articleDetailsPage.content.getArticleDate();
    expect(articleDateInContent).toEqual(dayjs().format('MMMM D, YYYY'));

    const isEditArticleButtonDisplayedInContent =
      await articleDetailsPage.content.isEditArticleButtonDisplayed();
    expect(isEditArticleButtonDisplayedInContent).toBeTruthy;

    const isDeleteArticleButtonDisplayedInContent =
      await articleDetailsPage.content.isDeleteArticleButtonDisplayed();
    expect(isDeleteArticleButtonDisplayedInContent).toBeTruthy;
  });
});
