import { Log } from "../../utils/Log";
import { HomePage } from "../HomePage/HomePage";
import { CaseBaseClass } from "./CaseBaseClass";

export class LeaveTracker extends CaseBaseClass {

    readonly homePage = new HomePage(this.page);

    async CREATE_LEAVE_TRACKER(caseType: string, user: string, department: string) {
        const caseNo =await this.CREATE_NEW_CASE(caseType, user, department);
        return caseNo;
    };

    async NAV_TO_CREATED_LEAVE_TRACKER(caseNo: string) {
        await this.homePage.SELECT_APP_TO_CASE_MANAGEMENT();
        await this.performClick(this.caseTypeInSideKick('Leave Tracker'));
        await this.page.waitForLoadState('load');
        await this.page.waitForLoadState('domcontentloaded');
        await this.CLICK_ON_CASE(caseNo);
    }

    async VALIDATE_ATTACHMENT_DELETED(caseNo: string, user: string, filePath: string) {
        Log.info('Validating attachment deleted: ' + caseNo);
        await this.CLICK_EDIT_BUTTON();
        await this.SELECT_DROPDOWN('Leave Type', 'Sick Leave');
        await this.SELECT_DATE('Start Date', 'Sep', '2025', '20');
        await this.SELECT_DATE('End Date', 'Sep', '2025', '25');
        await this.SELECT_LOOKUP_FIELD('Assignee', user);
        await this.UPLOAD_FILE(filePath);
        await this.DELETE_ATTACHMENT(filePath);
    }

    async SUBMIT_LEAVE_TRACKER(caseNo: string, user: string, filePath: string) {
        Log.info('Submitting leave tracker: ' + caseNo);
        await this.CLICK_EDIT_BUTTON();
        await this.SELECT_DROPDOWN('Leave Type', 'Sick Leave');
        await this.SELECT_DATE('Start Date', 'Sep', '2025', '20');
        await this.SELECT_DATE('End Date', 'Sep', '2025', '25');
        await this.SELECT_LOOKUP_FIELD('Assignee', user);
        await this.UPLOAD_FILE(filePath);
        await this.CLICK_SAVE_BUTTON();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
        if (await this.nextBtn.isVisible()) {
            await this.CLICK_NEXT_BUTTON();
            await this.page.waitForTimeout(1000);
        }
        if (await this.nextBtn.isVisible()) {
            await this.CLICK_NEXT_BUTTON();
            await this.page.waitForTimeout(1000);
        }
        await this.CLICK_SUBMIT_BUTTON();
    }

    async EDIT_LEAVE_TRACKER(caseNo: string, user?: string, filePath?: string) {
        Log.info('Editing leave tracker: ' + caseNo);
        await this.CLICK_EDIT_BUTTON();
        await this.SELECT_DROPDOWN('Leave Type', 'Earned Leave');
        await this.page.waitForTimeout(1000);
        if (filePath) {
            await this.UPLOAD_FILE(filePath);
        }
        if (user) {
            await this.SELECT_LOOKUP_FIELD('Assignee', user);
        }
        if (await this.nextBtn.isVisible()) {
            await this.CLICK_NEXT_BUTTON();
        }
        if (await this.nextBtn.isVisible()) {
            await this.CLICK_NEXT_BUTTON();
        }
        await this.CLICK_SUBMIT_BUTTON();
        await this.assertVisible(this.recordSubmittedSuccessfully);
    }

    async VALIDATE_ACTIVITY_HISTORY_TAB_WITHIN_CASE() {
        Log.info('Validating activity history tab for case');
        await this.CLICK_EDIT_BUTTON();
        await this.SELECT_DROPDOWN('Leave Type', 'Sick Leave');
        await this.SELECT_DATE('Start Date', 'Sep', '2025', '20');
        await this.SELECT_DATE('End Date', 'Sep', '2025', '25');
        await this.CLICK_SAVE_BUTTON();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
        await this.VALIDATE_ACTIVITY_HISTORY_TAB();
    }
    
    async VALIDATE_LINK_RECORDS_OBJECT_AS_CASE(
        sourceReason: string,
        destinationReason: string
    ) {
        Log.info('Validating activity history tab for case: ');
        await this.VALIDATE_LINK_RECORDS_WITHIN_CASE_OBJECT_AS_CASE(
            sourceReason, 
            destinationReason);
    }

    async VALIDATE_LINK_RECORDS_OBJECT_AS_DATA_TABLE(
        sourceReason: string,
        destinationReason: string
    ) {
        Log.info('Validating activity history tab for case: ');
        await this.VALIDATE_LINK_RECORDS_WITHIN_CASE_OBJECT_AS_DATA_TABLE(
            sourceReason, 
            destinationReason);
    }

    async VALIDATE_COMPOSE_EMAIL(toEmail: string, subject: string, body: string) {
        Log.info('Validating compose email functionality');
        await this.VALIDATE_EMAIL_FUNCTIONALITY(toEmail, subject, body);
    }
}