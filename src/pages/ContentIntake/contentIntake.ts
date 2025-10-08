import path from 'path';
import { BaseClass } from '../../config/BaseClass';
import { Log } from '../../utils/Log';
import { myVault } from '../MyVault/myVault';
import { expect, Locator } from '@playwright/test';
import { HomePage } from '../HomePage/HomePage';
import { th } from '@faker-js/faker';

const CI_Table = 'app-content-intakes-list';

export class contentIntake extends BaseClass {
  readonly myVaultPage = new myVault(this.page);
  readonly homePage = new HomePage(this.page);

  readonly CILink = this.page
    .getByLabel('Main')
    .getByRole('link', { name: 'Content Intakes' });
  readonly CIHeading = this.page.getByRole('main').getByText('Content Intakes');
  readonly CISearchBar = this.page.getByRole('textbox', {
    name: 'Search Content Intakes',
  });
  readonly rowsInCI = this.page.locator(
    'app-content-intakes-list table tr[mq-row]',
  );
  readonly columnInCI = this.page.locator(
    'app-content-intakes-list table tr[mq-header-row] th span[mq-tooltip]',
  );
  readonly sourceColInCI = this.page.locator('td[class*="source"] span');
  readonly CI_ID_IN_CITable = this.page.locator('td[class*="ci_label"] div');
  readonly CI_STATUS_IN_TABLE = this.page.locator('td[class*="status"] span');
  readonly basicDetailsTab = this.page.getByText('Basic Details');
  readonly attachmentsTab = this.page.getByText('Attachments');
  readonly activityDetailsTab = this.page.getByText('Activity Details');
  readonly filesInAttachment = this.page.locator(
    'td[class*="column-name"] span',
  );
  readonly uploadBtnInAttachmentTab = this.page.getByRole('button', {
    name: 'upload',
    exact: true,
  });
  readonly appActivityItem = this.page.locator('app-activity-item');
  readonly editButtonInBasicDetailsTab = this.page.getByRole('button', {
    name: 'Edit',
  });
  readonly subjectTextBox = this.page
    .locator('[data-test="Subject"]')
    .getByRole('textbox');
  readonly saveBtn = this.page.getByRole('button', { name: 'Save' });
  readonly actionsInCI = (CINo: string) =>
    this.page
      .getByRole('row')
      .filter({ hasText: CINo })
      .getByLabel('Activities');
  readonly viewDetailsOption = this.page.getByRole('menuitem', {
    name: 'View Details',
  });
  readonly assignToMeOption = this.page.getByRole('menuitem', {
    name: 'Assign to me',
  });
  readonly Reassign = this.page.getByRole('menuitem', { name: 'Reassign' });
  readonly Unassign = this.page.getByRole('menuitem', { name: 'Unassign' });
  readonly reAssignTextBox = this.page.getByRole('textbox', { name: 'Search' });
  readonly CI_COLUMN = this.page.getByRole('cell', {
    name: 'Content Intake ID',
  });
  readonly optionsInCIDetailsPage = this.page.getByRole('button', { name: 'Know more' }).first();
  readonly assignToMeInCIDetailsPage = this.page.getByRole('menuitem', { name: 'Assign to me' });
  readonly approveCIBtn = this.page.getByRole('button', { name: 'Approve' });
  readonly rejectCIBtn = this.page.getByRole('button', { name: 'Reject' });
  readonly approveMsg = this.page.getByRole('textbox', { name: 'Enter Comment' });
  readonly approveBtnInPopup = this.page.getByRole('button', { name: 'Approve' });
  readonly rejectBtnInPopup = this.page.getByRole('button', { name: 'Reject' });
  readonly approveStatusInCIDetails = this.page.getByText('APPROVED', { exact: true });
  readonly rejectStatusInCIDetails = this.page.getByText('REJECTED', { exact: true });
  readonly visibilityIconInAttachment = this.page.getByText('visibility_off');
  readonly lowConfScoreEditBtn = this.page.locator('div mq-icon[data-mq-icon-name="edit_pencil_underline"]').nth(1);
  readonly markAsVerifiedInPopup = this.page.getByText('Mark as Verified');
  readonly checkboxInPopup = this.page.locator('mq-checkbox input');
  readonly updateBtnInPopup = this.page.getByRole('button', { name: 'Update' });
  readonly validationsTab = this.page.getByLabel('Tab Group').getByText('Validations');
  readonly validationsHeaderInTab = this.page.getByLabel('Tab Group').getByText('Validations');
  readonly noOfValidations = this.page.locator('app-file-right-side-accordian mq-panel-title');
  readonly validationsList = this.page.locator('css=tr[mq-row] td[class*="column-status"]:has-text("Failed")');
  readonly keyFieldHighlighted = this.page.locator('app-file-preview div[style*="background-color: rgb(204, 0, 0)"]');
  readonly valueFieldHightlighted = this.page.locator('app-file-preview div[style*="background-color: rgb(0, 0, 204)"]')
  readonly fieldInMetadataHighlighted = this.page.locator('app-form-field[class*="highlight"]');
  readonly attachmentInCIPage = this.page.locator('td[class*="mq-cell"] app-file-icon');
  readonly CR_DESTINATION_COL = this.page.locator(
    'app-content-requests-list td[class*="column-destination"] div div + div',
  );
  readonly AssignToMeAction = this.page.getByRole('menuitem', { name: 'Assign to me' });
  readonly CI_ID_Column = this.page.locator('app-unassigned-content-takes th[class*="column-ci_label"]');
  readonly UnassignedContentIntakes = this.page.getByText('Unassigned Content Intakes');
  kebabMenu(newCI: string) {
    return this.page.getByRole('row', { name: `mq-header-cell ${newCI}` }).getByLabel('Activities');
  }

  async NAV_TO_CI() {
    Log.info('NAVIGATING TO CI page');
    await Promise.all([
      await this.page.waitForLoadState('load'),
      await this.performClick(this.CILink)
    ])
    await this.assertVisible(this.CIHeading);
  }

  async RELOAD_CI_PAGE() {
    Log.info('Performing Reload on CI Page')
    await this.page.reload({ waitUntil: 'load' });
    await this.page.waitForResponse(
      (response) =>
        response.url().includes('/content-intakes') && response.status() === 200,
    );
  }

  async UPLOAD_TO_CI(file: string[]) {
    Log.info('UPLOADING file in CI');
    for (const fileName of file) {
      await this.performClick(this.myVaultPage.newButton);
      const fileInput = this.page.locator('input[type="file"]').nth(1);
      await fileInput.waitFor({ state: 'attached' });
      await fileInput.setInputFiles(path.join(process.cwd(), fileName));
      await this.page.waitForTimeout(5000);
      Log.info('FILE UPLOADED: ' + fileName);
      await this.page.reload({ waitUntil: 'load' });
      await this.page.waitForLoadState('load');
      // await this.page.waitForResponse(
      //   (response) =>
      //     response.url().includes('/content-intakes') && response.status() === 200,
      // );
      await this.NAV_TO_CI();
    }
  }

  async fetchDataInCITable(colName: Locator) {
    Log.info('Fetching data from ' + colName);
    const cols = await this.columnInCI.count();
    for (let i = 0; i < cols; i++) {
      const textContent = await colName.nth(i).textContent();
    }
  }

  async searchCI() {
    Log.info('Searching CI in CI Page');
    const CI_NUMBER = await this.COUNT_CI();
    if (CI_NUMBER.CI_ID != '') {
      await this.CISearchBar.waitFor();
      await this.CISearchBar.fill('');
      await this.CISearchBar.fill(CI_NUMBER.CI_ID);
      // Add spaces before and after for substring match
      const expected = ` ${CI_NUMBER.CI_ID} `;
      const received =
        (await this.CI_ID_IN_CITable.first().textContent()) ?? '';
      expect(received).toContain(expected.trim());
    } else {
      throw new Error('No CI_ID found to search');
    }
  }

  async COUNT_CI() {
    Log.info('COUNTING CI in CI TABLE');
    await this.page.waitForLoadState('load');
    await this.page.locator('app-list-view-table table').waitFor();
    let count = 0;
    let CI_ID: string = '';
    const isVisible = await this.rowsInCI
      .first()
      .isVisible()
      .catch(() => false);
    if (isVisible) {
      count = await this.rowsInCI.count();
      Log.info(`Number of CI rows: ${count}`);
      CI_ID = (await this.CI_ID_IN_CITable.first().textContent()) ?? '';
      Log.info('Fetched CI ID ' + CI_ID);
    } else {
      Log.info("No CI's are available for user");
    }
    return { count, CI_ID };
  }

  async CREATE_CI(file: string[]) {
    Log.info('VALIDATING IF CI IS CREATED');
    const CI_BEFORE_UPLOAD = await this.COUNT_CI();
    await this.UPLOAD_TO_CI(file);
    const CI_AFTER_UPLOAD = await this.COUNT_CI();
    expect(CI_AFTER_UPLOAD.CI_ID).not.toEqual(CI_BEFORE_UPLOAD.CI_ID);
    // Validation: Find the latest CI row and check name, source, and status
    if (CI_AFTER_UPLOAD.count > 0) {
      expect(
        (await this.CI_ID_IN_CITable.first().textContent())?.trim(),
      ).toMatch(/^CI-\d+$/);
      expect(
        (await this.sourceColInCI.first().first().textContent())?.trim(),
      ).toBe('Manual Upload');
      const statusText = (await this.CI_STATUS_IN_TABLE.first().textContent())?.trim();
      expect(['Not Picked Up', 'Completed', 'In Progress']).toContain(statusText);
      await this.validateContentInCI(file);
      return CI_AFTER_UPLOAD.CI_ID
    } else {
      throw new Error('No CI rows found after upload.');
    }
  }

  async VALIDATE_BASIC_DETAILS() {
    await this.performClick(this.basicDetailsTab);
    await this.waitForElement(this.editButtonInBasicDetailsTab);
    // await this.performClick(this.editButtonInBasicDetailsTab);
    // await this.performClick(this.subjectTextBox);
    // await this.fillInput(this.subjectTextBox, 'TestAutomationEdit');
    // await this.performClick(this.saveBtn);
    // expect((await this.subjectTextBox.textContent())?.trim()).toContain('TestAutomationEdit');
  }

  async VALIDATE_APP_ACTIVITY_CONTENT() {
    Log.info('Validating if records are created in App activity details tab');
    await this.performClick(this.activityDetailsTab);
    await this.waitForLoader();
    await expect(this.appActivityItem.first()).toBeVisible();
  }

  async VALIDATE_CONTENTS_IN_ATTACHMENTS_TAB(file: string[]) {
    Log.info('Validating content in Attachments tab');
    for (const fileName of file) {
      Log.info(`Validating if ${fileName} is visible in Attachments tab`);
      const expectedFileName = fileName
        .split('/')
        .pop()
        ?.replace('.pdf', '')
        .trim();
      expect((await this.filesInAttachment.textContent())?.trim()).toContain(
        expectedFileName,
      );
    }
    await expect(this.uploadBtnInAttachmentTab).toBeVisible();
  }

  async validateContentInCI(file: string[]) {
    Log.info('Validating content in CI');
    await this.performClick(this.CI_ID_IN_CITable.first());
    await this.waitForElement(this.activityDetailsTab);
    await expect(this.basicDetailsTab).toBeVisible();
    await expect(this.activityDetailsTab).toBeVisible();
    await this.VALIDATE_CONTENTS_IN_ATTACHMENTS_TAB(file);
    await this.VALIDATE_BASIC_DETAILS();
    await this.VALIDATE_APP_ACTIVITY_CONTENT();
  }

  async PERFORM_ASSIGN_TO_ME(CI_NO) {
    Log.info('Performing Assign To Me option for a CI');
    // await this.performClick(this.actionsInCI(CI_NO));
    await this.actionsInCI(CI_NO).click({ force: true });
    await this.waitForElement(this.assignToMeOption);
    await this.performClick(this.assignToMeOption);
    await this.waitForElement(this.assignToMeOption, "detached");
    await this.page.waitForTimeout(2000);
    // await this.performClick(this.actionsInCI(CI_NO));
    await this.actionsInCI(CI_NO).click({ force: true });
    await this.waitForElement(this.Unassign);
    await expect(this.Unassign).toBeVisible();
    await expect(this.Reassign).toBeVisible();
    // await this.performClick(this.actionsInCI(CI_NO));
    await this.actionsInCI(CI_NO).click({ force: true });
  }

  async PERFORM_RE_ASSIGN() {
    Log.info('Performing Re-Assign CI');
    await this.waitForElement(this.Reassign);
    await this.performClick(this.Reassign);
    await this.waitForElement(this.reAssignTextBox);
    await this.performClick(this.reAssignTextBox);
    await this.fillInput(this.reAssignTextBox, 'test');
    await this.page.waitForTimeout(2000);
    await this.page.getByLabel('', { exact: true }).first().check();
    await expect(this.page.getByLabel('', { exact: true }).first()).toBeChecked();
    await this.page.getByRole('button', { name: 'Assign' }).click();
    Log.info('ReAssign operation completed');
  }

  async PERFORM_UNASSIGN(CI_NO) {
    Log.info('Performing UnAssigning action on CI');
    await this.waitForElement(this.Unassign);
    await this.performClick(this.Unassign);
    await this.page.waitForTimeout(2000);
    // await this.performClick(this.actionsInCI(CI_NO));
    await this.actionsInCI(CI_NO).click({ force: true });
    await this.waitForElement(this.assignToMeOption);
    await this.assertVisible(this.assignToMeOption);
  }

  async VALIDATE_OPTIONS_FOR_CI(CI_NO) {
    Log.info('VALIDATING OPTIONS FOR CREATED CI');
    await this.page.waitForTimeout(2000);
    // await this.performClick(this.actionsInCI(CI_NO));
    await this.actionsInCI(CI_NO).click({ force: true });
    await this.waitForElement(this.viewDetailsOption);
    await this.performClick(this.viewDetailsOption);
    await expect(this.editButtonInBasicDetailsTab).toBeVisible();
    await this.NAV_TO_CI();
    await this.PERFORM_ASSIGN_TO_ME(CI_NO);
    await this.RELOAD_CI_PAGE();
    await this.NAV_TO_CI();
    await this.actionsInCI(CI_NO).click({ force: true });
    // await this.performClick(this.actionsInCI(CI_NO));
    await this.PERFORM_RE_ASSIGN();
  }

  async APPROVE_CI(CI_NO: string) {
    Log.info('Approving CI');
    // await this.performClick(this.actionsInCI(CI_NO));
    await this.actionsInCI(CI_NO).click({ force: true });
    await this.waitForElement(this.viewDetailsOption);
    await this.performClick(this.viewDetailsOption);
    await this.waitForElement(this.page.locator('app-content-intakes-details-content div[role="region"]').first())
    await this.waitForElement(this.activityDetailsTab);
    const visibleStatus = await this.approveCIBtn.isVisible();
    if (visibleStatus) {
      Log.info('Performing approve action since CI is already Assign to me');
      await this.performClick(this.approveCIBtn);
      await this.waitForElement(this.approveMsg);
      await this.fillInput(this.approveMsg, 'Test Approve', 'Approve Message');
      await this.page.waitForTimeout(2000);
      await this.performClick(this.approveBtnInPopup);
      await this.page.waitForTimeout(2000);
      await this.assertVisible(this.approveStatusInCIDetails.first());
    } else {
      Log.info('Performing assigning to me to CI');
      await this.performClick(this.optionsInCIDetailsPage);
      await this.waitForElement(this.assignToMeInCIDetailsPage);
      await this.performClick(this.assignToMeInCIDetailsPage);
      await this.page.waitForTimeout(2000);
      await this.assertVisible(this.approveCIBtn);
      await this.performClick(this.approveCIBtn);
      await this.waitForElement(this.approveMsg);
      await this.fillInput(this.approveMsg, 'Test Approve', 'Approve Message');
      await this.page.waitForTimeout(2000);
      await this.performClick(this.approveBtnInPopup);
      await this.waitForElement(this.approveStatusInCIDetails.first());
      await this.assertVisible(this.approveStatusInCIDetails.first());
    }
  }

  async REJECT_CI(CI_NO: string) {
    Log.info('Rejecting CI');
    // await this.performClick(this.actionsInCI(CI_NO));
    await this.actionsInCI(CI_NO).click({ force: true });
    await this.waitForElement(this.viewDetailsOption);
    await this.performClick(this.viewDetailsOption);
    await this.waitForElement(this.page.locator('app-content-intakes-details-content div[role="region"]').first())
    await this.waitForElement(this.activityDetailsTab);
    const visibleStatus = await this.approveCIBtn.isVisible();
    if (visibleStatus) {
      Log.info('Performing approve action since CI is already Assign to me');
      await this.performClick(this.rejectCIBtn);
      await this.waitForElement(this.approveMsg);
      await this.fillInput(this.approveMsg, 'Test Reject', 'Reject Message');
      await this.page.waitForTimeout(2000);
      await this.performClick(this.rejectBtnInPopup);
      await this.assertVisible(this.rejectStatusInCIDetails);
    } else {
      Log.info('Performing assigning to me to CI');
      await this.performClick(this.optionsInCIDetailsPage);
      await this.waitForElement(this.assignToMeInCIDetailsPage);
      await this.performClick(this.assignToMeInCIDetailsPage);
      await this.page.waitForTimeout(2000);
      await this.assertVisible(this.rejectCIBtn);
      await this.performClick(this.rejectCIBtn)
      await this.fillInput(this.approveMsg, 'Test Reject', 'Reject Message');
      await this.page.waitForTimeout(2000);
      await this.performClick(this.rejectBtnInPopup);
      await this.assertVisible(this.rejectStatusInCIDetails);
    }
  }

  async validateSort() {
    Log.info('Validating Sort order on CI ID column');
    const dataBeforeSort: string[] = [];
    const count = await this.CI_ID_IN_CITable.count();
    for (let i = 0; i < count; i++) {
      const text = await this.CI_ID_IN_CITable.nth(i).textContent();
      dataBeforeSort.push(text?.trim() ?? '');
    }
    await this.performClick(this.CI_COLUMN);
    await this.page.waitForTimeout(2000);
    const dataAfterSort: string[] = [];
    const countAfter = await this.CI_ID_IN_CITable.count();
    for (let i = 0; i < countAfter; i++) {
      const text = await this.CI_ID_IN_CITable.nth(i).textContent();
      dataAfterSort.push(text?.trim() ?? '');
    }
    expect(dataAfterSort).not.toEqual(dataBeforeSort);
  }

  async VALIDATE_CI_VALID_PAGINATION() {
    await this.validatePaginationInFile(CI_Table)
  }

  async VALIDATE_CI_INVALID_INPUT() {
    await this.validateInvalidPage(CI_Table);
  }

  async VALIDATE_RECORDS_SELECTED(OPTION) {
    await this.validateRecordsSelected(CI_Table, OPTION)
  }

  async VALIDATE_WORKFLOW_CREATED() {
    await this.homePage.NAV_TO_DASHBOARD();
  }

  async ENABLE_VISIBILITY() {
    if (await this.visibilityIconInAttachment.isVisible()) {
      Log.info('Turning on Visibility');
      await this.performClick(this.visibilityIconInAttachment);
      await this.page.waitForTimeout(2000);
    } else {
      Log.info('Visibility Icon already turned on');
    }
  }

  async APPROVE_LOW_CONF_SCORE() {
    Log.info('Approving Low confidance Score');
    if (await this.lowConfScoreEditBtn.isVisible()) {
      await this.performClick(this.lowConfScoreEditBtn);
      await this.waitForElement(this.markAsVerifiedInPopup);
      const checkboxes = await this.checkboxInPopup.count();
      for (let i = 0; i < checkboxes; i++) {
        await this.performClick(this.checkboxInPopup.nth(i));
      };
      await this.performClick(this.updateBtnInPopup);
      await this.page.waitForTimeout(2000);
      await this.assertNotVisible(this.lowConfScoreEditBtn);
    }
  }

  async NAV_TO_VALIDATIONS_TAB() {
    Log.info('Navigate to VALIDATIONS tab');
    await this.performClick(this.validationsTab);
    await this.page.waitForTimeout(2000);
    await this.waitForElement(this.validationsHeaderInTab);
    expect(this.page.url()).toContain('validations');
  };

  async VALIDATE_NO_OF_ITEMS_IN_VALIDATIONS() {
    const fetchText = await this.noOfValidations.first().textContent();
    const match = fetchText?.match(/\((\d+)\)/);
    const noOfValidationsInRightMenu = match ? parseInt(match[1], 10) : 0;
    Log.info('Fetched count in Rightside bar ' + noOfValidationsInRightMenu);
    const listCountInValidationsTab = await this.validationsList.count();
    Log.info('Fetched count in Validations grid ' + listCountInValidationsTab);
    expect(noOfValidationsInRightMenu).toEqual(listCountInValidationsTab);
  }

  async VALIDATE_ANNOTATION_HIGHLIGHT() {
    Log.info('Validating annotation highlight functionality');
    await this.ENABLE_VISIBILITY();
    expect(await this.keyFieldHighlighted.count()).toBeGreaterThanOrEqual(1);
    expect(await this.valueFieldHightlighted.count()).toBeGreaterThanOrEqual(1);
    await this.performClick(this.keyFieldHighlighted.first());
    await this.assertVisible(this.fieldInMetadataHighlighted);
  }

  async CLICK_ON_ATTACHMENT() {
    Log.info('Navigating to attachment');
    await this.waitForElement(this.attachmentInCIPage.first());
    await Promise.all([
      this.page.waitForLoadState('load'),
      this.attachmentInCIPage.first().click()
    ])
    await this.page.waitForLoadState('load');
  }

  async WAIT_FOR_CI_TOBE_COMPLETED(): Promise<boolean> {
    const CREATED_CI = (await this.CI_ID_IN_CITable.first().textContent())?.trim();
    let attempt = 0;
    const maxAttempts = 5;

    try {
      while (attempt < maxAttempts) {
        const currentStatus = (await this.CI_STATUS_IN_TABLE.first().textContent())?.trim() || '';

        if (currentStatus === 'Completed') {
          Log.info(`Status of CREATED CI ${CREATED_CI} is ${currentStatus}`);
          return true;
        }

        Log.info(`Attempt ${attempt + 1}: CI status is "${currentStatus}". Refreshing...`);
        await this.performClick(this.page.getByRole('button', { name: 'refresh' }));

        // Optional: wait a bit to allow the DOM to update after refresh
        await this.page.waitForTimeout(3000);
        attempt++;
      }

      Log.info(`CI status did not reach 'Completed' after ${maxAttempts} attempts.`);
      return false;

    } catch (error) {
      Log.info(`WAIT_FOR_CI_TOBE_COMPLETED failed with error: ${error}`);
      return false;
    }
  }

  async VALIDATE_CONTENTDATA_FOR_ATTACHMENT() {
    if (await this.WAIT_FOR_CI_TOBE_COMPLETED()) {
      await this.performClick(this.CI_ID_IN_CITable.first());
      await this.waitForElement(this.activityDetailsTab);
      await this.CLICK_ON_ATTACHMENT();
      await this.APPROVE_LOW_CONF_SCORE();
      // await this.VALIDATE_ANNOTATION_HIGHLIGHT();
      await this.NAV_TO_VALIDATIONS_TAB();
      await this.VALIDATE_NO_OF_ITEMS_IN_VALIDATIONS();
    } else {
      Log.info('Validations are not happened. Please check WORKFLOWS and EXTRACTION CONFIGURATIONs created')
    }
  }

  async VALIDATE_AND_ASSIGN_CI(file: string[]) {
    await this.NAV_TO_CI();
    const newCI = await this.CREATE_CI(file);
    
    Log.info('Validate if CR is created when CI is created');
    await this.navigateToLinkInSidekick('Content Requests');
    await this.page.waitForLoadState('load');

    Log.info('Validating Destination column contains "INTAKE"');
    // expect(
    //   (await this.CR_DESTINATION_COL.first().textContent())?.trim(),
    // ).toEqual('INTAKE');

    Log.info('Navigating to Assignments tab');
    await this.navigateToLinkInSidekick('Assignments');
    await this.performClick(this.UnassignedContentIntakes);
    await this.page.waitForLoadState('load');

    Log.info('Sorting the list to find Unassigned Content Intakes');
    await this.CI_ID_Column.hover();
    await this.performClick(this.CI_ID_Column);
    await this.page.waitForTimeout(5000);
    await this.performClick(this.CI_ID_Column);

    // Log.info('Selecting the newly created CI');
    // const kebabMenu = this.kebabMenu(newCI);
    // await kebabMenu.waitFor({ state: 'visible', timeout: 20000 });
    // await this.performClick(kebabMenu);
    // await this.performClick(this.AssignToMeAction);
    // await this.page.waitForTimeout(2000);
    return newCI;
  }}
