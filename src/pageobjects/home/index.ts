import type { Page } from '@playwright/test';
import { logger } from '../../configs';
import { BasePage } from '../base.page';
import { Banner, GlobalFeed, PopularTags, YourFeed } from './components';

export class HomePage extends BasePage {
  readonly page: Page;
  readonly banner: Banner;
  readonly yourFeed: YourFeed;
  readonly globalFeed: GlobalFeed;
  readonly popularTags: PopularTags;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.banner = new Banner(page);
    this.yourFeed = new YourFeed(page);
    this.globalFeed = new GlobalFeed(page);
    this.popularTags = new PopularTags(page);
  }

  public async open(): Promise<void> {
    logger.debug('Open the Home page');
    await super.open('/');
  }
}
