import type { Page } from '@playwright/test';
import { logger } from '../../configs';
import { BasePage } from '../base.page';
import { home } from '../../elements/home';

export class HomePage extends BasePage {
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  public async open(): Promise<void> {
    logger.debug('Open the Home page');
    await super.open('/');
  }

  public async waitHomePageLoaded(): Promise<void> {
    logger.debug('Wait until Home page is displayed');

    await this.page.waitForSelector(home.root);
    await this.page.waitForSelector(home.tabs.globalFeed);
    await this.page.waitForSelector(home.articlePreview);
  }
}
