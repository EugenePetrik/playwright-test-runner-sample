import { test, expect } from '@playwright/test';
import faker from 'faker';
import { env } from '../configs';
import { HomePage } from '../pageobjects/home';
import { SignUpPage } from '../pageobjects/sign.up.page';
import type { IUser } from '../utils/types';

test.describe('Sign up', () => {
  let homePage: HomePage;
  let signUpPage: SignUpPage;

  const user: IUser = {
    email: `test${new Date().getTime() / 1000}@example.com`,
    password: faker.internet.password(),
    username: faker.internet.userName().replace(/[_'.]/g, '').toLowerCase().slice(0, 10),
  };

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    signUpPage = new SignUpPage(page);

    await signUpPage.open();
  });

  test('should open the page', async () => {
    const pageUrl = await signUpPage.getPageUrl();
    expect(pageUrl).toEqual(`${env.APP_URL}/register`);

    const pageTitle = await signUpPage.getPageTitle();
    expect(pageTitle).toEqual('Conduit');

    const pageHeader = await signUpPage.getPageHeader();
    expect(pageHeader).toEqual('Sign up');

    const accountLinkText = await signUpPage.getHaveAnAccountLink();
    expect(accountLinkText).toEqual('Have an account?');

    const accountLinkHreAttr = await signUpPage.getHaveAnAccountLinkHrefAttr();
    expect(accountLinkHreAttr).toEqual('/login');
  });

  test('should sign up successfully', async () => {
    await signUpPage.signUpAs(user);

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
