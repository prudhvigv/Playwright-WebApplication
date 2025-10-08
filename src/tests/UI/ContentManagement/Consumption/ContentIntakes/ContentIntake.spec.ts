import { EnvConfig } from '../../../../../config/EnvConfig';
import { test } from '../../../../../hooks/hooks';
import { contentIntake } from '../../../../../pages/ContentIntake/contentIntake';
import { HomePage } from '../../../../../pages/HomePage/HomePage';
import { LoginPage } from '../../../../../pages/Login/loginPage';
import { myVault } from '../../../../../pages/MyVault/myVault';
import { VaultHub } from '../../../../../pages/Vault_Hub/VaultHub';
import { Log } from '../../../../../utils/Log';

const FILE_NAME = 'ID Card_6_CI.pdf';
const SIGNATURE_FILE = 'Slip_1 - Copy_CI.pdf'

test.beforeEach('Login step', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
    EnvConfig.admin_username,
    EnvConfig.admin_password,
  );
  await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
});

test.describe('Verify Approve, Reject CI functionality', async () => {
  test('Content Intake - Approve CI', async ({page}) => {
    const CIPage = new contentIntake(page);
    const myVaulPage = new myVault(page);
    try {
      await myVaulPage.NAV_TO_MY_VAULT();
      await myVaulPage.DELETE_FILE([FILE_NAME]);
    } catch (error) {
      Log.info('error');
    }
    await CIPage.NAV_TO_CI();
    const CI_CREATED = await CIPage.CREATE_CI([`/src/test-data/ContentIntake/${FILE_NAME}`]);
    await CIPage.NAV_TO_CI();
    await CIPage.PERFORM_ASSIGN_TO_ME(CI_CREATED);
    await CIPage.APPROVE_CI(CI_CREATED);
  })

  test('Content Intake - Reject CI', async ({page}) => {
    const CIPage = new contentIntake(page);
    const myVaulPage = new myVault(page);
    try {
      await myVaulPage.NAV_TO_MY_VAULT();
      await myVaulPage.DELETE_FILE([FILE_NAME]);
    } catch (error) {
      Log.info('error');
    }
    await CIPage.NAV_TO_CI();
    const CI_CREATED = await CIPage.CREATE_CI([`/src/test-data/ContentIntake/${FILE_NAME}`]);
    await CIPage.NAV_TO_CI();
    await CIPage.PERFORM_ASSIGN_TO_ME(CI_CREATED);
    await CIPage.REJECT_CI(CI_CREATED);
  })
})

// test.describe('Verify that the user is able to search the CI on the CI list page.', async () => {
//   test('Content Intake - Search Functionality', async ({ page }) => {
//     const CIPage = new contentIntake(page);
//     await CIPage.NAV_TO_CI();
//     await CIPage.searchCI();
//   });
// });

test.describe('Verify that the user is able to apply the sort-on on the CI list page.', async () => {
  test('ContentIntake - Sort', async ({ page }) => {
    const CIPage = new contentIntake(page);
    await CIPage.NAV_TO_CI();
    await CIPage.validateSort();
  });
});

test.describe('Content Intake -> Pagination functionalities', async () => {
    test('@Sanity Valid input & Invalid input & Records selected functionality', async ({page}) => {
      const CIPage = new contentIntake(page);
      const vaultHub = new VaultHub(page);
      await CIPage.NAV_TO_CI();
      const noResultVisible = await vaultHub.noResultsInVaultHub.isVisible();
      if (!noResultVisible) {
        await CIPage.VALIDATE_CI_VALID_PAGINATION();
        await CIPage.VALIDATE_CI_INVALID_INPUT();
        await CIPage.VALIDATE_RECORDS_SELECTED(10);
        await CIPage.VALIDATE_RECORDS_SELECTED(15);
        await CIPage.VALIDATE_RECORDS_SELECTED(25);
        await CIPage.VALIDATE_RECORDS_SELECTED(50);
        await CIPage.VALIDATE_RECORDS_SELECTED(100);
      } else {
        test.skip();
      }
    });
  });

  test.describe('Content Intake -> E2E Validation', async () => {
    test('@Sanity Validate if CR is created when CI is created and validate the content of attachment post workflow executed', async ({ page }) => {
      const CIPage = new contentIntake(page);
      const CREATE_CI_NUMBER = await CIPage.VALIDATE_AND_ASSIGN_CI([`/src/test-data/ContentIntake/${SIGNATURE_FILE}`]);
      await CIPage.NAV_TO_CI();
      await CIPage.VALIDATE_OPTIONS_FOR_CI(CREATE_CI_NUMBER);    
      await CIPage.VALIDATE_CONTENTDATA_FOR_ATTACHMENT();
    });
  })
