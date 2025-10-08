import { expect } from '@playwright/test';
import { BaseClass } from '../../config/BaseClass';
import { HomePage } from '../HomePage/HomePage';
import { faker } from '@faker-js/faker';
import { Log } from '../../utils/Log';
import { myVault } from '../MyVault/myVault';

const VAULT_HUB_TABLE = 'app-vault-hub-vault-list';

let name = '';
const NAME = faker.word.words();
const DESCRIPTION = faker.lorem.sentence();
const max_file_size = 1;
const total_storage = 25;
const allowed_file_types = ['PDF', 'JPG', 'PNG', 'DOC', 'WEBP'];
const VAULT_DATA = {
  label: NAME,
  description: DESCRIPTION,
  max_file_size: max_file_size,
  total_storage: total_storage,
  allowed_file_types: allowed_file_types,
  allowed_profiles: [],
};

export class VaultHub extends BaseClass {
  readonly myVault = new myVault(this.page);
  readonly homePage = new HomePage(this.page);
  readonly vaultHubButton = this.page.getByRole('button', {
    name: 'Vault Hub',
  });
  readonly vaultHubTable = this.page.getByRole('table', { name: 'Table' });
  readonly vaultHubRows = this.page.locator(
    'app-vault-hub table tbody tr[class*="mq-row"]',
  );

  readonly globalNewButton = this.myVault.newButton;
  readonly globalCreateVaultMenuItem = this.page.getByRole('menuitem', {
    name: 'Create Vault',
  });
  readonly createVaultHubButton = this.page.getByRole('button', {
    name: 'Create',
  });
  readonly vaultHubLabelInput = this.page.getByRole('textbox', {
    name: 'Enter name',
  });
  readonly vaultHubDescriptionInput = this.page.getByRole('textbox', {
    name: 'Enter description',
  });
  readonly maxtotalStorageInput = this.page
    .locator('mq-input')
    .filter({ hasText: 'Maximum Storage Limit *' })
    .getByRole('textbox');
  readonly maxFileSizeInput = this.page
    .locator('mq-input')
    .filter({ hasText: 'Maximum File Size Limit *' })
    .getByRole('textbox');
  readonly saveButton = this.page.getByRole('button', { name: 'Create' });
  readonly cancelButton = this.page.getByRole('button', { name: 'Cancel' });
  readonly vaultRefreshButton = this.page.getByRole('button', {
    name: 'refresh',
  });
  readonly searchFileFolders = this.page.getByRole('textbox', {     name: 'Search Files and Folders'  }).first();
  readonly searchVaultHub = this.page.getByRole('textbox', {     name: 'Search Vaults'  }).first();
  readonly vaultHubLink = (vaultHubName: string) => this.page.getByRole('link', { name: vaultHubName }).first();
  readonly fileRowInMyVault = (fileName: string) =>
    this.page
      .locator('app-vault-hub-list-view-file table tr[mq-row]')
      .filter({ hasText: fileName })
      .first();
  readonly activitiesBtn = (fileName: string) =>
    this.page
      .locator('app-vault-hub-list-view-folder table tr[mq-row]')
      .filter({ hasText: fileName })
      .locator('[aria-label="Activities"]');
  readonly noResultsInVaultHub = this.page.locator('[data-test="list-view-empty-state-title"]')
  readonly knowMoreBtn = this.page.getByRole('button', { name: 'Know more' });
  readonly shareBtn = this.page.getByRole('menuitem', { name: 'Share' });
  readonly shareWithOthers = this.page.getByText('Share with Others');
  readonly shareSearchBox = this.page.getByRole('textbox', { name: 'Search with name of the user' });
  readonly selectBtn = this.page.getByRole('button', { name: 'Select' });
  readonly shareBtnInPopup = this.page.getByRole('button', { name: 'Share' });

  async navigateToVaultHub() {
    Log.info('NAVIGATING TO VAULT HUB');
    await this.navigateToLinkInSidekick('Vault Hub');
    await this.assertURLContains('vault-hub', 80000);
    Log.info('Navigated to Vault Hub');
  }

  async validateVaultHubListView() {
    Log.info('VALIDATING VAULT HUB LIST VIEW');
    await this.assertVisible(this.vaultHubTable);
  }

  async navigateToCreateVaultHub() {
    Log.info('NAVIGATING TO CREATE VAULT HUB PAGE');
    await this.performClick(this.globalNewButton);
    await this.performClick(this.globalCreateVaultMenuItem);
    await this.assertVisible(
      this.page.getByRole('dialog').getByText('Create Vault'),
    );
  }

  async SELECT_VAULT_HUB(vaultName: string) {
    await this.fillInput(this.searchVaultHub, vaultName);
    await this.page.waitForTimeout(1000);
    await this.assertVisible(this.vaultHubLink(vaultName));
    await this.performClick(this.vaultHubLink(vaultName));
    await this.assertURLContains('vault-hub', 80000);
  }

  async VALIDATE_CANCEL_BUTTON_FUNCTIONALITY() {
    Log.info('VALIDATING CANCEL BUTTON FUNCTIONALITY');
    await this.navigateToCreateVaultHub();
    await this.performClick(this.cancelButton);
    await this.page.waitForLoadState('networkidle');
    await this.assertURLContains('vault-hub', 80000);
    await this.assertVisible(this.vaultHubTable);
    await this.assertVisible(this.globalNewButton);
  }

  async CREATE_VAULT_HUB() {
    name = VAULT_DATA.label + faker.company.name();
    Log.info('CREATING VAULT HUB ' + name);
    await this.navigateToVaultHub();
    await this.navigateToCreateVaultHub();
    await this.fillInput(this.vaultHubLabelInput, name);
    await this.fillInput(this.vaultHubDescriptionInput, DESCRIPTION);
    await this.fillInput(
      this.maxtotalStorageInput,
      VAULT_DATA.total_storage.toString(),
    );
    await this.fillInput(
      this.maxFileSizeInput,
      VAULT_DATA.max_file_size.toString(),
    );
    await this.performClick(this.saveButton);
    await this.page.waitForLoadState('networkidle');
    await this.VALIDATE_VAULT_HUB_CREATION();
    await this.assertURLContains('vault-hub', 80000);
    return name;
  }

  async VALIDATE_VAULT_HUB_CREATION() {
    Log.info('VALIDATING VAULT HUB CREATION ' + name);
    await this.assertVisible(this.page.getByText(name).first());
  }

  async VALIDATE_REFRESH_ICON_FUNCTIONALITY() {
    Log.info('VALIDATING REFRESH ICON FUNCTIONALITY');
    await this.navigateToVaultHub();
    const initialVaultHubCount = await this.vaultHubTable.locator('tr').count();
    await this.performClick(this.vaultRefreshButton);
    await this.page.waitForLoadState('networkidle');
    const updatedVaultHubCount = await this.vaultHubTable.locator('tr').count();
    expect(updatedVaultHubCount).toBeGreaterThanOrEqual(initialVaultHubCount);
  }

  async DELETE_FILE(fileName: string[]) {
    for (const file of fileName) {
      Log.info('DELETING FILE ' + file);
      try {
        // Check if file is visible in the vault before attempting delete
        const nameWithoutExtension = file.replace(/\.[^/.]+$/, '');
        Log.info('Searching file ' + fileName);
        await this.fillInput(this.searchFileFolders, nameWithoutExtension);
        await this.page.waitForTimeout(1000);
        const isVisible =
          await this.myVault.fileNameInResults(nameWithoutExtension).isVisible();
        if (!isVisible) {
          Log.info('File not found, skipping delete: ' + file);
          continue;
        }
        await this.myVault.clickActivities(
          this.fileRowInMyVault(nameWithoutExtension),
          file,
          true
        );
        const deleteOption = this.page.getByRole('menuitem', {
          name: /delete/i,
        });
        await this.performClick(deleteOption);
        await this.performClick(
          this.page.getByRole('button', { name: 'Delete' }),
        );
        // await this.page.getByRole('button', { name: 'Delete' }).waitFor();
        // await this.page.getByRole('button', { name: 'Delete' }).click();
        await this.page.waitForTimeout(2000);
        Log.info('DELETE option clicked for file: ' + file);
      } catch (err) {
        Log.info(
          'Error deleting file (skipped): ' +
            file +
            ' | Reason: ' +
            (err?.message || err),
        );
        continue;
      }
    }
  }

  async DELETE_FOLDER(folderName: string) {
    Log.info('DELETING FOLDER ' + folderName);
    Log.info('Searching Folder ' + folderName);
    await this.fillInput(this.searchFileFolders, folderName);
    await this.page.waitForTimeout(1000);
    // Use the folder table, not the file table, for folders
    const folderRow = this.page
      .locator('app-vault-hub-list-view-folder table tr[mq-row]')
      .filter({ hasText: folderName })
      .first();
    await folderRow.waitFor({ state: 'visible', timeout: 5000 });
    // Try a generic button/icon selector for actions
    await this.performClick(this.activitiesBtn(folderName));
    const deleteOption = this.page.getByRole('menuitem', { name: /delete/i });
    await this.performClick(deleteOption);
    await this.performClick(this.page.getByRole('button', { name: 'Delete' }));
    await this.page.waitForTimeout(2000);
    Log.info('DELETE option clicked for folder: ' + folderName);
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

  async VALIDATE_COLUMNS_FILES_INSIDE_FOLDER() {
    Log.info('VALIDATING COLUMNS IN FILES -> MY VAULT');
    await this.assertVisible(this.myVault.columnInFilesTable('Name'));
    await this.assertVisible(this.myVault.columnInFilesTable('Extension'));
    await this.assertVisible(this.myVault.columnInFilesTable('File Category'));
    await this.assertVisible(this.myVault.columnInFilesTable('Uploaded On'));
    await this.assertVisible(this.myVault.columnInFilesTable('Status'));
  }

  async VALIDATE_FILE_VISIBLE_IN_VAULT_HUB_FOLDER(fileName: string[]) {
    await this.page.waitForTimeout(2000);
    let found = false;
    for (const file of fileName) {
      Log.info('VALIDATE IF FILE IS UPLOADED ' + file);
      const fileNameWithoutExtension = file.replace(/\.[^/.]+$/, '');
      const elements = await this.page.$$(
          'app-folder-list-view-file table tr[mq-row] td[class*="column-name"] span',
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

  async UPLOAD_FILE_TO_VAULT_HUB(filePath: string[], file: string, downloadsPath: string) {
    Log.info('Uploading file to vault in VaultHub');
    // const fileName = await this.REMOVE_FILE_EXTENSION(file)
    await this.myVault.UPLOAD_FILE_TO_MY_VAULT(filePath, false);
    await this.myVault.VALIDATE_COLUMNS_IN_FILE_SECTION();
    await this.myVault.VALIDATE_FILE_VISIBLE_IN_MY_VAULT([file], true);
    await this.myVault.VALIDATE_PREVIEW_FUNCTIONALITY(file, true);
    await this.myVault.VALIDATE_OPEN_FILE_FUNCTIONALITY(file, true);
    await this.myVault.VALIDATE_CHANGE_CATEGORY(file, true);
    await this.myVault.VALIDATE_DOWNLOAD_FUNCTIONALITY(file, downloadsPath, true);
  }

  async UPLOAD_FILE_TO_VAULT_HUB_FOLDER(filePath: string[], file: string, downloadsPath: string) {
    Log.info('Creating folder in vault hub');
    await this.myVault.UPLOAD_FILE_TO_MY_VAULT(filePath, false);
    await this.VALIDATE_COLUMNS_FILES_INSIDE_FOLDER();
    await this.VALIDATE_FILE_VISIBLE_IN_VAULT_HUB_FOLDER([file]);
  };

  async DELETE_FOLDER_IN_FOLDER() {
    const vaultBreadCrumb = this.page.locator('mq-breadcrumb div[class="mq-breadcrumb__row"] div a').nth(1);
    await this.performClick(vaultBreadCrumb);
    await this.waitForElement(this.searchFileFolders)
  }

  async VALIDATE_VAULT_HUB_VALID_PAGINATION() {
    await this.validatePaginationInFile(VAULT_HUB_TABLE)
  }

  async VALIDATE_VAULT_HUB_INVALID_INPUT() {
    await this.validateInvalidPage(VAULT_HUB_TABLE);
  }

  async VALIDATE_RECORDS_SELECTED(OPTION) {
    await this.validateRecordsSelected(VAULT_HUB_TABLE, OPTION)
  }

  async SHARE_VAULT(user: string) {
    Log.info('SHARING VAULT');
    await this.performClick(this.knowMoreBtn);
    await this.page.waitForLoadState('load');
    await this.performClick(this.shareBtn)
    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(1000);
    await this.assertVisible(this.shareSearchBox)
    await this.page.waitForTimeout(2000);
    await this.fillInput(this.shareSearchBox, 'test-automation');
    await this.page.waitForTimeout(2000);
    await this.waitForElement(this.page.locator(`//span[contains(text(), "${user}")]/following::mq-checkbox[1]`).first());
    await this.page.locator(`//span[contains(text(), "${user}")]/following::mq-checkbox[1]`).first().click();
    await this.page.waitForTimeout(2000); 
    await this.performClick(this.selectBtn)
    await this.page.waitForTimeout(1000);
    await this.performClick(this.shareBtnInPopup);
    await this.page.waitForTimeout(2000);  
  }
}
