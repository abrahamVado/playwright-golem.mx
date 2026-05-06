import { expect, APIResponse } from '@playwright/test';
import type { ApiEnvelope } from '../types/api';

export async function expectJson(res: APIResponse) {
  const contentType = res.headers()['content-type'] || '';
  expect(contentType).toContain('application/json');
}

export async function expectStatus(res: APIResponse, status: number) {
  expect(res.status(), await safeBody(res)).toBe(status);
}

export async function expectUnauthorized(res: APIResponse) {
  expect([401, 403], await safeBody(res)).toContain(res.status());
}

export async function expectForbidden(res: APIResponse) {
  expect(res.status(), await safeBody(res)).toBe(403);
}

export async function expectNotFoundOrForbidden(res: APIResponse) {
  expect([403, 404], await safeBody(res)).toContain(res.status());
}

export async function readJson<T>(res: APIResponse): Promise<T> {
  await expectJson(res);
  return (await res.json()) as T;
}

export async function expectSuccess<T>(res: APIResponse, status = 200): Promise<ApiEnvelope<T>> {
  expect(res.status(), await safeBody(res)).toBe(status);
  const body = await readJson<ApiEnvelope<T>>(res);
  expect(body.success, JSON.stringify(body, null, 2)).toBe(true);
  expect(body.data, JSON.stringify(body, null, 2)).toBeDefined();
  return body;
}

export async function expectError(
  res: APIResponse,
  status: number,
  code?: string
): Promise<ApiEnvelope<never>> {
  expect(res.status(), await safeBody(res)).toBe(status);
  const body = await readJson<ApiEnvelope<never>>(res);
  expect(body.success, JSON.stringify(body, null, 2)).toBe(false);
  expect(body.error, JSON.stringify(body, null, 2)).toBeDefined();
  if (code) {
    expect(body.error?.code, JSON.stringify(body, null, 2)).toBe(code);
  }
  return body;
}

export function getCookieValue(setCookieHeader: string | undefined, cookieName: string) {
  if (!setCookieHeader) return null;

  const cookieChunk = setCookieHeader
    .split(/,(?=[^;]+?=)/)
    .find((part) => part.trim().startsWith(`${cookieName}=`));

  if (!cookieChunk) return null;

  const pair = cookieChunk.trim().split(';', 1)[0];
  const value = pair.slice(`${cookieName}=`.length);
  return value || null;
}

export function expectRefreshCookie(setCookieHeader: string | undefined) {
  expect(setCookieHeader, 'Expected refresh_token Set-Cookie header').toBeTruthy();
  expect(setCookieHeader).toContain('refresh_token=');
  expect(setCookieHeader).toContain('HttpOnly');
  expect(setCookieHeader).toContain('Path=/api/v1/auth');
  return getCookieValue(setCookieHeader, 'refresh_token');
}

export async function safeBody(res: APIResponse): Promise<string> {
  try {
    return await res.text();
  } catch {
      return '<no response body>';
  }
}
