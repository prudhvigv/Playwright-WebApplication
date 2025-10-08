import { test } from '../../../../../hooks/hooks';
import { LoginPage } from '../../../../../pages/Login/loginPage';
import { VaultHub } from '../../../../../pages/Vault_Hub/VaultHub';
import { EnvConfig } from '../../../../../config/EnvConfig';
import { HomePage } from '../../../../../pages/HomePage/HomePage';
import { Log } from '../../../../../utils/Log';
import fs from 'fs';
import { folder } from '../../../../../pages/MyVault/folder';
import { myVault } from '../../../../../pages/MyVault/myVault';

const FILE_NAME = 'ID Card_6_VaultHub.pdf';

test.describe('Vault Hub', () => {

  let vaultName: string;
  test('@Sanity Verify that clicking on the "Vault Hub" option in the left navigation bar navigates the user to the vault hub page, displaying all vaults in the list view', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const vaultHub = new VaultHub(page);
    const homePage = new HomePage(page);
    await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
      EnvConfig.admin_username,
      EnvConfig.admin_password,
    );
    await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
    await vaultHub.navigateToVaultHub();
    await vaultHub.validateVaultHubListView();
  });

  test('Create Vault in vault hub -> Upload file to vault hub -> Validate options in activities menu -> Delete file from vault hub', async ({
    page,
  }, testInfo) => {
    const downloadsPath = testInfo.outputPath('downloads');
    fs.mkdirSync(downloadsPath, { recursive: true });
    const loginPage = new LoginPage(page);
    const vaultHub = new VaultHub(page);
    const homePage = new HomePage(page);
    await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
      EnvConfig.admin_username,
      EnvConfig.admin_password,
    );
    await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
    vaultName = await vaultHub.CREATE_VAULT_HUB();
    Log.info('Vault Name: ' + vaultName);
    await vaultHub.createVaultHubButton.isVisible();
    await vaultHub.UPLOAD_FILE_TO_VAULT_HUB([
      `/src/test-data/MyVault/${FILE_NAME}`,
    ], FILE_NAME, downloadsPath);
    try {
      await vaultHub.DELETE_FILE([FILE_NAME]);
    } catch (error) {
      Log.info('File not present in Files folder to delete' + error);
    }
  });

  test('Create Folder -> Validate options in activities menu -> Delete file from vault hub', async ({
    page,
  }, testInfo) => {
    const downloadsPath = testInfo.outputPath('downloads');
    fs.mkdirSync(downloadsPath, { recursive: true });
    const loginPage = new LoginPage(page);
    const vaultHub = new VaultHub(page);
    const homePage = new HomePage(page);
    const folderPage = new folder(page);
    await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
      EnvConfig.admin_username,
      EnvConfig.admin_password,
    );
    await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
    const valut = await vaultHub.CREATE_VAULT_HUB();
    Log.info('Vault Name: ' + valut);
    await vaultHub.createVaultHubButton.isVisible();
    try {
      await vaultHub.DELETE_FOLDER('RootFolder');
    } catch (error) {
      Log.info(
        'Folder which is going to automate is not already created' + error,
      );
    }
    // 1. Create root folder
    await folderPage.CREATE_FOLDER('RootFolder');
    await vaultHub.UPLOAD_FILE_TO_VAULT_HUB_FOLDER([
      `/src/test-data/MyVault/${FILE_NAME}`,
    ], FILE_NAME, downloadsPath);
    // 2. Create sub folder under root folder
    await folderPage.CREATE_FOLDER('SubFolder1');
    await vaultHub.DELETE_FOLDER_IN_FOLDER();
    await vaultHub.DELETE_FOLDER('RootFolder');
  });
  test('Verify that on the "Create Vault" page, clicking the "Cancel" button after entering all mandatory details does not save the vault details', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const vaultHub = new VaultHub(page);
    const homePage = new HomePage(page);
    await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
      EnvConfig.admin_username,
      EnvConfig.admin_password,
    );
    await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
    await vaultHub.navigateToVaultHub();
    await vaultHub.VALIDATE_CANCEL_BUTTON_FUNCTIONALITY();
  });

  test('Verify that the refresh icon on the Vault Hub list page updates the page correctly', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const vaultHub = new VaultHub(page);
    const homePage = new HomePage(page);
    await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
      EnvConfig.admin_username,
      EnvConfig.admin_password,
    );
    await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
    await vaultHub.navigateToVaultHub();
    await vaultHub.vaultRefreshButton.click();
    await vaultHub.VALIDATE_REFRESH_ICON_FUNCTIONALITY();
    await vaultHub.assertURLContains('vault-hub', 80000);
  });
});

test.describe('Vault Hub -> Pagination functionalities', async () => {
  test('Valid input & Invalid input & Records selected functionality', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const vaultHub = new VaultHub(page);
    const homePage = new HomePage(page);
    await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
      EnvConfig.admin_username,
      EnvConfig.admin_password,
    );
    await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
    await vaultHub.navigateToVaultHub();

    // Check if NoResult locator is not visible
    const noResultVisible = await vaultHub.noResultsInVaultHub.isVisible();
    if (!noResultVisible) {
      await vaultHub.VALIDATE_VAULT_HUB_VALID_PAGINATION();
      await vaultHub.VALIDATE_VAULT_HUB_INVALID_INPUT();
      await vaultHub.VALIDATE_RECORDS_SELECTED(10);
      await vaultHub.VALIDATE_RECORDS_SELECTED(15);
      await vaultHub.VALIDATE_RECORDS_SELECTED(25);
      await vaultHub.VALIDATE_RECORDS_SELECTED(50);
      await vaultHub.VALIDATE_RECORDS_SELECTED(100);
    } else {
      test.skip();
    }
  });
})
