import { expect } from "playwright/test";
import { BaseClass } from "../../config/BaseClass";
import { Log } from "../../utils/Log";
import { contentIntake } from '../ContentIntake/contentIntake';

const ASSIGNMENTS_TABLE = 'app-assigned-content-takes';

export class Assignments extends BaseClass {
    readonly CIPage = new contentIntake(this.page);

    readonly assignmentsLinkInSideNav = this.page.getByRole('link', { name: 'Assignments' });
    readonly myAssignmentsTab = this.page.getByRole('tab', { name: 'My Assignments' });
    readonly unAssignedCI = this.page.getByRole('tab', { name: 'Unassigned Content Intakes' });
    readonly unAssignedCI_Table = this.page.locator('app-unassigned-content-takes');
    readonly CI_Column_UnAssignedTable = this.page.locator('app-unassigned-content-takes th[class*="column-ci_label"]');
    readonly frequencyBtn = this.page.getByRole('button', { name: 'All' });
    readonly totalAssignedCanvas = this.page.locator('#totalAssigned');
    readonly pendingReviewsCanvas = this.page.locator('#pendingReviews');
    readonly reviewsCompletedCanvas = this.page.locator('#reviewsCompleted');
    readonly CITab = this.page.getByRole('tab', { name: 'Content Intake', exact: true });
    readonly FilesTab = this.page.getByRole('tab', { name: 'Files' })
    readonly FoldersTab = this.page.getByRole('tab', { name: 'Folders' })
    readonly pendingReviewTab = this.page.locator('label').filter({ hasText: 'Pending Review' });
    readonly ReviewedTab = this.page.locator('label').filter({ hasText: 'Reviewed' });
    readonly CITable = this.page.locator('app-assigned-content-takes');
    readonly CI_CITable = this.page.locator('app-assigned-content-takes td[class*="column-name"] div');

    async NAV_TO_ASSIGNMENTS() {
        Log.info('Navigating to Assignmets screen');
        await this.performClick(this.assignmentsLinkInSideNav);
        await this.waitForElement(this.myAssignmentsTab);
    };

    async NAV_TO_UNASSIGNED_CI() {
        Log.info('Navigating to Un assigned CI section in Assignment screen');
        await this.performClick(this.unAssignedCI);
        await this.page.waitForLoadState('load');
        await this.assertVisible(this.unAssignedCI_Table);
    }

    async VALIDATE_ASSIGNMENTS_SCREEN() {
        Log.info('Validating Assignments screen');
        await this.assertVisible(this.myAssignmentsTab);
        await this.assertVisible(this.unAssignedCI);
        await this.assertVisible(this.myAssignmentsTab);
        await this.assertVisible(this.CITab);
        await this.assertVisible(this.FilesTab);
        await this.assertVisible(this.FoldersTab);
    }

    async VALIDATE_IF_CREATED_APPROVED_CI_DISPLAYED(fileName: string) {
        Log.info('Validating if CI created and approved CI is displayed in Assignments screen');
        await this.CIPage.NAV_TO_CI();
        const CI_ID = (await this.CIPage.CREATE_CI([fileName])).trim();
        Log.info('CI ID created is ' + CI_ID);
        await this.CIPage.NAV_TO_CI();
        await this.CIPage.PERFORM_ASSIGN_TO_ME(CI_ID);
        await this.NAV_TO_ASSIGNMENTS();
        await this.assertVisible(this.page.getByText(CI_ID));
        await this.CIPage.NAV_TO_CI();
        await this.CIPage.APPROVE_CI(CI_ID);
        await this.NAV_TO_ASSIGNMENTS();
        await this.performClick(this.ReviewedTab);
        await this.assertVisible(this.page.getByText(CI_ID));
    }

    async VALIDATE_IF_CREATED_REJECTED_CI_DISPLAYED(fileName: string) {
        Log.info('Validating if CI created and rejected is displayed in Assignments screen');
        await this.CIPage.NAV_TO_CI();
        const CI_ID = (await this.CIPage.CREATE_CI([fileName])).trim();
        Log.info('CI ID created is ' + CI_ID);
        await this.CIPage.NAV_TO_CI();
        await this.CIPage.PERFORM_ASSIGN_TO_ME(CI_ID);
        await this.NAV_TO_ASSIGNMENTS();
        await this.assertVisible(this.page.getByText(CI_ID));
        await this.CIPage.NAV_TO_CI();
        await this.CIPage.REJECT_CI(CI_ID);
        await this.NAV_TO_ASSIGNMENTS();
        await this.performClick(this.ReviewedTab);
        await this.assertVisible(this.page.getByText(CI_ID));
    }

    async VALIDATE_UNASSIGNED_CI(fileName: string) {
        Log.info(`Validating if Un assigned CI's are displayed in UnAssigned tab of Assignment screen`);
        await this.CIPage.NAV_TO_CI();
        const CI_ID = (await this.CIPage.CREATE_CI([fileName])).trim();
        Log.info('CI ID created is ' + CI_ID);
        await this.NAV_TO_ASSIGNMENTS();
        await this.NAV_TO_UNASSIGNED_CI();
        await this.performClick(this.CI_Column_UnAssignedTable);
        await this.page.waitForTimeout(1000);
        await this.performClick(this.CI_Column_UnAssignedTable);
        await this.page.waitForTimeout(1000);
        await this.assertVisible(this.page.getByText(CI_ID));
        Log.info('Performing Assign To Me option for a CI');
        await this.performClick(this.CIPage.actionsInCI(CI_ID));
        await this.waitForElement(this.CIPage.assignToMeOption);
        await this.performClick(this.CIPage.assignToMeOption);
        await this.waitForElement(this.CIPage.assignToMeOption, "detached");
        await this.page.waitForTimeout(2000);
        await this.NAV_TO_ASSIGNMENTS();
        await this.assertVisible(this.page.getByText(CI_ID));
    }

    async VALIDATE_ASSIGNMENTS_VALID_PAGINATION() {
        await this.validatePaginationInFile(ASSIGNMENTS_TABLE)
    };

    async VALIDATE_ASSIGNMENTS_INVALID_INPUT() {
        await this.validateInvalidPage(ASSIGNMENTS_TABLE);
    };

    async VALIDATE_RECORDS_SELECTED(OPTION) {
        await this.validateRecordsSelected(ASSIGNMENTS_TABLE, OPTION)
    };
}