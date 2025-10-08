import { EnvConfig } from "../../../../../config/EnvConfig";
import { test } from "../../../../../hooks/hooks";
import { HomePage } from "../../../../../pages/HomePage/HomePage";
import { LoginPage } from "../../../../../pages/Login/loginPage";
import { VaultHub } from "../../../../../pages/Vault_Hub/VaultHub";
import { sharedVault } from "../../../../../pages/SharedVault/sharedVault";
import * as fs from 'fs';
import { Log } from "../../../../../utils/Log";

test('@Sanity Shared Vault -> Validate if user is able to see the shared vaults in the shared vaults section', async ({ page }, testInfo) => {
    const downloadsPath = testInfo.outputPath('downloads');
    fs.mkdirSync(downloadsPath, { recursive: true });
    const loginPage = new LoginPage(page);
    const vaultHub = new VaultHub(page);
    const homePage = new HomePage(page);
    const sharedVaultPage = new sharedVault(page);
    await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
      EnvConfig.admin_username,
      EnvConfig.admin_password,
    );
    await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
    const vaultName = await vaultHub.CREATE_VAULT_HUB();
    Log.info('Vault Name: ' + vaultName);
    await vaultHub.createVaultHubButton.isVisible();
    await vaultHub.SHARE_VAULT(EnvConfig.std_username);
    //Logout from admin account
    await loginPage.LOGOUT();
    //Login with standard user
    await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
      EnvConfig.std_username,
      EnvConfig.std_password,
    );
    await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
    await sharedVaultPage.NAV_TO_SHARED_VAULT();
    await sharedVaultPage.VALIDATE_SHARED_VAULT(vaultName);
})