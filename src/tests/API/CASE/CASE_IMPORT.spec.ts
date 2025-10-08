import { test, expect } from '@playwright/test';
import { ApiBaseClass, BulkImportRequest, BulkExportRequest } from '../../../utils/ApiBaseClass';
import { AuthHelper } from '../../../utils/AuthHelper';
import { CURRENT_API_ENV, TestData, } from '../../../config/EnvConfig';
import { Log } from '../../../utils/Log';

test.describe('Case Import API Tests', () => {
  let apiClient: ApiBaseClass;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiBaseClass(request, {
      baseURL: TestData.config.baseURL,
      tenant: TestData.config.tenant
    });
  });

  test.afterEach(async () => {
    // Clear auth token after each test to ensure fresh authentication
    AuthHelper.clearToken();
  });

  test('should authenticate and get valid bearer token', async ({ request }) => {
    const token = await AuthHelper.getAuthToken(request);
    expect(token).toBeDefined();
    expect(token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/); // JWT format
  });

  test('should import cases using JSON string synchronously', async () => {
    const importRequest: BulkImportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'SYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.caseType1),
      operation: 'create',
      metadataJson: JSON.stringify(TestData.sampleData.cases),
      objectType: 'case'
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    expect(responseData.data.jobId).toBeDefined();
    
    // Store jobId for potential cleanup or further validation
    const jobId = responseData.data.jobId;
    console.log('Case import job ID:', jobId);
  });

  test('should import cases using JSON string asynchronously', async () => {
    const importRequest: BulkImportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'ASYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.caseType1),
      operation: 'create',
      metadataJson: JSON.stringify(TestData.sampleData.cases),
      objectType: 'case'
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    const jobId = responseData.data.jobId;
    Log.info('Case import job ID: ' + jobId);
  });

  test('should handle import with update operation', async () => {
    // First create some cases
    const createRequest: BulkImportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'SYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.caseType1),
      operation: 'upsert',
      metadataJson: require('fs').readFileSync(require('path').join(__dirname, `../../../test-data/api/${CURRENT_API_ENV}/RichTextBulkUpload.csv`), 'utf8'),
      objectType: 'case'
    };

    await apiClient.bulkImport(createRequest);

    // Then update them
    const updateData = TestData.sampleData.cases.map(caseData => ({
      ...caseData,
      subject: `Updated ${caseData.subject}`,
      age: caseData.age + 1
    }));

    const updateRequest: BulkImportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'SYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.caseType1),
      operation: 'update',
      metadataJson: JSON.stringify(updateData),
      objectType: 'case'
    };

    const response = await apiClient.bulkImport(updateRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
  });

  // test('should import cases using JSON file asynchronously', async () => {
  //   const importRequest: BulkImportRequest = {
  //     objectName: TestData.caseTypes.demo_test_data_casetype_1,
  //     mode: 'ASYNC',
  //     mappingRequest: JSON.stringify(TestData.mappingRequests.caseType1),
  //     operation: 'create',
  //     metadataJson: require('fs').readFileSync(require('path').join(__dirname, `../../../test-data/api/${CURRENT_API_ENV}/cases-sample-all-fields (1).csv`), 'utf8'),
  //     objectType: 'case'
  //   };

  //   const response = await apiClient.bulkImport(importRequest);
  //   const responseBody = await response.json();
  //   Log.info(responseBody);
  //   const responseData = await apiClient.validateSuccessResponse(response, 200);
  //   expect(responseData.data).toHaveProperty('jobId');
  //   const jobId = responseData.data.jobId;
  //   Log.info('Case import job ID: ' + jobId);
  // });

  test('should handle import errors gracefully', async () => {
    // Test with invalid mapping request
    const invalidImportRequest: BulkImportRequest = {
      objectName: 'non_existent_case_type',
      mode: 'SYNC',
      mappingRequest: JSON.stringify({ invalid: 'mapping' }),
      operation: 'create',
      metadataJson: JSON.stringify(TestData.sampleData.cases),
      objectType: 'case'
    };

    const response = await apiClient.bulkImport(invalidImportRequest);
    
    // Should handle error response appropriately
    if (response.status() !== 200) {
      const errorData = await apiClient.validateErrorResponse(response, response.status());
      expect(errorData.success).toBe(false);
    }
  });

  test('should get job report for completed job', async () => {
    // Create a job first
    const importRequest: BulkImportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'SYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.caseType1),
      operation: 'create',
      metadataJson: JSON.stringify(TestData.sampleData.cases),
      objectType: 'case'
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    const jobId = responseData.data.jobId;
    Log.info('Case import job ID: ' + jobId);

    // Get job report
    const jobReportResponse = await apiClient.getJobReport(jobId);
    expect(jobReportResponse.status()).toBe(200);
  });

  test('should not import cases using JSON string synchronously for wrong payload', async () => {
    const importRequest: BulkImportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'SYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.caseType1),
      operation: 'create',
      objectType: 'case'
    };
    const response = await apiClient.bulkImport(importRequest);
    await apiClient.validateErrorResponse(response, 400);
  });

  // test.only('should throw error for import with update operation when file is not passed', async () => {
  //   // First create some cases
  //   const createRequest: BulkImportRequest = {
  //     objectName: TestData.caseTypes.demo_test_data_casetype_1,
  //     mode: 'SYNC',
  //     mappingRequest: JSON.stringify(TestData.mappingRequests.caseType1),
  //     operation: 'upsert',
  //     // metadataJson: require('fs').readFileSync(require('path').join(__dirname, `../../../test-data/api/${CURRENT_API_ENV}/RichTextBulkUpload.csv`), 'utf8'),
  //     objectType: 'case'
  //   };

  //   await apiClient.bulkImport(createRequest);

  //   // Then update them
  //   const updateData = TestData.sampleData.cases.map(caseData => ({
  //     ...caseData,
  //     subject: `Updated ${caseData.subject}`,
  //     age: caseData.age + 1
  //   }));

  //   const updateRequest: BulkImportRequest = {
  //     objectName: TestData.caseTypes.demo_test_data_casetype_1,
  //     mode: 'SYNC',
  //     mappingRequest: JSON.stringify(TestData.mappingRequests.caseType1),
  //     operation: 'update',
  //     metadataJson: JSON.stringify(updateData),
  //     objectType: 'case'
  //   };

  //   const response = await apiClient.bulkImport(updateRequest);
  //   const responseData = await apiClient.validateSuccessResponse(response, 200);
    
  //   expect(responseData.data).toHaveProperty('jobId');
  // });
});
