import { expect } from '@playwright/test';
import { BaseClass } from '../../../../config/BaseClass';
import { FieldTypes } from './FieldTypes';
import { faker } from '@faker-js/faker';
import {
  CreateFieldType,
  EditFieldType,
} from '../../../../test-data/Metadata_Manager/FileManager/FieldType/field-type.json';

const FIELD_NAME = (
  CreateFieldType.ShortText.fieldName + faker.person.firstName()
).replace(/[^a-zA-Z0-9_]/g, '');
const FIELD_LABEL =
  CreateFieldType.ShortText.fieldLabel + faker.person.jobDescriptor();
const PLACEHOLDER = CreateFieldType.ShortText.placeholder;
const HELP_TEXT = CreateFieldType.ShortText.helpText;
const FIELD_DESCRIPTION = CreateFieldType.ShortText.fieldDescription;
const PROTECT_FIELD = CreateFieldType.ShortText.protectField;
const IS_FIELD_SEARCHABLE = CreateFieldType.ShortText.fieldSearchable;

const EDIT_FIELD_NAME = (
  EditFieldType.ShortText.fieldName +
  faker.person.firstName() +
  faker.person.lastName()
).replace(/[^a-zA-Z0-9_]/g, '');
const EDIT_FIELD_LABEL =
  EditFieldType.ShortText.fieldLabel + faker.person.jobDescriptor();
const EDIT_PLACEHOLDER = EditFieldType.ShortText.placeholder;
const EDIT_HELP_TEXT = EditFieldType.ShortText.helpText;
const EDIT_FIELD_DESCRIPTION = EditFieldType.ShortText.fieldDescription;
const EDIT_PROTECT_FIELD = EditFieldType.ShortText.protectField;
const EDIT_IS_FIELD_SEARCHABLE = EditFieldType.ShortText.fieldSearchable;

export class ShortText extends BaseClass {
  readonly fieldType = new FieldTypes(this.page);

  readonly fieldNameInput = this.page.getByRole('textbox', {
    name: 'Enter Name',
  });
  readonly fieldLabelInput = this.page
    .getByRole('textbox', {
      name: 'Enter Label',
    })
    .first();
  readonly placeholderInput = this.page.getByRole('textbox', {
    name: 'Enter Placeholder',
  });
  readonly helpTextInput = this.page.getByRole('textbox', {
    name: 'Enter Help Text',
  });
  readonly fieldDescInput = this.page.getByRole('textbox', {
    name: 'Enter Description',
  });
  readonly protectFieldToggle = this.page.locator('.mq-toggle__slider').first();
  readonly isFieldSearchableToggle = this.page.locator(
    '//span[contains(text(), "Is this field searchable?")]/following::mq-toggle//span[contains(@class, "mq-toggle__slider")]',
  );
  readonly cancelButton = this.page.getByRole('button', { name: 'Cancel' });
  readonly saveButton = this.page.getByRole('button', { name: 'Save' });
  readonly updateButton = this.page.getByRole('button', { name: 'Update' });

  async enterData(
    name: string,
    label: string,
    placeholder: string,
    helpText: string,
    fieldDesc: string,
    protectField: boolean,
    isFieldSearch: boolean = false,
  ) {
    if (name !== '') {
      await this.fillInput(this.fieldNameInput, name);  
    }
    await this.page.waitForTimeout(2000);
    await this.fillInput(this.fieldLabelInput, label);
    await this.fillInput(this.placeholderInput, placeholder);
    await this.fillInput(this.helpTextInput, helpText);
    await this.fillInput(this.fieldDescInput, fieldDesc);
    if (protectField) {
      await this.performClick(this.protectFieldToggle);
    }
    if (isFieldSearch) {
      await this.performClick(this.isFieldSearchableToggle);
    }
  }

  async editData(
    label: string,
    placeholder: string,
    helpText: string,
    fieldDesc: string,
    protectField: boolean,
    isFieldSearch: boolean = false,
  ) {
    await this.page.waitForTimeout(2000);
    await this.fillInput(this.fieldLabelInput, label);
    await this.fillInput(this.placeholderInput, placeholder);
    await this.fillInput(this.helpTextInput, helpText);
    await this.fillInput(this.fieldDescInput, fieldDesc);
    if (protectField) {
      await this.performClick(this.protectFieldToggle);
    }
    if (isFieldSearch) {
      await this.performClick(this.isFieldSearchableToggle);
    }
  }

  async CREATE_SHORT_TEXT_FIELD() {
    console.log('CREATING SHORT TEXT FIELD');
    await this.page.locator('#mq-dialog-0').getByText('Short Text').waitFor();
    await this.page.locator('#mq-dialog-0').getByText('Short Text').click();
    await expect(this.saveButton).toBeDisabled();
    await this.enterData(
      FIELD_NAME,
      FIELD_LABEL,
      PLACEHOLDER,
      HELP_TEXT,
      FIELD_DESCRIPTION,
      PROTECT_FIELD,
      IS_FIELD_SEARCHABLE,
    );
    await this.performClick(this.saveButton);
    await this.page.waitForLoadState('networkidle');
  }

  async VALIDATE_SHORT_TEXT_FIELD_CREATED() {
    return await this.fieldType.VALIDATE_FIELD_TYPE_CREATED(FIELD_LABEL);
  }

  async EDIT_SHORT_TEXT_FIELD() {
    await this.fieldType.editFieldType(FIELD_LABEL);
    await this.editData(
      EDIT_FIELD_LABEL,
      EDIT_PLACEHOLDER,
      EDIT_HELP_TEXT,
      EDIT_FIELD_DESCRIPTION,
      EDIT_PROTECT_FIELD,
      EDIT_IS_FIELD_SEARCHABLE,
    );
    await this.performClick(this.updateButton);
    await this.page.waitForLoadState('networkidle');
  }

  async DELETE_SHORT_TEXT_FIELD() {
    await this.fieldType.deleteFieldType(EDIT_FIELD_LABEL);
  }
}
