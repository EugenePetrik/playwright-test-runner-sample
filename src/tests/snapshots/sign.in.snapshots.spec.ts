import { test, expect } from '@playwright/test';
import { SignInPage } from '../../pageobjects/sign.in.page';

test.describe('Sign in page - snapshots', () => {
  let signInPage: SignInPage;

  test.beforeEach(async ({ page }) => {
    signInPage = new SignInPage(page);
    await signInPage.open();
  });

  test('should open the page', async ({ page }) => {
    expect(await page.screenshot()).toMatchSnapshot('sign-in-page.png', { threshold: 0.1 });
  });
});
