import { test, expect } from '@playwright/test';
import { ApiBaseClass, BulkImportRequest, BulkExportRequest } from '../../../utils/ApiBaseClass';
import { AuthHelper } from '../../../utils/AuthHelper';
import { CURRENT_API_ENV, TestData } from '../../../config/EnvConfig';
import { Log } from '../../../utils/Log';

test.describe('Notes Export API Tests', () => {
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

  test('should export notes synchronously in CSV format', async () => {
    const exportRequest: BulkExportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'SYNC',
      objectType: 'notes',
      format: 'csv'
    };

    const response = await apiClient.bulkDTExport(exportRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    Log.info('Notes export (CSV) job ID:' + responseData.data.jobId);
  });

  test('should export notes synchronously in JSON format', async () => {
    const exportRequest: BulkExportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'SYNC',
      objectType: 'notes',
      format: 'json'
    };

    const response = await apiClient.bulkDTExport(exportRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    console.log('Notes export (JSON) job ID:', responseData.data.jobId);
  });

  test('should export notes synchronously with skip and limit in CSV format', async () => {
    const exportRequest: BulkExportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'SYNC',
      objectType: 'notes',
      format: 'csv',
      skip: 0,
      limit: 25
    };

    const response = await apiClient.bulkDTExport(exportRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
  });

  test('should export notes synchronously with skip and limit in JSON format', async () => {
    const exportRequest: BulkExportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'SYNC',
      objectType: 'notes',
      format: 'json',
      skip: 0,
      limit: 25
    };

    const response = await apiClient.bulkDTExport(exportRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
  });

  test('should export notes asynchronously with skip and limit in CSV format', async () => {
    const exportRequest: BulkExportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'ASYNC',
      objectType: 'notes',
      format: 'csv',
      skip: 2,
      limit: 10
    };

    const response = await apiClient.bulkDTExport(exportRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    const jobId = responseData.data.jobId;
    Log.info('Notes export (CSV) job ID:' + jobId);
  });

  test('should export notes asynchronously with skip and limit in JSON format', async () => {
    const exportRequest: BulkExportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'ASYNC',
      objectType: 'notes',
      format: 'json',
      skip: 0,
      limit: 15
    };

    const response = await apiClient.bulkDTExport(exportRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    const jobId = responseData.data.jobId;
    Log.info('Notes export (JSON) job ID:' + jobId);
  });

  test('should export notes asynchronously in CSV format', async () => {
    const exportRequest: BulkExportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'ASYNC',
      objectType: 'notes',
      format: 'csv'
    };

    const response = await apiClient.bulkDTExport(exportRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    const jobId = responseData.data.jobId;
    Log.info('Notes export (CSV) job ID:' + jobId);
  });

  test('should export notes asynchronously in JSON format', async () => {
    const exportRequest: BulkExportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'ASYNC',
      objectType: 'notes',
      format: 'json'
    };

    const response = await apiClient.bulkDTExport(exportRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    const jobId = responseData.data.jobId;
    Log.info('Notes export (JSON) job ID:' + jobId);
  });

  test('should handle import errors gracefully', async () => {
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
