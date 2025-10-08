import { expect, Locator } from "@playwright/test";
import { BaseClass } from "../../config/BaseClass";
import { Log } from "../../utils/Log";
import { myVault } from "../MyVault/myVault";
import { folder } from "../MyVault/folder";

export class RecycleBin extends BaseClass {
    readonly myVaultPage = new myVault(this.page);
    readonly folderPage = new folder(this.page);

    readonly recycleBinLinkInLeftNav = this.page.getByRole('link', { name: 'Recycle Bin' });
    readonly searchBar = this.page.getByRole('textbox', { name: 'search', exact: true });
    readonly filesTable = this.page.locator('app-recycle-bin-list-view-files table');
    readonly foldersTable = this.page.locator('app-recycle-bin-list-view-folder table');
    readonly fileNameInResults = (fileName: string) =>
    this.page
      .locator('[data-test="list-view-table"]')
      .getByRole('link', { name: `${fileName}` });
    readonly activitiesBtn = (fileName: string) =>
    this.page
      .locator('app-recycle-bin-list-view-files table tr[mq-row]')
      .filter({ hasText: fileName })
      .locator('[aria-label="Activities"]');
    readonly fileRowInMyVault = (fileName: string) =>
    this.page
      .locator('app-recycle-bin-list-view-files table tr[mq-row]')
      .filter({ hasText: fileName })
      .first();
    readonly folderRowInMyVault = (folderName: string) =>
    this.page
      .locator('app-recycle-bin-list-view-folder table tr[mq-row]')
      .filter({ hasText: folderName })
      .first();
    readonly restoreOption = this.page.getByRole('menuitem', { name: 'Restore' });
    readonly restoreBtnInPopup = this.page.getByRole('button', { name: 'Restore' });


    async NAV_TO_RECYCLE_BIN() {
        Log.info('Navigating to Recycle Bin');
        await this.performClick(this.recycleBinLinkInLeftNav);
        await this.assertVisible(this.filesTable);
        await this.assertVisible(this.foldersTable);
        await this.assertVisible(this.searchBar);
    };

    async VALIDATE_DELETED_FILES_IN_MY_VAULT([FILE_NAME]) {
        Log.info('Validating if deleted files are appeared in Files table');
        const totalPagesBeforeDelete: number = (await this.totalRecordsInMyVault('app-recycle-bin-list-view-files')).valueOf();
        Log.info('Records in file table before delete ' + totalPagesBeforeDelete)
        try {
            await this.myVaultPage.DELETE_FILE([FILE_NAME]);
        } catch (error) {
            Log.info('File not present in Files folder to delete' + error);
        }
        // Upload file from test-data folder
        await this.myVaultPage.NAV_TO_MY_VAULT();
        await this.myVaultPage.UPLOAD_FILE_TO_MY_VAULT([
        `/src/test-data/MyVault/${FILE_NAME}`,
        ]);
        await this.myVaultPage.DELETE_FILE([FILE_NAME]);
        await this.NAV_TO_RECYCLE_BIN();
        const totalPagesAfterDelete = await this.totalRecordsInMyVault('app-recycle-bin-list-view-files');
        Log.info('Records in file table after delete ' + totalPagesAfterDelete);
        expect(totalPagesAfterDelete).toBeGreaterThan(totalPagesBeforeDelete)
    };

    async clickActivities(fileRow: Locator, fileName: string) {
        const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
        Log.info('CLICKING ON ACTIVITIES for ' + nameWithoutExtension);
        // await this.waitForElement(fileRow);
        // await this.activitiesBtn(nameWithoutExtension).first().click();
        await this.page.locator(`//app-recycle-bin-list-view-files//span[contains(text(), "${fileName}")]/following::app-icon[1]`).first().click();
    }

    async VALIDATE_RESTORE_FILE(fileName) {
        Log.info('Performing Restore files functionality');
        Log.info('Searching file ' + fileName);
        const fileWithoutExtension = await this.REMOVE_FILE_EXTENSION(fileName)
        await this.fillInput(this.searchBar, fileWithoutExtension);
        await this.page.waitForTimeout(1000);
        await this.clickActivities(this.fileRowInMyVault(fileWithoutExtension), fileWithoutExtension);
        await this.waitForElement(this.restoreOption);
        await this.performClick(this.restoreOption);
        await this.waitForElement(this.restoreBtnInPopup);
        await this.performClick(this.restoreBtnInPopup);
        await this.myVaultPage.NAV_TO_MY_VAULT();
        await this.myVaultPage.searchFile(fileWithoutExtension);
        await this.myVaultPage.DELETE_FILE([fileName]);
    }

    async VALIDATE_DELETED_FOLDER_IN_MY_VAULT() {
        Log.info('Validating if deleted files are appeared in Files table');
        const totalPagesBeforeDelete: number = (await this.totalRecordsInMyVault('app-recycle-bin-list-view-folder')).valueOf();
        Log.info('Records in folder table before delete ' + totalPagesBeforeDelete)
        try {
            await this.myVaultPage.NAV_TO_MY_VAULT();
            await this.folderPage.DELETE_FOLDER('RootFolder');
        } catch (error) {
            Log.info(
                'Folder which is going to automate is not already created' + error,
            );
        }
        await this.folderPage.CREATE_FOLDER('RootFolder');
        await this.myVaultPage.NAV_TO_MY_VAULT()
        await this.folderPage.DELETE_FOLDER('RootFolder');
        await this.NAV_TO_RECYCLE_BIN();
        await this.page.reload();
        const totalPagesAfterDelete = await this.totalRecordsInMyVault('app-recycle-bin-list-view-folder');
        Log.info('Records in folder table after delete ' + totalPagesAfterDelete);
        expect(totalPagesAfterDelete).toBeGreaterThan(totalPagesBeforeDelete)
    }

    async VALIDATE_RESTORE_FOLDER() {
        Log.info('Performing Restore folder functionality');
        Log.info('Searching folder ');
        await this.fillInput(this.searchBar, 'RootFolder');
        await this.page.waitForTimeout(1000);
        await this.page.locator(`//app-recycle-bin-list-view-folder//span[contains(text(), "RootFolder")]/following::app-icon[1]`).first().click();
        await this.waitForElement(this.restoreOption);
        await this.performClick(this.restoreOption);
        await this.waitForElement(this.restoreBtnInPopup);
        await this.performClick(this.restoreBtnInPopup);
        await this.myVaultPage.NAV_TO_MY_VAULT();
        await this.myVaultPage.searchFile('RootFolder');
        await this.folderPage.DELETE_FOLDER('RootFolder');
    }
}