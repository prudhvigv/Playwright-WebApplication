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
  CreateFieldType.DateTime_Filed.fieldName + faker.person.lastName()
).replace(/[^a-zA-Z0-9_]/g, '');
const FIELD_LABEL =
  CreateFieldType.DateTime_Filed.fieldLabel + faker.person.jobDescriptor();
const PLACEHOLDER = CreateFieldType.DateTime_Filed.placeholder;
const HELP_TEXT = CreateFieldType.DateTime_Filed.helpText;
const FIELD_DESCRIPTION = CreateFieldType.DateTime_Filed.fieldDescription;
const PROTECT_FIELD = CreateFieldType.DateTime_Filed.protectField;
const IS_FIELD_SEARCHABLE = CreateFieldType.DateTime_Filed.fieldSearchable;

const EDIT_FIELD_NAME = (
  EditFieldType.DateTime_Filed.fieldName +
  faker.person.firstName() +
  faker.person.lastName()
).replace(/[^a-zA-Z0-9_]/g, '');
const EDIT_FIELD_LABEL =
  EditFieldType.DateTime_Filed.fieldLabel + faker.person.jobDescriptor();
const EDIT_PLACEHOLDER = EditFieldType.DateTime_Filed.placeholder;
const EDIT_HELP_TEXT = EditFieldType.DateTime_Filed.helpText;
const EDIT_FIELD_DESCRIPTION = EditFieldType.DateTime_Filed.fieldDescription;
const EDIT_PROTECT_FIELD = EditFieldType.DateTime_Filed.protectField;
const EDIT_IS_FIELD_SEARCHABLE = EditFieldType.DateTime_Filed.fieldSearchable;

export class DateTimeField extends BaseClass {
  readonly fieldType = new FieldTypes(this.page);
  readonly shortText = new ShortText(this.page);

  async CREATE_DATE_TIME_FIELD() {
    Log.info('Creating Date/Time field');
    await this.fieldType.selectFieldType('Date/Time');
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

  async VALIDATE_DATE_TIME_FIELD_CREATED() {
    return await this.fieldType.VALIDATE_FIELD_TYPE_CREATED(FIELD_LABEL);
  }

  async EDIT_DATE_TIME_FIELD() {
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

  async DELETE_DATE_TIME_FIELD() {
    await this.fieldType.deleteFieldType(EDIT_FIELD_LABEL);
  }
}
