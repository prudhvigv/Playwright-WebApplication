import { EnvConfig } from '../../../../../config/EnvConfig';
import { test } from '../../../../../hooks/hooks';
import { Assignments } from '../../../../../pages/Assignments/assignments';
import { HomePage } from '../../../../../pages/HomePage/HomePage';
import { LoginPage } from '../../../../../pages/Login/loginPage';
import { VaultHub } from '../../../../../pages/Vault_Hub/VaultHub';

const FILE_NAME = 'ID Card_6_Assignments.pdf';

test.beforeEach('Login step', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
    EnvConfig.admin_username,
    EnvConfig.admin_password,
  );
  await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
});

test.describe('Assignments', async () => {
    test('Validate if Approved CI is reflecting in Assignments screen with valid status', async ({page}) => {
        const assignments = new Assignments(page);
        await assignments.VALIDATE_IF_CREATED_APPROVED_CI_DISPLAYED(`/src/test-data/Assignments/${FILE_NAME}`)
    })

    test('Validate if Rejected CI is reflecting in Assignments screen with valid status', async ({page}) => {
        const assignments = new Assignments(page);
        await assignments.VALIDATE_IF_CREATED_REJECTED_CI_DISPLAYED(`/src/test-data/Assignments/${FILE_NAME}`)
    })

    test('Validate if Un-Assigned CI`s are displayed in Un-Assigned CI table in Assignments page', async ({page}) => {
        const assignments = new Assignments(page);
        await assignments.VALIDATE_UNASSIGNED_CI(`/src/test-data/Assignments/${FILE_NAME}`);
    })
});

test.describe('Assignments -> Pagination functionalities', async () => {

  test('@Sanity Valid input & Invalid input & Records selected functionality', async ({ page }) => {
    const assignments = new Assignments(page);
    const vaultHub = new VaultHub(page);
    // Check if NoResult locator is not visible
    const noResultVisible = await vaultHub.noResultsInVaultHub.isVisible();
    if (!noResultVisible) {
      await assignments.VALIDATE_ASSIGNMENTS_VALID_PAGINATION();
      await assignments.VALIDATE_ASSIGNMENTS_INVALID_INPUT();
      await assignments.VALIDATE_RECORDS_SELECTED(10);
      await assignments.VALIDATE_RECORDS_SELECTED(15);
      await assignments.VALIDATE_RECORDS_SELECTED(25);
      await assignments.VALIDATE_RECORDS_SELECTED(50);
      await assignments.VALIDATE_RECORDS_SELECTED(100);
    } else {
      test.skip();
    }
  });
})