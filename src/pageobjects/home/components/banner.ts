import type { Page } from '@playwright/test';
import { logger } from '../../../configs';
import { home } from '../../../elements/home';

export class Banner {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async getBrandNameText(): Promise<string> {
    const brandNameText = (await this.page.textContent(home.banner.name)).trim();
    logger.debug(`Brand name is ${brandNameText} on the Home page`);
    return brandNameText;
  }

  public async getBrandDescriptionText(): Promise<string> {
    const brandDescriptionText = (await this.page.textContent(home.banner.description)).trim();
    logger.debug(`Brand description is ${brandDescriptionText} on the Home page`);
    return brandDescriptionText;
  }
}
