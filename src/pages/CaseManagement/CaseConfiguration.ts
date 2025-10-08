import { expect } from "playwright/test";
import { BaseClass } from "../../config/BaseClass";
import { Log } from "../../utils/Log";
import { HomePage } from "../HomePage/HomePage";

export class CaseConfiguration extends BaseClass {

    readonly homePage = new HomePage(this.page);

    readonly caseTypeHeader = this.page.locator('app-list-header').getByText('Case Type');
    readonly searchCaseType = this.page.locator('app-list-header').getByRole('textbox', { name: 'Search' });
    readonly createNewCaseTypeBtn = this.page.getByRole('button', { name: 'Create New' });
    readonly caseRefreshBtn = this.page.getByRole('button', { name: 'refresh' });
    readonly columnsInTable = this.page.locator('app-case-type table th span[mq-tooltip]');
    readonly createNewCaseTypeInDropdown = this.page.getByRole('menuitem', { name: 'Create New Case Type' });
    readonly importBtnInDropdown = this.page.getByRole('menuitem', { name: 'Import' });
    
    async NAV_TO_CASETYPE() {
        Log.info('NAVIGATING TO CASE PAGE');
        if (!(this.page.url().includes('case-type'))) {
            await this.homePage.NAV_TO_DASHBOARD();
        }
        await this.navigateToLinkInSidekick('Case Type');
        await this.assertURLContains('case-type', 80000);
        await this.page.waitForLoadState('networkidle');
        await this.assertVisible(this.caseTypeHeader);
    };

    async VALIDATE_CASETYPE_LANDING_SCREEN() {
        Log.info('Validating case type landing screen');
        await this.assertVisible(this.caseTypeHeader);
        await this.assertVisible(this.searchCaseType);
        await this.assertVisible(this.createNewCaseTypeBtn);
        await this.assertVisible(this.caseRefreshBtn);
    };

    async VALIDATE_COLUMNS_IN_TABLE() {
        Log.info('Validating columns in table');
        await expect(this.columnsInTable.nth(0)).toHaveText('Case Type');
        await expect(this.columnsInTable.nth(1)).toHaveText('Description');
        await expect(this.columnsInTable.nth(2)).toHaveText('Created By');
        await expect(this.columnsInTable.nth(3)).toHaveText('Created At');
    };


}