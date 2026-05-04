const API_PREFIX = '/api/v1';

export const routes = {
  health: `${API_PREFIX}/health`,

  auth: {
    register: `${API_PREFIX}/auth/register`,
    login: `${API_PREFIX}/auth/login`,
    refresh: `${API_PREFIX}/auth/refresh`,
    logout: `${API_PREFIX}/auth/logout`,
  },

  me: `${API_PREFIX}/me`,

  admin: {
    users: `${API_PREFIX}/admin/users`,
    roles: `${API_PREFIX}/admin/roles`,
    permissions: `${API_PREFIX}/admin/permissions`,
  },

  companies: {
    users: (companyId: string) => `${API_PREFIX}/companies/${companyId}/users`,
    branches: (companyId: string) => `${API_PREFIX}/companies/${companyId}/branches`,
    settings: (companyId: string) => `${API_PREFIX}/companies/${companyId}/settings`,
  },

  test: {
    reset: `${API_PREFIX}/test/reset`,
    seed: `${API_PREFIX}/test/seed`,
    users: `${API_PREFIX}/test/users`,
    tenants: `${API_PREFIX}/test/tenants`,
  },
};