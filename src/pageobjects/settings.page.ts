import type { Page } from '@playwright/test';
import { logger } from '../configs';
import { BasePage } from './base.page';
import { settings } from '../elements/settings';

export class SettingsPage extends BasePage {
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  public async open(): Promise<void> {
    logger.debug('Open the Settings page');
    await super.open('/settings');
  }

  public async waitSettingsPageLoaded(): Promise<void> {
    logger.debug('Wait until Settings page is displayed');
    await this.page.waitForSelector(settings.root);
  }

  public async getPageHeader(): Promise<string> {
    const header = (await this.page.textContent(settings.header)).trim();
    logger.debug(`Page header text is ${header} on the Settings page`);
    return header;
  }

  public async getUsername(): Promise<string> {
    const username = await this.page.$eval(settings.usernameInput,
      (element: HTMLInputElement) => {
        return element.value; 
      });
    logger.debug(`Username equals ${username} on the Settings page`);
    return username;
  }

  public async getEmail(): Promise<string> {
    const email = await this.page.$eval(settings.emailInput,
      (element: HTMLInputElement) => {
        return element.value; 
      });
    logger.debug(`Email equals ${email} on the Settings page`);
    return email;
  }

  public async isUpdateSettingButtonDisplayed(): Promise<boolean> {
    const isButtonDisplayed = await this.page.isVisible(settings.updateSettingButton);
    logger.debug(`Update Settings button is ${
      isButtonDisplayed ? 'visible' : 'not visible'
    } on the Settings page`);
    return isButtonDisplayed;
  }

  public async isLogOutButtonDisplayed(): Promise<boolean> {
    const isButtonDisplayed = await this.page.isVisible(settings.logOutButton);
    logger.debug(`Log Out button is ${isButtonDisplayed ? 'visible' : 'not visible'} on the Settings page`);
    return isButtonDisplayed;
  }

  public async clickOnLogOutButton(): Promise<void> {
    logger.debug('Click on the Log Out button on the Settings page');
    await Promise.all([
      this.page.waitForNavigation(),
      await this.page.click(settings.logOutButton),
    ]);
  }
}
