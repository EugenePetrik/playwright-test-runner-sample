import { test, expect } from '@playwright/test';
import { env } from '../configs';
import { user } from '../models';
import { HomePage } from '../pageobjects/home';
import { SignUpPage } from '../pageobjects/sign.up.page';

test.describe('Sign up', () => {
  let homePage: HomePage;
  let signUpPage: SignUpPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    signUpPage = new SignUpPage(page);

    await signUpPage.open();
  });

  test('should open the page', async () => {
    const pageUrl = await signUpPage.getPageUrl();
    expect(pageUrl).toEqual(env.APP_URL + '/register');

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
    expect(pageUrl).toEqual(env.APP_URL + '/');

    const pageTitle = await homePage.getPageTitle();
    expect(pageTitle).toEqual('Conduit');

    const navBarLinksLength = await homePage.navBar.getNavLinksLength();
    expect(navBarLinksLength).toEqual(4);

    const navBarLinksText = await homePage.navBar.getNavLinksText();
    expect(navBarLinksText).toEqual(['Home', 'New Article', 'Settings', user.username]);
  });
});
