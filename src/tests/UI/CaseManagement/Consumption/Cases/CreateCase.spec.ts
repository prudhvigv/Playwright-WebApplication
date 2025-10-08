import { EnvConfig } from '../../../../../config/EnvConfig';
import { test } from '../../../../../hooks/hooks';
import { ITRequestCasePage } from '../../../../../pages/CaseManagement/ITRequest_Case';
import { HomePage } from '../../../../../pages/HomePage/HomePage';
import { LoginPage } from '../../../../../pages/Login/loginPage';
import { Log } from '../../../../../utils/Log';

test.beforeEach(async ({page}) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    await loginPage.LOGIN_WITH_VALID_CREDENTIALS(EnvConfig.admin_username, EnvConfig.admin_password);
    await homePage.SELECT_APP_TO_CASE_MANAGEMENT();
})

test('Create IT Request Case', async ({page}) => {
    const itRequestPage = new ITRequestCasePage(page);
    const caseNumber = await itRequestPage.CREATE_NEW_CASE('IT Request System', 'Prudhvi Admin', 'mavQ System Dept');
    Log.info('Case number is ' + caseNumber);
})