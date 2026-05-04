import { test, expect } from '../../fixtures/api.fixture';
import type { APIResponse } from '@playwright/test';
import { env } from '../../config/env';

function getAccessToken(body: any): string | undefined {
  return (
    body.access_token ??
    body.accessToken ??
    body.token ??
    body.data?.access_token ??
    body.data?.accessToken ??
    body.data?.token
  );
}

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
    const body = await debugFull(res, payload);

    expect(res.status(), JSON.stringify(body, null, 2)).toBe(200);

    const accessToken = getAccessToken(body);

    expect(
      accessToken,
      `Expected login response to include an access token. Body:\n${JSON.stringify(body, null, 2)}`
    ).toEqual(expect.any(String));

    expect(accessToken!.length).toBeGreaterThan(20);
  });

  test('invalid password cannot login', async ({ auth }) => {
    const payload = {
      email: env.adminEmail,
      password: 'wrong-password',
    };

    process.stdout.write(`\nREQUEST:\n${JSON.stringify(payload, null, 2)}\n`);

    const res = await auth.login(payload.email, payload.password);
    const body = await debugFull(res, payload);

    expect(
      res.status(),
      `Invalid password should be rejected. Body:\n${JSON.stringify(body, null, 2)}`
    ).toBeGreaterThanOrEqual(400);
  });

  test('unknown user cannot login', async ({ auth }) => {
    const payload = {
      email: 'missing@example.test',
      password: 'Password123!Strong',
    };

    process.stdout.write(`\nREQUEST:\n${JSON.stringify(payload, null, 2)}\n`);

    const res = await auth.login(payload.email, payload.password);
    const body = await debugFull(res, payload);

    expect(
      res.status(),
      `Unknown user should not login. Body:\n${JSON.stringify(body, null, 2)}`
    ).toBeGreaterThanOrEqual(400);

    expect([400, 401, 404, 422]).toContain(res.status());
  });
});