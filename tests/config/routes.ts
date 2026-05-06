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

  users: `${API_PREFIX}/users`,
  userById: (id: string) => `${API_PREFIX}/users/${id}`,
  roles: `${API_PREFIX}/roles`,
  roleById: (id: string) => `${API_PREFIX}/roles/${id}`,
  companies: {
    current: `${API_PREFIX}/companies/current`,
  },

  invalid: {
    route: `${API_PREFIX}/route-that-does-not-exist`,
  },
};
