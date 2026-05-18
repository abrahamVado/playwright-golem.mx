import { expect } from '@playwright/test';

export async function assertError(res: any, statusCode: number, errorCode: string): Promise<void> {
  expect(res.status()).toBe(statusCode);
  const body = await res.json();
  expect(body.success).toBe(false);
  expect(body.error?.code).toBe(errorCode);
}