import { test } from '../../../../../../hooks/hooks';
import { LoginPage } from '../../../../../../pages/Login/loginPage';
import { EnvConfig } from '../../../../../../config/EnvConfig';
import { BasicDetails } from '../../../../../../pages/Metadata_Manager/FILE_MANAGER/BasicDetails/BasicDetails';
import { FieldTypes } from '../../../../../../pages/Metadata_Manager/FILE_MANAGER/FieldTypes/FieldTypes';
import { HomePage } from '../../../../../../pages/HomePage/HomePage';

test.describe('BASIC USER -> ', async () => {
  test('Verify that the user can edit the label on the Basic Details page for the file manager', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const fieldType = new FieldTypes(page);
    const basicDetails = new BasicDetails(page);
    const homePage = new HomePage(page)
    await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
      EnvConfig.admin_username,
      EnvConfig.admin_password,
    );
    await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
    await fieldType.NAV_TO_FIELDS();
    await basicDetails.NAV_TO_BASIC_DETAILS();
    await basicDetails.EDIT_LABEL();
    await basicDetails.VALIDATE_LABEL_EDITED();
  });
});
