import { randomEmail, randomName } from './random';

export function makeRegisterPayload(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    name: randomName(),
    email: randomEmail(),
    password: 'Password123!Strong',
    password_confirmation: 'Password123!Strong',
    ...overrides,
  };
}

export function makeUserPayload(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    name: randomName(),
    email: randomEmail('rbac-user'),
    password: 'Password123!Strong',
    role: 'member',
    company_id: 'tenant-a',
    branch_id: null,
    ...overrides,
  };
}
