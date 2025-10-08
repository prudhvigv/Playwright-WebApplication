import { BaseClass } from '../../../../config/BaseClass';
import { FieldTypes } from './FieldTypes';
import { ShortText } from './ShortText';
import {
  CreateFieldType,
  EditFieldType,
} from '../../../../test-data/Metadata_Manager/FileManager/FieldType/field-type.json';
import { faker } from '@faker-js/faker';

const FIELD_NAME = (
  CreateFieldType.Phone_Number.fieldName + faker.person.lastName()
).replace(/[^a-zA-Z0-9_]/g, '');
const FIELD_LABEL =
  CreateFieldType.Phone_Number.fieldLabel + faker.person.jobDescriptor();
const PLACEHOLDER = CreateFieldType.Phone_Number.placeholder;
const HELP_TEXT = CreateFieldType.Phone_Number.helpText;
const FIELD_DESCRIPTION = CreateFieldType.Phone_Number.fieldDescription;
const PROTECT_FIELD = CreateFieldType.Phone_Number.protectField;
const IS_FIELD_SEARCHABLE = CreateFieldType.Phone_Number.fieldSearchable;

const EDIT_FIELD_NAME = (
  EditFieldType.Phone_Number.fieldName +
  faker.person.firstName() +
  faker.person.lastName()
).replace(/[^a-zA-Z0-9_]/g, '');
const EDIT_FIELD_LABEL =
  EditFieldType.Phone_Number.fieldLabel + faker.person.jobDescriptor();
const EDIT_PLACEHOLDER = EditFieldType.Phone_Number.placeholder;
const EDIT_HELP_TEXT = EditFieldType.Phone_Number.helpText;
const EDIT_FIELD_DESCRIPTION = EditFieldType.Phone_Number.fieldDescription;
const EDIT_PROTECT_FIELD = EditFieldType.Phone_Number.protectField;
const EDIT_IS_FIELD_SEARCHABLE = EditFieldType.Phone_Number.fieldSearchable;

export class PhoneField extends BaseClass {
  readonly fieldType = new FieldTypes(this.page);
  readonly shortText = new ShortText(this.page);

  async CREATE_PHONE_NUMBER_FIELD() {
    console.log('Creating Phone field');
    await this.fieldType.selectFieldType('Number');
    await this.fillInput(this.shortText.fieldNameInput, FIELD_NAME);
    await this.fillInput(this.shortText.fieldLabelInput, FIELD_LABEL);
    await this.fillInput(this.shortText.placeholderInput, PLACEHOLDER);
    await this.fillInput(this.shortText.helpTextInput, HELP_TEXT);
    await this.fillInput(this.shortText.fieldDescInput, FIELD_DESCRIPTION);
    if (PROTECT_FIELD) {
      await this.performClick(this.shortText.protectFieldToggle);
    }
    if (IS_FIELD_SEARCHABLE) {
      await this.performClick(this.shortText.isFieldSearchableToggle);
    }
    await this.performClick(this.shortText.saveButton);
    await this.page.waitForLoadState('networkidle');
  }

  async VALIDATE_PHONE_NUMBER_FIELD_CREATED() {
    return await this.fieldType.VALIDATE_FIELD_TYPE_CREATED(FIELD_LABEL);
  }

  async EDIT_PHONE_NUMBER_FIELD() {
    await this.fieldType.editFieldType(FIELD_LABEL);
    await this.shortText.editData(
      EDIT_FIELD_LABEL,
      EDIT_PLACEHOLDER,
      EDIT_HELP_TEXT,
      EDIT_FIELD_DESCRIPTION,
      EDIT_PROTECT_FIELD,
      EDIT_IS_FIELD_SEARCHABLE,
    );
    await this.performClick(this.shortText.updateButton);
    await this.page.waitForLoadState('networkidle');
  }

  async DELETE_PHONE_NUMBER_FIELD() {
    await this.fieldType.deleteFieldType(EDIT_FIELD_LABEL);
  }
}
