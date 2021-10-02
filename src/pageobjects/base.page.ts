/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Page } from '@playwright/test';
import { logger, timeouts } from '../configs';
import { FooterComponent, NavBarComponent } from './components';

export class BasePage {
  readonly page: Page;
  readonly navBar: NavBarComponent;
  readonly footer: FooterComponent;

  constructor(page: Page) {
    this.page = page;
    this.navBar = new NavBarComponent(page);
    this.footer = new FooterComponent(page);
  }

  protected async open(path: string): Promise<void> {
    await this.page.goto(`${path}`, {
      timeout: timeouts.wait,
      waitUntil: 'networkidle',
    });
  }

  public async getPageUrl(): Promise<string> {
    const url = this.page.url();
    logger.debug(`Current page URL is ${url}`);
    return url;
  }

  public async getPageTitle(): Promise<string> {
    const title = await this.page.title();
    logger.debug(`Page title is '${title}'`);
    return title;
  }

  public async waitForPageNavigation(): Promise<void> {
    logger.debug('Wait until Network requests finished');
    await this.page.waitForNavigation({
      timeout: timeouts.wait,
      waitUntil: 'networkidle',
    });
  }

  public async waitForPageTimeout(milliseconds: number): Promise<void> {
    logger.debug(`Stop test execution for ${milliseconds} milliseconds`);
    await this.page.waitForTimeout(milliseconds);
  }

  public async reloadPage(): Promise<void> {
    logger.debug('Reload the page');
    await this.page.reload({
      timeout: timeouts.wait,
      waitUntil: 'networkidle',
    });
  }

  public async pauseTestExecution(): Promise<void> {
    await this.page.pause();
  }

  async mockUserResponse(data: any): Promise<void> {
    logger.debug(`Mock API data for the User request - /api/user/`);

    await this.page.route('**/api/user/', (route) => {
      route.fulfill({
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        contentType: 'application/json; charset=utf-8',
        body: JSON.stringify(data),
      });
    });
  }
}
