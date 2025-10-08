import { EnvConfig } from '../../../../../config/EnvConfig';
import { test } from '../../../../../hooks/hooks';
import { DataTable } from '../../../../../pages/DataTable/DataTable';
import { HomePage } from '../../../../../pages/HomePage/HomePage';
import { LoginPage } from '../../../../../pages/Login/loginPage';

test.describe('DataTable Tests', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);
        await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
            EnvConfig.admin_username,
            EnvConfig.admin_password,
        );
        await homePage.SELECT_APP_TO_CASE_MANAGEMENT();
    })

    test('DataTable --> Add, View, Edit Records', async ({page}) => {
        const dataTable = new DataTable(page);
        await dataTable.NAV_TO_DATATABLE();
        await dataTable.SELECT_DT('DataTable1')
        const recordCreated = await dataTable.ADD_RECORD();
        if (recordCreated !== null) {
            await dataTable.SELECT_RECORD_IN_TABLE(recordCreated);
            await dataTable.EDIT_RECORD(recordCreated);
        } else {
            throw new Error('Failed to create record: recordCreated is null');
        }
    });

    test('Validate if user is able to cancel record creation', async ({page}) => {
        const dataTable = new DataTable(page);
        await dataTable.NAV_TO_DATATABLE();
        await dataTable.SELECT_DT('DataTable1')
        await dataTable.CANCEL_RECORD();
    });

    test('Validate if user is able to add record with invalid data', async ({page}) => {
        const dataTable = new DataTable(page);
        await dataTable.NAV_TO_DATATABLE();
        await dataTable.SELECT_DT('DataTable1');
        await dataTable.ADD_RECORD_WITH_INVALID_DATA();
    });

    test('Validate if user is able to view error message when mandatory fields are not filled', async ({page}) => {
        const dataTable = new DataTable(page);
        await dataTable.NAV_TO_DATATABLE();
        await dataTable.SELECT_DT('DataTable1');
        await dataTable.ADD_RECORD_WITH_MANDATORY_FIELDS_NOT_FILLED();
    });

    test('Validate if error is visible when user tried to enter data in mandatory field and delete it', async ({page}) => {
        const dataTable = new DataTable(page);
        await dataTable.NAV_TO_DATATABLE();
        await dataTable.SELECT_DT('DataTable1');
        await dataTable.VALIDATE_ERROR_ON_MANDATORY_FIELDS();
    });
})