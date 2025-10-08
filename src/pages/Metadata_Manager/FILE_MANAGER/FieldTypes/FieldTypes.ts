import { BaseClass } from '../../../../config/BaseClass';
import { HomePage } from '../../../HomePage/HomePage';
import { faker } from '@faker-js/faker';
import { CreateFieldType } from '../../../../test-data/Metadata_Manager/FileManager/FieldType/field-type.json';
import { expect } from '@playwright/test';
import { Log } from '../../../../utils/Log';

const FIELD_LABEL =
  CreateFieldType.ShortText.fieldLabel + faker.person.jobDescriptor();

export class FieldTypes extends BaseClass {
  readonly homePage = new HomePage(this.page);

  readonly createFieldTypeBtn = this.page.getByRole('button', {
    name: 'Create',
    exact: true,
  });
  readonly selectFieldTypeDialog = this.page.getByText('Select Field Type');
  readonly fieldTypeOption = (fieldTypeName: string) =>
    this.page.locator('#mq-dialog-0').getByText(fieldTypeName, { exact: true });
  readonly rowsInTable = this.page.locator(
    'app-list-view-table table tr[class*="mq-row"]',
  );
  readonly rowValuesInTable = this.page.locator(
    'app-list-view-table table tr[class*="mq-row"] td span span',
  );
  readonly fieldNameInTable = (name: string) =>
    this.page.getByText(`${name}`, { exact: true });
  readonly fieldLabelInTable = (label: string) =>
    this.page.getByText(`${label}`, { exact: true });
  readonly searchFieldType = this.page.getByRole('textbox', {
    name: 'Search Field Names',
  });
  readonly fieldOption = (fieldTypeName: string) =>
    this.page
      .getByRole('row', { name: `${fieldTypeName}` })
      .getByLabel('Activities');
  readonly editOptionBtn = this.page.getByRole('menuitem', { name: 'Edit' });
  readonly deleteOptionBtn = this.page.getByRole('menuitem', {
    name: 'Delete',
  });
  readonly deletePopup = this.page.getByRole('button', { name: 'Delete' });
  readonly editFieldLabel = this.page.getByText('Edit Field');

  async NAV_TO_FIELDS() {
    Log.info('NAVIGATING TO FILE CATEGORIES');
    await this.homePage.navigateToDashboard();
    await this.navigateToLinkInSidekick('File Manager');
    await this.assertURLContains('file-manager', 80000);
    await this.selectTab('Fields');
    await this.assertVisible(this.searchFieldType);
  }

  async NAV_TO_CREATE_FIELDTYPE() {
    Log.info('NAVIGATING TO CREATE FIELD TYPE DIALOG');
    await this.performClick(this.createFieldTypeBtn);
    await this.assertVisible(this.selectFieldTypeDialog);
  }

  async selectFieldType(fieldTypeName: string) {
    Log.info('SELECTING FIELD TYPE');
    await this.performClick(this.fieldTypeOption(fieldTypeName));
  }

  async VALIDATE_FIELD_TYPE_CREATED(searchText: string) {
    Log.info('Validating if Data Type is created');
    await this.waitForElement(this.createFieldTypeBtn);
    await this.fillInput(this.searchFieldType, searchText);
    await this.page.waitForTimeout(2000);
    const count = await this.rowsInTable.count();
    Log.info('Total results are ' + count);
    return expect(count).toBeGreaterThanOrEqual(1);
  }

  async SELECT_FIELD_TYPE_IN_TABLE() {
    Log.info('Selecting field type in Table');
    await this.performClick(this.fieldNameInTable(FIELD_LABEL).first());
  }

  async selectFieldTypeOption(fieldTypeName: string) {
    Log.info('Selecting option for field type ' + fieldTypeName);
    await this.performClick(this.fieldOption(fieldTypeName).first());
    await this.assertVisible(this.editOptionBtn);
    await this.assertVisible(this.deleteOptionBtn);
  }

  async editFieldType(fieldTypeName: string) {
    Log.info(`Editing field type ${fieldTypeName}`);
    await this.selectFieldTypeOption(fieldTypeName);
    await this.performClick(this.editOptionBtn);
    await this.waitForElement(this.editFieldLabel);
  }

  async deleteFieldType(fieldTypeName: string) {
    Log.info('Deleting field type created ' + fieldTypeName);
    await this.selectFieldTypeOption(fieldTypeName);
    await this.performClick(this.deleteOptionBtn);
    await this.waitForElement(this.deletePopup);
    await this.performClick(this.deletePopup);
    await this.page.waitForLoadState('networkidle');
  }
}
