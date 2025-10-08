import { EnvConfig } from '../../../../../config/EnvConfig';
import { test } from '../../../../../hooks/hooks';
import { ContentRequest } from '../../../../../pages/ContentRequest/contentRequest';
import { LoginPage } from '../../../../../pages/Login/loginPage';
import fs from 'fs';
import { myVault } from '../../../../../pages/MyVault/myVault';
import { Log } from '../../../../../utils/Log';
import { HomePage } from '../../../../../pages/HomePage/HomePage';
import { VaultHub } from '../../../../../pages/Vault_Hub/VaultHub';

const FILE_NAME = 'ID Card_6_CR.pdf';

test.beforeEach('Login step', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const CR_Page = new ContentRequest(page);
  const homePage = new HomePage(page)
  await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
    EnvConfig.admin_username,
    EnvConfig.admin_password,
  );
  await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
});

test.describe('Content-Request functionalities', async () => {
  test('Validate if CR is created when a file is uploaded', async ({
    page,
  }) => {
    const CR_Page = new ContentRequest(page);
    const myVaulPage = new myVault(page);
    try {
      await myVaulPage.NAV_TO_MY_VAULT();
      await myVaulPage.DELETE_FILE([FILE_NAME]);
    } catch (error) {
      Log.info('error');
    }
    await CR_Page.NAV_TO_CR();
    await CR_Page.VALIDATE_CR_CREATED_FOR_FILE_UPLOAD(
      `/src/test-data/ContentRequest/${FILE_NAME}`,
    );
    await myVaulPage.NAV_TO_MY_VAULT();
    await myVaulPage.DELETE_FILE([FILE_NAME]);
  });

  test('Validate if CR is created when user performs download file operation', async ({
    page,
  }, testInfo) => {
    const CR_Page = new ContentRequest(page);
    const myVaulPage = new myVault(page);
    const downloadsPath = testInfo.outputPath('downloads');
    fs.mkdirSync(downloadsPath, { recursive: true });
    await CR_Page.NAV_TO_CR();
    await CR_Page.VALIDATE_CR_CREATED_FOR_FILE_DOWNLOAD(
      `/src/test-data/ContentRequest/${FILE_NAME}`,
      downloadsPath,
    );
    await myVaulPage.NAV_TO_MY_VAULT();
    await myVaulPage.DELETE_FILE([FILE_NAME]);
  });
});

test.describe('Content Request -> Pagination functionalities', async () => {
    test('Valid input & Invalid input & Records selected functionality', async ({page}) => {
      const CR_Page = new ContentRequest(page);
      await CR_Page.NAV_TO_CR();
      const vaultHub = new VaultHub(page);
      const noResultVisible = await vaultHub.noResultsInVaultHub.isVisible();
      if (!noResultVisible) {
        await CR_Page.VALIDATE_CI_VALID_PAGINATION();
        await CR_Page.VALIDATE_CI_INVALID_INPUT();
        await CR_Page.VALIDATE_RECORDS_SELECTED(10);
        await CR_Page.VALIDATE_RECORDS_SELECTED(15);
        await CR_Page.VALIDATE_RECORDS_SELECTED(25);
        await CR_Page.VALIDATE_RECORDS_SELECTED(50);
        await CR_Page.VALIDATE_RECORDS_SELECTED(100);
      } else {
        test.skip();
      }
      
    });
})