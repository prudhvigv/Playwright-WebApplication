import { expect } from '@playwright/test';
import { BaseClass } from '../../config/BaseClass';
import { Log } from '../../utils/Log';
import { myVault } from './myVault';

const folderTable = 'app-list-view-folder';

export class folder extends BaseClass {
  readonly myVaultPage = new myVault(this.page);

  readonly newFolderOption = this.page.getByRole('menuitem', {
    name: /new folder/i,
  });
  readonly colmnNameInFolderTable = (colName: string) =>
    this.page.getByLabel('Folders').getByRole('button', { name: `${colName}` });
  readonly folderNameInput = this.page.getByPlaceholder('Name of the folder');
  readonly createBtn = this.page.getByRole('button', { name: /Create/i });
  readonly folderRow = (folderName: string) =>
    this.page
      .locator('app-list-view-folder table tr[mq-row]')
      .filter({ hasText: `${folderName}` });
  readonly folderNameInDetails = (folderName: string) =>
    this.page.locator('app-skeleton-data').getByText(folderName);
  readonly activitiesBtn = (folderName: string) =>
    this.page
      .locator('app-list-view-folder table tr[mq-row]')
      .filter({ hasText: folderName })
      .locator('[aria-label="Activities"]');
  readonly folderRowInMyVault = (fileName: string) =>
    this.page
      .locator('app-list-view-folder table tr[mq-row]')
      .filter({ hasText: fileName })
      .first();
  readonly renameFolderName = this.page.getByRole('textbox', {
    name: 'Enter new Folder name',
  });
  readonly noResultsInFolder = this.page.locator('app-list-view-folder [data-test="list-view-empty-state-title"]')

  async VALIDATE_COLUMNS_IN_FOLDER_TABLE() {
    Log.info('VALIDATING COLUMNS IN FOLDER TABLE');
    const noDataInFolder = await this.noResultsInFolder.isVisible();
    Log.info('Data in folder: ' + noDataInFolder);
    if (noDataInFolder) {
      await this.assertVisible(this.colmnNameInFolderTable('Name'));
      await this.assertVisible(this.colmnNameInFolderTable('Assigned To'));
      await this.assertVisible(this.colmnNameInFolderTable('Created By'));
      await this.assertVisible(this.colmnNameInFolderTable('Updated On'));
    }
  }

  async CREATE_FOLDER(folderName: string) {
    Log.info(`Creating folder: ${folderName}`);
    await this.performClick(this.myVaultPage.newButton);
    await this.performClick(this.newFolderOption);
    await this.fillInput(this.folderNameInput, folderName);
    await this.performClick(this.createBtn);
    await this.page.waitForTimeout(2000);
    await this.waitForElement(this.folderNameInDetails(folderName));
    await this.assertVisible(this.folderNameInDetails(folderName));
    await this.page.waitForTimeout(2000);
  }

  async searchFolder(folderName: string) {
    Log.info('Searching Folder ' + folderName);
    await this.fillInput(this.myVaultPage.searchFileFolders, folderName);
    await this.page.waitForTimeout(1000);
    await expect(this.folderRowInMyVault(folderName)).toBeVisible();
  }

  async NAVIGATE_TO_FOLDER(folderName: string) {
    Log.info(`Navigating to folder: ${folderName}`);
    await this.performClick(this.myVaultPage.itemsInLeftNav(folderName));
    await this.page.waitForTimeout(1000); // Wait for navigation
  }

  /**
   * Validates folder hierarchy expansion in the left nav: clicking each folder expands its children one level at a time.
   * @param folderNames Array of folder names in hierarchy order (root -> sub1 -> sub2 ...)
   */
  async VALIDATE_FOLDER_HIERARCHY(folderNames: string[]) {
    Log.info('Validating folder hierarchy expansion in left nav');
    for (let i = 0; i < folderNames.length; i++) {
      const currentFolder = folderNames[i];
      // Click to expand current folder in left nav
      await this.performClick(this.myVaultPage.itemsInLeftNav(currentFolder));
      await expect(
        this.myVaultPage.itemsInLeftNav(currentFolder),
      ).toBeVisible();
      // If there is a next folder, check it is now visible (expanded)
      if (i + 1 < folderNames.length) {
        const nextFolder = folderNames[i + 1];
        await expect(this.myVaultPage.itemsInLeftNav(nextFolder)).toBeVisible();
      }
    }
    Log.info('Folder Heiararchy validated');
  }

  async VALIDATE_FILE_VISIBLE_IN_FOLDER(fileName: string[]) {
    await this.page.waitForTimeout(2000);
    let found = false;
    for (const file of fileName) {
      Log.info('VALIDATE IF FILE IS UPLOADED ' + file);
      const fileNameWithoutExtension = file.replace(/\.[^/.]+$/, '');
      const elements = await this.page.$$(
        'app-list-view-table table tr[mq-row] td[class*="column-name"] span',
      );
      Log.info('Total no of elements ' + elements.length);
      for (const element of elements) {
        const text = await element.textContent();
        Log.info('Fetched file text is ' + text);
        if (text?.trim() === fileNameWithoutExtension) {
          found = true;
          break;
        }
      }
      expect(found).toBeTruthy();
    }
  }

  async VALIDATE_OPEN_FOLDER_FUNCTIONALITY(folderName: string) {
    Log.info('VALIDATING OPEN FOLDER FUNCTIONALITY');
    await this.searchFolder(folderName);
    await this.performClick(this.activitiesBtn(folderName));
    const openOption = this.page.getByRole('menuitem', { name: /open/i });
    await this.performClick(openOption);
    await this.page.waitForLoadState('load');
    await this.assertVisible(this.folderNameInDetails(folderName));
    await this.page.waitForTimeout(3000);
    await this.myVaultPage.NAV_TO_MY_VAULT();
    await this.page.waitForLoadState('load');
    await this.waitForElement(this.myVaultPage.myVaultLink);
  }

  async VALIDATE_SHARE_FOLDER_FUNCTIONALITY(folderName: string) {
    Log.info('VALIDATING SHARE FOLDER FUNCTIONALITY');
    await this.searchFolder(folderName);
    await this.performClick(this.activitiesBtn(folderName));
    const shareOption = this.page.getByRole('menuitem', { name: /share/i });
    await this.performClick(shareOption);
    await this.page.waitForLoadState('load');
    await this.assertVisible(this.myVaultPage.shareTextBox);
    await this.fillInput(this.myVaultPage.shareTextBox, 'test-automation');
    await this.page.waitForTimeout(2000);
    await this.performClick(this.myVaultPage.shareBtnInPopup);
    await this.page.waitForTimeout(1000);
    await this.page.goBack();
    await this.waitForElement(this.myVaultPage.myVaultLink);
  }

  async VALIDATE_RENAME_FOLDER_FUNCTIONALITY(folderName: string) {
    Log.info('RENAMING FOLDER');
    await this.searchFolder(folderName);
    await this.performClick(this.activitiesBtn(folderName));
    await this.myVaultPage.contentActionsOption.hover();
    await this.page.waitForTimeout(1000);
    await this.performClick(this.myVaultPage.renameDocOption);
    await this.fillInput(this.renameFolderName, folderName + '_Edit');
    await this.performClick(this.myVaultPage.saveChangeCategoryBtn);
    await this.page.waitForLoadState('load');
  }

  async DELETE_RENAMED_FOLDER(folderName: string) {
    const RENAMED_FOLDER = folderName + '_Edit';
    Log.info('Deleting renamed folder' + RENAMED_FOLDER);
    await this.DELETE_FOLDER(RENAMED_FOLDER);
  }

  async DELETE_FOLDER(folderName: string) {
    Log.info('DELETING FOLDER ' + folderName);
    Log.info('Searching Folder ' + folderName);
    await this.fillInput(this.myVaultPage.searchFileFolders, folderName);
    await this.page.waitForTimeout(1000);
    // Use the folder table, not the file table, for folders
    const folderRow = this.page
      .locator('app-list-view-folder table tr[mq-row]')
      .filter({ hasText: folderName })
      .first();
    await folderRow.waitFor({ state: 'visible', timeout: 5000 });
    // Try a generic button/icon selector for actions
    await this.performClick(this.activitiesBtn(folderName));
    const deleteOption = this.page.getByRole('menuitem', { name: /delete/i });
    await this.performClick(deleteOption);
    await this.performClick(this.page.getByRole('button', { name: 'Delete' }));
    await this.assertNotVisible(this.page.getByRole('button', { name: 'Delete' }));
    Log.info('DELETE option clicked for folder: ' + folderName);
  }

  async VALIDATE_FOLDER_VALID_PAGINATION() {
    await this.validatePaginationInFile(folderTable)
  }

  async VALIDATE_FOLDER_INVALID_INPUT() {
    await this.validateInvalidPage(folderTable);
  }

  async VALIDATE_RECORDS_SELECTED(OPTION) {
    await this.validateRecordsSelected(folderTable, OPTION)
  }
}
