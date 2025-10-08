import { Locator, Page } from 'playwright';
import { expect } from '@playwright/test';
import { Log } from '../utils/Log';

let pageNoInput: number;

export class BaseClass {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async performClick(locator: Locator) {
    Log.info(`Performing click on locator: ${locator}`);
    await this.page.waitForLoadState('load');
    await this.waitForElement(locator);
    await locator.click({ timeout: 80000 });
    Log.info(`Clicked on locator: ${locator}`);
  }

  async fillInput(locator: Locator, value: string, fieldName: string = '') {
    await this.page.waitForLoadState('networkidle');
    await this.waitForElement(locator);
    await locator.fill(''); // Clear the input first
    await locator.fill(value);
    Log.info(`Entered value in field ${fieldName}` + value);
  }

  async waitForElement(
    locator: Locator,
    stateOfElement: 'visible' | 'attached' | 'detached' | 'hidden' = 'visible',
  ) {
    await locator.waitFor({ state: stateOfElement, timeout: 80000 });
  }

  async getText(locator: Locator): Promise<string> {
    await this.page.waitForLoadState('networkidle');
    await this.waitForElement(locator);
    return (await locator.textContent())?.trim() || '';
  }

  async assertURLContains(partialUrl: string, timeout: number = 80000) {
    await this.page.waitForLoadState('networkidle');
    await expect(this.page).toHaveURL(new RegExp(partialUrl), { timeout });
  }

  async assertVisible(locator: Locator, timeout: number = 80000) {
    await this.page.waitForLoadState('networkidle');
    Log.info(`Asserting visibility of locator: ${locator}`);
    await this.waitForElement(locator);
    await expect(locator).toBeVisible({ timeout });
    Log.info(`Locator is visible: ${locator}`);
  }

  async assertNotVisible(locator: Locator, timeout: number = 80000) {
    Log.info(`Asserting not visibility of locator: ${locator}`);
    // await this.waitForElement(locator, timeout);
    await expect(locator).toBeVisible({ visible: false, timeout });
    Log.info(`Locator is not visible: ${locator}`);
  }

  async navigateToLinkInSidekick(linkName: string) {
    const sidekickLink = this.page.getByRole('link', { name: linkName }).first();
    await this.performClick(sidekickLink);
    await this.page.waitForLoadState('networkidle');
  }

  async selectTab(tabName: string) {
    Log.info('Selecting Tab' + tabName);
    const locator = this.page.getByRole('tab', { name: `${tabName}` });
    await this.performClick(locator);
  }

  async selectRowsPerPage(tableLocator: string, options: '5' | '10' | '15' | '25' | '50' | '100') {
    Log.info('Selecting no of rows per page ' + options)
    const dropdown = this.page.locator(`${tableLocator} mq-dropdown[panelclass="pagination-items"]`);
    const dropdownOption = this.page.locator(`div[class*="mq-option__label"]`).filter({ hasText: `${options} Rows` });
    await this.performClick(dropdown);
    await this.waitForElement(dropdownOption);
    await this.performClick(dropdownOption);
    await this.page.waitForTimeout(2000);
  };

  async goToPageNumber(tableLocator: string, pageNo: number) {
    Log.info('Navigating to page number ' + pageNo);
    const pageNoInput = this.page.locator(`${tableLocator} input[placeholder="Page No"]`);
    await this.fillInput(pageNoInput, String(pageNo));
    await pageNoInput.press('Enter');
    await this.page.waitForTimeout(2000);
    await this.page.waitForLoadState('networkidle');
  };

  async totalRecordsInMyVault(tableLocator: string) {
    Log.info('Calculating total no of records in MyValut ' + tableLocator);
    const totalRecords = this.page.locator(`${tableLocator} span[class*="pagination-caption"] span + span`);
    const fetchedCount = await totalRecords.textContent();
    const records: Number = Number(fetchedCount);
    Log.info('Total no of records ' + records);
    return records;
  };

  async noOfRowsInTable(tableLocator: string, rows: string) {
    Log.info('Fetching no of records in single page');
    const recordsInTable = this.page.locator(tableLocator)
    const noOfRecords = recordsInTable.count();
    Log.info('Records in singlePage ' +noOfRecords);
    return noOfRecords;
  }

  async noOfPages(tableLocator: string) {
    const totalRecords = Number(await this.totalRecordsInMyVault(tableLocator));
    const noOfRowsSelected = await this.page.locator(`${tableLocator} div[class*="mq-dropdown__value"] span`).textContent();
    const valuePreSelected = noOfRowsSelected ? parseInt(noOfRowsSelected.match(/\d+/)?.[0] || '0', 10) : 0;
    Log.info('No of Rows preselected is ' + valuePreSelected);
    const pages = totalRecords / 5;
    const totalPages = Math.ceil(pages);
    Log.info(`Total no of pages for ${totalRecords} should be ${totalPages}`);
    return totalPages;
  };

  async inputPageNo(tableLocator: string, value: number=pageNoInput ) {
    const pages = await this.noOfPages(tableLocator);
    pageNoInput = Math.min(1, pages);
    await this.goToPageNumber(tableLocator, value);
  }

  async validatePaginationInFile(tableLoc: string) {
    const totalPages = await this.noOfPages(tableLoc);
    await this.inputPageNo(tableLoc);
    Log.info('Total pages ' + totalPages);
    await this.page.waitForLoadState('networkidle');
    await this.assertVisible(this.page.locator(tableLoc));
  }

  async validateInvalidPage(tableLoc: string) {
    const totalPages = await this.noOfPages(tableLoc);
    await this.inputPageNo(tableLoc, totalPages + 1);
    Log.info('Total pages ' + totalPages);
    // await this.page.waitForTimeout(2000);
    await this.page.waitForLoadState('networkidle');
    await this.assertVisible(this.page.locator('//span[contains(text(), "Please enter valid page number")]').first());
  }

  async validateRecordsSelected(fileTable: string, option) {
    Log.info('Selecting option in pagination to show records ' + option);
    const rowsLocator = this.page.locator(`${fileTable} div[class*="mq-dropdown__value"] span`);
    await this.selectRowsPerPage(fileTable, option);
    const noOfRows = await rowsLocator.count();
    Log.info('Total records in single page is ' + noOfRows);
   expect(noOfRows).toBeLessThanOrEqual(option)
  }

  async REMOVE_FILE_EXTENSION(FILENAME: string) {
    Log.info('Removing extension for file ' + FILENAME);
    const nameWithoutExtension = FILENAME.replace(/\.[^/.]+$/, '');
    Log.info('File name without extension ' + nameWithoutExtension);
    return nameWithoutExtension;
  }

  async waitForLoader() {
    const loader = this.page.getByRole('img', { name: 'spinner loader' });
    await this.page.waitForTimeout(2000);
    try {
      let loaderPresent = true;
      const loaderCount = await loader.count();
      Log.info('Initial Loader count is ' + loaderCount);
      while (loaderPresent) {
        try {
          const loaderCountLater = await loader.count();
          if (loaderCountLater < loaderCount || (await loader.count()) < 1)  {
            loaderPresent = false
          }
        } catch (error) {
          loaderPresent = false
        }
      }
    } catch (error) {
      Log.info('Error is ' + error)
    }
  }

  async fetchCaseNumber() {
    Log.info('Fetching case number from URL');
    const url = this.page.url();

    const match = url.match(/\/record\/([^?]+)/);
    Log.info('Case number is ' + match?.[1]);
    return match?.[1];
  }
}
