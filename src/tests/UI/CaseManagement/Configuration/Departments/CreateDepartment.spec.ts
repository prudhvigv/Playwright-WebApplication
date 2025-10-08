import { test } from '../../../../../hooks/hooks';
import { LoginPage } from '../../../../../pages/Login/loginPage';
import { createNewDepartment } from '../../../../../pages/IAM/DEPARTMENTS/CreateNewDepartments';
import { EnvConfig } from '../../../../../config/EnvConfig';
import { HomePage } from '../../../../../pages/HomePage/HomePage';


test.beforeEach('Login step', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const createDepartmentPage = new createNewDepartment(page);
  await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
    EnvConfig.admin_username,
    EnvConfig.admin_password,
  );
  await homePage.navigateToDashboard();
  await createDepartmentPage.navigateToDepartmentsPage();
});


test.describe('Validate department creation scenarios', () => {
    test('user should be displayed with Save button as disabled when no data is entered', async ({ page }) => {
        const createDepartmentPage = new createNewDepartment(page);
        await createDepartmentPage.validateSaveBtnDisabled();
    })

    test('user should be able to see mandatory error when no data is entered', async ({
        page,
    }) => {
        const createDepartmentPage = new createNewDepartment(page);
        await createDepartmentPage.VALIDATE_ERROR_ON_MANDATORY_FIELDS();
    });

    test('User is able to create, Search and Update a valid department', async({page})=>{
        const createDepartmentPage = new createNewDepartment(page);
        await createDepartmentPage.CREATE_VALID_DEPARTMENT();
        await createDepartmentPage.searchCreatedDepartment();
        await createDepartmentPage.Update_department();
    });

    test('User is able to validate pagination', async({page})=>{
        const createDepartmentPage = new createNewDepartment(page);
        await createDepartmentPage.VALIDATE_PAGINATION();
    });
})