import { test, expect } from '@playwright/test';
import faker from 'faker';
import { env } from '../../configs';
import { HomePage } from '../../pageobjects/home';
import { SettingsPage } from '../../pageobjects/settings.page';
import { ApiHelper } from '../../utils/api.helper';
import type { IUser } from '../../utils/types';

test.describe('Log out', () => {
  let settingsPage: SettingsPage;
  let homePage: HomePage;

  const user: IUser = {
    email: `test${new Date().getTime() / 1000}@example.com`,
    password: faker.internet.password(),
    username: faker.internet.userName().replace(/[_'.]/g, '').toLowerCase().slice(0, 10),
  };

  test.beforeAll(async () => {
    await ApiHelper.createUser(user);
  });

  test.beforeEach(async ({ page }) => {
    settingsPage = new SettingsPage(page);
    homePage = new HomePage(page);

    await ApiHelper.loginToApp(page, user);
    
    await settingsPage.open();
  });

  test('should log out', async () => {
    const isLogOutButtonVisible = await settingsPage.isLogOutButtonDisplayed();
    expect(isLogOutButtonVisible).toBeTruthy();

    await settingsPage.clickOnLogOutButton();

    const pageUrl = await homePage.getPageUrl();
    expect(pageUrl).toEqual(`${env.APP_URL}/`);

    const pageTitle = await homePage.getPageTitle();
    expect(pageTitle).toEqual('Conduit');

    const navBarLinksText = await homePage.navBar.getNavLinksText();
    expect(navBarLinksText).toEqual(['Home', 'Sign in', 'Sign up']);
  });
});
