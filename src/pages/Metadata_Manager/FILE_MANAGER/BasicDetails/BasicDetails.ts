import { expect } from '@playwright/test';
import { BaseClass } from '../../../../config/BaseClass';
import { Log } from '../../../../utils/Log';
import { HomePage } from '../../../HomePage/HomePage';
import { faker } from '@faker-js/faker';

const LABEL_NAME = 'AutoLabel' + faker.person.middleName();

export class BasicDetails extends BaseClass {
  readonly homePage = new HomePage(this.page);

  readonly basicDetailsHeader = this.page
    .locator('mq-section')
    .getByText('Basic Details');
  readonly editButton = this.page.getByRole('button', { name: 'Edit' });
  readonly labelName = (name: string) => this.page.getByText(`${name}`);
  readonly editLabelTextBox = this.page.getByRole('textbox', {
    name: 'Enter Label',
  });
  readonly saveEditDetails = this.page.getByRole('button', { name: 'Save' });

  async NAV_TO_BASIC_DETAILS() {
    Log.info('NAVIGATING TO BASIC DETAILS PAGE');
    await this.homePage.navigateToDashboard();
    await this.navigateToLinkInSidekick('File Manager');
    await this.assertURLContains('file-manager', 80000);
    await this.selectTab('Basic Details');
    await this.assertVisible(this.basicDetailsHeader);
  }

  async EDIT_LABEL() {
    Log.info(`EDITING LABEL WITH ${LABEL_NAME} IN BASIC DETAILS PAGE`);
    await this.performClick(this.editButton);
    await this.waitForElement(this.editLabelTextBox);
    await this.fillInput(this.editLabelTextBox, LABEL_NAME);
    await this.performClick(this.saveEditDetails);
    await this.saveEditDetails.waitFor({ state: 'hidden' });
  }

  async VALIDATE_LABEL_EDITED() {
    Log.info('VALIDATING LABEL EDITED');
    await expect(this.labelName(LABEL_NAME)).toBeVisible();
  }
}
