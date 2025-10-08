/**
 * EnvConfig.ts
 * 
 * This module is responsible for loading and validating environment variables required for test execution.
 * 
 * How it works:
 * 1. It imports values from './env', which itself loads configuration from (in order of priority):
 *    - Environment variables (set by CI/CD, e.g., GitLab pipeline)
 *    - config.json (generated from UI_CONFIG_JSON in the pipeline)
 *    - .env file (for local development)
 * 
 * 2. The `getEnvVar` function ensures that each required variable is present and not empty.
 *    - It first checks the value imported from './env'.
 *    - If not present, it falls back to process.env (useful for direct pipeline execution).
 *    - If still not found, it throws an error and logs available environment variables for debugging.
 * 
 * 3. The `EnvConfig` object exposes the validated environment variables for use in tests.
 * 
 * 4. The file also determines which API test data file to load based on the current environment.
 */

import { Log } from '../utils/Log';
import './env';
import { BASE_URL, ADMIN_USERMAIL, ADMIN_PASSWORD, STANDARD_USERMAIL, STANDARD_PASSWORD } from './env';

/**
 * Returns the value of the environment variable, or throws an error if not set.
 * @param name The name of the environment variable.
 * @param value The value imported from './env'.
 */
function getEnvVar(name: string, value?: string): string {
  // Prefer value from './env' (which resolves from config.json, .env, or process.env)
  if (value && value.trim() !== '' && value !== 'undefined') {
    Log.info(`✅ ${name} loaded from configuration`);
    return value;
  }

  // Fallback: check process.env directly (for pipeline execution)
  const envValue = process.env[name];
  if (!envValue || envValue.trim() === '' || envValue === 'undefined') {
    // Log error and available variables for easier debugging in CI
    console.error(`❌ Environment variable ${name} is not set or empty`);
    console.error('🔍 Available environment variables:', Object.keys(process.env).filter(key => 
      key.toUpperCase().includes('URL') ||
      key.toUpperCase().includes('USER') ||
      key.toUpperCase().includes('PASSWORD') ||
      key.toUpperCase().includes('MAIL') ||
      key.toUpperCase().includes('CREDENTIAL')
    ));
    console.error('💡 Make sure you have:');
    console.error('   - .env file for local development, OR');
    console.error('   - config.json file with proper structure, OR');
    console.error('   - Environment variables set in GitLab CI pipeline');
    throw new Error(`❌ Environment variable ${name} is not set or empty`);
  }
  console.log(`✅ ${name} loaded from environment variables`);
  return envValue;
}

// Exported configuration object for use in tests
export const EnvConfig = {
  baseUrl: getEnvVar('BASE_URL', BASE_URL),
  admin_username: getEnvVar('ADMIN_USERMAIL', ADMIN_USERMAIL),
  admin_password: getEnvVar('ADMIN_PASSWORD', ADMIN_PASSWORD),
  std_username: getEnvVar('STANDARD_USERMAIL', STANDARD_USERMAIL),
  std_password: getEnvVar('STANDARD_PASSWORD', STANDARD_PASSWORD),
};

// Define supported API environments
export type EnvType = 'QA' | 'CMM-V2' | 'TEST-AUTOMATION-1';

// Default environment for API test data
const DEFAULT_API_ENV = 'TEST-AUTOMATION-1';

// Determine current API environment (from TENANT_TO_EXECUTE_API_TESTS or default)
export const CURRENT_API_ENV: EnvType = (process.env.TENANT_TO_EXECUTE_API_TESTS || DEFAULT_API_ENV) as EnvType;

// Load the appropriate API test data file based on the environment
export const TestData = require(`../test-data/api/${CURRENT_API_ENV}/api-test-data-${CURRENT_API_ENV}.json`);