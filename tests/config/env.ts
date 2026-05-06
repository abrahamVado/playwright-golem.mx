export const env = {
  apiURL: process.env.API_URL || 'http://localhost:8080',
  adminEmail: process.env.E2E_ADMIN_EMAIL || 'admin@example.com',
  adminPassword: process.env.E2E_ADMIN_PASSWORD || 'password',
  tenantAId: process.env.E2E_TENANT_A_ID || 'tenant-a',
  tenantBId: process.env.E2E_TENANT_B_ID || 'tenant-b',
};
