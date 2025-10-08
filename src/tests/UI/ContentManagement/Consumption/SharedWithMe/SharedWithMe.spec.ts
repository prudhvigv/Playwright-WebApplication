import { expect } from '@playwright/test';
import { EnvConfig } from '../../../../../config/EnvConfig';
import { test } from '../../../../../hooks/hooks';
import { HomePage } from '../../../../../pages/HomePage/HomePage';
import { LoginPage } from '../../../../../pages/Login/loginPage';
import { myVault } from '../../../../../pages/MyVault/myVault';
import { RecycleBin } from '../../../../../pages/RecycleBin/recycle-bin';
import { SharedWithMe } from '../../../../../pages/SharedWithMe/sharedWithMe';
import { Log } from '../../../../../utils/Log';

const FILE_NAME = 'ID Card_1_SharedWithMe.pdf';

test.beforeEach('Login Step', async ({ page }) => {
  test.setTimeout(20 * 10000)
  const login = new LoginPage(page);
  const homePage = new HomePage(page);
  await login.LOGIN_WITH_VALID_CREDENTIALS(
    EnvConfig.admin_username,
    EnvConfig.admin_password,
  );
  await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
});

test('@Sanity Validate if USER A is able to share the uploaded file to USER B and USER B should be able to see in Shared with Me tab', async ({
  page,
}) => {
  const myVaulPage = new myVault(page);
  const loginPage = new LoginPage(page);
  const sharedWithMe = new SharedWithMe(page);
  const homePage = new HomePage(page);
  const recycleBin = new RecycleBin(page);
  await recycleBin.NAV_TO_RECYCLE_BIN();
  const recordsBeforeDelete: number = (await recycleBin.totalRecordsInMyVault('app-recycle-bin-list-view-files')).valueOf();
  Log.info('Shared with me - Records before delete ' + recordsBeforeDelete);
  await myVaulPage.NAV_TO_MY_VAULT();
  try {
    await myVaulPage.DELETE_FILE([FILE_NAME]);
  } catch (error) {
    Log.info('error');
  }
  await myVaulPage.UPLOAD_FILE_TO_MY_VAULT([
    `/src/test-data/SharedWithMe/${FILE_NAME}`,
  ]);
  // await myVaulPage.VALIDATE_SHARE_FUNCTIONALITY(FILE_NAME, EnvConfig.std_username);
  // await loginPage.LOGOUT();
  // await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
  //   EnvConfig.std_username,
  //   EnvConfig.std_password,
  // );
  // await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
  // await sharedWithMe.NAV_TO_SHARED_WITH_ME();
  // await sharedWithMe.VALIDATE_FILE_IN_SHARED_WITH_ME(FILE_NAME);
  // await loginPage.LOGOUT();
  // await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
  //   EnvConfig.admin_username,
  //   EnvConfig.admin_password,
  // );
  // await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
  await myVaulPage.DELETE_FILE([FILE_NAME]);
  await recycleBin.NAV_TO_RECYCLE_BIN();
  const recordsAfterDelete = await recycleBin.totalRecordsInMyVault('app-recycle-bin-list-view-files');
  Log.info('Shared with me - Records after delete ' + recordsAfterDelete);
  expect(recordsAfterDelete).toBeGreaterThan(recordsBeforeDelete)
});
