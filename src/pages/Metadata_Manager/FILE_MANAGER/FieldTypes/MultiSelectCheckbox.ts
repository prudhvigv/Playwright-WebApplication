import { BaseClass } from '../../../../config/BaseClass';
import { FieldTypes } from './FieldTypes';
import { ShortText } from './ShortText';
import {
  CreateFieldType,
  EditFieldType,
} from '../../../../test-data/Metadata_Manager/FileManager/FieldType/field-type.json';
import { faker } from '@faker-js/faker';
import { Log } from '../../../../utils/Log';
import { expect } from '@playwright/test';
import { Dropdown } from './Dropdown';

const FIELD_NAME = (
  CreateFieldType.MultiSelectCheckbox_Field.fieldName + faker.person.lastName()
).replace(/[^a-zA-Z0-9_]/g, '');
const FIELD_LABEL =
  CreateFieldType.MultiSelectCheckbox_Field.fieldLabel +
  faker.person.jobDescriptor();
const PLACEHOLDER = CreateFieldType.MultiSelectCheckbox_Field.placeholder;
const HELP_TEXT = CreateFieldType.MultiSelectCheckbox_Field.helpText;
const FIELD_DESCRIPTION =
  CreateFieldType.MultiSelectCheckbox_Field.fieldDescription;
const PROTECT_FIELD = CreateFieldType.MultiSelectCheckbox_Field.protectField;
const DEFAULT_SELECTION =
  CreateFieldType.MultiSelectCheckbox_Field.DefaultSelection;
const LIST = CreateFieldType.MultiSelectCheckbox_Field.List;

const EDIT_FIELD_NAME = (
  EditFieldType.MultiSelectCheckbox_Field.fieldName + faker.person.lastName()
).replace(/[^a-zA-Z0-9_]/g, '');
const EDIT_FIELD_LABEL =
  EditFieldType.MultiSelectCheckbox_Field.fieldLabel +
  faker.person.jobDescriptor();
const EDIT_PLACEHOLDER = EditFieldType.MultiSelectCheckbox_Field.placeholder;
const EDIT_HELP_TEXT = EditFieldType.MultiSelectCheckbox_Field.helpText;
const EDIT_FIELD_DESCRIPTION =
  EditFieldType.MultiSelectCheckbox_Field.fieldDescription;
const EDIT_PROTECT_FIELD = EditFieldType.MultiSelectCheckbox_Field.protectField;

export class MultiSelectCheckbox extends BaseClass {
  readonly fieldType = new FieldTypes(this.page);
  readonly shortText = new ShortText(this.page);
  readonly dropdown = new Dropdown(this.page);

  readonly fieldLabelInput = this.page
    .getByRole('textbox', { name: 'Enter Label' })
    .first();
  readonly defaultSelection = this.page.getByRole('checkbox', {
    name: 'Show list in alphabetical',
  });
  readonly fieldLabel = this.page
    .locator('app-meta-manager-field-enum-input')
    .getByRole('textbox', { name: 'Enter Label' });
  readonly valueLabel = this.page.getByRole('textbox', { name: 'Enter value' });
  readonly addButton = this.page.getByRole('button', { name: 'Add' });
  readonly labelAdded = this.page.locator('span[class="value"]');

  async verifyLabelAdded(labelName: string) {
    Log.info('Verify if label is added');
    const labelAddedCount = await this.labelAdded.count();
    const labels: string[] = [];
    for (let i = 0; i < labelAddedCount; i++) {
      const text = await this.labelAdded.nth(i).textContent();
      if (text) {
        labels.push(text.trim());
      }
    }
    if (!labels.length) {
      throw new Error('No labels found');
    }
    expect(labels).toContain(labelName);
  }

  async CREATE_MULTISELECT_CHECKBOX_FIELD() {
    Log.info('Creating MultiSelect Checkbox field');
    await this.fieldType.selectFieldType('Multi-Select Checkbox');
    await this.fillInput(this.shortText.fieldNameInput, FIELD_NAME);
    await this.fillInput(this.fieldLabelInput, FIELD_LABEL);
    await this.fillInput(this.shortText.placeholderInput, PLACEHOLDER);
    await this.fillInput(this.shortText.helpTextInput, HELP_TEXT);
    await this.fillInput(this.shortText.fieldDescInput, FIELD_DESCRIPTION);
    if (PROTECT_FIELD) {
      await this.performClick(this.shortText.protectFieldToggle);
    }
    if (DEFAULT_SELECTION) {
      await this.performClick(this.defaultSelection);
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
          await this.fillInput(this.fieldLabel, LIST[`FieldLable${i + 1}`]);
          await this.fillInput(this.valueLabel, LIST[`Value${i + 1}`]);
          await this.performClick(this.addButton);
          await this.verifyLabelAdded(LIST[`Value${i + 1}`]);
        }
      } else {
        await this.fillInput(this.fieldLabel, LIST.FieldLable1);
        await this.fillInput(this.valueLabel, LIST.Value1);
        await this.performClick(this.addButton);
        await this.verifyLabelAdded(LIST.Value1);
      }
    }
    await this.performClick(this.shortText.saveButton);
    await this.page.waitForLoadState('networkidle');
  }

  async VALIDATE_MULTI_SELECT_CHECKBOX_FIELD_CREATED() {
    return await this.fieldType.VALIDATE_FIELD_TYPE_CREATED(FIELD_LABEL);
  }

  async EDIT_MULTI_SELECT_CHECKBOX_FIELD_FIELD() {
    await this.fieldType.editFieldType(FIELD_LABEL);
    await this.shortText.enterData(
      EDIT_FIELD_NAME,
      EDIT_FIELD_LABEL,
      EDIT_PLACEHOLDER,
      EDIT_HELP_TEXT,
      EDIT_FIELD_DESCRIPTION,
      EDIT_PROTECT_FIELD,
    );
    await this.performClick(this.shortText.updateButton);
    await this.page.waitForLoadState('networkidle');
    await this.waitForElement(this.fieldType.searchFieldType);
  }

  async DELETE_MULTI_SELECT_CHECKBOX_FIELD_FIELD() {
    await this.fieldType.deleteFieldType(EDIT_FIELD_LABEL);
  }
}
