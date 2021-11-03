import { test, expect } from '@playwright/test';
import faker from 'faker';
import { env } from '../../configs';
import { SignInPage } from '../../pageobjects/sign.in.page';
import { HomePage } from '../../pageobjects/home';
import { ApiHelper } from '../../utils/api.helper';
import type { IUser } from '../../utils/types';

test.describe('Sign in', () => {
  let homePage: HomePage;
  let signInPage: SignInPage;

  const user: IUser = {
    email: `test${new Date().getTime() / 1000}@example.com`,
    password: faker.internet.password(),
    username: faker.internet.userName().replace(/[_'.]/g, '').toLowerCase().slice(0, 10),
  };

  test.beforeAll(async () => {
    await ApiHelper.createUser(user);
  });

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    signInPage = new SignInPage(page);

    await signInPage.open();
  });

  test('should open the page', async () => {
    const pageUrl = await signInPage.getPageUrl();
    expect(pageUrl).toEqual(`${env.APP_URL}/login`);

    const pageTitle = await signInPage.getPageTitle();
    expect(pageTitle).toEqual('Conduit');

    const pageHeader = await signInPage.getPageHeader();
    expect(pageHeader).toEqual('Sign in');

    const accountLinkText = await signInPage.getNeedAnAccountLink();
    expect(accountLinkText).toEqual('Need an account?');

    const accountLinkHreAttr = await signInPage.getNeedAnAccountLinkHrefAttr();
    expect(accountLinkHreAttr).toEqual('/register');
  });

  test('should log in successfully', async () => {
    await signInPage.signInAs(user);

    const pageUrl = await homePage.getPageUrl();
    expect(pageUrl).toEqual(`${env.APP_URL}/`);

    const pageTitle = await homePage.getPageTitle();
    expect(pageTitle).toEqual('Conduit');

    const navBarLinksLength = await homePage.navBar.getNavLinksLength();
    expect(navBarLinksLength).toEqual(4);

    const navBarLinksText = await homePage.navBar.getNavLinksText();
    expect(navBarLinksText).toEqual(['Home', 'New Article', 'Settings', user.username]);
  });
});
