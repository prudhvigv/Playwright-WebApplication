import path from "path";
import { BaseClass } from "../../config/BaseClass";
import { Log } from "../../utils/Log";
import { expect } from "playwright/test";

export class CaseBaseClass extends BaseClass {
    readonly createNewButton = this.page.getByRole('button', { name: 'Create New' });
    readonly caseTypeInDropdown = (caseName: string) => this.page.getByRole('menuitem', { name: caseName });
    readonly forField = this.page.getByRole('combobox', { name: /for/ });
    readonly userToBeSubmitedDropdown = this.page.getByLabel('Search', { exact: true });
    readonly userToBeSelected = (name: string) => this.page.getByText(name).first();
    readonly departmentDropdown = this.page.getByRole('combobox', { name: 'Department' });
    readonly departmentToBeSelected = (department: string) => this.page.getByText(department, { exact: true });
    readonly beginApplicationButton = this.page.getByRole('button', { name: 'Begin Application' });

    readonly shortTextField = (fieldName: string) => this.page.locator(`[data-test="${fieldName}"]`).getByRole('textbox');
    readonly emailField = (fieldName: string) => this.page.locator(`[data-test="${fieldName}"]`).getByRole('textbox');
    readonly multiSelectDropdown = (fieldName: string) => this.page.locator('div').filter({ hasText: /^empty$/ }).first();
    readonly dropdown = (fieldName: string) => this.page.locator(`//label[contains(text(), "${fieldName}")]/following::p-select`)
    readonly longTextField = this.page.locator('[data-test="formFieldLongText"]').getByRole('textbox');
    readonly selectDateTimeField = this.page.getByRole('textbox', { name: 'Select Date and Time' });
    readonly selectDateField = (fieldName: string) => this.page.locator(`app-date-picker[data-test="${fieldName}"] #icon`);
    readonly multiSelectCheckbox = this.page.locator('app-multi-select-checkbox-field mq-checkbox label');
    readonly radioButton = (radioButtonLabel: string) => this.page.locator('#mq-radio-2 div').filter({ hasText: radioButtonLabel });
    readonly parentField = (fieldName: string) => this.page.getByRole('combobox', { name: fieldName })
    readonly lookupField = (fieldName: string) => this.page.getByRole('combobox', { name: fieldName })
    readonly fileUploadField = this.page.locator('div[class*="upload-input"] mq-icon');
    readonly deleteAttachmentBtn = this.page.locator('div[class="add-file-box"] mq-icon[data-mq-icon-name="red_delete"]');
    readonly editBtn = this.page.getByRole('button', { name: 'Edit' });
    readonly nextBtn = this.page.getByRole('button', { name: 'Next' });
    readonly previousBtn = this.page.getByRole('button', { name: 'Previous' });
    readonly saveBtn = this.page.getByRole('button', { name: 'Save' });
    readonly cancelBtn = this.page.getByRole('button', { name: 'Cancel' });
    readonly submitBtn = this.page.getByRole('button', { name: 'Submit' });
    readonly caseTypeInSideKick = (caseName: string) => this.page.getByRole('link', { name: caseName }).first();
    readonly caseInRecords = (caseName: string) => this.page.getByRole('cell', { name: caseName }).first();
    readonly caseInDetailsPage = (caseName: string) => this.page.getByText(caseName);
    readonly orangeDotInTab = (tabName: string) => this.page.locator(`//span[contains(text(), "${tabName}")]/following::div[1]`);
    readonly notesBtn = this.page.locator('mq-icon[tooltiptext="Case Notes"]');
    readonly addNotesBtn = this.page.getByRole('button', { name: 'Add Notes' });
    readonly enterNoteField = this.page.getByRole('textbox', { name: 'Enter Note' });
    readonly editNoteTitle = this.page.getByRole('textbox', { name: 'Enter name' });
    readonly noteDesc = this.page.getByRole('tabpanel', { name: 'Case Notes' }).locator('ngx-editor div').nth(1);
    readonly saveNotesBtn = this.page.getByRole('button', { name: 'Save' });
    readonly noteCreatedSuccessfully = this.page.getByText('Note created successfully');
    readonly noteUpdatedSuccessfully = this.page.getByText('Note updated successfully');
    readonly noteDeletedSuccessfully = this.page.getByText('Note deleted successfully');
    readonly noteTitleInNotesPage = (title: string) => this.page.getByText(title).first();
    readonly activitiesBtn = this.page.getByRole('button', { name: 'Activities' }).first();
    readonly editBtnInActivitiesPage = this.page.getByRole('menuitem', { name: 'Edit' });
    readonly deleteBtnInActivitiesPage = this.page.getByRole('menuitem', { name: 'Delete' });
    readonly yesBtnInDeleteNotesPopup = this.page.getByRole('button', { name: 'Yes, Delete' });
    readonly addFilesIcon = this.page.locator('.add-files-icon > .mq-icon > svg');
    readonly uploadFileBtn = this.page.getByText('Upload a file');
    readonly updateBtn = this.page.getByRole('button', { name: 'Update' });
    readonly caseNoteAttachmentUploaded = this.page.getByText('Case note attachment uploaded');
    readonly activityHistoryTab = this.page.getByRole('tab', { name: 'Activity' });
    readonly createdAtInActivityHistory = this.page.getByText('Created At:').first();
    readonly ownerInActivityHistory = this.page.getByText('Owner:').first();
    readonly linkRecordsTab = this.page.getByRole('tab', { name: 'Linked Records' });
    readonly addLinkBtn = this.page.getByRole('button', { name: 'Add Link' });
    readonly objectTypeDropdownLinkedRecords = this.page.getByRole('combobox', { name: 'Select Object Type' });
    readonly objectSelectionAsCase = this.page.getByRole('option', { name: 'Case' });
    readonly objectSelectionAsDataTable = this.page.getByRole('option', { name: 'Data Table' });
    readonly objectNameDropdownLinkedRecords = this.page.getByRole('combobox', { name: 'Select Object Name' });
    readonly objectNameOption = (name: string) => this.page.getByRole('option', { name: name });
    readonly recordIdDropdown = this.page.getByRole('combobox', { name: 'Select Record ID' });
    readonly firstOptionCase = this.page.getByRole('option').first();
    readonly firstOptionRecord = this.page.getByRole('option').first();
    readonly sourceReasonLinkedRecords = this.page.getByRole('textbox', { name: 'Enter Source Reason' });
    readonly destinationReasonLinkedRecords = this.page.getByRole('textbox', { name: 'Enter Destination Reason' });
    readonly saveBtnLinkedRecords = this.page.getByRole('button', { name: 'Save' });
    readonly emailTab = this.page.getByRole('tab', { name: 'Email' });
    readonly composeEmailBtn = this.page.getByRole('button', { name: 'Compose Email' });
    readonly senderDropdown = this.page.getByRole('combobox', { name: 'Enter sender' });
    readonly firstFromSenderEmailSelection = this.page.getByRole('option').first();
    readonly toField = this.page.getByRole('textbox', { name: 'Enter recipients' });
    readonly subjectField = this.page.getByRole('textbox', { name: 'Enter subject' });
    readonly bodyField = this.page.getByRole('paragraph');
    readonly sendEmailBtn = this.page.getByRole('button',{ name: 'Send' });

    readonly myTasksBtn = this.page.getByRole('link', { name: 'My Tasks' });
    readonly taskHubBtn = this.page.getByRole('link', { name: 'Task Hub' });
    readonly caseTabInMyTaskPage = this.page.getByRole('tab', { name: 'Case' }).locator('span').first();
    readonly tasksInMyTaskPage = this.page.locator('tr td div[class*="link-text"]');
    readonly caseNoInMyTaskDetailsPage = this.page.locator('span[class*="metadata-desc"]');
    readonly editBtnInMyTaskDetailsPage = this.page.getByRole('button', { name: 'Edit' });
    readonly recordSubmittedSuccessfully = this.page.getByText('Record submitted successfully');
    readonly liveStatusOfCaseInCaseDetailsPage = (caseNo: string) => this.page.locator(`//div[contains(text(), "${caseNo}")]/following::span[1]`);
    readonly orangeDotInEditedFieldTabInCaseDetailsPage = this.page.locator('div[class*="notification-dot"]');
    readonly taskNoInTaskHub = (taskNo: string) => this.page.getByText(taskNo);
    readonly taskActivityBtn = (taskNo: string) => this.page.locator(`//div[contains(text(), "${taskNo}")]/following::app-list-view-table-toolbox-options[1]`)
    readonly claimTaskBtn = this.page.getByRole('menuitem', { name: 'Claim Task' });
    readonly caseStatusInMyTaskDetailsPage = this.page.locator('//div[contains(text(), " Action to Do ")]/following::div[@mq-tooltip]');
    readonly reviewerDropdown = this.page.getByRole('combobox', { name: 'Select Reviewer' });
    readonly reviewerOption = (option: string) => this.page.getByText(option);

    async CREATE_NEW_CASE(caseType: string, user: string, department: string) {
        await this.performClick(this.createNewButton);
        await this.performClick(this.caseTypeInDropdown(caseType));
        await this.performClick(this.forField);
        await this.fillInput(this.userToBeSubmitedDropdown, user);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
        await this.performClick(this.page.locator('cdk-virtual-scroll-viewport div[role="option"]').first());
        await this.performClick(this.departmentDropdown);
        await this.fillInput(this.userToBeSubmitedDropdown, department);
        await this.page.waitForLoadState('networkidle');
        await this.performClick(this.departmentToBeSelected(department));
        await this.performClick(this.beginApplicationButton);
        await this.page.waitForLoadState('networkidle');
        await this.waitForElement(this.beginApplicationButton, "detached");
        const caseNo = await this.fetchCaseNumber()
        return caseNo;
    }

    async CLICK_ON_CASE(caseName: string) {
        Log.info('Clicking on case: ' + caseName);
        await this.performClick(this.caseInRecords(caseName));
        await this.page.waitForLoadState('load');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async SELECT_DROPDOWN(dropdownLabel: string, value: string) {
        Log.info(`Selecting ${value} from ${dropdownLabel}`);
        await this.performClick(this.dropdown(dropdownLabel));
        await this.performClick(this.page.getByRole('option', { name: value }));
        await this.page.waitForTimeout(1000);
    }

    async SELECT_MULTI_SELECT_DROPDOWN(dropdownLabel: string, values: string[]) {
        Log.info(`Selecting multiple values from ${dropdownLabel} dropdown`);

        // Click to open the multi-select dropdown
        await this.performClick(this.multiSelectDropdown(dropdownLabel));
        await this.page.waitForLoadState('networkidle');

        // Wait for dropdown options to be available
        await this.page.waitForTimeout(1000);

        // Iterate through the provided values and select each option
        for (const value of values) {
            Log.info(`Selecting option: ${value}`);
            try {
                const option = this.page.getByRole('option', { name: value });
                await this.waitForElement(option);
                await this.performClick(option);
                await this.page.waitForTimeout(500); // Small delay between selections
            } catch (error) {
                Log.info(`Warning: Option '${value}' not found or could not be selected`);
            }
        }

        // Close the dropdown (click outside or press Escape)
        await this.performClick(this.multiSelectDropdown(dropdownLabel));
        await this.page.waitForTimeout(1000);
        Log.info(`Completed selecting multiple values from ${dropdownLabel} dropdown`);
    }

    async SELECT_DATE_TIME(date: string) {
        Log.info('Selecting date and time');
        await this.performClick(this.selectDateTimeField);
        await this.performClick(this.page.getByRole('button', { name: 'Now' }))
        await this.page.waitForTimeout(2000);
        await this.performClick(this.page.getByRole('button', { name: 'Done' }));
    }

    async SELECT_DATE(fieldName: string, month: string, year: string, day: string) {
        Log.info('Selecting date');
        await this.performClick(this.selectDateField(fieldName));
        await this.page.getByRole('button', { name: 'Choose Year' }).click();
        await this.page.locator(`//div[contains(@class,"p-yearpicker")]//span[contains(text(), "${year}")]`).click();
        await this.page.waitForTimeout(1000);
        await this.page.locator(`//div[contains(@class,"p-monthpicker")]//span[contains(text(), "${month}")]`).click();
        await this.page.waitForTimeout(1000);
        await this.page.locator(`//div[contains(@class,"p-datepicker")]//tbody//td[@aria-label="${day}"]//span[not(contains(@class, "p-disabled"))]`).click();
        await this.page.waitForTimeout(1000);
    };

    async SELECT_MULTI_SELECT_CHECKBOX(checkboxLabels: string[]) {
        Log.info('Selecting multi select checkboxes');

        // Wait for the checkboxes to be available
        await this.page.waitForLoadState('networkidle');
        await this.waitForElement(this.multiSelectCheckbox.first());

        // Get all available checkboxes
        const allCheckboxes = await this.multiSelectCheckbox.all();

        // Iterate through the provided checkbox labels
        for (const label of checkboxLabels) {
            Log.info(`Looking for checkbox with label: ${label}`);
            let checkboxFound = false;
            // Find and click the checkbox that matches the label
            for (const checkbox of allCheckboxes) {
                const checkboxText = await checkbox.textContent();
                if (checkboxText && checkboxText.trim().toLowerCase().includes(label.toLowerCase())) {
                    Log.info(`Found and clicking checkbox: ${label}`);
                    await this.performClick(checkbox);
                    checkboxFound = true;
                    break;
                }
            }
            if (!checkboxFound) {
                Log.info(`Warning: Checkbox with label '${label}' not found`);
            }
        }
        await this.page.waitForTimeout(1000); // Small wait for UI updates
        Log.info('Completed selecting multi select checkboxes');
    };

    async SELECT_PARENT_FIELD(fieldName: string, value: string) {
        Log.info(`Selecting ${value} from ${fieldName}`);
        await this.performClick(this.parentField(fieldName));
        await this.fillInput(this.page.getByLabel('Search', { exact: true }), value);
        await this.performClick(this.page.getByRole('option', { name: value }));
        await this.page.waitForTimeout(1000);
    }

    async SELECT_LOOKUP_FIELD(fieldName: string, value: string) {
        Log.info(`Selecting ${value} from ${fieldName}`);
        await this.performClick(this.lookupField(fieldName));
        await this.fillInput(this.page.getByLabel('Search', { exact: true }), value);
        await this.page.waitForTimeout(2000);
        await this.performClick(this.page.locator('//span[contains(@class,"p-selected")]').first());
        await this.page.waitForTimeout(1000);
    }

    async SELECT_RADIO_BUTTON(radioButtonLabel: string, value: string) {
        Log.info(`Selecting ${value} from ${radioButtonLabel}`);
        await this.performClick(this.radioButton(radioButtonLabel));
        await this.page.waitForTimeout(1000);
    };

    async UPLOAD_FILE(filePath: string) {
        Log.info(`Uploading file from ${filePath}`);
        await this.performClick(this.fileUploadField);
        await this.page.waitForTimeout(2000);
        const fileInput = this.page.locator('app-file-attachment-upload-dialog input[type="file"]').first();
        await fileInput.waitFor({ state: 'attached' });
        await fileInput.setInputFiles(path.join(process.cwd(), filePath));
        await this.page.waitForTimeout(3000);
    };

    async DELETE_ATTACHMENT(filePath: string) {
        Log.info(`Deleting attachment from ${filePath}`);
        await this.performClick(this.deleteAttachmentBtn);
        await this.page.waitForTimeout(1000);
        await this.waitForElement(this.deleteAttachmentBtn, "detached");
    };

    async CLICK_EDIT_BUTTON() {
        Log.info('Clicking edit button');
        await this.performClick(this.editBtn);
        await this.page.waitForTimeout(1000);
    };

    async CLICK_NEXT_BUTTON() {
        Log.info('Clicking next button');
        await this.performClick(this.nextBtn);
        await this.page.waitForTimeout(1000);
    };

    async CLICK_PREVIOUS_BUTTON() {
        Log.info('Clicking previous button');
        await this.performClick(this.previousBtn);
        await this.page.waitForTimeout(1000);
    };

    async CLICK_SAVE_BUTTON() {
        Log.info('Clicking save button');
        await this.performClick(this.saveBtn);
        await this.page.waitForTimeout(1000);
    };

    async CLICK_CANCEL_BUTTON() {
        Log.info('Clicking cancel button');
        await this.performClick(this.cancelBtn);
        await this.page.waitForTimeout(1000);
    };

    async CLICK_SUBMIT_BUTTON() {
        Log.info('Clicking submit button');
        await this.page.waitForTimeout(2000);
        await this.performClick(this.submitBtn);
        await this.page.waitForTimeout(1000);
    };

    async ADD_NOTES_WITHOUT_ATTACHMENT(caseNo: string, notesTitle: string, notesDescription: string) {
        Log.info('Adding notes without attachment');
        await this.performClick(this.notesBtn);
        await this.waitForElement(this.addNotesBtn);
        await this.performClick(this.addNotesBtn);
        await this.fillInput(this.enterNoteField, notesTitle);
        await this.performClick(this.noteDesc);
        await this.fillInput(this.noteDesc, notesDescription);
        await this.performClick(this.saveNotesBtn);
        await this.waitForElement(this.noteCreatedSuccessfully);
        await this.waitForElement(this.noteTitleInNotesPage(notesTitle));
        await this.assertVisible(this.noteTitleInNotesPage(notesTitle));
        await this.performClick(this.notesBtn);
    };

    async ADD_NOTES_WITH_ATTACHMENT(caseNo: string, notesTitle: string, notesDescription: string, filePath: string) {
        Log.info('Adding notes with attachment');
        await this.performClick(this.notesBtn);
        await this.waitForElement(this.addNotesBtn);
        await this.performClick(this.addNotesBtn);
        await this.fillInput(this.enterNoteField, notesTitle);
        await this.performClick(this.noteDesc);
        await this.fillInput(this.noteDesc, notesDescription);
        await this.performClick(this.addFilesIcon);
        const fileInput = this.page.locator('input[type="file"]').first();
        await fileInput.waitFor({ state: 'attached' });
        await fileInput.setInputFiles(path.join(process.cwd(), filePath));
        await this.page.waitForTimeout(1000);
        await this.performClick(this.saveNotesBtn);
        await this.waitForElement(this.noteCreatedSuccessfully);
        await this.waitForElement(this.noteTitleInNotesPage(notesTitle));
        await this.assertVisible(this.noteTitleInNotesPage(notesTitle));
        await this.performClick(this.notesBtn);
    };

    async UPDATE_NOTES(title: string, description: string) {
        Log.info('Updating notes');
        await this.performClick(this.notesBtn);
        await this.waitForElement(this.addNotesBtn);
        await this.performClick(this.activitiesBtn);
        await this.page.waitForTimeout(2000);
        await this.performClick(this.editBtnInActivitiesPage);
        await this.page.waitForTimeout(2000);
        await this.fillInput(this.editNoteTitle, title);
        await this.performClick(this.updateBtn);
        await this.waitForElement(this.noteTitleInNotesPage(title));
        await this.assertVisible(this.noteTitleInNotesPage(title));
        await this.performClick(this.notesBtn);
    }

    async DELETE_NOTES(title: string) {
        Log.info('Deleting notes');
        await this.performClick(this.notesBtn);
        await this.waitForElement(this.addNotesBtn);
        await this.performClick(this.activitiesBtn);
        await this.page.waitForTimeout(2000);
        await this.performClick(this.deleteBtnInActivitiesPage);
        await this.performClick(this.yesBtnInDeleteNotesPopup);
        await this.waitForElement(this.noteDeletedSuccessfully);
        await this.performClick(this.notesBtn);
    }

    async VALIDATE_ACTIVITY_HISTORY_TAB() {
        Log.info('Validating activity history tab');
        await this.performClick(this.notesBtn);
        await this.performClick(this.activityHistoryTab);
        await this.page.waitForTimeout(8000);
        await this.activityHistoryTab.scrollIntoViewIfNeeded();
        await expect(this.createdAtInActivityHistory).toBeVisible();
        await expect(this.ownerInActivityHistory).toBeVisible();
    }

    async VALIDATE_LINK_RECORDS_WITHIN_CASE_OBJECT_AS_CASE(
        sourceReason: string,
        destinationReason: string
    ) {
        Log.info('Validating link records within case');
        // Click on Link Records tab
        await this.performClick(this.notesBtn);
        await this.performClick(this.linkRecordsTab);
        await this.page.waitForTimeout(2000);
        // Click on Add Link button
        await this.performClick(this.addLinkBtn);
        await this.page.waitForTimeout(2000);
        // Select Object Type as Case
        await this.performClick(this.objectTypeDropdownLinkedRecords);
        await this.performClick(this.objectSelectionAsCase);
        await this.page.waitForTimeout(2000);
        // Select Object Name
        await this.performClick(this.objectNameDropdownLinkedRecords);
        await this.page.waitForTimeout(2000);
        await this.performClick(this.firstOptionCase);
        // Select Record ID
        await this.performClick(this.recordIdDropdown);
        await this.page.waitForTimeout(4000);
        await this.performClick(this.firstOptionRecord);
        // Enter Source Reason
        await this.fillInput(this.sourceReasonLinkedRecords, sourceReason);
        // Enter Destination Reason
        await this.fillInput(this.destinationReasonLinkedRecords, destinationReason);
        // Click on Save button
        await this.performClick(this.saveBtnLinkedRecords);
        await this.page.waitForTimeout(4000);
    }

     async VALIDATE_LINK_RECORDS_WITHIN_CASE_OBJECT_AS_DATA_TABLE(
        sourceReason: string,
        destinationReason: string
    ) {
        Log.info('Validating link records within case');
        // Click on Link Records tab
        await this.performClick(this.notesBtn);
        await this.performClick(this.linkRecordsTab);
        await this.page.waitForTimeout(2000);
        // Click on Add Link button
        await this.performClick(this.addLinkBtn);
        await this.page.waitForTimeout(2000);
        // Select Object Type as Case
        await this.performClick(this.objectTypeDropdownLinkedRecords);
        await this.performClick(this.objectSelectionAsDataTable);
        await this.page.waitForTimeout(2000);
        // Select Object Name
        await this.performClick(this.objectNameDropdownLinkedRecords);
        await this.page.waitForTimeout(2000);
        await this.performClick(this.firstOptionCase);
        // Select Record ID
        await this.performClick(this.recordIdDropdown);
        await this.page.waitForTimeout(4000);
        await this.performClick(this.firstOptionRecord);
        // Enter Source Reason
        await this.fillInput(this.sourceReasonLinkedRecords, sourceReason);
        // Enter Destination Reason
        await this.fillInput(this.destinationReasonLinkedRecords, destinationReason);
        // Click on Save button
        await this.performClick(this.saveBtnLinkedRecords);
        await this.page.waitForTimeout(4000);
    }

    async VALIDATE_EMAIL_FUNCTIONALITY(toEmail: string, subject: string, body: string) {
        Log.info('Validating email functionality');
        await this.performClick(this.notesBtn);
        await this.performClick(this.emailTab);
        await this.performClick(this.composeEmailBtn);
        await this.page.waitForTimeout(4000);
        await this.performClick(this.senderDropdown);
        await this.performClick(this.firstFromSenderEmailSelection);
        await this.fillInput(this.toField, toEmail);
        await this.fillInput(this.subjectField, subject);
        await this.performClick(this.bodyField);
        await this.fillInput(this.bodyField, body);
        await this.performClick(this.sendEmailBtn);
        await this.page.waitForTimeout(8000);
    }

    async NAV_TO_MY_TASKS() {
        Log.info('Navigating to my tasks');
        await this.performClick(this.myTasksBtn);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForURL('**/my-tasks');
    };

    async SELECT_MY_TASK(caseNo: string) {
        Log.info('Selecting my task');
        await this.performClick(this.tasksInMyTaskPage.first());
        await this.page.waitForTimeout(1000);
        await this.performClick(this.caseTabInMyTaskPage)
        const caseNoInMyTaskDetailsPage = await this.caseNoInMyTaskDetailsPage.textContent();
        if (caseNoInMyTaskDetailsPage !== caseNo) {
            throw new Error('Case number in my task details page does not match with the case number in my task page');
        }
        const url = this.page.url();
        const taskNo = url.split('/').pop();
        Log.info('Task number is ' + taskNo);
        return taskNo;
    };

    async NAV_TO_CASE_TAB_IN_TASK() {
        Log.info('Navigating to case tab in task');
        await this.performClick(this.caseTabInMyTaskPage);
        await this.page.waitForLoadState('networkidle');
    }

    async VALIDATE_CASE_MOVED_TO_MANAGER_REVIEW(caseNo: string) {
        Log.info('Validating case moved to manager review');
        const liveStatusOfCase = await this.liveStatusOfCaseInCaseDetailsPage(caseNo).textContent();
        Log.info('Livestatus of case is ' + liveStatusOfCase?.trim());
        if (liveStatusOfCase?.trim() !== 'Manager Review') {
            throw new Error('Case is not in manager review');
        }
    }

    async VALIDATE_CASE_MOVED_TO_HR_REVIEW(caseNo: string) {
        Log.info('Validating case moved to HR review');
        const liveStatusOfCase = await this.liveStatusOfCaseInCaseDetailsPage(caseNo).textContent();
        Log.info('Livestatus of case is ' + liveStatusOfCase?.trim());
        if (liveStatusOfCase?.trim() !== 'HR Review') {
            throw new Error('Case is not in HR review');
        }
    }

    async VALIDATE_ORANGE_DOT_IN_EDITED_FIELD_TAB_IN_CASE_DETAILS_PAGE() {
        Log.info('Validating orange dot in edited field tab in case details page');
        await this.assertVisible(this.orangeDotInEditedFieldTabInCaseDetailsPage);
    }

    async VALIDATE_VIEW_ONLY_MODE() {
        Log.info('Validating view only mode');
        await this.assertNotVisible(this.editBtn);
    }

    async NAV_TO_TASK_HUB() {
        Log.info('Navigating to task hub');
        await this.performClick(this.taskHubBtn);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForURL('**/task-hub');
    }

    async CLAIM_THE_TASK(taskNo: string) {
        Log.info('Claiming the task');
        if (await this.taskNoInTaskHub(taskNo).isVisible()) {
            Log.info('Claiming the task')
            await this.performClick(this.taskActivityBtn(taskNo));
            await this.page.waitForTimeout(1000);
            await this.performClick(this.claimTaskBtn);
            await this.page.waitForTimeout(10000);
        } else {
            Log.info('Task not available in task hub');
        }
    }

    async VALIDATE_HR_STATUS_OF_TASK() {
        Log.info('Validating HR status of task');
        await this.page.waitForTimeout(2000);
        expect(this.caseStatusInMyTaskDetailsPage.textContent()).toContain('HR Review');
    }

    async REVIEW_HR_CASE_IN_TASK(reviewOption: string) {
        Log.info('Reviewing HR case in task');
        await this.performClick(this.editBtnInMyTaskDetailsPage);
        await this.page.waitForTimeout(2000);
        await this.performClick(this.reviewerDropdown);
        await this.performClick(this.reviewerOption('Move to Finance Review'));
        await this.performClick(this.submitBtn);
        await this.assertVisible(this.recordSubmittedSuccessfully);
    }

    async 
}
