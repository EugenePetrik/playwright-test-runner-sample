import type { Page } from '@playwright/test';
import { logger } from '../../configs';
import { navBar } from '../../elements/components/nav.bar';

export class NavBar {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async isBrandLogoVisible(): Promise<boolean> {
    const isBrandLogoVisible = await this.page.isVisible(navBar.brandLogo);
    logger.debug(`Brand Logo is ${isBrandLogoVisible ? 'visible' : 'not visible'} in Navigation`);
    return isBrandLogoVisible;
  }

  public async getBrandLogoLink(): Promise<string> {
    const brandLogoLink = await this.page.getAttribute(navBar.brandLogo, 'href');
    logger.debug(`Brand Logo 'href' attribute equals ${brandLogoLink} in Navigation`);
    return brandLogoLink;
  }

  public async getNavLinksLength(): Promise<number> {
    const navLinksLength = (await this.page.$$(navBar.links)).length;
    logger.debug(`There are ${navLinksLength} links in Navigation`);
    return navLinksLength;
  }

  public async getNavLinksText(): Promise<Array<string>> {
    const navLinksText = await this.page.$$eval(navBar.links, links => {
      return links.map(link => link.textContent.trim());
    });
    logger.debug(`Navigation contains the following links - ${navLinksText.join(', ')}`);
    return navLinksText;
  }
}
