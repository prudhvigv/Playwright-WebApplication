import { EnvConfig } from "../../../../../config/EnvConfig";
import { test } from "../../../../../hooks/hooks";
import { HomePage } from "../../../../../pages/HomePage/HomePage";
import { LoginPage } from "../../../../../pages/Login/loginPage";
import { myVault } from "../../../../../pages/MyVault/myVault";
import { RecycleBin } from "../../../../../pages/RecycleBin/recycle-bin";

const FILE_NAME = 'ID Card_1_RecycleBin.pdf';

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

test.describe('RecycleBin', async () => {
    test('@Sanity Validate if files deleted from My Vault is moved to Recycle Bin and restored functionality', async ({ page }) => {
        const recycleBin = new RecycleBin(page);
        await recycleBin.NAV_TO_RECYCLE_BIN();
        await recycleBin.VALIDATE_DELETED_FILES_IN_MY_VAULT([FILE_NAME]);
        await recycleBin.VALIDATE_RESTORE_FILE(FILE_NAME);
    });

    test('Validate if folders deleted from My Vault is moved to Recycle Bin and restored functionality', async ({ page }) => {
        const recycleBin = new RecycleBin(page);
        await recycleBin.NAV_TO_RECYCLE_BIN();
        await recycleBin.VALIDATE_DELETED_FOLDER_IN_MY_VAULT();
        await recycleBin.VALIDATE_RESTORE_FOLDER();
    });

    
})