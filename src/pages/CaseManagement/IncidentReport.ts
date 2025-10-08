import { Log } from "../../utils/Log";
import { HomePage } from "../HomePage/HomePage";
import { CaseBaseClass } from "./CaseBaseClass";

export class IncidentReport extends CaseBaseClass {

    readonly homePage = new HomePage(this.page);
    
    async CREATE_INCIDENT_REPORT(caseType: string, user: string, department: string) {
        await this.CREATE_NEW_CASE(caseType, user, department);
    };

    async NAV_TO_CREATED_INCIDENT_REPORT(reportName: string) {
        await this.homePage.SELECT_APP_TO_CASE_MANAGEMENT();
        await this.performClick(this.caseTypeInSideKick('Incident Report'));
        await this.page.waitForLoadState('load');
        await this.page.waitForLoadState('domcontentloaded');
        Log.info('Navigating to incident report: ' + reportName);
        await this.performClick(this.caseInRecords(reportName));
        await this.page.waitForLoadState('load');
        await this.page.waitForLoadState('domcontentloaded');
    };

    async SUBMIT_INCIDENT_REPORT(caseNumber: string) {
        await this.CLICK_EDIT_BUTTON();
        await this.fillInput(this.shortTextField('Customer'), 'Test Customer');
        await this.fillInput(this.emailField('Email'), 'test@mavq.com');
        await this.SELECT_MULTI_SELECT_DROPDOWN('Multi select Dropdown', ['Open', 'Closed']);
        // await this.SELECT_DROPDOWN('D')
    };
}