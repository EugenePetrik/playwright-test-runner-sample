import { test, expect } from '@playwright/test';
import faker from 'faker';
import { SettingsPage } from '../../pageobjects/settings.page';
import { createUserAndSignIn } from '../../utils/api';
import type { IUser } from '../../utils/types';
import userResponse from '../../data/mock/user.json';

test.describe('Settings page - snapshots', () => {
  let settingsPage: SettingsPage;

  const user: IUser = {
    email: `test${new Date().getTime() / 1000}@example.com`,
    password: faker.internet.password(),
    username: faker.internet.userName().replace(/[_'.]/g, '').toLowerCase().slice(0, 10),
  };

  test.beforeEach(async ({ page }) => {
    settingsPage = new SettingsPage(page);

    await createUserAndSignIn(page, user);
    await settingsPage.mockUserResponse(userResponse);
    await settingsPage.open();
  });

  test('should open the page', async ({ page }) => {
    expect(await page.screenshot()).toMatchSnapshot('settings-page.png', { threshold: 0.1 });
  });
});
