import { EnvConfig } from '../../../../../config/EnvConfig';
import { test } from '../../../../../hooks/hooks';
import { HomePage } from '../../../../../pages/HomePage/HomePage';
import { LoginPage } from '../../../../../pages/Login/loginPage';
import { myVault } from '../../../../../pages/MyVault/myVault';
import { Log } from '../../../../../utils/Log';
import { VaultHub } from '../../../../../pages/Vault_Hub/VaultHub';
import fs from 'fs';

const FILE_NAME = 'ID Card_6_MyVault.pdf';
const FILE_NAME_2 = '10681_2.jpeg';

test.beforeEach('Login step', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const myVaultPage = new myVault(page);
  const homePage = new HomePage(page)
  await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
    EnvConfig.admin_username,
    EnvConfig.admin_password,
  );
  await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
  await myVaultPage.NAV_TO_MY_VAULT();
});

test.describe('Verify that when a user uploads a file without selecting a dedicated folder, it is uploaded directly under "My Vault" as an immediate child and appears in the Files list view on the My Vault landing page.', async () => {
  test.describe('Verify that all actions - Preview, Download, Unzip, Open, Download, Change file directory, Content action, Share and Delete—can be performed successfully on files in the "My Vault" section and that all associated features function as expected.', async () => {
    test.describe('Verify that clicking on the "My Vault" option in the left navigation bar navigates the user to the My Vault details page, which displays the Files List View and Folders List View as primary sections, and ensure that the "My Vault" option is available for all users.', async () => {
      test.describe('Verify that upon accessing the files section, the user sees the following columns for uploaded files: Name, Assigned To, Extension, Created By, Uploaded On, and File Size', async () => {
        test('@Sanity Create, View, Perform operations like Preview, OpenFile, ChangeCategory, Share, Delete files in My Vault', async ({
          page,
        }, testInfo) => {
          const downloadsPath = testInfo.outputPath('downloads');
          fs.mkdirSync(downloadsPath, { recursive: true });
          const myVaultPage = new myVault(page);
          try {
            await myVaultPage.DELETE_FILE([FILE_NAME]);
          } catch (error) {
            Log.info('File not present in Files folder to delete' + error);
          }
          // Upload file from test-data folder
          await myVaultPage.UPLOAD_FILE_TO_MY_VAULT([
            `/src/test-data/MyVault/${FILE_NAME}`,
          ]);
          await myVaultPage.VALIDATE_MY_VAULT_SCREEN();
          await myVaultPage.VALIDATE_COLUMNS_IN_FILE_SECTION();
          // Validate if uploaded file is visible in MyVault screen
          await myVaultPage.VALIDATE_FILE_VISIBLE_IN_MY_VAULT([FILE_NAME]);
          // Validate if uploaded file is visible in Left nav
          await myVaultPage.VALIDATE_FILE_IN_LEFT_NAV(FILE_NAME);
          await myVaultPage.VALIDATE_PREVIEW_FUNCTIONALITY(FILE_NAME);
          await myVaultPage.VALIDATE_OPEN_FILE_FUNCTIONALITY(FILE_NAME);
          await myVaultPage.VALIDATE_CHANGE_CATEGORY(FILE_NAME);
          await myVaultPage.VALIDATE_DOWNLOAD_FUNCTIONALITY(
            FILE_NAME,
            downloadsPath,
          );
          await myVaultPage.VALIDATE_RENAME_FUNCTIONALITY(FILE_NAME);
          await myVaultPage.VALIDATE_FAV_FUNCTIONALITY(FILE_NAME);
        });
      });
    });

    // test('Validate Content actions for uploaded file', async ({ page }) => {
    //   const myVaultPage = new myVault(page);
    //   try {
    //     await myVaultPage.DELETE_FILE([FILE_NAME, FILE_NAME_2]);
    //   } catch (error) {
    //     Log.info('File not present in Files folder to delete' + error);
    //   }
    //   await myVaultPage.UPLOAD_FILE_TO_MY_VAULT([
    //     `/src/test-data/MyVault/${FILE_NAME}`,
    //     `/src/test-data/MyVault/${FILE_NAME_2}`,
    //   ]);
    //   await myVaultPage.VALIDATE_FILE_VISIBLE_IN_MY_VAULT([
    //     FILE_NAME,
    //     FILE_NAME_2,
    //   ]);
    //   await myVaultPage.VALIDATE_MERGE_DOCUMENTS(FILE_NAME, FILE_NAME_2);
    // });

    test('Valid input & Invalid input & Records selected functionality', async ({page}) => {
      const myVaultPage = new myVault(page);
      const vaultHub = new VaultHub(page);
      const noResultVisible = await page.locator('app-list-view-file [data-test="list-view-empty-state-title"]')
        .isVisible();
      if (noResultVisible) {
        await myVaultPage.VALIDATE_FILE_VALID_PAGINATION();
        await myVaultPage.VALIDATE_FILE_INVALID_INPUT();
        await myVaultPage.VALIDATE_RECORDS_SELECTED(10);
        await myVaultPage.VALIDATE_RECORDS_SELECTED(15);
        await myVaultPage.VALIDATE_RECORDS_SELECTED(25);
        await myVaultPage.VALIDATE_RECORDS_SELECTED(50);
        await myVaultPage.VALIDATE_RECORDS_SELECTED(100);
      } else {
        Log.info('No results found in File section');
      }
    });
  });
});
