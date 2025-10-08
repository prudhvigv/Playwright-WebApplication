import { APIRequestContext } from '@playwright/test';
import { TestData} from '../config/EnvConfig'

export interface AuthTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  id_token?: string;
  'not-before-policy': number;
  scope: string;
}

export class AuthHelper {
  private static token: string | null = null;
  private static tokenExpiry: number = 0;

  /**
   * Get authentication token using client credentials flow
   * @param request - Playwright APIRequestContext
   * @returns Bearer token string
   */
  static async getAuthToken(request: APIRequestContext): Promise<string> {
    // Check if token is still valid (with 5 minute buffer)
    const currentTime = Math.floor(Date.now() / 1000);
    if (this.token && this.tokenExpiry > currentTime + 300) {
      return this.token;
    }

    try {
      const response = await request.post(`https://auth.${TestData.config.route}.internal.mavq.io/realms/${TestData.config.tenant}/protocol/openid-connect/token`, {
        headers: {
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/x-www-form-urlencoded',
          'origin': `https://${TestData.config.tenant}.${TestData.config.route}.internal.mavq.io`,
          'priority': 'u=1, i',
          'referer': `https://${TestData.config.tenant}.${TestData.config.route}.internal.mavq.io/`,
          'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
          'Cookie': 'AUTH_SESSION_ID=e1023817-988a-40df-87b4-f4c34a866193.insu-dev-keycloak-0-11031; KEYCLOAK_IDENTITY=eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJhYTUyYmQwYi05NTE5LTRjMjMtYjMxYy1mOTkxMDAzNDczNGIifQ.eyJleHAiOjE3NTE1MDU4ODUsImlhdCI6MTc1MTQ2OTg4NSwianRpIjoiMDc4ZjY0ZGMtZjgwOS00OGRiLTkxNDgtMzJlMzZjZjY0YWU4IiwiaXNzIjoiaHR0cHM6Ly9hdXRoLmRldi5pbnN1LmludGVybmFsLm1hdnEuaW8vcmVhbG1zL2NtbS12MiIsInN1YiI6IjAxYWJjMjE0LTRjNWItNDY3NS1hNTA4LWI5ZmI3OGMwNmU4YSIsInR5cCI6IlNlcmlhbGl6ZWQtSUQiLCJzaWQiOiJlMTAyMzgxNy05ODhhLTQwZGYtODdiNC1mNGMzNGE4NjYxOTMiLCJzdGF0ZV9jaGVja2VyIjoiZ0NqUDFpQXhSaTRIM2c2SkplUEdWN2h4anItOFhaaE1XdkM1N1BQb1psNCJ9.2euDxZ3RhpRGGTj1T38i7jW6p9x6ATqUXn9We1AonS6n8Dp_3CYSV8dXZ4L0GDfivLlycvbGT_lWOse4qsua-g; KEYCLOAK_SESSION="cmm-v2/01abc214-4c5b-4675-a508-b9fb78c06e8a/e1023817-988a-40df-87b4-f4c34a866193"'
        },
        form: {
          'grant_type': 'client_credentials',
          'client_id': TestData.config.client_id,
          'client_secret': TestData.config.client_secret
        }
      });

      if (!response.ok()) {
        throw new Error(`Authentication failed: ${response.status()} ${response.statusText()}`);
      }

      const tokenData: AuthTokenResponse = await response.json();
      
      this.token = tokenData.access_token;
      this.tokenExpiry = currentTime + tokenData.expires_in;
      return this.token;
    } catch (error) {
      console.error('Failed to get authentication token:', error);
      throw error;
    }
  }

  /**
   * Clear cached token (useful for testing token refresh)
   */
  static clearToken(): void {
    this.token = null;
    this.tokenExpiry = 0;
  }

  /**
   * Get authorization headers with bearer token
   * @param request - Playwright APIRequestContext
   * @returns Headers object with Authorization
   */
  static async getAuthHeaders(request: APIRequestContext): Promise<{ [key: string]: string }> {
    const token = await this.getAuthToken(request);
    return {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'en-US,en;q=0.9',
      'priority': 'u=1, i',
      'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36'
    };
  }
}
