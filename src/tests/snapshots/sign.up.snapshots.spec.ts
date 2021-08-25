import { test, expect } from '@playwright/test';
import { SignUpPage } from '../../pageobjects/sign.up.page';

test.describe('Sign up page - snapshots', () => {
  let signUpPage: SignUpPage;

  test.beforeEach(async ({ page }) => {
    signUpPage = new SignUpPage(page);
    await signUpPage.open();
  });

  test('should open the page', async ({ page }) => {
    expect(await page.screenshot()).toMatchSnapshot('sign-up-page.png');
  });
});
