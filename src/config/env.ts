import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Log } from '../utils/Log';

dotenv.config();

// Function to load configuration from multiple sources
function loadConfig() {
  Log.info('🔧 Loading configuration...');
  
  // Priority 1: Environment variables (set by GitLab CI pipeline)
  if (process.env.BASE_URL && process.env.ADMIN_USERMAIL) {
    Log.info('✅ Using environment variables from GitLab CI pipeline');
    return {
      BASE_URL: process.env.BASE_URL,
      ADMIN_USERMAIL: process.env.ADMIN_USERMAIL,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
      STANDARD_USERMAIL: process.env.STANDARD_USERMAIL,
      STANDARD_PASSWORD: process.env.STANDARD_PASSWORD,
    };
  }

  // Priority 2: config.json (GitLab CI generated from UI_CONFIG_JSON variable)
  const configPath = path.join(process.cwd(), 'config.json');
  if (fs.existsSync(configPath)) {
    try {
      Log.info('✅ Using config.json file');
      const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      // Handle both object and array formats
      const config = Array.isArray(configData) ? configData[0] : configData;
      
      // // Determine which user credentials to use
      // const userCredential = process.env.USER_CREDENTIAL || 'USER_CREDENTIALS_1';
      // const credentials = config[userCredential] || {};
      
      return {
        BASE_URL: config.BASE_URL,
        ADMIN_USERMAIL: config.ADMIN_USERMAIL,
        ADMIN_PASSWORD: config.ADMIN_PASSWORD,
        STANDARD_USERMAIL: config.STANDARD_USERMAIL,
        STANDARD_PASSWORD: config.STANDARD_PASSWORD,
      };
    } catch (error) {
      console.warn('⚠️ Failed to parse config.json, falling back to .env file:', error);
    }
  }
  
  // Priority 3: .env file (local development)
  Log.info('✅ Using .env file for local development');
  return {
    BASE_URL: process.env.BASE_URL,
    ADMIN_USERMAIL: process.env.ADMIN_USERMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    STANDARD_USERMAIL: process.env.STANDARD_USERMAIL,
    STANDARD_PASSWORD: process.env.STANDARD_PASSWORD,
  };
}

const config = loadConfig();

export const BASE_URL = config.BASE_URL;
export const ADMIN_USERMAIL = config.ADMIN_USERMAIL;
export const ADMIN_PASSWORD = config.ADMIN_PASSWORD;
export const STANDARD_USERMAIL = config.STANDARD_USERMAIL;
export const STANDARD_PASSWORD = config.STANDARD_PASSWORD;
