# API Automation Test Suite

This directory contains automated test scripts for validating Batch Service API endpoints. The tests are organized into separate spec files for different API functionalities.

## Structure

```
src/tests/API/
├── CASE/CASE_IMPORT.spec.ts         # Case import operations
├── CASE/CASE_EXPORT.spec.ts         # Case Export operations
├── NOTES/NOTES_IMPORT.spec.ts       # Notes import operations
├── NOTES/NOTES_EXPORT.spec.ts       # Notes Export operations
├── DATA-TABLE/DT_IMPORT.spec.ts     # DataTable import operations 
├── DATA-TABLE/DT_EXPORT.spec.ts     # DataTable export operations 
└── README.md                        # This documentation
```

## Supporting Files

```
src/utils/
├── AuthHelper.ts             # Bearer token authentication utility
└── ApiBaseClass.ts           # Base API client with common methods

src/test-data/API/
└── api-test-data-CMM-V2      # Test data and configuration for CMM-V2 tenant
└── api-test-data-QA          # Test data and configuration for QA tenant
```

## Features

### Authentication
- **Bearer Token Authentication**: Automatically handles OAuth2 client credentials flow
- **Token Caching**: Reuses valid tokens to reduce authentication overhead
- **Automatic Refresh**: Refreshes expired tokens automatically

### API Operations Covered

#### Case API (`CASE_EXPORT.spec.ts/CASE_IMPORT.spec.ts`)
- Import cases (JSON string, sync/async)
- Import cases with file upload (CSV)
- Export cases (JSON/CSV, sync/async)
- Export with pagination (skip/limit)
- Update operations
- Error handling

#### Notes API (`NOTES_EXPORT.spec.ts/NOTES_IMPORT.spec.ts`)
- Import notes (JSON string, sync/async)
- Import notes with CSV file
- Export notes (JSON/CSV, sync/async)
- Export with pagination
- Data validation

#### Datatable API (`DT_EXPORT.spec.ts/DT_IMPORT.spec.ts`)
- Import datatable records (JSON string, sync/async)
- Import with CSV file
- Export datatable records (JSON/CSV, sync/async)
- Upsert operations
- Data type validation

## Configuration

### Environment Setup

The API configuration is stored in `src/test-data/API/api-test-data.json`:

```json
{
  "config": {
    "baseURL"
    "tenant"
    "route"
  }
}
```

### Authentication Configuration

Authentication is handled automatically using the credentials in `AuthHelper.ts`:
- **Auth URL**
- **Grant Type**
- **Client ID**
- **Client Secret**

## Running Tests

### Run All API Tests
```bash
npx playwright test src/tests/API/
```

### Run Specific Test Suites
```bash
# Case API tests only
npx playwright test src/tests/API/case-api.spec.ts

# Notes API tests only
npx playwright test src/tests/API/notes-api.spec.ts

# Datatable API tests only
npx playwright test src/tests/API/datatable-api.spec.ts

# Job Report API tests only
npx playwright test src/tests/API/job-report-api.spec.ts
```

### Run with Different Options
```bash
# Run in headed mode
npx playwright test src/tests/API/ --headed

# Run with debug output
npx playwright test src/tests/API/ --debug

# Run specific test by name
npx playwright test src/tests/API/ -g "should import cases using JSON string synchronously"

# Run in parallel
npx playwright test src/tests/API/ --workers=4
```

## Test Data

### Sample Data Structure

The test data includes:
- **Cases**: Sample case records with various field types
- **Notes**: Sample note records with title, content, and case references
- **Datatable**: Sample datatable records with different data types
- **Mapping Requests**: Field mapping configurations for each object type


## Key Features

### 1. Automatic Authentication
- No manual token management required
- Handles token expiration automatically
- Uses proper OAuth2 client credentials flow

### 2. Comprehensive Validation
- Response status validation
- Data structure validation
- Error handling validation
- Job completion monitoring

### 3. Async Job Handling
- Automatic waiting for job completion
- Progress tracking
- Timeout handling
- Status monitoring

### 4. Error Handling
- Graceful error handling for API failures
- Validation of error response structures
- Detailed error logging

### 5. Data Format Support
- JSON string import/export
- CSV file import/export
- Multipart form data handling
- Binary file upload support

## Best Practices

### 1. Test Organization
- Each API endpoint group has its own spec file
- Related tests are grouped in describe blocks
- Clear, descriptive test names

### 2. Data Management
- Centralized test data configuration
- Reusable data structures
- Easy customization

### 3. Authentication
- Automatic token management
- Security best practices
- Token cleanup after tests

### 4. Async Operations
- Proper waiting for job completion
- Timeout handling
- Progress monitoring

## Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Check if client credentials are correct
   - Verify network connectivity to auth server
   - Check if client has proper permissions

2. **Test Timeouts**
   - Increase timeout in `waitForJobCompletion` method
   - Check if test data is too large
   - Verify API server performance

3. **Data Validation Errors**
   - Check mapping request configuration
   - Verify test data format
   - Ensure required fields are present

### Debug Tips

1. **Enable Console Logging**
   ```typescript
   console.log('Job ID:', jobId);
   console.log('Response:', JSON.stringify(responseData, null, 2));
   ```

2. **Use Playwright Debug Mode**
   ```bash
   npx playwright test --debug src/tests/API/case-api.spec.ts
   ```

3. **Check Network Requests**
   - Use browser dev tools to inspect API calls
   - Verify request headers and payloads
   - Check response status codes

## Extending the Test Suite

### Adding New API Tests

1. Create a new spec file in `src/tests/API/`
2. Import required utilities:
   ```typescript
   import { test, expect } from '@playwright/test';
   import { ApiBaseClass } from '../../utils/ApiBaseClass';
   import { AuthHelper } from '../../utils/AuthHelper';
   ```

3. Follow the existing pattern for test structure
4. Add test data to `api-test-data.json` if needed

### Adding New API Methods

1. Extend `ApiBaseClass` with new methods
2. Add proper TypeScript interfaces
3. Include validation and error handling
4. Update documentation

This test suite provides comprehensive coverage of the Batch Service API endpoints with proper authentication, validation, and error handling.


## Configuring the Target Tenant for API Test Execution

By default, API tests run against the `CMM-V2` tenant environment. You can easily switch to a different tenant (such as `QA`) for your test execution by setting the `TEST_ENV` environment variable before running your tests.

 - $env:TEST_ENV="QA". 

 In order to override default tenant in pipeline, User will be entitled to select the tenant under API_ENV variable.