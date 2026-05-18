import { expect } from '@playwright/test';

export async function assertUnauthorized(res: any): Promise<void> {
  expect(res.status()).toBe(401);
  const body = await res.json();
  expect(body.success).toBe(false);
  expect(body.error?.code).toBe('UNAUTHORIZED');
}