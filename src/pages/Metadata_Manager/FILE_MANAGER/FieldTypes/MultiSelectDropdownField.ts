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
import { Dropdown } from './Dropdown';

const FIELD_NAME = (
  CreateFieldType.MultiSelectDropdown_Field.fieldName + faker.person.lastName()
).replace(/[^a-zA-Z0-9_]/g, '');
const FIELD_LABEL =
  CreateFieldType.MultiSelectDropdown_Field.fieldLabel +
  faker.person.jobDescriptor();
const PLACEHOLDER = CreateFieldType.MultiSelectDropdown_Field.placeholder;
const HELP_TEXT = CreateFieldType.MultiSelectDropdown_Field.helpText;
const FIELD_DESCRIPTION =
  CreateFieldType.MultiSelectDropdown_Field.fieldDescription;
const PROTECT_FIELD = CreateFieldType.MultiSelectDropdown_Field.protectField;
const DEFAULT_SELECTION =
  CreateFieldType.MultiSelectDropdown_Field.DefaultSelection;
const LIST = CreateFieldType.MultiSelectDropdown_Field.List;

const EDIT_FIELD_NAME = (
  EditFieldType.MultiSelectDropdown_Field.fieldName + faker.person.lastName()
).replace(/[^a-zA-Z0-9_]/g, '');
const EDIT_FIELD_LABEL =
  EditFieldType.MultiSelectDropdown_Field.fieldLabel +
  faker.person.jobDescriptor();
const EDIT_PLACEHOLDER = EditFieldType.MultiSelectDropdown_Field.placeholder;
const EDIT_HELP_TEXT = EditFieldType.MultiSelectDropdown_Field.helpText;
const EDIT_FIELD_DESCRIPTION =
  EditFieldType.MultiSelectDropdown_Field.fieldDescription;
const EDIT_PROTECT_FIELD = EditFieldType.MultiSelectDropdown_Field.protectField;
const EDIT_LIST = EditFieldType.MultiSelectDropdown_Field.List;

export class MultiSelectDropdown extends BaseClass {
  readonly fieldType = new FieldTypes(this.page);
  readonly shortText = new ShortText(this.page);
  readonly multiSelectCheckbox = new MultiSelectCheckbox(this.page);
  readonly dropdown = new Dropdown(this.page);

  async CREATE_MULTISELECT_DROPDOWN_FIELD() {
    Log.info('Creating MultiSelect Dropdown field');
    await this.fieldType.selectFieldType('Multi-Select Dropdown');
    await this.fillInput(this.shortText.fieldNameInput, FIELD_NAME);
    await this.fillInput(this.multiSelectCheckbox.fieldLabelInput, FIELD_LABEL);
    await this.fillInput(this.shortText.placeholderInput, PLACEHOLDER);
    await this.fillInput(this.shortText.helpTextInput, HELP_TEXT);
    await this.fillInput(this.shortText.fieldDescInput, FIELD_DESCRIPTION);
    if (PROTECT_FIELD) {
      await this.performClick(this.shortText.protectFieldToggle);
    }
    if (DEFAULT_SELECTION) {
      await this.performClick(this.multiSelectCheckbox.defaultSelection);
    }
    if (Object.keys(LIST).length === 2) {
      if (Object.keys(LIST).length >= 2 && Object.keys(LIST).length % 2 === 0) {
        const fieldLabels = Object.keys(LIST).filter((key) =>
          key.startsWith('FieldLable'),
        );
        const values = Object.keys(LIST).filter((key) =>
          key.startsWith('Value'),
        );
        for (let i = 0; i < fieldLabels.length && i < values.length; i++) {
          await this.fillInput(
            this.multiSelectCheckbox.fieldLabel,
            LIST[`FieldLable${i + 1}`],
          );
          await this.fillInput(
            this.multiSelectCheckbox.valueLabel,
            LIST[`Value${i + 1}`],
          );
          await this.performClick(this.multiSelectCheckbox.addButton);
          await this.multiSelectCheckbox.verifyLabelAdded(
            LIST[`Value${i + 1}`],
          );
        }
      } else {
        await this.fillInput(
          this.multiSelectCheckbox.fieldLabel,
          LIST.FieldLable1,
        );
        await this.fillInput(this.multiSelectCheckbox.valueLabel, LIST.Value1);
        await this.performClick(this.multiSelectCheckbox.addButton);
        await this.multiSelectCheckbox.verifyLabelAdded(LIST.Value1);
      }
    }
    await this.performClick(this.shortText.saveButton);
    await this.page.waitForLoadState('networkidle');
  }

  async VALIDATE_MULTI_SELECT_DROPDOWN_FIELD_CREATED() {
    return await this.fieldType.VALIDATE_FIELD_TYPE_CREATED(FIELD_LABEL);
  }

  async EDIT_MULTI_SELECT_DROPDOWN_FIELD_FIELD() {
    await this.fieldType.editFieldType(FIELD_LABEL);
    await this.shortText.enterData(
      EDIT_FIELD_NAME,
      EDIT_FIELD_LABEL,
      EDIT_PLACEHOLDER,
      EDIT_HELP_TEXT,
      EDIT_FIELD_DESCRIPTION,
      EDIT_PROTECT_FIELD,
    );
    await this.dropdown.FILL_LIST(EDIT_LIST);
    await this.performClick(this.shortText.updateButton);
    await this.page.waitForLoadState('networkidle');
    await this.waitForElement(this.fieldType.searchFieldType);
  }

  async DELETE_MULTI_SELECT_DROPDOWN_FIELD_FIELD() {
    await this.fieldType.deleteFieldType(EDIT_FIELD_LABEL);
  }
}
