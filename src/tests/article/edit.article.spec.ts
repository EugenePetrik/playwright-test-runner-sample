import { test, expect } from '@playwright/test';
import faker from 'faker';
import dayjs from 'dayjs';
import { env } from '../../configs';
import { createUser, createArticle, signInUser } from '../../utils/api';
import { EditArticlePage, ArticleDetailsPage } from '../../pageobjects/article';
import type { IArticle, IUser } from '../../utils/types';

test.describe('Edit an article', () => {
  let editArticlePage: EditArticlePage;
  let articleDetailsPage: ArticleDetailsPage;
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
    await createUser(user);
    articleSlug = await createArticle(user, article);
  });

  test.beforeEach(async ({ page }) => {
    editArticlePage = new EditArticlePage(page);
    articleDetailsPage = new ArticleDetailsPage(page);

    await signInUser(page, user);
    await editArticlePage.open(articleSlug);
  });

  test('should open the page', async () => {
    const pageUrl = await editArticlePage.getPageUrl();
    expect(pageUrl).toEqual(env.APP_URL + `/editor/${articleSlug}`);

    const pageTitle = await editArticlePage.getPageTitle();
    expect(pageTitle).toEqual('Conduit');

    const articleTitle = await editArticlePage.getArticleTitle();
    expect(articleTitle).toEqual(article.title);

    const articleDescription = await editArticlePage.getArticleDescription();
    expect(articleDescription).toEqual(article.description);

    const articleBody = await editArticlePage.getArticleBody();
    expect(articleBody).toEqual(article.body);

    const articleTagsPlaceholder = await editArticlePage.getArticleTagsPlaceholder();
    expect(articleTagsPlaceholder).toEqual('Enter tags');

    const articleTags = await editArticlePage.getArticleTags();
    expect(articleTags).toEqual(article.tagList);
  });

  test('should edit an article', async () => {
    const newArticle: IArticle = {
      title: faker.lorem.words(),
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      tagList: [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()],
    };

    await editArticlePage.editArticleWith(newArticle);

    const pageUrl = await articleDetailsPage.getPageUrl();
    expect(pageUrl).toEqual(env.APP_URL + `/articles/${articleSlug}`);

    const pageTitle = await articleDetailsPage.getPageTitle();
    expect(pageTitle).toEqual('Conduit');

    const articleTitle = await articleDetailsPage.banner.getArticleTitle();
    expect(articleTitle).toEqual(newArticle.title);

    const isAuthorAvatarDisplayedInBanner =
      await articleDetailsPage.banner.isAuthorAvatarDisplayed();
    expect(isAuthorAvatarDisplayedInBanner).toBeTruthy;

    const authorNameInBanner = await articleDetailsPage.banner.getAuthorName();
    expect(authorNameInBanner).toEqual(user.username);

    const articleDateInBanner = await articleDetailsPage.banner.getArticleDate();
    expect(articleDateInBanner).toEqual(dayjs().format('MMMM DD, YYYY'));

    const isEditArticleButtonDisplayedInBanner =
      await articleDetailsPage.banner.isEditArticleButtonDisplayed();
    expect(isEditArticleButtonDisplayedInBanner).toBeTruthy;

    const isDeleteArticleButtonDisplayedInBanner =
      await articleDetailsPage.banner.isDeleteArticleButtonDisplayed();
    expect(isDeleteArticleButtonDisplayedInBanner).toBeTruthy;

    const articleBody = await articleDetailsPage.content.getArticleBody();
    expect(articleBody).toEqual(newArticle.body);

    const articleTags = await articleDetailsPage.content.getArticleTags();
    expect(articleTags).toEqual([...article.tagList, ...newArticle.tagList]);

    const isAuthorAvatarDisplayedInContent =
      await articleDetailsPage.content.isAuthorAvatarDisplayed();
    expect(isAuthorAvatarDisplayedInContent).toBeTruthy;

    const authorNameInContent = await articleDetailsPage.content.getAuthorName();
    expect(authorNameInContent).toEqual(user.username);

    const articleDateInContent = await articleDetailsPage.content.getArticleDate();
    expect(articleDateInContent).toEqual(dayjs().format('MMMM DD, YYYY'));

    const isEditArticleButtonDisplayedInContent =
      await articleDetailsPage.content.isEditArticleButtonDisplayed();
    expect(isEditArticleButtonDisplayedInContent).toBeTruthy;

    const isDeleteArticleButtonDisplayedInContent =
      await articleDetailsPage.content.isDeleteArticleButtonDisplayed();
    expect(isDeleteArticleButtonDisplayedInContent).toBeTruthy;
  });
});
