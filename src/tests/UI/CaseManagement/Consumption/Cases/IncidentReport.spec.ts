import { EnvConfig } from '../../../../../config/EnvConfig';
import { test } from '../../../../../hooks/hooks';
import { IncidentReport } from '../../../../../pages/CaseManagement/IncidentReport';
import { HomePage } from '../../../../../pages/HomePage/HomePage';
import { LoginPage } from '../../../../../pages/Login/loginPage';

test.beforeEach('Login step', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page)
    await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
      EnvConfig.admin_username,
      EnvConfig.admin_password,
    );
    await homePage.SELECT_APP_TO_CASE_MANAGEMENT();
});

test.describe('Incident Report', async () => {
    test('Create a report', async ({page}) => {
        const incidentReport = new IncidentReport(page);
        await incidentReport.CREATE_INCIDENT_REPORT('Incident Report', EnvConfig.std_username, 'mavQ System Dept');
    })
})