import { test, expect } from '@playwright/test';
import { ApiBaseClass, BulkImportRequest, BulkExportRequest } from '../../../utils/ApiBaseClass';
import { AuthHelper } from '../../../utils/AuthHelper';
import { CURRENT_API_ENV, TestData } from '../../../config/EnvConfig';
import { Log } from '../../../utils/Log';
import path from 'path';
import * as fs from 'fs'; 

test.describe('Notes Import API Tests', () => {
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

  test('should import notes using JSON string synchronously', async () => {
    const importRequest: BulkImportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'SYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.notes1),
      operation: 'create',
      metadataJson: JSON.stringify(TestData.sampleData.notes),
      objectType: 'notes'
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    expect(responseData.data.jobId).toBeDefined();
    expect(responseData.data.count.total).toEqual(responseData.data.count.success);
    
    Log.info('Notes import job ID: ' + responseData.data.jobId);
  });

  test('should import notes using JSON string asynchronously', async () => {
    const importRequest: BulkImportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'ASYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.notes1),
      operation: 'create',
      metadataJson: JSON.stringify(TestData.sampleData.notes),
      objectType: 'notes'
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    const jobId = responseData.data.jobId;
    Log.info('Notes import job ID: ' + jobId);
  });

  test('should import notes using CSV format synchronously', async () => {

    const csvFilePath = path.join(__dirname, `../../../test-data/api/${CURRENT_API_ENV}/Notes/CaseNoteHTML.csv`);
    const csvBuffer = fs.readFileSync(csvFilePath);

    const importRequest: BulkImportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'SYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.notes1),
      operation: 'create',
      objectType: 'notes',
      file: csvBuffer,
      fileName: 'CaseNoteHTML.csv'
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseBody = await response.json();
    console.log(responseBody);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    expect(responseData.data.count.total).toEqual(responseData.data.count.success);
    console.log('Notes CSV import job ID:', responseData.data.jobId);
  });

  test('should import notes using CSV format asynchronously', async () => {
    // Create CSV content for notes
    const csvFilePath = path.join(__dirname, `../../../test-data/api/${CURRENT_API_ENV}/Notes/CaseNoteHTML.csv`);
    const csvBuffer = fs.readFileSync(csvFilePath);

    const importRequest: BulkImportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'ASYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.notes1),
      operation: 'create',
      objectType: 'notes',
      file: csvBuffer,
      fileName: 'CaseNoteHTML.csv'
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    const jobId = responseData.data.jobId;
    Log.info('Notes import job ID: ' + jobId);
  });

  test('should import notes using JSON file synchronously', async () => {
    const importRequest: BulkImportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'SYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.notes1),
      operation: 'create',
      metadataJson: require('fs').readFileSync(require('path').join(__dirname, `../../../test-data/api/${CURRENT_API_ENV}/Notes/CaseNote.json`), 'utf8'),
      objectType: 'notes'
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    expect(responseData.data.jobId).toBeDefined();
    expect(responseData.data.count.total).toEqual(responseData.data.count.success);
    
    Log.info('Notes import job ID: ' + responseData.data.jobId);
  });

  test('should import notes using JSON file asynchronously', async () => {
    const importRequest: BulkImportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'ASYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.notes1),
      operation: 'create',
      metadataJson: require('fs').readFileSync(require('path').join(__dirname, `../../../test-data/api/${CURRENT_API_ENV}/Notes/CaseNote.json`), 'utf8'),
      objectType: 'notes'
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    const jobId = responseData.data.jobId;
    Log.info('Notes import job ID: ' + jobId);
  });
});

test.describe('Notes Import API - Negative Scenarios', () => {
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

  test('Result in json body should be failed when wrong case type in JSON/CSV is provided in SYNC operation', async () => {
    const importRequest: BulkImportRequest = {
      objectName: "Notes",
      mode: 'SYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.notes1),
      operation: 'create',
      metadataJson: JSON.stringify(TestData.negativeScenarios.notes),
      objectType: 'notes'
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    expect(responseData.data.jobId).toBeDefined();
    expect(responseData.data.count.total).not.toEqual(responseData.data.count.success);
    
    Log.info('Notes import job ID: ' + responseData.data.jobId);
  });

  test('Result in json body should be failed when wrong JSON/CSV is provided in SYNC operation', async () => {
    const importRequest: BulkImportRequest = {
      objectName: TestData.caseTypes.demo_test_data_casetype_1,
      mode: 'SYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.notes1),
      operation: 'create',
      metadataJson: JSON.stringify(TestData.negativeScenarios.notes),
      objectType: 'notes'
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseData = await apiClient.validateSuccessResponse(response, 200);
    
    expect(responseData.data).toHaveProperty('jobId');
    expect(responseData.data.jobId).toBeDefined();
    expect(responseData.data.count.total).not.toEqual(responseData.data.count.success);
    
    Log.info('Notes import job ID: ' + responseData.data.jobId);
  });

  test('Response should return 400 when no JSON is passed in Payload', async () => {
    const importRequest: BulkImportRequest = {
      objectName: "Notes",
      mode: 'SYNC',
      mappingRequest: JSON.stringify(TestData.mappingRequests.notes1),
      operation: 'create',
      objectType: 'notes'
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseData = await apiClient.validateErrorResponse(response, 400);
    expect(responseData.success).toBe(false);
    expect(responseData.message).toBe('Either metadataFile or metadataJson is required.');
    Log.info('Response is ' + responseData);
  });

  test('Response should return 400 when no mapping request is passed in Payload', async () => {
    const importRequest: BulkImportRequest = {
      objectName: "Notes",
      mode: 'SYNC',
      mappingRequest: '',
      operation: 'create',
      objectType: 'notes'
    };

    const response = await apiClient.bulkImport(importRequest);
    const responseData = await response.json();
    expect(responseData.statusCode).toBe(400);
    expect(responseData.message).toBe("Required request parameter 'mappingRequest' for method parameter type String is not present");
  });
})
