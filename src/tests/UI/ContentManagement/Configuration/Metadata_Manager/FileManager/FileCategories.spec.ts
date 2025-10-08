import { test } from '../../../../../../hooks/hooks';
import { LoginPage } from '../../../../../../pages/Login/loginPage';
import { FileCategories } from '../../../../../../pages/Metadata_Manager/FILE_MANAGER/FieldCategories/FileCategories';
import { EnvConfig } from '../../../../../../config/EnvConfig';
import { HomePage } from '../../../../../../pages/HomePage/HomePage';

test.describe('File Categories', () => {
  test('Verify that clicking on the "File Manager" option in the left navigation bar navigates the user to the file categories list page, displaying all file categories in the list view', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const fileCategories = new FileCategories(page);
    const homePage = new HomePage(page);
    await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
      EnvConfig.admin_username,
      EnvConfig.admin_password,
    );
    await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
    await fileCategories.naviToFileManagerPage();
    await fileCategories.validateFileCategoriesListView();
  });

  test('Verify that on the "Create File Category" page, clicking the "Cancel" button after entering all mandatory details does not save the folder category details', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const fileCategories = new FileCategories(page);
    const homePage = new HomePage(page);
    await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
      'prudhvi-admin',
      'Quality@123',
    );
    await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
    await fileCategories.naviToFileManagerPage();
    await fileCategories.VALIDATE_CANCEL_BUTTON_FUNCTIONALITY();
  });

  test('Verify that a user with the necessary permissions can successfully create a file category by adding a folder category name and saving the selected folder category without encountering any errors', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const fileCategories = new FileCategories(page);
    const homePage = new HomePage(page);
    await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
      'prudhvi-admin',
      'Quality@123',
    );
    await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
    await fileCategories.naviToFileManagerPage();
    await fileCategories.CREATE_FILE_CATEGORY();
    await fileCategories.VALIDATE_FILE_CATEGORY_CREATION();
  });

  test('Verify that the refresh icon on the File Categories list page updates the page correctly', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const fileCategories = new FileCategories(page);
    const homePage = new HomePage(page);
    await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
      'prudhvi-admin',
      'Quality@123',
    );
    await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
    await fileCategories.naviToFileManagerPage();
    await fileCategories.VALIDATE_REFRESH_ICON_FUNCTIONALITY();
  });

  // test('Verify that the Edit actions can be performed on a File category from the list page', async ({
  //   page,
  // }) => {
  //   const loginPage = new LoginPage(page);
  //   const fileCategories = new FileCategories(page);
  //   const homePage = new HomePage(page);
  //   await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
  //     'prudhvi-admin',
  //     'Quality@123',
  //   );
  //   await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
  //   await fileCategories.naviToFileManagerPage();
  //   await fileCategories.PERFORM_EDIT_FILE_CATEGORY();
  // });

  // test('Verify that the Unpublish actions can be performed on a File category from the list page', async ({
  //   page,
  // }) => {
  //   const loginPage = new LoginPage(page);
  //   const fileCategories = new FileCategories(page);
  //   const homePage = new HomePage(page);
  //   await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
  //     'prudhvi-admin',
  //     'Quality@123',
  //   );
  //   await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
  //   await fileCategories.naviToFileManagerPage();
  //   await fileCategories.PERFORM_UNPUBLISH_FILE_CATEGORY();
  // });
});
