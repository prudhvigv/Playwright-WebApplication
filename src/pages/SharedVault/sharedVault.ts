import { BaseClass } from "../../config/BaseClass";
import { Log } from "../../utils/Log";

export class sharedVault extends BaseClass {

    readonly sharedVaultName = (name: string) => this.page.getByRole('link', { name: name }).first();
    
    async NAV_TO_SHARED_VAULT() {
        Log.info('NAVIGATING TO Shared VAULT ');
        await this.navigateToLinkInSidekick('Shared Vaults');
        await this.assertURLContains('shared-vaults', 80000);
        Log.info('Navigated to Shared Vault');
    };

    async VALIDATE_SHARED_VAULT(vaultName: string) {
        Log.info(`VALIDATING IF ${vaultName} IS VISIBLE IN SHARED VAULT`);
        await this.waitForElement(this.sharedVaultName(vaultName));
        await this.assertVisible(this.sharedVaultName(vaultName));
    }


}