import { BaseClass } from '../../../../config/BaseClass';
import { FieldTypes } from './FieldTypes';
import { ShortText } from './ShortText';
import {
  CreateFieldType,
  EditFieldType,
} from '../../../../test-data/Metadata_Manager/FileManager/FieldType/field-type.json';
import { faker } from '@faker-js/faker';
import { Log } from '../../../../utils/Log';
import { MultiSelectCheckbox } from './MultiSelectCheckbox';

const FIELD_NAME = (
  CreateFieldType.Dropdown_Field.fieldName + faker.person.lastName()
).replace(/[^a-zA-Z0-9_]/g, '');
const FIELD_LABEL =
  CreateFieldType.Dropdown_Field.fieldLabel + faker.person.jobDescriptor();
const PLACEHOLDER = CreateFieldType.Dropdown_Field.placeholder;
const HELP_TEXT = CreateFieldType.Dropdown_Field.helpText;
const FIELD_DESCRIPTION = CreateFieldType.Dropdown_Field.fieldDescription;
const PROTECT_FIELD = CreateFieldType.Dropdown_Field.protectField;
const IS_FIELD_SEARCHABLE = CreateFieldType.Dropdown_Field.fieldSearchable;
const LIST = CreateFieldType.Dropdown_Field.List;

const EDIT_FIELD_NAME = (
  EditFieldType.Dropdown_Field.fieldName + faker.person.lastName()
).replace(/[^a-zA-Z0-9_]/g, '');
const EDIT_FIELD_LABEL =
  EditFieldType.Dropdown_Field.fieldLabel + faker.person.jobDescriptor();
const EDIT_PLACEHOLDER = EditFieldType.Dropdown_Field.placeholder;
const EDIT_HELP_TEXT = EditFieldType.Dropdown_Field.helpText;
const EDIT_FIELD_DESCRIPTION = EditFieldType.Dropdown_Field.fieldDescription;
const EDIT_PROTECT_FIELD = EditFieldType.Dropdown_Field.protectField;
const EDIT_IS_FIELD_SEARCHABLE = EditFieldType.Dropdown_Field.fieldSearchable;
const EDIT_LIST = EditFieldType.Dropdown_Field.List;

export class Dropdown extends BaseClass {
  readonly fieldType = new FieldTypes(this.page);
  readonly shortText = new ShortText(this.page);
  readonly multiSelectCheckbox = new MultiSelectCheckbox(this.page);

  async FILL_LIST(list) {
    Log.info('Editing list values');
    if (Object.keys(list).length === 2) {
      if (Object.keys(list).length >= 2 && Object.keys(list).length % 2 === 0) {
        const fieldLabels = Object.keys(list).filter((key) =>
          key.startsWith('FieldLable'),
        );
        const values = Object.keys(list).filter((key) =>
          key.startsWith('Value'),
        );
        for (let i = 0; i < fieldLabels.length && i < values.length; i++) {
          await this.fillInput(
            this.multiSelectCheckbox.fieldLabel,
            list[`FieldLable${i + 1}`],
          );
          await this.fillInput(
            this.multiSelectCheckbox.valueLabel,
            list[`Value${i + 1}`],
          );
          await this.performClick(this.multiSelectCheckbox.addButton);
          await this.multiSelectCheckbox.verifyLabelAdded(
            list[`Value${i + 1}`],
          );
          await this.performClick(this.shortText.fieldDescInput);
          await this.page.waitForTimeout(1000);
        }
      } else {
        await this.fillInput(
          this.multiSelectCheckbox.fieldLabel,
          list.FieldLable1,
        );
        await this.fillInput(this.multiSelectCheckbox.valueLabel, list.Value1);
        await this.performClick(this.shortText.fieldDescInput);
        await this.page.waitForTimeout(1000);
        await this.performClick(this.multiSelectCheckbox.addButton);
        await this.multiSelectCheckbox.verifyLabelAdded(list.Value1);
      }
    }
  }

  async CREATE_DROPDOWN_FIELD() {
    Log.info('Creating Dropdown field');
    await this.fieldType.selectFieldType('Dropdown');
    await this.fillInput(this.shortText.fieldNameInput, FIELD_NAME);
    await this.fillInput(this.multiSelectCheckbox.fieldLabelInput, FIELD_LABEL);
    await this.fillInput(this.shortText.placeholderInput, PLACEHOLDER);
    await this.fillInput(this.shortText.helpTextInput, HELP_TEXT);
    await this.fillInput(this.shortText.fieldDescInput, FIELD_DESCRIPTION);
    if (PROTECT_FIELD) {
      await this.performClick(this.shortText.protectFieldToggle);
    }
    if (IS_FIELD_SEARCHABLE) {
      await this.performClick(this.shortText.isFieldSearchableToggle);
    }
    await this.FILL_LIST(LIST);
    await this.performClick(this.shortText.saveButton);
    await this.page.waitForLoadState('networkidle');
  }

  async VALIDATE_DROPDOWN_FIELD_CREATED() {
    return await this.fieldType.VALIDATE_FIELD_TYPE_CREATED(FIELD_LABEL);
  }

  async EDIT_DROPDOWN_FIELD() {
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
    await this.FILL_LIST(EDIT_LIST);
    await this.performClick(this.shortText.updateButton);
    await this.page.waitForLoadState('networkidle');
    await this.waitForElement(this.fieldType.searchFieldType);
  }

  async DELETE_DROPDOWN_FIELD() {
    await this.fieldType.deleteFieldType(EDIT_FIELD_LABEL);
  }
}
