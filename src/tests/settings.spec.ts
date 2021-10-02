import { test, expect } from '@playwright/test';
import faker from 'faker';
import { env } from '../configs';
import { SettingsPage } from '../pageobjects/settings.page';
import { createUser, signInUser } from '../utils/api';
import type { IUser } from '../utils/types';

test.describe('Settings', () => {
  let settingsPage: SettingsPage;

  const user: IUser = {
    email: `test${new Date().getTime() / 1000}@example.com`,
    password: faker.internet.password(),
    username: faker.internet.userName().replace(/[_'.]/g, '').toLowerCase().slice(0, 10),
  };

  test.beforeAll(async () => {
    await createUser(user);
  });

  test.beforeEach(async ({ page }) => {
    settingsPage = new SettingsPage(page);

    await signInUser(page, user);
    await settingsPage.open();
  });

  test('should open the page', async () => {
    const pageUrl = await settingsPage.getPageUrl();
    expect(pageUrl).toEqual(`${env.APP_URL}/settings`);

    const pageTitle = await settingsPage.getPageTitle();
    expect(pageTitle).toEqual('Conduit');

    const pageHeader = await settingsPage.getPageHeader();
    expect(pageHeader).toEqual('Your Settings');

    const getUsername = await settingsPage.getUsername();
    expect(getUsername).toEqual(user.username);

    const getEmail = await settingsPage.getEmail();
    expect(getEmail).toEqual(user.email);

    const isUpdateSettingButtonDisplayed = await settingsPage.isUpdateSettingButtonDisplayed();
    expect(isUpdateSettingButtonDisplayed).toBeTruthy();

    const isLogOutButtonDisplayed = await settingsPage.isLogOutButtonDisplayed();
    expect(isLogOutButtonDisplayed).toBeTruthy();
  });
});
