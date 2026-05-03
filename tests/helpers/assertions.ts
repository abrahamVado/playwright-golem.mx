import { expect, APIResponse } from '@playwright/test';

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

export async function safeBody(res: APIResponse): Promise<string> {
  try {
    return await res.text();
  } catch {
    return '<no response body>';
  }
}
