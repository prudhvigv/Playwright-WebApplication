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
  CreateFieldType.Image_Field.fieldName + faker.person.lastName()
).replace(/[^a-zA-Z0-9_]/g, '');
const FIELD_LABEL =
  CreateFieldType.Image_Field.fieldLabel + faker.person.jobDescriptor();
const PLACEHOLDER = CreateFieldType.Image_Field.placeholder;
const HELP_TEXT = CreateFieldType.Image_Field.helpText;
const FIELD_DESCRIPTION = CreateFieldType.Image_Field.fieldDescription;
const PROTECT_FIELD = CreateFieldType.Image_Field.protectField;

const EDIT_FIELD_NAME = (
  EditFieldType.Image_Field.fieldName +
  faker.person.firstName() +
  faker.person.lastName()
).replace(/[^a-zA-Z0-9_]/g, '');
const EDIT_FIELD_LABEL =
  EditFieldType.Image_Field.fieldLabel + faker.person.jobDescriptor();
const EDIT_PLACEHOLDER = EditFieldType.Image_Field.placeholder;
const EDIT_HELP_TEXT = EditFieldType.Image_Field.helpText;
const EDIT_FIELD_DESCRIPTION = EditFieldType.Image_Field.fieldDescription;
const EDIT_PROTECT_FIELD = EditFieldType.Image_Field.protectField;

export class ImageField extends BaseClass {
  readonly fieldType = new FieldTypes(this.page);
  readonly shortText = new ShortText(this.page);

  readonly imageOption = this.page.locator('span').filter({ hasText: 'Image' }).first();

  async CREATE_IMAGE_FIELD() {
    Log.info('Creating Image field');
    await this.page.locator('span').filter({ hasText: 'Image' }).first().click();
    await this.fillInput(this.shortText.fieldNameInput, FIELD_NAME);
    await this.fillInput(this.shortText.fieldLabelInput, FIELD_LABEL);
    await this.fillInput(this.shortText.placeholderInput, PLACEHOLDER);
    await this.fillInput(this.shortText.helpTextInput, HELP_TEXT);
    await this.fillInput(this.shortText.fieldDescInput, FIELD_DESCRIPTION);
    if (PROTECT_FIELD) {
      await this.performClick(this.shortText.protectFieldToggle);
    }
    await this.performClick(this.shortText.saveButton);
    await this.page.waitForLoadState('networkidle');
  }

  async VALIDATE_IMAGE_FIELD_CREATED() {
    return await this.fieldType.VALIDATE_FIELD_TYPE_CREATED(FIELD_LABEL);
  }

  async EDIT_IMAGE_FIELD() {
    await this.fieldType.editFieldType(FIELD_LABEL);
    await this.shortText.editData(
      EDIT_FIELD_LABEL,
      EDIT_PLACEHOLDER,
      EDIT_HELP_TEXT,
      EDIT_FIELD_DESCRIPTION,
      EDIT_PROTECT_FIELD,
    );
    await this.performClick(this.shortText.updateButton);
    await this.page.waitForLoadState('networkidle');
  }

  async DELETE_IMAGE_FIELD() {
    await this.fieldType.deleteFieldType(EDIT_FIELD_LABEL);
  }
}
