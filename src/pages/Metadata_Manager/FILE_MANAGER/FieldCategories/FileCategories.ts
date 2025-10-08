import { expect } from '@playwright/test';
import { BaseClass } from '../../../../config/BaseClass';
import { HomePage } from '../../../HomePage/HomePage';
import {
  validFileCategory,
  editFileCategory,
} from '../../../../test-data/Metadata_Manager/FileManager/FileCategories/create-file-category.json';
import { faker } from '@faker-js/faker';
import { Log } from '../../../../utils/Log';

// const NAME = validFileCategory.name + faker.person.firstName();
const DESCRIPTION = validFileCategory.description;
const FILE_TYPE = validFileCategory.fileType;
const EDIT_NAME = editFileCategory.name + faker.word.words();
const EDIT_DESCRIPTION = editFileCategory.description + faker.word.words();
let name = '';

export class FileCategories extends BaseClass {
  readonly homePage = new HomePage(this.page);

  readonly fileManagerButton = this.page.getByRole('button', {
    name: 'File Manager',
  });
  readonly fileManagerTable = this.page.locator('app-file-manager table');
  readonly fileCategoryRows = this.page.locator(
    'app-file-manager table tbody tr[class*="mq-row"]',
  );
  readonly createFileCategoryButton = this.page.getByRole('button', {
    name: 'Create',
  });
  readonly createCategoryNameInput = this.page.getByRole('textbox', {
    name: 'Enter name',
  });
  readonly descriptionInput = this.page.getByRole('textbox', {
    name: 'Enter description',
  });
  readonly fileTypeDropdown = this.page.getByRole('combobox', {
    name: 'Select',
  });
  readonly fileUploadButton = this.page
    .locator('div[class*="file-upload"]')
    .nth(2);
  readonly saveButton = this.page.getByRole('button', { name: 'Save' });
  readonly cancelButton = this.page.getByRole('button', { name: 'Cancel' });
  readonly fileCategoryName = (name: string) =>
    this.page.getByRole('cell', { name: `${name}`, exact: true });
  readonly fileRefreshButton = this.page.getByRole('button', {
    name: 'refresh',
  });
  readonly fileCategoryOptionBtn = (fileCatName: string) =>
    this.page
      .getByRole('row', { name: `${fileCatName}` })
      .getByLabel('Activities');
  readonly editButton = this.page.getByRole('menuitem', { name: 'Edit' });
  readonly unPublishButton = this.page.getByRole('menuitem', {
    name: 'Unpublish',
  });
  readonly editFileCategoryHeader = this.page.getByText('Edit File Category');
  readonly deActivateButton = this.page.getByRole('button', {
    name: 'Deactivate',
  });
  readonly fileCategoryStatus = (fileName: string) =>
    this.page.locator(
      `//tr//td//div[contains(text(), "${fileName}")]/following::app-status-label[1]`,
    );

  async naviToFileManagerPage() {
    Log.info('NAVIGATING TO FILE CATEGORIES');
    await this.homePage.navigateToDashboard();
    await this.navigateToLinkInSidekick('File Manager');
    await this.assertURLContains('file-manager', 80000);
  }

  async validateFileCategoriesListView() {
    Log.info('VALIDATING FILE CATEGORIES LIST VIEW');
    await this.assertVisible(this.fileManagerTable);
  }

  async NAVIGATE_TO_CREATE_FILE_CATEGORY_PAGE() {
    Log.info('NAVIGATING TO CREATE FILE CATEGORY PAGE');
    await this.performClick(this.createFileCategoryButton);
    await this.assertURLContains('file-category/create');
  }

  async VALIDATE_CANCEL_BUTTON_FUNCTIONALITY() {
    Log.info(
      'VALIDATE CANCEL BUTTON FUNCTIONALITY IN CREATE FILE CATEGORY PAGE',
    );
    await this.naviToFileManagerPage();
    await this.NAVIGATE_TO_CREATE_FILE_CATEGORY_PAGE();
    await this.performClick(this.cancelButton);
    await this.page.waitForLoadState('networkidle');
    await this.assertVisible(this.createFileCategoryButton);
  }

  async CREATE_FILE_CATEGORY() {
    name = validFileCategory.name + faker.person.firstName();
    Log.info('CREATING FILE CATEGORY ' + name);
    await this.naviToFileManagerPage();
    await this.NAVIGATE_TO_CREATE_FILE_CATEGORY_PAGE();
    await this.fillInput(this.createCategoryNameInput, name);
    await this.fillInput(this.descriptionInput, DESCRIPTION);
    await this.performClick(this.fileTypeDropdown);
    await this.page.getByRole('option', { name: FILE_TYPE }).click();
    await this.performClick(this.saveButton);
    await this.page.waitForLoadState('networkidle');
  }

  async VALIDATE_FILE_CATEGORY_CREATION() {
    Log.info('VALIDATING FILE CATEGORY CREATION ' + name);
    await this.assertVisible(this.fileManagerTable);
    await this.assertVisible(this.fileCategoryName(name));
  }

  async fileCategoryRowsCount() {
    const rows = await this.fileCategoryRows.count();
    Log.info(`Number of file category rows: ${rows}`);
    return rows;
  }

  async VALIDATE_REFRESH_ICON_FUNCTIONALITY() {
    Log.info('VALIDATING REFRESH ICON FUNCTIONALITY');
    await this.naviToFileManagerPage();
    const initialFileCategoryCount = await this.fileManagerTable
      .locator('tr')
      .count();
    await this.performClick(this.fileRefreshButton);
    await this.page.waitForLoadState('networkidle');
    const updatedFileCategoryCount = await this.fileManagerTable
      .locator('tr')
      .count();
    expect(updatedFileCategoryCount).toBeGreaterThanOrEqual(
      initialFileCategoryCount,
    );
  }

  async clickEditFileCategoryButton(fileCategoryName: string) {
    Log.info(`CLICKING EDIT BUTTON FOR FILE CATEGORY: ${fileCategoryName}`);
    await this.performClick(this.fileCategoryOptionBtn(fileCategoryName));
    await this.performClick(this.editButton);
    await this.assertVisible(this.editFileCategoryHeader);
  }

  async PERFORM_EDIT_FILE_CATEGORY() {
    Log.info('PERFORMING EDIT FILE CATEGORY ON ' + name);
    await this.clickEditFileCategoryButton(name);
    await this.fillInput(this.createCategoryNameInput, EDIT_NAME);
    await this.fillInput(this.descriptionInput, EDIT_DESCRIPTION);
    await this.performClick(this.saveButton);
    await this.page.waitForLoadState('networkidle');
    await this.assertVisible(this.fileCategoryName(EDIT_NAME));
  }

  async PERFORM_UNPUBLISH_FILE_CATEGORY() {
    Log.info(`PERFORMING UNPUBLISH ON FILE CATEGORY: ${name}`);
    await this.naviToFileManagerPage();
    const STATUS_BEFORE_UNPUBLISH = await this.getText(
      this.fileCategoryStatus(name),
    );
    Log.info('CAPTURING STATUS BEFORE UNPUBLISH' + STATUS_BEFORE_UNPUBLISH);
    await this.performClick(this.fileCategoryOptionBtn(name));
    await this.performClick(this.unPublishButton);
    await this.page.waitForLoadState('networkidle');
    await this.assertVisible(this.deActivateButton);
    await this.performClick(this.deActivateButton);
    const STATUS_AFTER_UNPUBLISH = await this.getText(
      this.fileCategoryStatus(name),
    );
    expect(STATUS_AFTER_UNPUBLISH).not.toBe(STATUS_BEFORE_UNPUBLISH);
    Log.info('CAPTURING STATUS AFTER UNPUBLISH' + STATUS_AFTER_UNPUBLISH);
  }
}
