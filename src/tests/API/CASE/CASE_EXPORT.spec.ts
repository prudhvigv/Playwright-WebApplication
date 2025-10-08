import { test, expect } from '@playwright/test';
import { ApiBaseClass, BulkImportRequest, BulkExportRequest } from '../../../utils/ApiBaseClass';
import { AuthHelper } from '../../../utils/AuthHelper';
import { CURRENT_API_ENV, TestData, } from '../../../config/EnvConfig';
import { Log } from '../../../utils/Log';

test.describe('Case Export API Tests', () => {
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

  test('should export cases synchronously', async () => {
    const exportRequest: BulkExportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'SYNC',
      objectType: 'case',
      limit: 120
    };

    const response = await apiClient.bulkDTExport(exportRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    const jobId = responseData.data.jobId;
    console.log('Case export job ID:', jobId);
  });

   test('should export cases asynchronously with limit', async () => {
    const exportRequest: BulkExportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'ASYNC',
      objectType: 'case',
      skip: 0,
      limit: 25
    };

    const response = await apiClient.bulkDTExport(exportRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    const jobId = responseData.data.jobId;
    Log.info('Case export job ID: ' + jobId);
  });

  test('should export cases asynchronously with skip and limit', async () => {
    const exportRequest: BulkExportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'ASYNC',
      objectType: 'case',
      format: 'csv',
      skip: 5,
      limit: 10
    };

    const response = await apiClient.bulkDTExport(exportRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    const jobId = responseData.data.jobId;
    Log.info('Case export job ID: ' + jobId);
  });

  test('should export cases asynchronously', async () => {
    const exportRequest: BulkExportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'ASYNC',
      objectType: 'case'
    };

    const response = await apiClient.bulkDTExport(exportRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    const jobId = responseData.data.jobId;
    Log.info('Case export job ID: ' + jobId);
  });

  test('should handle export errors gracefully', async () => {
    // Test with invalid mapping request
    const invalidExportRequest: BulkExportRequest = {
      objectName: 'non_existent_case_type',
      mode: 'SYNC',
      objectType: 'case'
    };

    const response = await apiClient.bulkDTExport(invalidExportRequest);
    
    // Should handle error response appropriately
    if (response.status() !== 200) {
      const errorData = await apiClient.validateErrorResponse(response, response.status());
      expect(errorData.success).toBe(false);
    }
  });
});


