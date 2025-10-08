import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { AuthHelper } from './AuthHelper';
import { Log } from './Log';

export interface ApiConfig {
  baseURL: string;
  tenant: string;
}

export interface BulkImportRequest {
  objectName: string;
  mode: 'SYNC' | 'ASYNC';
  mappingRequest: string;
  operation: 'create' | 'update' | 'upsert';
  metadataJson?: string;
  objectType: 'case' | 'notes' | 'datatable';
  file?: Buffer;
  fileName?: string;
}

export interface BulkExportRequest {
  objectName: string;
  mode: 'SYNC' | 'ASYNC';
  objectType: 'case' | 'notes' | 'datatable';
  format?: 'json' | 'csv';
  skip?: number;
  limit?: number;
}

export interface JobReportRequest {
  jobId: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any[];
}

export class ApiBaseClass {
  protected request: APIRequestContext;
  protected config: ApiConfig;

  constructor(request: APIRequestContext, config: ApiConfig) {
    this.request = request;
    this.config = config;
  }

  /**
   * Make authenticated API request
   */
  protected async makeRequest(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    options: any = {}
  ): Promise<APIResponse> {
    const headers = await AuthHelper.getAuthHeaders(this.request);
    
    const requestOptions = {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {})
      }
    };

    const url = `${this.config.baseURL}${endpoint}`;
    let response: APIResponse;
    console.log('URL in makeRequest ' + url);

    switch (method) {
      case 'POST':
        response = await this.request.post(url, requestOptions);
        break;
      case 'PUT':
        response = await this.request.put(url, requestOptions);
        break;
      case 'DELETE':
        response = await this.request.delete(url, requestOptions);
        break;
      default:
        response = await this.request.get(url, requestOptions);
    }

    return response;
  }

  /**
   * Bulk import data (cases, notes, datatable)
   */
  async bulkImport(importRequest: BulkImportRequest): Promise<APIResponse> {
    const endpoint = `/api/v1/tenants/${this.config.tenant}/bulk/import`;
    
    const formData: { [key: string]: string } = {
      objectName: importRequest.objectName,
      mode: importRequest.mode,
      mappingRequest: importRequest.mappingRequest,
      operation: importRequest.operation,
      objectType: importRequest.objectType
    };

    if (importRequest.metadataJson) {
      formData.metadataJson = importRequest.metadataJson;
    }

    // Always use multipart for this API
    const multipartData: { [key: string]: string | { name: string; mimeType: string; buffer: Buffer } } = {
      ...formData
    };

    // For file uploads, add the file to multipart
    if (importRequest.file && importRequest.fileName) {
      multipartData.metadataFile = {
        name: importRequest.fileName,
        mimeType: 'text/csv',
        buffer: importRequest.file
      };
    }
    
    return await this.makeRequest(endpoint, 'POST', {
      multipart: multipartData
    });
  }

  /**
   * Bulk export data (cases, notes, datatable)
   */
  async bulkExport(exportRequest: BulkExportRequest): Promise<APIResponse> {
    const endpoint = `/api/v1/tenants/${this.config.tenant}/bulk/case/${exportRequest.objectName}/export`;
    
    const formData: { [key: string]: string } = {
      objectName: exportRequest.objectName,
      mode: exportRequest.mode,
      objectType: exportRequest.objectType,
    };

    if (exportRequest.format !== undefined) {
        formData.exportType = exportRequest.format;
      }

    if (exportRequest.skip !== undefined) {
      formData.skip = exportRequest.skip.toString();
    }

    if (exportRequest.limit !== undefined) {
      formData.limit = exportRequest.limit.toString();
    }

    return await this.makeRequest(endpoint, 'POST', {
      multipart: formData
    });
  }

  async bulkDTExport(exportRequest: BulkExportRequest): Promise<APIResponse> {
    const endpoint = `/api/v1/tenants/${this.config.tenant}/bulk/case/${exportRequest.objectName}/export`;
    
    // Prepare the payload as a plain object (to be sent as JSON)

    const payload: { [key: string]: any } = {
      objectName: exportRequest.objectName,
      mode: exportRequest.mode,
      objectType: exportRequest.objectType,
    };

    if (exportRequest.format !== undefined) {
      payload.exportType = exportRequest.format;
    }

    if (exportRequest.skip !== undefined) {
      payload.skip = exportRequest.skip;
    }

    if (exportRequest.limit !== undefined) {
      payload.limit = exportRequest.limit;
    }

    return await this.makeRequest(endpoint, 'POST', {
      data: payload,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Get job report
   */
  async getJobReport(jobId: string): Promise<APIResponse> {
    const endpoint = `/api/v1/tenants/${this.config.tenant}/bulk/${jobId}/report`;
    return await this.makeRequest(endpoint, 'GET');
  }

  /**
   * Validate response status and structure
   */
  validateResponse(response: APIResponse, expectedStatus: number = 200): void {
    expect(response.status()).toBe(expectedStatus);
    expect(response.headers()['content-type']).toContain('application/json');
  }

  /**
   * Validate successful API response
   */
  async validateSuccessResponse(response: APIResponse, expectedStatus: number = 200): Promise<ApiResponse> {
    this.validateResponse(response, expectedStatus);
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success');
    expect(responseBody.success).toBe(true);
    expect(responseBody).toHaveProperty('data');
    
    return responseBody;
  }

  /**
   * Validate error API response
   */
  async validateErrorResponse(response: APIResponse, expectedStatus: number): Promise<ApiResponse> {
    this.validateResponse(response, expectedStatus);
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('success');
    expect(responseBody.success).toBe(false);
    
    return responseBody;
  }

  /**
   * Wait for async job completion
   */
  async waitForJobCompletion(jobId: string, timeout: number = 30000): Promise<any> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const jobResponse = await this.getJobReport(jobId);
      const jobData = await this.validateSuccessResponse(jobResponse);
      
      if (jobData.data.status === 'COMPLETED') {
        return jobData.data;
      }
      
      if (jobData.data.status === 'FAILED') {
        throw new Error(`Job ${jobId} failed: ${JSON.stringify(jobData.data.errors)}`);
      }
      
      // Wait 2 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 2000));
      Log.info('Status of job ' + jobId + ' is ' + jobData.data.status);
    }
    
    throw new Error(`Job ${jobId} did not complete within ${timeout}ms`);
  }
}
