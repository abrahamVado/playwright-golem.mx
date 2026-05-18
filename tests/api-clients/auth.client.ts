import { APIRequestContext, APIResponse } from '@playwright/test';
import { routes } from '../config/routes';
import { ApiEnvelope, LoginPayload } from '../types/api';

const DEBUG_API_REQUESTS = !!process.env.DEBUG_API_REQUESTS;

export function extractAccessToken(body: any): string | undefined {
  return (
    body.access_token ??
    body.accessToken ??
    body.token ??
    body.data?.access_token ??
    body.data?.accessToken ??
    body.data?.token
  );
}

async function readJsonSafe(res: APIResponse): Promise<any> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export class AuthClient {
  constructor(private request: APIRequestContext) {}

  async login(email: string, password: string) {
    const payload = { email, password };

    if (DEBUG_API_REQUESTS) {
      console.log('\n--- REQUEST PAYLOAD ---');
      console.log(JSON.stringify(payload, null, 2));
      console.log('------------------------\n');
    }

    return this.request.post(routes.auth.login, {
      data: payload,
    });
  }

  async loginAndGetToken(email: string, password: string): Promise<string> {
    const res = await this.login(email, password);
    const body = (await readJsonSafe(res)) as ApiEnvelope<LoginPayload> | null;

    if (!res.ok()) {
      throw new Error(
        `Login failed: ${res.status()} ${JSON.stringify(body, null, 2)}`
      );
    }

    const accessToken = extractAccessToken(body?.data ?? body);

    if (!accessToken) {
      throw new Error(
        `Login response does not include access token: ${JSON.stringify(body, null, 2)}`
      );
    }

    return accessToken;
  }

  async register(payload: Record<string, unknown>) {
    return this.request.post(routes.auth.register, {
      data: payload,
    });
  }

  async refresh(refreshToken: string) {
    return this.request.post(routes.auth.refresh, {
      headers: {
        Cookie: `refresh_token=${refreshToken}`,
      },
    });
  }

  async refreshWithoutCookie() {
    return this.request.post(routes.auth.refresh);
  }

  async logout(accessToken: string) {
    return this.request.post(routes.auth.logout, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
}
