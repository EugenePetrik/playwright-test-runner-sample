import type { Page } from '@playwright/test';
import type { IUser } from '../utils/types';
import { logger } from '../configs';
import { BasePage } from './base.page';
import { signUp } from '../elements/sign.up';

export class SignUpPage extends BasePage {
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  public async open(): Promise<void> {
    logger.debug('Open the Sign Up page');
    await super.open('/register');
  }

  public async waitSignUpPageLoaded(): Promise<void> {
    logger.debug('Wait until Sign Up page is displayed');
    await this.page.waitForSelector(signUp.root);
  }

  public async signUpAs(user: IUser): Promise<void> {
    logger.debug(`Sign up into the application with the user - ${JSON.stringify(user)}`);

    const { username, email, password } = user;

    await this.page.type(signUp.usernameInput, username);
    await this.page.type(signUp.emailInput, email);
    await this.page.type(signUp.passwordInput, password);

    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click(signUp.signUpButton)
    ]);
  }

  public async getPageHeader(): Promise<string> {
    const header = (await this.page.textContent(signUp.header)).trim();
    logger.debug(`Page header text is ${header} on the Sign Up page`);
    return header;
  }

  public async getHaveAnAccountLink(): Promise<string> {
    const linkText = (await this.page.textContent(signUp.haveAnAccountLink)).trim();
    logger.debug(`"Have an account?" link text is ${linkText} on the Sign Up page`);
    return linkText;
  }

  public async getHaveAnAccountLinkHrefAttr(): Promise<string> {
    const linkHrefAttr = await this.page.getAttribute(signUp.haveAnAccountLink, 'href');
    logger.debug(`"Have an account?" link "href" attribute is ${linkHrefAttr} on the Sign Up page`);
    return linkHrefAttr;
  }
}
