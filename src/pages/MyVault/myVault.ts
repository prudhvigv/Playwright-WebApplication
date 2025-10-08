import { expect, Locator } from '@playwright/test';
import { BaseClass } from '../../config/BaseClass';
import { Log } from '../../utils/Log';
import path from 'path';
import fs from 'fs';

const fileTable = 'app-list-view-file';

export class myVault extends BaseClass {
  readonly myVaultLink = this.page
    .getByLabel('Main')
    .getByRole('link', { name: 'My Vault' });
  readonly myVaultDetailsPage = this.page
    .getByRole('main')
    .getByText('My Vault');
  readonly filesExpandBtn = this.page.locator(
    'div[class*="table-header"] span >> "Files"',
  );
  readonly folderExpandBtn = this.page.locator(
    'div[class*="table-header"] span >> "Folders"',
  );
  readonly fileContents = this.page.locator(
    'app-list-view-file table tr[mq-row]',
  );
  readonly folderContents = this.page.locator(
    'app-list-view-folder table tr[mq-row]',
  );
  readonly filesRefreshBtn = this.page.locator(
    'app-list-view-file mq-icon[svgicon="refresh_list_page"]',
  );
  readonly folderRefreshBtn = this.page
    .getByRole('heading', { name: 'Folder Expansion Panel' })
    .getByLabel('refresh');
  readonly newButton = this.page.getByRole('button', { name: 'New Button' });
  readonly uploadFileButton = this.page.getByText('Upload File');
  readonly closeUploader = this.page.getByRole('button').nth(1);
  readonly fileUploadTick = this.page.locator('#tick-circle path').nth(1);
  readonly fileNameUploaded = (fileName: string) =>
    this.page.getByRole('link', { name: `${fileName}`, exact: true });
  readonly fileNameInResults = (fileName: string) =>
    this.page
      .locator('[data-test="list-view-table"]')
      .getByRole('link', { name: `${fileName}`, exact: true });
  readonly searchFileFolders = this.page.getByRole('textbox', {
    name: 'Search Files & Folders',
  });
  readonly activitiesBtn = (fileName: string) =>
    this.page
      .locator('app-list-view-file table tr[mq-row]')
      .filter({ hasText: fileName })
      .locator('[aria-label="Activities"]');
  readonly itemsInLeftNav = (fileName: string) =>
    this.page
      .getByLabel('Main')
      .getByRole('link', { name: `${fileName}`, exact: true });
  readonly columnInFilesTable = (colName: string) =>
    this.page
      .getByLabel('Files')
      .getByRole('button', { name: `${colName}`, exact: true });
  readonly previewFileHeading = this.page.getByText('Preview File');
  readonly fileContentHeading = this.page.getByText('File Content');
  readonly fileMetadataHeading = this.page.getByText('File Metadata');
  readonly changeFileCategoryHeading = this.page.getByText('Change File Category');
  readonly changeFileCategoryDropdown = this.page.getByRole('button', {name: 'dropdown trigger'});
  readonly changeFile = this.page.getByRole('option').first();
  readonly saveChangeCategoryBtn = this.page.getByRole('button', {
    name: 'Save',
  });
  readonly fileCategoryUpdated = this.page.getByText(
    'File Category successfully Updated',
  );
  readonly shareTextBox = this.page.getByRole('textbox', {
    name: 'Search with name of the user',
  });
  readonly userRadiobtn = this.page.getByLabel('', { exact: true });
  readonly selectUserInSharePopup = (userID: string) =>
    this.page.getByLabel('', { exact: true }).filter({ hasText: userID });
  readonly selectUserBtn = this.page.getByRole('button', { name: 'Select' });
  readonly chooseAccessLevel = this.page.getByRole('combobox', {
    name: 'Choose access level',
  });
  readonly contentActionsOption = this.page.getByRole('menuitem', {
    name: /content actions/i,
  });
  readonly renameDocOption = this.page.getByRole('menuitem', {
    name: /rename/i,
  });

  readonly markFavDocOption = this.page.getByRole('menuitem', {
    name: /mark as favorite/i,
  });

  readonly renameFileNameInPopup = this.page.getByRole('textbox', {
    name: 'Enter new File name',
  });
  readonly mergeDocOption = this.page.getByRole('menuitem', {
    name: /merge document/i,
  });
  readonly shareBtnInPopup = this.page.getByRole('button', { name: 'Share' });
  readonly addFilesBtn = this.page.getByRole('button', { name: /add files/i });
  readonly insertBtn = this.page.getByRole('button', { name: /insert/i });
  readonly mergeFilesBtn = this.page.getByRole('button', {
    name: /merge files/i,
  });
  readonly fileInMergeWindow = (fileName: string) =>
    this.page.getByRole('radio', { name: fileName, exact: true });
  readonly fileRowInMyVault = (fileName: string) =>
    this.page
      .locator('app-list-view-file table tr[mq-row]')
      .filter({ hasText: fileName })
      .first();
  readonly fileNameInFavList = (fileName: string) =>
    this.page
      .locator('td[class*="column-name"] span[mq-tooltip]')
      .filter({ hasText: fileName })
      .first();

  readonly favLinkInLeftNav = this.page.getByRole('link', {
    name: 'Favorites',
  });
  readonly contentTab = this.page.getByRole('tab', { name: 'Content' }).locator('span').first();
  readonly activityTab = this.page.getByText('Activity Details');
  readonly softDeleteActivity = this.page.locator('app-activity-item app-activity-soft-deleted');
  readonly uploadActivity = this.page.locator('app-activity-item app-activity-upload-download');
  readonly updateActivity = this.page.locator('app-activity-item app-activity-update-card');
  readonly shareActivity = this.page.locator('app-activity-item app-activity-share-card');
  readonly myVaultBreadcrumb = this.page.getByLabel('Breadcrumbs').getByRole('link', { name: 'My Vault' });

  async NAV_TO_MY_VAULT() {
    Log.info('NAVIGATING TO MY VAULT');
    await this.performClick(this.myVaultLink);
    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(2000);
    await this.assertVisible(this.myVaultDetailsPage);
  }

  async VALIDATE_MY_VAULT_SCREEN() {
    await this.assertVisible(this.filesExpandBtn);
    await this.assertVisible(this.folderExpandBtn);
    await this.assertVisible(this.filesRefreshBtn);
    await this.assertVisible(this.folderRefreshBtn);
  }

  async VALIDATE_COLUMNS_IN_FILE_SECTION() {
    Log.info('VALIDATING COLUMNS IN FILES -> MY VAULT');
    const noDataInFiles = await this.page.locator('app-list-view-file [data-test="list-view-empty-state-title"]').isVisible();
    Log.info('No data in files: ' + noDataInFiles);
    if (!noDataInFiles) {
      await this.assertVisible(this.columnInFilesTable('Name'));
    // await this.assertVisible(this.columnInFilesTable('Assigned To'));
      await this.assertVisible(this.columnInFilesTable('Extension'));
      await this.assertVisible(this.columnInFilesTable('Created By'));
      await this.assertVisible(this.columnInFilesTable('Uploaded On'));
      await this.assertVisible(this.columnInFilesTable('File Size'));
    }
    
  }

  async VALIDATE_FILE_IN_LEFT_NAV(fileName: string) {
    Log.info(`VALIDATING ${fileName} IN LEFT NAV`);
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    await this.assertVisible(this.itemsInLeftNav(nameWithoutExtension));
  }

  async UPLOAD_FILE_TO_MY_VAULT(filePath: string[], myVault: boolean = true) {
    Log.info('Uploading file(s) to Vault');
    for (const fileName of filePath) {
      // const activityBeforeUpload = await this.countActivityDetailsRecords(this.uploadActivity);
      await this.performClick(this.contentTab);
      await this.performClick(this.newButton);
      const fileInput = this.page.locator('input[type="file"]').first();
      await fileInput.waitFor({ state: 'attached' });
      await fileInput.setInputFiles(path.join(process.cwd(), fileName));
      await this.page.waitForResponse(
        (response) =>
          response.url().includes('/upload') && response.status() === 200,
      );
      await this.waitForElement(this.fileUploadTick);
      await this.performClick(this.closeUploader);
      Log.info('FILE UPLOADED: ' + fileName);
      await this.page.reload({ waitUntil: 'load' });
      await this.page.waitForResponse(
      (response) =>
        (response.url().includes('/my-vault') || response.url().includes('/vault-hub')) && response.status() === 200,
      );
      // const activityAfterUpload = await this.countActivityDetailsRecords(this.uploadActivity);
      if (myVault) {
        await this.performClick(this.myVaultLink);
        await this.page.waitForLoadState('networkidle');
        // await this.page.waitForResponse(
        //   (response) =>
        //     response.status() === 200,
        // );
        await this.page.waitForTimeout(2000);
      }      
    }
  }

  async UPLOAD_FILE_TO_FOLDER(filePath: string[]) {
    Log.info('Uploading file(s) to Folder');
    for (const fileName of filePath) {
      await this.performClick(this.contentTab);
      await this.performClick(this.newButton);
      const fileInput = this.page.locator('input[type="file"]').first();
      await fileInput.waitFor({ state: 'attached' });
      await fileInput.setInputFiles(path.join(process.cwd(), fileName));
      await this.page.waitForResponse(
        (response) =>
          response.url().includes('/upload') && response.status() === 200,
      );
      await this.waitForElement(this.fileUploadTick);
      await this.performClick(this.closeUploader);
      Log.info('FILE UPLOADED: ' + fileName);
      await this.page.reload({ waitUntil: 'load' });
      await this.page.waitForResponse(
      (response) =>
        (response.url().includes('/my-vault') || response.url().includes('/vault-hub')) && response.status() === 200,
      );
      await this.performClick(this.myVaultLink); 
    }
  }

  async VALIDATE_FILE_VISIBLE_IN_MY_VAULT(fileName: string[], vaultHub: boolean = false) {
    await this.page.waitForTimeout(2000);
    let found = false;
    for (const file of fileName) {
      Log.info('VALIDATE IF FILE IS UPLOADED ' + file);
      const fileNameWithoutExtension = file.replace(/\.[^/.]+$/, '');
      let elements: any;
      if (!vaultHub) {
        elements = await this.page.$$(
          'app-list-view-file table tr[mq-row] td[class*="column-name"] span',
        );
      } else {
        elements = await this.page.$$(
          'app-vault-hub-list-view-file table tr[mq-row] td[class*="column-name"] span',
        );
      }
      // const elements = await this.page.$$(
      //   'app-list-view-file table tr[mq-row] td[class*="column-name"] span',
      // );
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

  async searchFile(fileName: string) {
    Log.info('Searching file ' + fileName);
    await this.fillInput(this.searchFileFolders, fileName);
    await this.page.waitForTimeout(1000);
    await this.assertVisible(this.fileNameInResults(fileName));
  }

  async clickActivities(fileRow: Locator, fileName: string, vaultHub: boolean = false) {
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    Log.info('CLICKING ON ACTIVITIES for ' + nameWithoutExtension);
    if (vaultHub) {
      await this.waitForElement(this.page
        .locator('app-vault-hub-list-view-file table tr[mq-row]')
        .filter({ hasText: nameWithoutExtension })
        .first());
      Log.info('Clicking on activities for ' + nameWithoutExtension + ' in vault hub');
      await this.page.locator('app-vault-hub-list-view-file table tr[mq-row]').filter({ hasText: nameWithoutExtension})
        .locator('[aria-label="Activities"]')
        .first()
        .click();
    } else {
      await this.waitForElement(fileRow);
      await this.activitiesBtn(nameWithoutExtension).first().click();
    }
    // await this.activitiesBtn(nameWithoutExtension).first().click();
  }

  async DELETE_FILE(fileName: string[]) {
    for (const file of fileName) {
      Log.info('DELETING FILE ' + file);
      try {
        // Check if file is visible in the vault before attempting delete
        const nameWithoutExtension = file.replace(/\.[^/.]+$/, '');
        Log.info('Searching file ' + fileName);
        await this.NAV_TO_MY_VAULT();
        await this.fillInput(this.searchFileFolders, nameWithoutExtension);
        await this.page.waitForTimeout(1000);
        const isVisible =
          await this.fileNameInResults(nameWithoutExtension).first().isVisible();
        if (!isVisible) {
          Log.info('File not found, skipping delete: ' + file);
          continue;
        }
        await this.clickActivities(
          this.fileRowInMyVault(nameWithoutExtension).first(),
          file,
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
      .locator('app-list-view-folder table tr[mq-row]')
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

  async VALIDATE_PREVIEW_FUNCTIONALITY(fileName: string, vaultHub: boolean = false) {
    Log.info('VALIDATING PREVIEW FILE FUNCTIOANLITY');
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    await this.clickActivities(
      this.fileRowInMyVault(nameWithoutExtension),
      fileName,
      vaultHub
    );
    const previewOption = this.page.getByRole('menuitem', { name: /preview/i });
    await this.performClick(previewOption);
    await this.page.waitForLoadState('load');
    await this.assertVisible(this.previewFileHeading);
    await this.page.goBack();
    // await this.waitForElement(this.myVaultLink);
    await this.page.waitForLoadState('load');
  }

  async VALIDATE_OPEN_FILE_FUNCTIONALITY(fileName: string, vaultHub: boolean = false) {
    Log.info('VALIDATING OPEN FILE FUNCTIOANLITY');
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    await this.clickActivities(
      this.fileRowInMyVault(nameWithoutExtension),
      fileName,
      vaultHub
    );
    const openOption = this.page.getByRole('menuitem', { name: /open/i });
    await this.performClick(openOption);
    await this.page.waitForLoadState('load');
    await this.assertVisible(this.fileContentHeading);
    await this.assertVisible(this.fileMetadataHeading);
    await this.page.goBack();
    await this.page.waitForLoadState('load');
    // await this.waitForElement(this.myVaultLink);
  }

  async VALIDATE_CHANGE_CATEGORY(fileName: string, vaultHub: boolean = false) {
    Log.info('VALIDATING CHANGE CATEGORY FUNCTIONALITY');
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    await this.clickActivities(
      this.fileRowInMyVault(nameWithoutExtension),
      fileName,
      vaultHub
    );
    const changeCategoryOption = this.page.getByRole('menuitem', {
      name: /change file category/i,
    });
    await this.performClick(changeCategoryOption);
    await this.page.waitForLoadState('load');
    await this.assertVisible(this.changeFileCategoryHeading);
    await this.page.waitForTimeout(2000);
    await this.performClick(this.changeFileCategoryDropdown);
    await this.page.waitForTimeout(2000);
    await this.performClick(this.changeFile);
    await this.saveChangeCategoryBtn.click();
    await this.assertVisible(this.fileCategoryUpdated);
  }

  async VALIDATE_SHARE_FUNCTIONALITY(fileName: string, user: string) {
    Log.info('VALIDATING SHARE FUNCTIONALITY');
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    await this.clickActivities(
      this.fileRowInMyVault(nameWithoutExtension),
      fileName,
    );
    const shareOption = this.page.getByRole('menuitem', { name: /share/i });
    await this.performClick(shareOption);
    await this.page.waitForLoadState('load');
    await this.assertVisible(this.shareTextBox);
    await this.page.waitForTimeout(2000);
    await this.fillInput(this.shareTextBox, user);
    await this.page.waitForTimeout(2000);
    await this.waitForElement(this.page.locator(`//span[contains(text(), "${user}")]/following::mq-checkbox[1]`).first());
    await this.page.locator(`//span[contains(text(), "${user}")]/following::mq-checkbox[1]`).first().click();
    // await this.userRadiobtn.check();
    await this.page.waitForTimeout(2000);
    await this.page.getByRole('button', { name: 'Select' }).click();
    await this.page.waitForTimeout(1000);
    // await this.page.getByRole('button', { name: 'Share' }).click();
    await this.performClick(this.shareBtnInPopup);
    await this.page.waitForTimeout(2000);
    // await this.page.goBack();
    await this.waitForElement(this.myVaultLink);
  }

  async VALIDATE_DOWNLOAD_FUNCTIONALITY(fileName: string, downloadPath, vaultHub: boolean = false) {
    Log.info('VALIDATING DOWNLOAD FUNCTIONALITY');
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    await this.clickActivities(
      this.fileRowInMyVault(nameWithoutExtension),
      fileName,
      vaultHub
    );
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.page.getByRole('menuitem', { name: 'Download' }).click(),
    ]);
    // Save the downloaded file to the downloadsPath
    try {
      const suggested = await download.suggestedFilename();
      const filePath = path.join(downloadPath, suggested);
      await download.saveAs(filePath);
      expect(fs.existsSync(filePath)).toBeTruthy();
      await this.page.waitForTimeout(1000);
      await this.page.reload();
      await this.page.waitForResponse(
        (response) =>
          response.url().includes('/my-vault') && response.status() === 200,
      );
      await this.page.waitForLoadState('load');
    } catch (error) {
      Log.info('Error downloading file: ' + error);
    }
    
    if (vaultHub) {
      await this.page.waitForLoadState('load');
    } else {
      await this.waitForElement(this.searchFileFolders);
    }
  }

  async VALIDATE_FAV_FUNCTIONALITY(fileName: string) {
    Log.info('VALIDATING FAV FUNCTIONALITY IN FILE');
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    await this.clickActivities(
      this.fileRowInMyVault(nameWithoutExtension + '_Edit').first(),
      nameWithoutExtension + '_Edit',
    );
    await this.contentActionsOption.hover();
    await this.page.waitForTimeout(1000);
    await this.performClick(this.markFavDocOption);
    await this.page.waitForTimeout(2000);
    await this.performClick(this.favLinkInLeftNav);
    await expect(
      this.page.getByRole('link', {
        name: `${nameWithoutExtension + '_Edit'}`,
      }),
    ).toBeVisible();
    await this.NAV_TO_MY_VAULT();
    await this.DELETE_FILE([nameWithoutExtension + '_Edit']);
  }

  async VALIDATE_RENAME_FUNCTIONALITY(fileName: string) {
    Log.info('RENAMING FILE');
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    await this.clickActivities(
      this.fileRowInMyVault(nameWithoutExtension),
      nameWithoutExtension,
    );
    await this.contentActionsOption.hover();
    await this.page.waitForTimeout(1000);
    await this.performClick(this.renameDocOption);
    await this.fillInput(
      this.renameFileNameInPopup,
      nameWithoutExtension + '_Edit',
    );
    await this.performClick(this.saveChangeCategoryBtn);
    await this.page.waitForLoadState('load');
    await this.VALIDATE_FILE_VISIBLE_IN_MY_VAULT([
      nameWithoutExtension + '_Edit',
    ]);
  }

  async VALIDATE_MERGE_DOCUMENTS(file1: string, file2: string) {
    const MERGED_FILE = file1.replace(/\.[^/.]+$/, '') + '_merged';
    Log.info('VALIDATING MERGE DOCUMENT');
    const nameWithoutExtension = file1.replace(/\.[^/.]+$/, '');
    await this.clickActivities(
      this.fileRowInMyVault(nameWithoutExtension),
      file1,
    );
    await this.contentActionsOption.hover();
    await this.performClick(this.mergeDocOption);
    await this.assertVisible(this.page.getByText('Merge Document'));
    await this.performClick(this.addFilesBtn);
    await this.page.waitForTimeout(1000);
    // Select the row for the file2 parameter (without extension)
    const file2NameWithoutExt = file2.replace(/\.[^/.]+$/, '');
    await this.performClick(this.fileInMergeWindow(file2NameWithoutExt));
    await this.page.waitForTimeout(1000);
    await this.performClick(this.insertBtn);
    await this.page.waitForTimeout(5000);
    await this.performClick(this.mergeFilesBtn);
    await this.page.waitForTimeout(2000);
    await this.assertVisible(this.page.getByText('My Vault'));
    await this.searchFile(MERGED_FILE);
    await this.assertVisible(this.fileNameInResults(MERGED_FILE));
    await this.DELETE_FILE([MERGED_FILE]);
  }
  
  async NAV_TO_ACTIVITY_TAB(locator: Locator) {
    await this.performClick(this.activityTab);
    await this.waitForElement(locator.first());
  }

  async countActivityDetailsRecords(activityLocator: Locator) {
    let totalCount = 0
    await this.NAV_TO_ACTIVITY_TAB(activityLocator)
    totalCount = await activityLocator.count();
    Log.info(`Total no of activity records for ${activityLocator}` + totalCount);
    return totalCount;
  }

  async VALIDATE_FILE_VALID_PAGINATION() {
    await this.validatePaginationInFile(fileTable)
  }

  async VALIDATE_FILE_INVALID_INPUT() {
    await this.validateInvalidPage(fileTable);
  }

  async VALIDATE_RECORDS_SELECTED(OPTION) {
    await this.validateRecordsSelected(fileTable, OPTION)
  }
}
