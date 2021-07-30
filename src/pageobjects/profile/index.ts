import type { Page } from '@playwright/test';
import { logger } from '../../configs';
import { BasePage } from '../base.page';
import { FavoritedArticles, MyArticles } from './components';
import { profile } from '../../elements/profile';

export class ProfilePage extends BasePage {
  readonly page: Page;
  readonly myArticles: MyArticles;
  readonly favoritedArticles: FavoritedArticles;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.myArticles = new MyArticles(page);
    this.favoritedArticles = new FavoritedArticles(page);
  }

  public async open(username: string): Promise<void> {
    logger.debug(`Open the Profile page`);
    await super.open(`/@${username}`);
  }

  public async isUserImageVisible(): Promise<boolean> {
    const isUserImageVisible = await this.page.isDisabled(profile.userImage);
    logger.debug(
      `User image is ${isUserImageVisible ? 'visible' : 'not visible'} on the Profile page`,
    );
    return isUserImageVisible;
  }

  public async getUsernameText(): Promise<string> {
    const usernameText = (await this.page.textContent(profile.username)).trim();
    logger.debug(`Username is ${usernameText} on the Profile page`);
    return usernameText;
  }

  public async isEditProfileButtonVisible(): Promise<boolean> {
    const isEditProfileButtonVisible = await this.page.isDisabled(
      profile.editProfileSettingsButton,
    );
    logger.debug(
      `Edit Profile button is ${
        isEditProfileButtonVisible ? 'visible' : 'not visible'
      } on the Profile page`,
    );
    return isEditProfileButtonVisible;
  }
}
