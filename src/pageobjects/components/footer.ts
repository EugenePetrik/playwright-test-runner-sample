import type { Page } from '@playwright/test';
import { logger } from '../../configs';
import { footer } from '../../elements/components/footer';

export class FooterComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async isBrandLogoDisplayed(): Promise<boolean> {
    const isBrandLogoDisplayed = await this.page.isVisible(footer.brandLogo);
    logger.debug(`Brand Logo is ${isBrandLogoDisplayed ? 'visible' : 'not visible'} in Footer`);
    return isBrandLogoDisplayed;
  }

  public async getBrandLogoLink(): Promise<string> {
    const brandLogoLink = await this.page.getAttribute(footer.brandLogo, 'href');
    logger.debug(`Brand Logo 'href' attribute equals ${brandLogoLink} in Footer`);
    return brandLogoLink;
  }

  public async getFooterText(): Promise<string> {
    const footerText = (await this.page.textContent(footer.attribution)).trim();
    logger.debug(`Attribution text is ${footerText} in Footer`);
    return footerText;
  }
}
