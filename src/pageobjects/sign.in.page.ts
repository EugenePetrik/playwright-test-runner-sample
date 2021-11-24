import type { Page } from '@playwright/test';
import type { IUser } from '../utils/types';
import { logger } from '../configs';
import { BasePage } from './base.page';
import { signIn } from '../elements/sign.in';

export class SignInPage extends BasePage {
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  public async open(): Promise<void> {
    logger.debug('Open the Sign In page');
    await super.open('/login');
  }

  public async waitSignInPageLoaded(): Promise<void> {
    logger.debug('Wait until Sign In page is displayed');
    await this.page.waitForSelector(signIn.root);
  }

  public async signInAs(user: IUser): Promise<void> {
    logger.debug(`Sign in into the application with the user - ${JSON.stringify(user)}`);

    const { email, password } = user;

    await this.page.fill(signIn.emailInput, email);
    await this.page.fill(signIn.passwordInput, password);

    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click(signIn.signInButton)
    ]);
  }

  public async getPageHeader(): Promise<string> {
    const header = (await this.page.textContent(signIn.header)).trim();
    logger.debug(`Page header text is ${header} on the Sign In page`);
    return header;
  }

  public async getNeedAnAccountLink(): Promise<string> {
    const linkText = (await this.page.textContent(signIn.needAnAccountLink)).trim();
    logger.debug(`"Need an account?" link text is ${linkText} on the Sign In page`);
    return linkText;
  }

  public async getNeedAnAccountLinkHrefAttr(): Promise<string> {
    const linkHrefAttr = await this.page.getAttribute(signIn.needAnAccountLink, 'href');
    logger.debug(`"Need an account?" link "href" attribute is ${linkHrefAttr} on the Sign In page`);
    return linkHrefAttr;
  }
}
