import { expect } from '@playwright/test';
import { BaseClass } from "../../../config/BaseClass";
import { Log } from "../../../utils/Log";
import { newDepartment as DepartmentData } from "../../../test-data/IAM/create-department.json";
import { faker, Faker } from "@faker-js/faker";
import { LoginPage } from '../../Login/loginPage';
import { HomePage } from "../../HomePage/HomePage";


const DepartmentLabel = DepartmentData.label + faker.company.name().replace(/[^a-zA-Z0-9]/g, '');
const DepartmentName = DepartmentData.name + faker.company.name().replace(/[^a-zA-Z0-9]/g, '');
const Description = DepartmentData.description + faker.lorem.sentence().replace(/[^a-zA-Z0-9]/g, '');
const SEARCH_DEPT = DepartmentLabel;
const dept_Table = 'app-list-view';



export class createNewDepartment extends BaseClass {
    readonly loginPage = new LoginPage(this.page);
    readonly homePage = new HomePage(this.page);

    readonly createDepartmentButton = this.page.getByRole('button', { name: 'Create Department' });
    readonly departmentLabel = this.page.getByPlaceholder('Enter Department Label');
    readonly departmentName = this.page.getByRole('textbox', { name: 'Department Name' });
    readonly description = this.page.getByPlaceholder('Enter Description');
    readonly parentDepartmentDropdown = this.page.getByRole('combobox', { name: 'Select Parent Department' });
    readonly parentDepartmentSelection = this.page.getByRole('listbox', { name: 'Option List' }).first();
    readonly saveButton = this.page.getByRole('button', { name: 'Save' });
    readonly mandatoryError = (fieldName: string) =>
        this.page
            .locator(`[data-test="${fieldName}"]`)
            .getByText('This field is required');
    readonly departmentInTable = (departmentName: string) => this.page.getByText(departmentName).first();
    readonly searchInput = this.page.locator('app-list-header').getByRole('textbox', { name: 'Search' });
    readonly editButton = this.page.getByRole('button', { name: 'icon' });


    async navigateToDepartmentsPage() {
        await this.navigateToLinkInSidekick('Departments');
        await this.assertURLContains('departments', 80000);
    }

    async clickCreateDepartmentButton() {
        await this.performClick(this.createDepartmentButton);
        await this.page.waitForLoadState('networkidle');
    }

    async navigateToCreateDepartmentPage() {
        Log.info('NAVIGATE TO CREATE DEPARTMENT PAGE');
        await this.homePage.navigateToDashboard();
        await this.navigateToDepartmentsPage();
        await this.clickCreateDepartmentButton();
    }

    async enterValidData() {
        Log.info('CREATE VALID DEPARTMENT BY ENTERING VALID DATA');
        await this.clickCreateDepartmentButton();
        await this.departmentLabel.fill(DepartmentLabel);
        await this.description.fill(Description);
        await this.parentDepartmentDropdown.click();
        await this.parentDepartmentSelection.click();
        await this.saveButton.waitFor({ state: 'visible', timeout: 80000 });
        await this.performClick(this.saveButton);
        await this.page.waitForTimeout(2000);
    }

    async validateCreatedDepartment() {
        Log.info('VALIDATE CREATED DEPARTMENT');
        await this.waitForElement(this.searchInput);
        await this.fillInput(this.searchInput, DepartmentLabel);
        await this.page.waitForLoadState('networkidle');
        const userRow = this.page.getByRole('cell', {
            name: `${SEARCH_DEPT}`,
            exact: true,
        });
        await expect(userRow).toBeVisible({ timeout: 80000 });
    }

    async validateMandatoryError() {
        Log.info('VALIDATE MANDATORY ERROR');
        await this.departmentLabel.fill('');
        await this.performClick(this.departmentName);
        await this.assertVisible(this.mandatoryError('Department Label'));
    }

    async validateSaveBtnDisabled() {
        Log.info('VALIDATE SAVE BUTTON DISABLED');
        await this.clickCreateDepartmentButton();
        await expect(this.saveButton).toBeDisabled();
    }

    async CREATE_VALID_DEPARTMENT() {
        await this.enterValidData();
        await this.page.waitForLoadState('networkidle');
        Log.info('VALID DEPARTMENT CREATED SUCCESSFULLY');
    }

    async VALIDATE_ERROR_ON_MANDATORY_FIELDS() {
        await this.navigateToCreateDepartmentPage();
        Log.info('VALIDATE ERROR ON MANDATORY FIELDS');
        await this.validateMandatoryError();
    }

    async Update_department() {
        Log.info('UPDATE DEPARTMENT');
        await this.performClick(this.departmentInTable(DepartmentLabel));
        await this.performClick(this.editButton);
        await this.departmentLabel.fill(DepartmentLabel);
        await this.description.fill(Description);
        await this.performClick(this.saveButton);
    }

    async searchCreatedDepartment() {
        Log.info('SEARCH CREATED DEPARTMENT');
        await this.fillInput(this.searchInput, DepartmentLabel);
        await this.page.waitForLoadState('networkidle');
        await this.performClick(this.departmentInTable(DepartmentLabel));
    }
    
    async VALIDATE_PAGINATION() {
        await this.validatePaginationInFile(dept_Table)
    }
}
