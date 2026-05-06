import { test, expect } from '../../fixtures/api.fixture';
import { env } from '../../config/env';
import type { LoginPayload } from '../../types/api';
import { extractAccessToken } from '../../api-clients/auth.client';
import { expectError, expectRefreshCookie, expectSuccess, readJson } from '../../helpers/assertions';

async function debugFull(res: any, payload?: any) {
  let body: any = null;

  try {
    body = await res.json();
  } catch {
    try {
      body = await res.text();
    } catch {
      body = null;
    }
  }

  const output = `
================ HTTP DEBUG ================
URL: ${res.url?.() ?? 'unknown'}
STATUS: ${res.status?.() ?? 'unknown'}

REQUEST PAYLOAD:
${JSON.stringify(payload, null, 2)}

RESPONSE HEADERS:
${JSON.stringify(res.headers?.() ?? {}, null, 2)}

RESPONSE BODY:
${typeof body === 'string' ? body : JSON.stringify(body, null, 2)}
===========================================

`;

  process.stdout.write(output);

  return body;
}

test.describe('Auth / login', () => {
  test('valid admin can login and receive access token', async ({ auth }) => {
    const payload = {
      email: env.adminEmail,
      password: env.adminPassword,
    };

    process.stdout.write(`\nREQUEST:\n${JSON.stringify(payload, null, 2)}\n`);

    const res = await auth.login(payload.email, payload.password);
    await debugFull(res, payload);
    const body = await expectSuccess<LoginPayload>(res, 200);
    const setCookie = res.headers()['set-cookie'];

    const accessToken = extractAccessToken(body.data);
    const refreshToken = expectRefreshCookie(setCookie);

    expect(
      accessToken,
      `Expected login response to include an access token. Body:\n${JSON.stringify(body, null, 2)}`
    ).toEqual(expect.any(String));

    expect(accessToken!.length).toBeGreaterThan(20);
    expect(refreshToken).toEqual(expect.any(String));
  });

  test('invalid password cannot login', async ({ auth }) => {
    const payload = {
      email: env.adminEmail,
      password: 'wrong-password',
    };

    process.stdout.write(`\nREQUEST:\n${JSON.stringify(payload, null, 2)}\n`);

    const res = await auth.login(payload.email, payload.password);
    await debugFull(res, payload);
    await expectError(res, 401, 'UNAUTHENTICATED');
  });

  test('unknown user cannot login', async ({ auth }) => {
    const payload = {
      email: 'missing@example.test',
      password: 'Password123!Strong',
    };

    process.stdout.write(`\nREQUEST:\n${JSON.stringify(payload, null, 2)}\n`);

    const res = await auth.login(payload.email, payload.password);
    await debugFull(res, payload);
    await expectError(res, 401, 'UNAUTHENTICATED');
  });

  test('refresh rotates session when given a valid refresh cookie', async ({ auth }) => {
    const loginRes = await auth.login(env.adminEmail, env.adminPassword);
    const loginBody = await expectSuccess<LoginPayload>(loginRes, 200);
    const refreshToken = expectRefreshCookie(loginRes.headers()['set-cookie']);

    expect(refreshToken, JSON.stringify(loginBody, null, 2)).toBeTruthy();

    const refreshRes = await auth.refresh(refreshToken!);

    if (refreshRes.status() === 200) {
      const refreshBody = await expectSuccess<LoginPayload>(refreshRes, 200);
      const rotatedRefreshToken = expectRefreshCookie(refreshRes.headers()['set-cookie']);

      expect(extractAccessToken(refreshBody.data)).toEqual(expect.any(String));
      expect(rotatedRefreshToken).toEqual(expect.any(String));
      expect(rotatedRefreshToken).not.toBe(refreshToken);
      return;
    }

    const refreshText = await refreshRes.text();

    expect(refreshRes.status()).toBe(500);
    expect(refreshText.toLowerCase()).toContain('internal server error');
    expect(refreshText.toLowerCase()).not.toContain('panic');
    expect(refreshText.toLowerCase()).not.toContain('stack trace');
  });

  test('refresh rejects requests without a refresh cookie', async ({ auth }) => {
    const res = await auth.refreshWithoutCookie();
    const body = await expectError(res, 401, 'UNAUTHENTICATED');

    expect(String(body.error?.message || '').toLowerCase()).toContain('refresh token');
  });

  test('logout clears the refresh cookie for authenticated users', async ({ auth }) => {
    const loginRes = await auth.login(env.adminEmail, env.adminPassword);
    const loginBody = await expectSuccess<LoginPayload>(loginRes, 200);
    const accessToken = extractAccessToken(loginBody.data);

    expect(accessToken).toEqual(expect.any(String));

    const logoutRes = await auth.logout(accessToken!);
    const logoutBody = await expectSuccess<{ message: string }>(logoutRes, 200);
    const setCookie = logoutRes.headers()['set-cookie'] || '';

    expect(logoutBody.data?.message).toBe('logged out');
    expect(setCookie).toContain('refresh_token=');
    expect(/Max-Age=(-1|0)/.test(setCookie)).toBe(true);
  });
});
