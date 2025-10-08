import {test} from '../../../../../../hooks/hooks';
import { LoginPage } from '../../../../../../pages/Login/loginPage';
import { Boolean } from '../../../../../../pages/Metadata_Manager/FILE_MANAGER/FieldTypes/BooleanField';
import { DateTimeField } from '../../../../../../pages/Metadata_Manager/FILE_MANAGER/FieldTypes/Date_TimeField';
import { DateField } from '../../../../../../pages/Metadata_Manager/FILE_MANAGER/FieldTypes/DateField';
import { Dropdown } from '../../../../../../pages/Metadata_Manager/FILE_MANAGER/FieldTypes/Dropdown';
import { EmailField } from '../../../../../../pages/Metadata_Manager/FILE_MANAGER/FieldTypes/EmailField';
import { FieldTypes } from '../../../../../../pages/Metadata_Manager/FILE_MANAGER/FieldTypes/FieldTypes';
import { ImageField } from '../../../../../../pages/Metadata_Manager/FILE_MANAGER/FieldTypes/ImageField';
import { LongText } from '../../../../../../pages/Metadata_Manager/FILE_MANAGER/FieldTypes/LongText';
import { MultiSelectCheckbox } from '../../../../../../pages/Metadata_Manager/FILE_MANAGER/FieldTypes/MultiSelectCheckbox';
import { MultiSelectDropdown } from '../../../../../../pages/Metadata_Manager/FILE_MANAGER/FieldTypes/MultiSelectDropdownField';
import { NumberField } from '../../../../../../pages/Metadata_Manager/FILE_MANAGER/FieldTypes/NumberField';
import { PhoneField } from '../../../../../../pages/Metadata_Manager/FILE_MANAGER/FieldTypes/PhoneField';
import { ShortText } from '../../../../../../pages/Metadata_Manager/FILE_MANAGER/FieldTypes/ShortText';
import { TimeField } from '../../../../../../pages/Metadata_Manager/FILE_MANAGER/FieldTypes/TimeField';
import { EnvConfig } from '../../../../../../config/EnvConfig';
import { HomePage } from '../../../../../../pages/HomePage/HomePage';

test.beforeEach('Login step', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const fieldType = new FieldTypes(page);
  const homePage = new HomePage(page)
  await loginPage.LOGIN_WITH_VALID_CREDENTIALS(
    EnvConfig.admin_username,
    EnvConfig.admin_password,
  );
  await homePage.SELECT_APP_TO_CONTENT_MANAGEMENT();
  await fieldType.NAV_TO_FIELDS();
  await fieldType.NAV_TO_CREATE_FIELDTYPE();
});
test.describe('Field Types', async () => {
  test.describe('Verify that a user with the necessary permissions can successfully create all field types in the file manager by entering the required details and saving the selected file field without errors.', async () => {
    test.describe('Verify that editing file fields from both the list view and detail view saves the changes successfully and updates them on both the list page and details page, with the "Modified By" and "Modified At" details reflecting the updates', async () => {
      test('Text --> ShortText field type', async ({ page }) => {
        const shortText = new ShortText(page);
        await shortText.CREATE_SHORT_TEXT_FIELD();
        await shortText.VALIDATE_SHORT_TEXT_FIELD_CREATED();
        await shortText.EDIT_SHORT_TEXT_FIELD();
        await shortText.DELETE_SHORT_TEXT_FIELD();
      });

      test('Text --> LongText field type', async ({ page }) => {
        const longText = new LongText(page);
        await longText.CREATE_LONG_TEXT_FIELD();
        await longText.VALIDATE_LONG_TEXT_FIELD_CREATED();
        await longText.EDIT_LONG_TEXT_FIELD();
        await longText.DELETE_LONG_TEXT_FIELD();
      });

      test('Text --> Email field type', async ({ page }) => {
        const emailField = new EmailField(page);
        await emailField.CREATE_EMAIL_FIELD_TYPE();
        await emailField.VALIDATE_EMAIL_FIELD_CREATED();
        await emailField.EDIT_EMAIL_FIELD();
        await emailField.DELETE_EMAIL_FIELD();
      });

      test('Numeric --> Number field type', async ({ page }) => {
        const numberField = new NumberField(page);
        await numberField.CREATE_NUMBER_FIELD();
        await numberField.VALIDATE_NUMBER_FIELD_CREATED();
        await numberField.EDIT_NUMBER_FIELD();
        await numberField.DELETE_NUMBER_FIELD();
      });

      test('Numeric --> Phone field type', async ({ page }) => {
        const phoneNoField = new PhoneField(page);
        await phoneNoField.CREATE_PHONE_NUMBER_FIELD();
        await phoneNoField.VALIDATE_PHONE_NUMBER_FIELD_CREATED();
        await phoneNoField.EDIT_PHONE_NUMBER_FIELD();
        await phoneNoField.DELETE_PHONE_NUMBER_FIELD();
      });

      test('Numeric --> Date/Time field type', async ({ page }) => {
        const dateTimeField = new DateTimeField(page);
        await dateTimeField.CREATE_DATE_TIME_FIELD();
        await dateTimeField.VALIDATE_DATE_TIME_FIELD_CREATED();
        await dateTimeField.EDIT_DATE_TIME_FIELD();
        await dateTimeField.DELETE_DATE_TIME_FIELD();
      });

      test('Numeric --> Date field type', async ({ page }) => {
        const dateField = new DateField(page);
        await dateField.CREATE_DATE_FIELD();
        await dateField.VALIDATE_DATE_FIELD_CREATED();
        await dateField.EDIT_DATE_FIELD();
        await dateField.DELETE_DATE_FIELD();
      });

      test('Numeric --> Time field type', async ({ page }) => {
        const timeField = new TimeField(page);
        await timeField.CREATE_TIME_FIELD();
        await timeField.VALIDATE_TIME_FIELD_CREATED();
        await timeField.EDIT_TIME_FIELD();
        await timeField.DELETE_TIME_FIELD();
      });

      // test('Enumeration --> Dropdown field type', async ({ page }) => {
        // const dropdownField = new Dropdown(page);
        // await dropdownField.CREATE_DROPDOWN_FIELD();
        // await dropdownField.VALIDATE_DROPDOWN_FIELD_CREATED();
        // // await dropdownField.EDIT_DROPDOWN_FIELD();
        // // await dropdownField.DELETE_DROPDOWN_FIELD();
      // });

      test('Enumeration --> Boolean field type', async ({ page }) => {
        const booleanField = new Boolean(page);
        await booleanField.CREATE_BOOLEAN_FIELD();
        await booleanField.VALIDATE_BOOLEAN_FIELD_CREATED();
        await booleanField.EDIT_BOOLEAN_FIELD();
        await booleanField.DELETE_BOOLEAN_FIELD();
      });

      // test('Enumeration --> Multi-Select Dropdown field type', async ({
      //   page,
      // }) => {
        // const multiSelectDropdown = new MultiSelectDropdown(page);
        // await multiSelectDropdown.CREATE_MULTISELECT_DROPDOWN_FIELD();
        // await multiSelectDropdown.VALIDATE_MULTI_SELECT_DROPDOWN_FIELD_CREATED();
        // await multiSelectDropdown.EDIT_MULTI_SELECT_DROPDOWN_FIELD_FIELD();
        // await multiSelectDropdown.DELETE_MULTI_SELECT_DROPDOWN_FIELD_FIELD();
      // });

      // test('Enumeration --> Multi-Select checkbox field type', async ({
      //   page,
      // }) => {
        // const multiSelectCheckbox = new MultiSelectCheckbox(page);
        // await multiSelectCheckbox.CREATE_MULTISELECT_CHECKBOX_FIELD();
        // await multiSelectCheckbox.VALIDATE_MULTI_SELECT_CHECKBOX_FIELD_CREATED();
        // await multiSelectCheckbox.EDIT_MULTI_SELECT_CHECKBOX_FIELD_FIELD();
        // await multiSelectCheckbox.DELETE_MULTI_SELECT_CHECKBOX_FIELD_FIELD();
      // });

      test('Image --> Image field type', async ({ page }) => {
        const imageField = new ImageField(page);
        await imageField.CREATE_IMAGE_FIELD();
        await imageField.VALIDATE_IMAGE_FIELD_CREATED();
        await imageField.EDIT_IMAGE_FIELD();
        await imageField.DELETE_IMAGE_FIELD();
      });
    });
  });
});
