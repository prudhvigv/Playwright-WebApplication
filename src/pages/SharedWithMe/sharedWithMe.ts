import { BaseClass } from '../../config/BaseClass';
import { Log } from '../../utils/Log';

export class SharedWithMe extends BaseClass {
  readonly sharedWithMeLink = this.page
    .getByLabel('Main')
    .getByRole('link', { name: 'Shared with me' });
  readonly sharedWithMeHeader = this.page
    .getByRole('main')
    .getByText('Shared With Me');
  readonly filesInTable = (fileName: string) =>
    this.page
      .locator('td[class*="column-name"] span')
      .filter({ hasText: fileName });

  async NAV_TO_SHARED_WITH_ME() {
    Log.info('NAVIGATING TO SHARED WITH ME TAB');
    await this.performClick(this.sharedWithMeLink);
    await this.assertVisible(this.sharedWithMeHeader);
  }

  async VALIDATE_FILE_IN_SHARED_WITH_ME(file: string) {
    Log.info(`VALIDATING IF ${file} IS VISIBLE IN SHARED WITH ME`);
    const nameWithoutExtension = file.replace(/\.[^/.]+$/, '');
    await this.waitForElement(this.filesInTable(nameWithoutExtension));
    await this.assertVisible(this.filesInTable(nameWithoutExtension).first());
  }
}
