import { test as base, chromium, Page } from '@playwright/test';
import { Log } from '../utils/Log';
import { EnvConfig } from '../config/EnvConfig';
import { LoginPage } from '../pages/Login/loginPage';
import path from 'path';
import fs from 'fs';

const reportsDir = path.resolve(__dirname, '../reports');

export const test = base.extend<{
  loginPage: LoginPage;
}>({
  loginPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.navigateToLoginPage(EnvConfig.baseUrl);
    await use(login);
  },
});

test.afterEach(async ({page}, testInfo) => {
  Log.info(`Execution status of ${testInfo.title} is ${testInfo.status}`);
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({
      path: `reports/${testInfo.title}-failure.png`,
      fullPage: true
    })
  }
});

test.afterAll(async () => {
  Log.info(`-------Test Execution Completed-------`)
  Log.info(`Execution end ${Date.toString()}`)
})