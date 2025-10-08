import { test, expect } from '@playwright/test';
import { ApiBaseClass, BulkImportRequest, BulkExportRequest } from '../../../utils/ApiBaseClass';
import { AuthHelper } from '../../../utils/AuthHelper';
// import testData from '../../test-data/API/api-test-data-CMM-V2.json';
import { CURRENT_API_ENV, TestData, } from '../../../config/EnvConfig';
import * as fs from 'fs'; 
import { Log } from '../../../utils/Log';
import path from 'path';

test.describe('Datatable Import API Tests', () => {
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

  test('should import datatable records using JSON string synchronously', async () => {
    const importRequest: BulkImportRequest = {
      objectName: TestData.dataTables.demo_test_datatable_1,
      mode: 'SYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.dataTable1),
      operation: 'create',
      metadataJson: JSON.stringify(TestData.sampleData.datatable),
      objectType: 'datatable'
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    expect(responseData.data.jobId).toBeDefined();
    
    console.log('Datatable import job ID:', responseData.data.jobId);
  });

  test('should import datatable records using JSON string asynchronously', async () => {
    const importRequest: BulkImportRequest = {
      objectName: TestData.dataTables.demo_test_datatable_1,
      mode: 'ASYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.dataTable1),
      operation: 'create',
      metadataJson: JSON.stringify(TestData.sampleData.datatable),
      objectType: 'datatable'
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');

    Log.info('Datatable import job ID: ' + responseData.data.jobId);
  });

  test('should import datatable records using JSON format synchronously', async () => {

    const importRequest: BulkImportRequest = {
      objectName: TestData.dataTables.demo_test_datatable_1,
      mode: 'SYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.dataTable1),
      operation: 'create',
      objectType: 'datatable',
      metadataJson: require('fs').readFileSync(require('path').join(__dirname, `../../../test-data/api/${CURRENT_API_ENV}/DataTable/datatable_1_valid_records.json`), 'utf8')
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    console.log('Datatable CSV import job ID:', responseData.data.jobId);
  });

  test('should import datatable records using JSON format asynchronously', async () => {

    const importRequest: BulkImportRequest = {
      objectName: TestData.dataTables.demo_test_datatable_1,
      mode: 'ASYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.dataTable1),
      operation: 'create',
      objectType: 'datatable',
      metadataJson: require('fs').readFileSync(require('path').join(__dirname, `../../../test-data/api/${CURRENT_API_ENV}/DataTable/datatable_1_valid_records.json`), 'utf8')
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    console.log('Datatable CSV import job ID:', responseData.data.jobId);
  });

  test('should import datatable records using CSV format synchronously', async () => {

  const csvFilePath = path.join(__dirname, `../../../test-data/api/${CURRENT_API_ENV}/DataTable/datatable_1_valid_records.csv`);
  const csvBuffer = fs.readFileSync(csvFilePath);

    const importRequest: BulkImportRequest = {
      objectName: TestData.dataTables.demo_test_datatable_1,
      mode: 'SYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.dataTable1),
      operation: 'create',
      objectType: 'datatable',
      file: csvBuffer,
      fileName: 'datatable_1_valid_records.csv'
    };

    const response = await apiClient.bulkImport(importRequest);
    Log.info('Response is ' + await response.body())
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    expect(responseData.data).toHaveProperty('jobId');
    console.log('Datatable CSV import job ID:', responseData.data.jobId);
  });

  test('should import datatable records using CSV format with upsert operation', async () => {

    // Create file buffer for proper file upload
  const csvFilePath = path.join(__dirname, `../../../test-data/api/${CURRENT_API_ENV}/DataTable/datatable_1_valid_records.csv`);
  const csvBuffer = fs.readFileSync(csvFilePath);

    const importRequest: BulkImportRequest = {
      objectName: TestData.dataTables.demo_test_datatable_1,
      mode: 'SYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.dataTable1),
      operation: 'upsert',
      objectType: 'datatable',
      file: csvBuffer,
      fileName: 'datatable_1_valid_upsert.csv'
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    console.log('Datatable CSV upsert job ID:', responseData.data.jobId);
  });

  test('should import datatable records using CSV format asynchronously', async () => {

  const csvFilePath = path.join(__dirname, `../../../test-data/api/${CURRENT_API_ENV}/DataTable/datatable_1_valid_records.csv`);
  const csvBuffer = fs.readFileSync(csvFilePath);

    const importRequest: BulkImportRequest = {
      objectName: TestData.dataTables.demo_test_datatable_1,
      mode: 'ASYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.dataTable1),
      operation: 'create',
      objectType: 'datatable',
      file: csvBuffer,
      fileName: 'datatable_1_valid_records.csv'
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    const jobId = responseData.data.jobId;
    Log.info('Datatable CSV async import job ID:' + jobId);
  });
});

test.describe('Datatable Import API - Negative Scenarios', () => {
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

  test('should not process the request when wrong data in JSON/CSV is provided in SYNC operation', async () => {
    const importRequest: BulkImportRequest = {
      objectName: TestData.dataTables.demo_test_datatable_1,
      mode: 'SYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.dataTable1),
      operation: 'create',
      metadataJson: JSON.stringify(TestData.negativeScenarios.datatable),
      objectType: 'datatable'
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    expect(responseData.data.jobId).toBeDefined();
    expect(responseData.data.count.fail).toBe(1);
    
    Log.info('Datatable import job ID:' + responseData.data.jobId);
  });

  test('Response should return 400 when no JSON is passed in Payload', async () => {
    const importRequest: BulkImportRequest = {
      objectName: TestData.dataTables.demo_test_datatable_1,
      mode: 'SYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.dataTable1),
      operation: 'create',
      objectType: 'datatable'
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseData = await apiClient.validateErrorResponse(response, 400);
    expect(responseData.success).toBe(false);
    expect(responseData.message).toBe('Either metadataFile or metadataJson is required.');
    Log.info('Response is ' + responseData);
  });

  test('Response should return 400 when no mapping request is passed in Payload', async () => {
    const importRequest: BulkImportRequest = {
      objectName: TestData.dataTables.demo_test_datatable_1,
      mode: 'SYNC',
      metadataJson: JSON.stringify(TestData.negativeScenarios.datatable),
      mappingRequest: '',
      operation: 'create',
      objectType: 'datatable'
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseData = await response.json();
    expect(responseData.statusCode).toBe(400);
    expect(responseData.message).toBe("Required request parameter 'mappingRequest' for method parameter type String is not present");
  });
})
