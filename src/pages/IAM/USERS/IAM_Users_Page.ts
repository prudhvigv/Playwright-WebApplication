import { BaseClass } from '../../../config/BaseClass';
import { HomePage } from '../../HomePage/HomePage';
import { Log } from '../../../utils/Log';

export class IAMUsersPage extends BaseClass {
  readonly homePage = new HomePage(this.page);

  readonly createUserButton = this.page.getByRole('button', {
    name: 'Create User',
  });
  readonly searchUserInput = this.page.getByRole('textbox', {
    name: 'Search User',
  });

  async navigateToUsersPage() {
    await this.navigateToLinkInSidekick('Users');
    await this.assertURLContains('/users', 80000);
  }

  async clickCreateUserButton() {
    await this.performClick(this.createUserButton);
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToCreateUserPage() {
    Log.info('NAVIGATE TO CREATE USER PAGE');
    await this.homePage.navigateToDashboard();
    await this.navigateToUsersPage();
    await this.clickCreateUserButton();
    await this.assertURLContains('/create', 80000);
  }
}
