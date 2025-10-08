import { BaseClass } from '../../../../config/BaseClass';
import { FieldTypes } from './FieldTypes';
import { faker } from '@faker-js/faker';
import {
  CreateFieldType,
  EditFieldType,
} from '../../../../test-data/Metadata_Manager/FileManager/FieldType/field-type.json';
import { ShortText } from './ShortText';
import { Log } from '../../../../utils/Log';

const FIELD_NAME = (
  CreateFieldType.LongText.fieldName + faker.person.lastName()
).replace(/[^a-zA-Z0-9_]/g, '');
const FIELD_LABEL =
  CreateFieldType.LongText.fieldLabel + faker.person.jobDescriptor();
const PLACEHOLDER = CreateFieldType.LongText.placeholder;
const HELP_TEXT = CreateFieldType.LongText.helpText;
const FIELD_DESCRIPTION = CreateFieldType.LongText.fieldDescription;
const PROTECT_FIELD = CreateFieldType.LongText.protectField;
const IS_FIELD_SEARCHABLE = CreateFieldType.LongText.fieldSearchable;

const EDIT_FIELD_NAME = (
  EditFieldType.LongText.fieldName +
  faker.person.firstName() +
  faker.person.lastName()
).replace(/[^a-zA-Z0-9_]/g, '');
const EDIT_FIELD_LABEL =
  EditFieldType.LongText.fieldLabel + faker.person.jobDescriptor();
const EDIT_PLACEHOLDER = EditFieldType.LongText.placeholder;
const EDIT_HELP_TEXT = EditFieldType.LongText.helpText;
const EDIT_FIELD_DESCRIPTION = EditFieldType.LongText.fieldDescription;
const EDIT_PROTECT_FIELD = EditFieldType.LongText.protectField;
const EDIT_IS_FIELD_SEARCHABLE = EditFieldType.LongText.fieldSearchable;

export class LongText extends BaseClass {
  readonly fieldType = new FieldTypes(this.page);
  readonly shortText = new ShortText(this.page);

  async CREATE_LONG_TEXT_FIELD() {
    Log.info('Creating Long text field');
    await this.page.getByText('Long Text').first().click();
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

  async VALIDATE_LONG_TEXT_FIELD_CREATED() {
    return await this.fieldType.VALIDATE_FIELD_TYPE_CREATED(FIELD_LABEL);
  }

  async EDIT_LONG_TEXT_FIELD() {
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

  async DELETE_LONG_TEXT_FIELD() {
    await this.fieldType.deleteFieldType(EDIT_FIELD_LABEL);
  }
}
