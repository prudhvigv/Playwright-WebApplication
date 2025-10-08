import { expect } from '@playwright/test';
import { BaseClass } from '../../../config/BaseClass';
import { validUser as UserData } from '../../../test-data/IAM/Users/create-user.json';
import { faker } from '@faker-js/faker';
import { IAMUsersPage } from './IAM_Users_Page';
import { LoginPage } from '../../Login/loginPage';
import { Log } from '../../../utils/Log';

const FIRST_NAME = UserData.firstname + faker.person.firstName();
const LAST_NAME = UserData.lastname + faker.person.lastName();
const USERNAME = FIRST_NAME.toLowerCase() + '.' + LAST_NAME.toLowerCase();
const EMAIL = FIRST_NAME + '.' + LAST_NAME + '+test@mavq.com';
const PROFILE = UserData.selectProfile;
const MANAGER = UserData.Manager;
const IS_ACTIVE = UserData.isActive;
const SEARCH_USER = FIRST_NAME + ' ' + LAST_NAME;

export class IAM_CreateNewUsers extends BaseClass {
  readonly loginPage = new LoginPage(this.page);
  readonly IAM_USER_PAGE = new IAMUsersPage(this.page);

  readonly firstNameInput = this.page
    .locator('[data-test="First Name"]')
    .getByRole('textbox');
  readonly lastNameInput = this.page
    .locator('[data-test="Last Name"]')
    .getByRole('textbox');
  readonly userNameInput = this.page
    .locator('[data-test="Username"]')
    .getByRole('textbox');
  readonly emailInput = this.page
    .locator('[data-test="Email"]')
    .getByRole('textbox');
  readonly selectProfileDropdown = this.page.locator('#pn_id_14');
  readonly selectProfileDropdownOptions = (option: string) =>
    this.page.getByRole('option', { name: `${option}`, exact: true });
  readonly managerDropdonw = this.page.locator('#pn_id_4');
  readonly managerSearchInput = this.page.locator('input[pinputtext]');
  readonly managerSearchResults = (searchResult: string) =>
    this.page.getByRole('option', { name: `${searchResult}`, exact: true });
  readonly isActiveToggle = this.page.locator('mq-toggle span');
  readonly departmentDropdown = this.page
    .getByText('Department')
    .getByRole('combobox');
  readonly roleDropdown = this.page.getByText('Role').getByRole('combobox');
  readonly saveButton = this.page.getByRole('button', { name: 'Save' });
  readonly mandtoryError = (fieldName: string) =>
    this.page
      .locator(`[data-test="${fieldName}"]`)
      .getByText('This field is required');

  async enterValidData() {
    Log.info('CREATE VALID USER BY ENTERING VALID DATA');
    await this.fillInput(this.firstNameInput, FIRST_NAME);
    await this.fillInput(this.lastNameInput, LAST_NAME);
    await this.fillInput(this.userNameInput, USERNAME);
    await this.fillInput(this.emailInput, EMAIL);
    await this.performClick(this.selectProfileDropdown);
    await this.performClick(this.selectProfileDropdownOptions(PROFILE));
    await this.performClick(this.managerDropdonw);
    await this.fillInput(this.managerSearchInput, MANAGER);
    await this.page.waitForLoadState('networkidle');
    await this.performClick(this.managerSearchResults(MANAGER));
    if ((await this.isActiveToggle.isChecked()) && IS_ACTIVE === false) {
      await this.performClick(this.isActiveToggle);
    }
    await expect(this.saveButton).toBeEnabled();
  }

  async validateUserCreatedWithEmail() {
    Log.info('VALIDATING USER CREATED WITH EMAIL');
    await this.waitForElement(this.IAM_USER_PAGE.searchUserInput);
    await this.fillInput(this.IAM_USER_PAGE.searchUserInput, SEARCH_USER);
    await this.page.waitForLoadState('networkidle');
    const userRow = this.page.getByRole('cell', {
      name: `${SEARCH_USER}`,
      exact: true,
    });
    await expect(userRow).toBeVisible({ timeout: 80000 });
  }

  async validateMandatoryError() {
    Log.info('VALIDATE MANDATORY ERROR');
    await this.fillInput(this.firstNameInput, '');
    await this.performClick(this.emailInput);
    await this.assertVisible(this.mandtoryError('First Name'));
    await this.performClick(this.lastNameInput);
    await this.performClick(this.firstNameInput);
    await this.assertVisible(this.mandtoryError('Last Name'));
    await this.performClick(this.userNameInput);
    await this.performClick(this.lastNameInput);
    await this.assertVisible(this.mandtoryError('Username'));
    await this.performClick(this.emailInput);
    await this.performClick(this.lastNameInput);
    await this.assertVisible(this.mandtoryError('Email'));
  }

  async validateSaveBtnDisabled() {
    Log.info('VALIDATE SAVE BUTTON DISABLED');
    await expect(this.saveButton).toBeDisabled();
  }

  async CREATE_VALID_USER() {
    await this.IAM_USER_PAGE.navigateToCreateUserPage();
    await this.enterValidData();
    await this.performClick(this.saveButton);
    await this.page.waitForLoadState('networkidle');
    await this.validateUserCreatedWithEmail();
    Log.info('VALID USER CREATED SUCCESSFULLY');
  }

  async VALIDATE_ERROR_ON_MANDATORY_FIELDS() {
    await this.IAM_USER_PAGE.navigateToCreateUserPage();
    Log.info('VALIDATE ERROR ON MANDATORY FIELDS');
    await this.validateMandatoryError();
  }
}
