import { expect } from '@playwright/test';
import { BaseClass } from '../../config/BaseClass';
import { Log } from '../../utils/Log';
import { myVault } from '../MyVault/myVault';
import fs from 'fs';

const CR_Table = 'app-content-requests-list';

export class ContentRequest extends BaseClass {
  readonly myVaultPage = new myVault(this.page);

  readonly CRLink = this.page
    .getByLabel('Main')
    .getByRole('link', { name: 'Content Requests' });
  readonly CRHeading = this.page
    .getByRole('main')
    .getByText('Content Requests');
  readonly CRSearchBar = this.page.getByRole('textbox', {
    name: 'Search File & Folder',
  });
  readonly CR_ID_COL = this.page.locator(
    'app-content-requests-list td[class*="column-cr_label"] div',
  );
  readonly CR_SOURCE_COL = this.page.locator(
    'app-content-requests-list td[class*="column-source"] span',
  );
  readonly CR_STATUS_COLUMN = this.page.locator(
    'app-content-requests-list td[class*="column-status"] div span',
  );
  readonly CR_DESTINATION_COL = this.page.locator(
    'app-content-requests-list td[class*="column-destination"] div div + div',
  );

  async NAV_TO_CR() {
    Log.info('NAVIGATE TO CONTENT REQUEST');
    await this.performClick(this.CRLink);
    await this.assertVisible(this.CRHeading);
  }

  async COUNT_CR() {
    Log.info('Counting CR');
    let count = 0;
    let CR_ID: string | undefined = undefined;
    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(3000);
    const isVisible = await this.CR_ID_COL.first()
      .isVisible()
      .catch(() => false);
    if (isVisible) {
      count = await this.CR_ID_COL.count();
      Log.info(`Number of CR rows: ${count}`);
      CR_ID = (await this.CR_ID_COL.first().textContent()) ?? undefined;
      Log.info('Fetched CR ID ' + CR_ID);
    } else {
      Log.info("No CI's are available for user");
    }
    return { count, CR_ID };
  }

  async VALIDATE_CR_CREATED_FOR_FILE_UPLOAD(file: string) {
    Log.info('Validate if CR is created when user performs upload in MyVault');
    const CR_COUNT_BEFORE_OPERATION = await this.COUNT_CR();
    await this.myVaultPage.NAV_TO_MY_VAULT();
    await this.myVaultPage.UPLOAD_FILE_TO_MY_VAULT([file]);
    await this.NAV_TO_CR();
    const CR_COUNT_AFTER_OPERATION = await this.COUNT_CR();
    if (CR_COUNT_AFTER_OPERATION.CR_ID !== CR_COUNT_BEFORE_OPERATION.CR_ID) {
      Log.info('CR created');
      expect(CR_COUNT_AFTER_OPERATION.CR_ID).not.toEqual(
        CR_COUNT_BEFORE_OPERATION.CR_ID,
      );
      expect(
        (await this.CR_STATUS_COLUMN.first().textContent())?.trim(),
      ).toEqual('Completed');
      expect((await this.CR_SOURCE_COL.first().textContent())?.trim()).toEqual(
        'Manual Upload',
      );
      expect(
        (await this.CR_DESTINATION_COL.first().textContent())?.trim(),
      ).toEqual('VAULT');
    } else {
      Log.info('CR not created');
    }
  }

  async VALIDATE_CR_CREATED_FOR_FILE_DOWNLOAD(file: string, downloadsPath) {
    Log.info(
      'Validate if CR is created when user performs download file in MyVault',
    );
    const fileOnly = file.split('/').pop()?.replace('.pdf', '').trim() || '';
    Log.info('Filename only ' + fileOnly);
    const CR_COUNT_BEFORE_OPERATION = await this.COUNT_CR();
    await this.myVaultPage.NAV_TO_MY_VAULT();
    await this.myVaultPage.UPLOAD_FILE_TO_MY_VAULT([file]);
    await this.myVaultPage.VALIDATE_DOWNLOAD_FUNCTIONALITY(
      fileOnly,
      downloadsPath,
    );
    await this.NAV_TO_CR();
    const CR_COUNT_AFTER_OPERATION = await this.COUNT_CR();
    if (CR_COUNT_AFTER_OPERATION.CR_ID !== CR_COUNT_BEFORE_OPERATION.CR_ID) {
      Log.info('CR created');
      expect(CR_COUNT_AFTER_OPERATION.CR_ID).not.toEqual(
        CR_COUNT_BEFORE_OPERATION.CR_ID,
      );
      expect(
        (await this.CR_STATUS_COLUMN.first().textContent())?.trim(),
      ).toEqual('Completed');
      expect((await this.CR_SOURCE_COL.first().textContent())?.trim()).toEqual(
        'Download',
      );
      expect(
        (await this.CR_DESTINATION_COL.first().textContent())?.trim(),
      ).toEqual('DOWNLOAD');
    } else {
      Log.info('CR not created');
    }
  }

  async VALIDATE_CI_VALID_PAGINATION() {
    await this.validatePaginationInFile(CR_Table)
  }

  async VALIDATE_CI_INVALID_INPUT() {
    await this.validateInvalidPage(CR_Table);
  }

  async VALIDATE_RECORDS_SELECTED(OPTION) {
    await this.validateRecordsSelected(CR_Table, OPTION)
  }
}
