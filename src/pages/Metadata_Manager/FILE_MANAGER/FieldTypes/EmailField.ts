import { BaseClass } from '../../../../config/BaseClass';
import { ShortText } from './ShortText';
import {
  CreateFieldType,
  EditFieldType,
} from '../../../../test-data/Metadata_Manager/FileManager/FieldType/field-type.json';
import { FieldTypes } from './FieldTypes';
import { faker } from '@faker-js/faker';

const FIELD_NAME = (
  CreateFieldType.Email.fieldName + faker.person.lastName()
).replace(/[^a-zA-Z0-9_]/g, '');
const FIELD_LABEL =
  CreateFieldType.Email.fieldLabel + faker.person.jobDescriptor();
const PLACEHOLDER = CreateFieldType.Email.placeholder;
const HELP_TEXT = CreateFieldType.Email.helpText;
const FIELD_DESCRIPTION = CreateFieldType.Email.fieldDescription;
const PROTECT_FIELD = CreateFieldType.Email.protectField;
const IS_FIELD_SEARCHABLE = CreateFieldType.Email.fieldSearchable;

const EDIT_FIELD_NAME = (
  EditFieldType.Email.fieldName +
  faker.person.firstName() +
  faker.person.lastName()
).replace(/[^a-zA-Z0-9_]/g, '');
const EDIT_FIELD_LABEL =
  EditFieldType.Email.fieldLabel + faker.person.jobDescriptor();
const EDIT_PLACEHOLDER = EditFieldType.Email.placeholder;
const EDIT_HELP_TEXT = EditFieldType.Email.helpText;
const EDIT_FIELD_DESCRIPTION = EditFieldType.Email.fieldDescription;
const EDIT_PROTECT_FIELD = EditFieldType.Email.protectField;
const EDIT_IS_FIELD_SEARCHABLE = EditFieldType.Email.fieldSearchable;

export class EmailField extends BaseClass {
  readonly fieldType = new FieldTypes(this.page);
  readonly shortText = new ShortText(this.page);

  async CREATE_EMAIL_FIELD_TYPE() {
    console.log('Creating Email field');
    await this.fieldType.selectFieldType('Email');
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

  async VALIDATE_EMAIL_FIELD_CREATED() {
    return await this.fieldType.VALIDATE_FIELD_TYPE_CREATED(FIELD_LABEL);
  }

  async EDIT_EMAIL_FIELD() {
    await this.fieldType.editFieldType(FIELD_LABEL);
    await this.shortText.enterData(
      EDIT_FIELD_NAME,
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

  async DELETE_EMAIL_FIELD() {
    await this.fieldType.deleteFieldType(EDIT_FIELD_LABEL);
  }
}
