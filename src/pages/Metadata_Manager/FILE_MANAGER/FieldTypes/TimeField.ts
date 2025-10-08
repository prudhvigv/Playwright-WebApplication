import { BaseClass } from '../../../../config/BaseClass';
import { FieldTypes } from './FieldTypes';
import { ShortText } from './ShortText';
import {
  CreateFieldType,
  EditFieldType,
} from '../../../../test-data/Metadata_Manager/FileManager/FieldType/field-type.json';
import { faker } from '@faker-js/faker';
import { Log } from '../../../../utils/Log';

const FIELD_NAME = (
  CreateFieldType.Time_Field.fieldName + faker.person.lastName()
).replace(/[^a-zA-Z0-9_]/g, '');
const FIELD_LABEL =
  CreateFieldType.Time_Field.fieldLabel + faker.person.jobDescriptor();
const PLACEHOLDER = CreateFieldType.Time_Field.placeholder;
const HELP_TEXT = CreateFieldType.Time_Field.helpText;
const FIELD_DESCRIPTION = CreateFieldType.Time_Field.fieldDescription;
const PROTECT_FIELD = CreateFieldType.Time_Field.protectField;
const IS_FIELD_SEARCHABLE = CreateFieldType.Time_Field.fieldSearchable;

const EDIT_FIELD_NAME = (
  EditFieldType.Time_Field.fieldName +
  faker.person.firstName() +
  faker.person.lastName()
).replace(/[^a-zA-Z0-9_]/g, '');
const EDIT_FIELD_LABEL =
  EditFieldType.Time_Field.fieldLabel + faker.person.jobDescriptor();
const EDIT_PLACEHOLDER = EditFieldType.Time_Field.placeholder;
const EDIT_HELP_TEXT = EditFieldType.Time_Field.helpText;
const EDIT_FIELD_DESCRIPTION = EditFieldType.Time_Field.fieldDescription;
const EDIT_PROTECT_FIELD = EditFieldType.Time_Field.protectField;
const EDIT_IS_FIELD_SEARCHABLE = EditFieldType.Time_Field.fieldSearchable;

export class TimeField extends BaseClass {
  readonly fieldType = new FieldTypes(this.page);
  readonly shortText = new ShortText(this.page);

  async CREATE_TIME_FIELD() {
    Log.info('Creating Time field');
    await this.fieldType.selectFieldType('Time');
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

  async VALIDATE_TIME_FIELD_CREATED() {
    return await this.fieldType.VALIDATE_FIELD_TYPE_CREATED(FIELD_LABEL);
  }

  async EDIT_TIME_FIELD() {
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

  async DELETE_TIME_FIELD() {
    await this.fieldType.deleteFieldType(EDIT_FIELD_LABEL);
  }
}
