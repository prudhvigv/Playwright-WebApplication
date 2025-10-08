import { defineConfig } from '@playwright/test';
import { OrtoniReportConfig } from 'ortoni-report';
import * as os from 'os';

const reportConfig: OrtoniReportConfig = {
  open: process.env.CI ? "never" : 'always',
  folderPath: "my-report",
  filename: "report.html",
  title: "Test Report",
  showProject: true,
  projectName: "IntelliSuite",
  testType: "Functional",
  meta: {
    'Execution 1': "05-Sep-2025",
    platform: os.type()
  }
}


export default defineConfig({
  testDir: './src/tests',
  fullyParallel: false,
  reporter: [['ortoni-report', reportConfig], ['list'], ['json', { outputFile: 'playwright-report/results.json' }]],
  use: {
    baseURL: process.env.BASE_URL,
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'on',
    trace: 'on-first-retry',
    navigationTimeout: 8 * 10000,
  },
  retries: 1,
  timeout: 100000,
  workers: 1
});
