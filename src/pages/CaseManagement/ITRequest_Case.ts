import { BaseClass } from "../../config/BaseClass";
import { Log } from "../../utils/Log";
import { HomePage } from "../HomePage/HomePage";

export class ITRequestCasePage extends BaseClass{
    
    readonly homePage = new HomePage(this.page);

    readonly caseTypeInDropdown = (caseName: string) => this.page.getByRole('menuitem', { name: caseName });
    readonly itRequestForField = this.page.locator('div[aria-label*="for"]')
    readonly searchField = this.page.getByLabel('Search', { exact: true });
    readonly userInDropdown = (user: string) => this.page.getByRole('option', { name: user }).first();
    readonly departmentDropdown = this.page.getByRole('combobox', { name: 'Department' });
    readonly departmentInDropdown = (department: string) => this.page.getByText(department).first();
    readonly beginApplicationButton = this.page.getByRole('button', { name: 'Begin Application' });
    readonly caseTab = this.page.getByRole('tab', { name: 'Case' });
    readonly caseJourneyTab = (journey: string) => this.page.locator('app-cmm-steps div').filter({ hasText: journey }).nth(1)
    readonly editJourneyBtn = this.page.getByRole('button', { name: 'Edit' });
    readonly generateDocBtn = this.page.getByRole('button', { name: 'Generate Document' });
    readonly caseTypeInSideKick = (caseName: string) => this.page.getByRole('link', { name: caseName }).first();
    readonly createNewCaseButton = this.page.locator('app-list-header').getByRole('button', { name: 'Create New' })

    
    async CREATE_NEW_CASE(caseType: string, user: string, department: string) {
        Log.info(`Creating new case with type: ${caseType}`);
        await this.homePage.SELECT_APP_TO_CASE_MANAGEMENT();
        await this.homePage.performClick(this.homePage.createCaseButton);
        await this.page.waitForLoadState('load');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await this.waitForElement(this.caseTypeInDropdown(caseType));
        await this.performClick(this.caseTypeInDropdown(caseType));
        await this.performClick(this.itRequestForField);
        await this.performClick(this.searchField);
        await this.fillInput(this.searchField, user);
        await this.performClick(this.userInDropdown(user));
        await this.performClick(this.departmentInDropdown(department));
        await this.performClick(this.beginApplicationButton);
        const isVisible = await this.caseTab.isVisible();
        if (isVisible) {
            await this.assertVisible(this.caseTab);
            const caseNumber = await this.fetchCaseNumber();
            Log.info('Case number is ' + caseNumber);
            await this.assertVisible(this.caseJourneyTab('Created'));
            await this.assertVisible(this.caseJourneyTab('Manager Review'));
            await this.assertVisible(this.caseJourneyTab('HR Review'));
            await this.assertVisible(this.caseJourneyTab('Finance Review'));
            await this.assertVisible(this.caseJourneyTab('Completed'));
            await this.assertVisible(this.editJourneyBtn);
            await this.assertVisible(this.generateDocBtn);
            return caseNumber;
        } else {
            Log.info('Case tab is not visible');
        }
    }

    async SUBMIT_CASE(caseType: string, caseNumber: string) {
        Log.info('Submitting case with number: ' + caseNumber);
        await this.homePage.SELECT_APP_TO_CASE_MANAGEMENT();
        await this.performClick(this.caseTypeInSideKick(caseType));
        await this.waitForElement(this.createNewCaseButton);
        await this.homePage.performClick(this.homePage.createCaseButton);
        await this.page.waitForLoadState('load');
        await this.page.waitForLoadState('domcontentloaded');
    }
}