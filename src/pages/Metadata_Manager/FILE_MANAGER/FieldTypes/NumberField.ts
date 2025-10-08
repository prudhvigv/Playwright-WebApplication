import { BaseClass } from '../../../../config/BaseClass';
import { FieldTypes } from './FieldTypes';
import { ShortText } from './ShortText';
import {
  CreateFieldType,
  EditFieldType,
} from '../../../../test-data/Metadata_Manager/FileManager/FieldType/field-type.json';
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
  EditFieldType.Number.fieldName +
  faker.person.firstName() +
  faker.person.lastName()
).replace(/[^a-zA-Z0-9_]/g, '');
const EDIT_FIELD_LABEL =
  EditFieldType.Number.fieldLabel + faker.person.jobDescriptor();
const EDIT_PLACEHOLDER = EditFieldType.Number.placeholder;
const EDIT_HELP_TEXT = EditFieldType.Number.helpText;
const EDIT_FIELD_DESCRIPTION = EditFieldType.Number.fieldDescription;
const EDIT_PROTECT_FIELD = EditFieldType.Number.protectField;
const EDIT_IS_FIELD_SEARCHABLE = EditFieldType.Number.fieldSearchable;

export class NumberField extends BaseClass {
  readonly fieldType = new FieldTypes(this.page);
  readonly shortText = new ShortText(this.page);

  async CREATE_NUMBER_FIELD() {
    console.log('Creating Number field');
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

  async VALIDATE_NUMBER_FIELD_CREATED() {
    return await this.fieldType.VALIDATE_FIELD_TYPE_CREATED(FIELD_LABEL);
  }

  async EDIT_NUMBER_FIELD() {
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

  async DELETE_NUMBER_FIELD() {
    await this.fieldType.deleteFieldType(EDIT_FIELD_LABEL);
  }
}
