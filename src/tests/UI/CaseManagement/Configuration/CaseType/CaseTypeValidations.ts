import { EnvConfig } from "../../../../../config/EnvConfig";
import { test } from "../../../../../hooks/hooks";
import { HomePage } from "../../../../../pages/HomePage/HomePage";
import { LoginPage } from "../../../../../pages/Login/loginPage";

test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
        EnvConfig.admin_username,
        EnvConfig.admin_password,
    );
    await homePage.NAV_TO_DASHBOARD();
})

test.describe('Case Type Validations', () => {
    test('Validate if user is able to view all created case types', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.
    })
})

