import { expect } from '@playwright/test';
import { BaseClass } from '../../config/BaseClass';
import { Log } from '../../utils/Log';


export class LoginPage extends BaseClass {
  readonly usernameInput = this.page.getByRole('textbox', { name: 'username' });
  readonly passwordInput = this.page.getByRole('textbox', { name: 'password' });
  readonly loginButton = this.page.getByRole('button', { name: 'Login' });
  readonly profileIcon = this.page.locator('mq-avatar div').nth(2);
  readonly logoutButton = this.page.getByRole('menuitem', { name: 'Log Out' });
  readonly myTasksInSidebar = this.page.getByRole('link', { name: 'My Tasks' });

  async navigateToLoginPage(url: string) {
    Log.info('User navigating to ' + url);
    await this.page.goto(url), { waitUntil: 'load' };
    await this.waitForElement(this.usernameInput)
    const title = await this.page.title();
    Log.info('1. Page title is ' + title)
    if (!(await this.usernameInput.isVisible())) {
      await this.page.goto(url, { waitUntil: 'load' });
    }
    const title1 = await this.page.title();
    Log.info('2. Page title is ' + title1)
    Log.info('---- Page Loaded ----');
  }

  async enterUsername(username: string) {
    await this.fillInput(this.usernameInput, username)
  }

  async enterPassword(password: string) {
    await this.fillInput(this.passwordInput, password)
  }

  async clickLoginButton() {
    await this.performClick(this.loginButton)
    await this.page.waitForResponse(
      (response) =>
        response.status() === 200,
    );
  }

  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    await this.page.waitForResponse(
      (response) =>
        response.status() === 200,
    );
  }

  async LOGOUT() {
    Log.info('Logging out user');
    await this.performClick(this.profileIcon);
    await this.performClick(this.logoutButton);
    await this.page.waitForLoadState('load');
    await this.assertVisible(this.usernameInput);
    Log.info('User logged out successfully');
  }

  async LOGIN_WITH_VALID_CREDENTIALS(username: string, password: string) {
    await this.navigateToLoginPage('');
    Log.info('Logging in with valid credentials');
    Log.info('Username is ' + username);
    await this.page.waitForURL(/.*login.*/);
    await this.page.waitForLoadState('domcontentloaded');
    if (await this.usernameInput.isVisible()) {
      Log.info('Entering login details to login to application');
      await this.enterUsername(username);
      await this.enterPassword(password);
      await this.clickLoginButton();
      await this.page.waitForLoadState('networkidle');
      if (await this.page.getByText('Invalid username or password.').isVisible()) {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
        await this.page.waitForLoadState('networkidle');
      }
      await expect(this.profileIcon).toBeVisible({ timeout: 80000 });
      // await this.waitForElement(this.myTasksInSidebar);
      Log.info('User logged in successfully');
      // await this.page.waitForURL('**/my-tasks**');
      // await this.page.waitForTimeout(2000);
      if (await this.page.locator('mq-icon[data-mq-icon-name="arrow_circle_right"]').isVisible()) {
        await this.page.locator('mq-icon[data-mq-icon-name="arrow_circle_right"]').click();
      }
    } else {
      Log.info('User is already logged in');
    }
  }
}
