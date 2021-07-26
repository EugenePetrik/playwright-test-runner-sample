import type { Page } from '@playwright/test';
import { logger, timeouts } from '../configs';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
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
}
