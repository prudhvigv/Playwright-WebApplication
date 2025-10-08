import { expect } from "@playwright/test";
import { BaseClass } from "../../config/BaseClass";
import { Log } from "../../utils/Log";
import { HomePage } from "../HomePage/HomePage";

const FIRST_NAME = 'First DT';
const MIDDLE_NAME = 'Middle DT';
const LAST_NAME = 'Last DT';
const PERSONAL_EMAIL = 'test@mavq.com';
const FIRST_NAME_EDIT = 'First DT Edit';
const MIDDLE_NAME_EDIT = 'Middle DT Edit';
const LAST_NAME_EDIT = 'Last DT Edit';
const PERSONAL_EMAIL_EDIT = 'test@mavq.com Edit';

export class DataTable extends BaseClass {

    readonly homePage = new HomePage(this.page);

    readonly dataTableLink = this.page.getByRole('link', { name: 'Data Table' });
    readonly selectDTLabel = this.page.getByText('Select Table').first();
    readonly selectDTDropdown = this.page.locator('app-single-select-dropdown p-select span[role="combobox"]');
    readonly searchDTInDropdown = this.page.getByRole('searchbox')
    readonly DTinDropdownOption = (DTName: string) => this.page.getByRole('option', { name: DTName });
    readonly addRecordBtn = this.page.getByRole('button', { name: 'Add Record' });
    readonly firstNameInput = this.page.locator('[data-test="formFieldLongText"]').getByRole('textbox');
    readonly middleNameInput = this.page.locator('[data-test="Customer Middle Name"]').getByRole('textbox');
    readonly lastNameInput = this.page.locator('[data-test="Customer Last Name"]').getByRole('textbox');
    readonly personalEmailInput = this.page.locator('[data-test="Personal Email"]').getByRole('textbox');
    readonly cancelBtn = this.page.getByRole('button', { name: 'Cancel' });
    readonly saveBtn = this.page.getByRole('button', { name: 'Save' });
    readonly DTRecordInDetailsPage = this.page.locator('span[class*="metadata-desc"]');
    readonly backBtnInDetailsPage = this.page.locator('.mq-icon.notranslate.back-arrow > svg');
    readonly valueInDetailsPage = (value: string) => this.page.locator(`//span[contains(text(), "${value}")]`);
    readonly editBtnInDetailsPage = this.page.getByRole('button', { name: 'Edit' });
    readonly activitiesBtnForRecord = (record: string) =>
        this.page
            .getByRole('row')
            .filter({ hasText: record })
            .getByLabel('Activities');
    readonly deleteBtnInActivitiesPage = this.page.getByRole('menuitem', { name: 'Delete' });
    readonly confirmDeleteBtn = this.page.getByRole('button', { name: 'Delete' });
    readonly errorForInValidEmail = this.page.locator('div[class*="error-container"] mq-icon[data-mq-icon-name="error_icon"]');
    readonly errorForNoDataEntered = this.page.locator('//span[contains(text(), "Resolve All validations errors before saving")]')
    readonly errorMsgForFirstName = this.page.locator('div').filter({ hasText: /^Customer First Name is required$/ });
    readonly errorIconForFirstName = this.page.getByLabel('Tab One').locator('mq-icon path').first();

    async NAV_TO_DATATABLE() {
        Log.info('NAVIGATING TO DATATABLE PAGE');
        if (!(this.page.url().includes('data-table'))) {
            await this.homePage.SELECT_APP_TO_CASE_MANAGEMENT();
        }
        await this.navigateToLinkInSidekick('Data Table');
        await this.assertURLContains('data-table', 80000);
        await this.page.waitForLoadState('networkidle');
        await this.assertVisible(this.selectDTLabel);
    };

    async SELECT_DT(DTName: string) {
        Log.info(`SELECTING DT ${DTName}`);
        await this.performClick(this.selectDTDropdown);
        await this.fillInput(this.searchDTInDropdown, DTName);
        await this.performClick(this.DTinDropdownOption(DTName));
        await this.page.waitForLoadState('load');
        await this.page.waitForTimeout(2000)
        await this.waitForElement(this.activitiesBtnForRecord('DT').first())
    };

    async ADD_RECORD_WITH_INVALID_DATA() {
        Log.info('ADDING RECORD WITH INVALID DATA');
        await this.performClick(this.addRecordBtn);
        await this.assertVisible(this.firstNameInput);
        await this.fillInput(this.firstNameInput, FIRST_NAME);
        await this.fillInput(this.middleNameInput, MIDDLE_NAME);
        await this.fillInput(this.lastNameInput, LAST_NAME);
        await this.fillInput(this.personalEmailInput, 'test');
        await this.performClick(this.saveBtn);
        await this.assertVisible(this.errorForInValidEmail);
    }

    async CANCEL_RECORD() {
        Log.info('CANCELING RECORD');
        await this.performClick(this.addRecordBtn);
        await this.assertVisible(this.firstNameInput);
        await this.fillInput(this.firstNameInput, FIRST_NAME);
        await this.fillInput(this.middleNameInput, MIDDLE_NAME);
        await this.fillInput(this.lastNameInput, LAST_NAME);
        await this.fillInput(this.personalEmailInput, PERSONAL_EMAIL);
        await this.performClick(this.cancelBtn);
        await this.assertVisible(this.selectDTLabel);
    }

    async ADD_RECORD_WITH_MANDATORY_FIELDS_NOT_FILLED() {
        Log.info('ADDING RECORD WITH MANDATORY FIELDS NOT FILLED');
        await this.performClick(this.addRecordBtn);
        await this.assertVisible(this.firstNameInput);
        await this.performClick(this.saveBtn);
        await this.assertVisible(this.errorForNoDataEntered);
    }

    async VALIDATE_ERROR_ON_MANDATORY_FIELDS() {
        Log.info('VALIDATING ERROR ON MANDATORY FIELDS');
        await this.performClick(this.addRecordBtn);
        await this.assertVisible(this.firstNameInput);
        await this.fillInput(this.firstNameInput, FIRST_NAME);
        await this.performClick(this.lastNameInput);
        await this.fillInput(this.firstNameInput, '');
        await this.performClick(this.lastNameInput);
        await this.assertVisible(this.errorIconForFirstName);
    }

    async FETCH_FIRST_RECORD_IN_TABLE() {
        Log.info('FETCHING FIRST RECORD IN TABLE');
        const firstRecord = await this.page.locator('app-list-view-table table div[mq-tooltip]').first().textContent();
        return firstRecord;
    }

    async NAV_BACK_TO_TABLE() {
        Log.info('NAVIGATING BACK TO TABLE');
        await this.performClick(this.backBtnInDetailsPage);
        await this.waitForElement(this.selectDTLabel);
    }

    async ADD_RECORD() {
        Log.info('ADDING RECORD');    
        const firstRecordBefore = await this.FETCH_FIRST_RECORD_IN_TABLE();
        Log.info('FIRST RECORD IN TABLE IS BEFORE ADDING RECORD' + firstRecordBefore);
        await this.performClick(this.addRecordBtn);
        await this.assertVisible(this.firstNameInput);
        await this.fillInput(this.firstNameInput, FIRST_NAME);
        await this.fillInput(this.middleNameInput, MIDDLE_NAME);
        await this.fillInput(this.lastNameInput, LAST_NAME);
        await this.fillInput(this.personalEmailInput, 'test@mavq.com');
        await this.performClick(this.saveBtn);
        await this.waitForElement(this.DTRecordInDetailsPage);
        const recordCreated = await this.DTRecordInDetailsPage.textContent();
        Log.info('RECORD CREATED IS ' + recordCreated);
        expect(recordCreated).not.toBe(firstRecordBefore);
        await this.validateDataInRecordCreated();
        await this.performClick(this.backBtnInDetailsPage);
        await this.page.waitForLoadState('load');
        await this.waitForElement(this.activitiesBtnForRecord('DT').first());
        const firstRecordAfter = await this.FETCH_FIRST_RECORD_IN_TABLE();
        Log.info('FIRST RECORD IN TABLE IS AFTER ADDING RECORD' + firstRecordAfter);
        expect(firstRecordAfter).not.toBe(firstRecordBefore);
        return recordCreated;
    }

    async validateDataInRecordCreated() {
        Log.info('VALIDATING DATA IN RECORD CREATED');
        await this.assertVisible(this.valueInDetailsPage(FIRST_NAME));
        await this.assertVisible(this.valueInDetailsPage(MIDDLE_NAME));
        await this.assertVisible(this.valueInDetailsPage(LAST_NAME));
        await this.assertVisible(this.valueInDetailsPage(PERSONAL_EMAIL));
    }

    async SELECT_RECORD_IN_TABLE(record: string) {
        Log.info('SELECTING RECORD IN TABLE');
        await this.performClick(this.page.locator('app-list-view-table table div[mq-tooltip]').getByText(record));
        await this.waitForElement(this.DTRecordInDetailsPage);
        const recordSelected = await this.DTRecordInDetailsPage.textContent();
        Log.info('RECORD SELECTED IS ' + recordSelected);
        expect(recordSelected).toBe(record);
    };

    async EDIT_RECORD(record: string) {
        Log.info('EDITING RECORD' + record);
        await this.performClick(this.editBtnInDetailsPage);
        await this.page.waitForTimeout(2000);
        await this.fillInput(this.firstNameInput, FIRST_NAME_EDIT);
        await this.fillInput(this.middleNameInput, MIDDLE_NAME_EDIT);
        await this.fillInput(this.lastNameInput, LAST_NAME_EDIT);
        await this.fillInput(this.personalEmailInput, PERSONAL_EMAIL_EDIT);
        await this.performClick(this.saveBtn);
        await this.waitForElement(this.DTRecordInDetailsPage);
        const recordEdited = await this.DTRecordInDetailsPage.textContent();
        Log.info('RECORD EDITED IS ' + recordEdited);
        expect(recordEdited).toBe(record);
        await this.NAV_BACK_TO_TABLE();
    }
 
}