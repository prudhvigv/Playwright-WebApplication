import { Locator } from '@playwright/test';
import { BaseClass } from '../../config/BaseClass';
import { Log } from '../../utils/Log';

export class HomePage extends BaseClass {
  readonly settingsIcon = this.page.getByRole('button', { name: 'Settings' });
  readonly menuButton = this.page.locator('.create-btn-wrapper').first();
  readonly contentManagementOption = this.page.getByRole('menuitem', { name: 'Content Management' });
  readonly caseManagementOption = this.page.getByRole('menuitem', { name: 'Case Management' });
  readonly myTasksInSidebar = this.page.getByRole('link', { name: 'My Tasks' });
  readonly newButton = this.page.getByRole('button', { name: 'New Button' });
  readonly createCaseButton = this.page.getByRole('button', { name: 'Create New' });

  async validateSettingsIconVisible(visible: boolean) {
    if (visible) {
      await this.assertVisible(this.settingsIcon, 80000);
    } else {
      await this.settingsIcon.waitFor({ state: 'hidden', timeout: 5000 });
    }
  }

  async navigateToDashboard() {
    Log.info('NAVIGATING TO DASHBOARD');
    await this.performClick(this.settingsIcon);
    await this.page.waitForURL(/\/dashboard/);
    await this.assertURLContains('/dashboard', 80000);
  }

  async SELECT_APP_TO_CONTENT_MANAGEMENT() {
    await this.page.waitForLoadState('load');
    await this.page.waitForLoadState('domcontentloaded');
    Log.info('Reroute application to Content Management');
    await this.page.waitForLoadState('load');
    await this.performClick(this.menuButton);
    await this.waitForElement(this.contentManagementOption);
    await this.performClick(this.contentManagementOption);
    await this.assertVisible(this.newButton);
  }

  async SELECT_APP_TO_CASE_MANAGEMENT() {
    await this.page.waitForLoadState('load');
    await this.page.waitForLoadState('domcontentloaded');
    Log.info('Reroute application to Content Management');
    await this.page.waitForLoadState('load');
    await this.performClick(this.menuButton);
    await this.waitForElement(this.caseManagementOption);
    await this.performClick(this.caseManagementOption);
    await this.assertVisible(this.createCaseButton);
  }

  async NAV_TO_DASHBOARD() {
    Log.info('Navigating to Dashboards page');
    if (await this.settingsIcon.isVisible()) {
      await this.performClick(this.settingsIcon);
      await this.page.waitForResponse((response) => response.status() == 200);
    } else {
      Log.info('User does not have permission to view settings icon');
    }
  }
}
