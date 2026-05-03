export const routes = {
  health: '/health',

  auth: {
    register: '/auth/register',
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
  },

  me: '/me',

  admin: {
    users: '/admin/users',
    roles: '/admin/roles',
    permissions: '/admin/permissions',
  },

  companies: {
    users: (companyId: string) => `/companies/${companyId}/users`,
    branches: (companyId: string) => `/companies/${companyId}/branches`,
    settings: (companyId: string) => `/companies/${companyId}/settings`,
  },

  test: {
    reset: '/test/reset',
    seed: '/test/seed',
    users: '/test/users',
    tenants: '/test/tenants',
  },
};
