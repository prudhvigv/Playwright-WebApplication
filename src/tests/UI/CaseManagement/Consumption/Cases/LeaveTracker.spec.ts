import { EnvConfig } from '../../../../../config/EnvConfig';
import { test } from '../../../../../hooks/hooks';
import { LeaveTracker } from '../../../../../pages/CaseManagement/LeaveTracker';
import { HomePage } from '../../../../../pages/HomePage/HomePage';
import { LoginPage } from '../../../../../pages/Login/loginPage';
import { Log } from '../../../../../utils/Log';

let leaveTrackerCaseNo: string;
let taskNo: string;

const NOTES_TITLE_WITHOUT_ATTACHMENT = 'Test Title Without Attachment';
const NOTES_DESCRIPTION_WITHOUT_ATTACHMENT = 'Adding notes without attachment';
const NOTES_TITLE_WITH_ATTACHMENT = 'Test Title With Attachment';
const NOTES_EDIT_TITLE_WITH_ATTACHMENT = 'Test Edit Title With Attachment';
const NOTES_DESCRIPTION_WITH_ATTACHMENT = 'Adding notes with attachment';
const FILE_PATH = '/src/test-data/MyVault/ID Card_6_MyVault.pdf';

test.beforeEach('Login step', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
        EnvConfig.admin_username,
        EnvConfig.admin_password,
    );
    await homePage.SELECT_APP_TO_CASE_MANAGEMENT();
});

test.describe('Leave Tracker', async () => {

    test.only('Create a case', async ({ page }) => {
        const leaveTracker = new LeaveTracker(page);
        const caseNo = await leaveTracker.CREATE_LEAVE_TRACKER('Leave Tracker', EnvConfig.std_username, 'mavQ System Dept');
        if (!caseNo) {
            throw new Error('Leave tracker case number is undefined');
        }
        leaveTrackerCaseNo = caseNo;
        Log.info('Leave tracker number is ' + leaveTrackerCaseNo);
    });

    test('Validate if user is able to attach and delete the attached file', async ({ page }) => {
        const leaveTracker = new LeaveTracker(page);
        if (!leaveTrackerCaseNo) {
            throw new Error('Leave tracker case number is undefined');
        }
        await leaveTracker.NAV_TO_CREATED_LEAVE_TRACKER(leaveTrackerCaseNo);
        await leaveTracker.VALIDATE_ATTACHMENT_DELETED(leaveTrackerCaseNo, EnvConfig.std_username, '/src/test-data/MyVault/ID Card_6_MyVault.pdf');
    });

    test('Validate notes functionality', async ({ page }) => {
        const leaveTracker = new LeaveTracker(page);
        if (!leaveTrackerCaseNo) {
            throw new Error('Leave tracker case number is undefined');
        }
        await leaveTracker.NAV_TO_CREATED_LEAVE_TRACKER(leaveTrackerCaseNo);
        await leaveTracker.ADD_NOTES_WITHOUT_ATTACHMENT(leaveTrackerCaseNo, NOTES_TITLE_WITHOUT_ATTACHMENT, NOTES_DESCRIPTION_WITHOUT_ATTACHMENT);
        await leaveTracker.DELETE_NOTES(NOTES_TITLE_WITHOUT_ATTACHMENT);
        await leaveTracker.ADD_NOTES_WITH_ATTACHMENT(leaveTrackerCaseNo, NOTES_TITLE_WITH_ATTACHMENT, NOTES_DESCRIPTION_WITH_ATTACHMENT, FILE_PATH);
        await leaveTracker.UPDATE_NOTES(NOTES_EDIT_TITLE_WITH_ATTACHMENT, NOTES_DESCRIPTION_WITH_ATTACHMENT);
        await leaveTracker.DELETE_NOTES('Test Title With Attachment');
    });

    test('Verify that all actions taken on a case are recorded and displayed in the "Activity History" tab in the right-hand panel of the case record.', async ({ page }) => {
        const leaveTracker = new LeaveTracker(page);
        if (!leaveTrackerCaseNo) {
            throw new Error('Leave tracker case number is undefined');
        }
        await leaveTracker.NAV_TO_CREATED_LEAVE_TRACKER(leaveTrackerCaseNo);
        await leaveTracker.VALIDATE_ACTIVITY_HISTORY_TAB_WITHIN_CASE();
    });

    test.only('Validate if user is able to view the case record but not able to edit it', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);
        const leaveTracker = new LeaveTracker(page);
        if (!leaveTrackerCaseNo) {
            throw new Error('Leave tracker case number is undefined');
        }
        await loginPage.LOGOUT();
        await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
           EnvConfig.std_username,
           EnvConfig.std_password,
        );
        if (!leaveTrackerCaseNo) {
            throw new Error('Leave tracker case number is undefined');
        }
        await leaveTracker.NAV_TO_CREATED_LEAVE_TRACKER(leaveTrackerCaseNo);
        await leaveTracker.VALIDATE_VIEW_ONLY_MODE();
    });

    test('Submit with valid data and validate case moved to manager review', async ({page}) => {
        const leaveTracker = new LeaveTracker(page);
        if (!leaveTrackerCaseNo) {
            throw new Error('Leave tr acker case number is undefined');
        }
        await leaveTracker.NAV_TO_CREATED_LEAVE_TRACKER(leaveTrackerCaseNo);
        await leaveTracker.SUBMIT_LEAVE_TRACKER(leaveTrackerCaseNo, EnvConfig.std_username, '/src/test-data/MyVault/ID Card_6_MyVault.pdf');
        await leaveTracker.VALIDATE_CASE_MOVED_TO_MANAGER_REVIEW(leaveTrackerCaseNo);
    });

    test('Verify that on a case record, clicking the Linked Records option in the right panel displays the Add link button, and clicking this button opens a pop-up showing a list of fields.', async ({ page }) => {
        const leaveTracker = new LeaveTracker(page);
        await leaveTracker.NAV_TO_CREATED_LEAVE_TRACKER(leaveTrackerCaseNo);
        await leaveTracker.VALIDATE_LINK_RECORDS_OBJECT_AS_CASE(
            'Test link source',
            'Test link destination');
    });

    test('Verify that once the user fills in all fields in the Create Object Link pop-up, the Save button becomes enabled, and clicking Save links the selected record to the source record.', async ({ page }) => {
        const leaveTracker = new LeaveTracker(page);
        await leaveTracker.NAV_TO_CREATED_LEAVE_TRACKER(leaveTrackerCaseNo);
        await leaveTracker.VALIDATE_LINK_RECORDS_OBJECT_AS_DATA_TABLE(
            'Test link source',
            'Test link destination');
    });

    test('Verify that in the case record, the user can click on the Email tab from the right panel, compose an email, and send it using the communication channel configured for the case type.', async ({ page }) => {
        const leaveTracker = new LeaveTracker(page);
        await leaveTracker.NAV_TO_CREATED_LEAVE_TRACKER(leaveTrackerCaseNo);
        await leaveTracker.VALIDATE_COMPOSE_EMAIL('test@example.com', 'Test Subject', 'Test Body');
    });

    test('Login with Manager and edit the case then submit, Also verify if orange dot is added to edited field tab in case details page and case moved to HR review', async ({page}) => {
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);
        const leaveTracker = new LeaveTracker(page);
        if (!leaveTrackerCaseNo) {
            throw new Error('Leave tracker case number is undefined');
        }
        await loginPage.LOGOUT();
        await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
            'prudhvi.golla1',
            EnvConfig.admin_password,
        );
        await homePage.SELECT_APP_TO_CASE_MANAGEMENT();
        await leaveTracker.NAV_TO_MY_TASKS();
        const taskDetails = await leaveTracker.SELECT_MY_TASK(leaveTrackerCaseNo);
        if (!taskDetails) {
            throw new Error('Task details are undefined');
        }
        taskNo = taskDetails;
        Log.info('Task number is ' + taskNo);
        await leaveTracker.EDIT_LEAVE_TRACKER(leaveTrackerCaseNo);
        await leaveTracker.VALIDATE_CASE_MOVED_TO_HR_REVIEW(leaveTrackerCaseNo);
        await leaveTracker.NAV_TO_CREATED_LEAVE_TRACKER(leaveTrackerCaseNo);
        await leaveTracker.VALIDATE_ORANGE_DOT_IN_EDITED_FIELD_TAB_IN_CASE_DETAILS_PAGE();
    });

    test('Login with user who is having access to claim the task and proceed further', async ({page}) => {
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);
        const leaveTracker = new LeaveTracker(page);
        if (!leaveTrackerCaseNo) {
            throw new Error('Leave tracker case number is undefined');
        }
        await loginPage.LOGOUT();
        await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
            'prudhvi.golla@mavq.com',
            'Quality@123',
        );
        await homePage.SELECT_APP_TO_CASE_MANAGEMENT();
        await leaveTracker.NAV_TO_TASK_HUB();
        await leaveTracker.CLAIM_THE_TASK(taskNo);
        await leaveTracker.NAV_TO_MY_TASKS();
        await leaveTracker.SELECT_MY_TASK(leaveTrackerCaseNo);
        await leaveTracker.VALIDATE_HR_STATUS_OF_TASK();
        await leaveTracker.NAV_TO_CASE_TAB_IN_TASK();
        await leaveTracker.REVIEW_HR_CASE_IN_TASK('Move to Finance Review');
        await loginPage.LOGOUT();
        await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
            EnvConfig.std_username,
            EnvConfig.std_password,
        );
        await homePage.SELECT_APP_TO_CASE_MANAGEMENT();
        await leaveTracker.NAV_TO_CREATED_LEAVE_TRACKER(leaveTrackerCaseNo);
        await leaveTracker.VALIDATE_CASE_MOVED_TO_FINANCE_REVIEW(leaveTrackerCaseNo);
    })
});