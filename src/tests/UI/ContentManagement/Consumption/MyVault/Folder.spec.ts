import { test } from '../../../../../hooks/hooks';
import { EnvConfig } from '../../../../../config/EnvConfig';
import { folder } from '../../../../../pages/MyVault/folder';
import { myVault } from '../../../../../pages/MyVault/myVault';
import { Log } from '../../../../../utils/Log';
import { LoginPage } from '../../../../../pages/Login/loginPage';
import { HomePage } from '../../../../../pages/HomePage/HomePage';
import { VaultHub } from '../../../../../pages/Vault_Hub/VaultHub';

const FILE_NAME = 'ID Card_1_Folder.pdf';

test.beforeEach('Login step', async ({ page }) => {
  test.setTimeout(120 * 1000)
  const loginPage = new LoginPage(page);
  const myVaultPage = new myVault(page);
  const homePage = new HomePage(page);
  await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
    EnvConfig.admin_username,
    EnvConfig.admin_password,
  );
  await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
  await myVaultPage.NAV_TO_MY_VAULT();
});

test.describe('Verify that all actions - Open,Content action, Share and Delete—can be performed successfully on Folders in the "Vault Hub" section and that all associated features function as expected.', async () => {
  test('Validate columns in Folder table in MyVault', async ({ page }) => {
    const folderPage = new folder(page);
    await folderPage.VALIDATE_COLUMNS_IN_FOLDER_TABLE();
  });
});

test.describe('Verify that the user can view all folders and their corresponding sub-folders up to the last level of the folder hierarchy under the "My Vault" section in the left navigation bar.', async () => {
  test('@Sanity View folder hirarchy in left nav till last folder', async ({
    page,
  }) => {
    const folderPage = new folder(page);
    const myVaultPage = new myVault(page);
    try {
      await folderPage.DELETE_FOLDER('RootFolder');
    } catch (error) {
      Log.info(
        'Folder which is going to automate is not already created' + error,
      );
    }
    // 1. Create root folder
    await folderPage.CREATE_FOLDER('RootFolder');
    await myVaultPage.UPLOAD_FILE_TO_FOLDER([
      `/src/test-data/MyVault/${FILE_NAME}`,
    ]);
    await folderPage.NAVIGATE_TO_FOLDER('RootFolder');
    await folderPage.VALIDATE_FILE_VISIBLE_IN_FOLDER([FILE_NAME]);
    // 2. Navigate into root folder
    await folderPage.NAVIGATE_TO_FOLDER('RootFolder');
    await folderPage.CREATE_FOLDER('SubFolder1');
    // 3. Create sub-folder
    await folderPage.CREATE_FOLDER('SubFolder2');
    // 4. Navigate into sub-folder
    await folderPage.CREATE_FOLDER('SubFolder3');
    // 6. Validate hierarchy in left nav
    await folderPage.VALIDATE_FOLDER_HIERARCHY([
      'RootFolder',
      'SubFolder1',
      'SubFolder2',
    ]);
    // Deleting root folder
    await myVaultPage.NAV_TO_MY_VAULT();
    await folderPage.DELETE_FOLDER('RootFolder');
    try {
      const loginPage = new LoginPage(page);
      await loginPage.LOGOUT(); // You need to implement this method in your LoginPage
    } catch (err) {
      console.warn('⚠️ Logout failed or not applicable for this test.');
    }
  });

  test.describe('Verify that all actions - Open,Content action, Share and Delete—can be performed successfully on Folders in the "Vault Hub" section and that all associated features function as expected.', async () => {
    test('@Sanity Validate open, Share and Content action options for FOLDER', async ({
      page,
    }) => {
      const folderPage = new folder(page);
      const myVaultPage = new myVault(page);
      try {
        await folderPage.DELETE_FOLDER('RootFolder');
      } catch (error) {
        Log.info(
          'Folder which is going to automate is not already created' + error,
        );
      }
      await folderPage.CREATE_FOLDER('RootFolder');
      await myVaultPage.NAV_TO_MY_VAULT();
      await folderPage.VALIDATE_OPEN_FOLDER_FUNCTIONALITY('RootFolder');
      await folderPage.VALIDATE_SHARE_FOLDER_FUNCTIONALITY('RootFolder');
      await folderPage.VALIDATE_RENAME_FOLDER_FUNCTIONALITY('RootFolder');
      await folderPage.DELETE_RENAMED_FOLDER('RootFolder');
      try {
        const loginPage = new LoginPage(page);
        await loginPage.LOGOUT(); // You need to implement this method in your LoginPage
      } catch (err) {
        console.warn('⚠️ Logout failed or not applicable for this test.');
      }
    });
  });

  test.describe('Folder -> Pagination functionalities', async () => {
    test('Valid input & Invalid input & Records selected functionality', async ({page}) => {
      const folderPage = new folder(page);
      const noResultVisible = await page.locator('app-list-view-folder [data-test="list-view-empty-state-title"]').isVisible();

      if (noResultVisible) {
        await folderPage.VALIDATE_FOLDER_VALID_PAGINATION();
        await folderPage.VALIDATE_FOLDER_INVALID_INPUT();
        await folderPage.VALIDATE_RECORDS_SELECTED(10);
        await folderPage.VALIDATE_RECORDS_SELECTED(15);
        await folderPage.VALIDATE_RECORDS_SELECTED(25);
        await folderPage.VALIDATE_RECORDS_SELECTED(50);
        await folderPage.VALIDATE_RECORDS_SELECTED(100);
      }
      try {
        const loginPage = new LoginPage(page);
        await loginPage.LOGOUT(); // You need to implement this method in your LoginPage
      } catch (err) {
        console.warn('⚠️ Logout failed or not applicable for this test.');
      }
    });
  })
});
