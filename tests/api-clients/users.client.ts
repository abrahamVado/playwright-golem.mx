import { APIRequestContext } from '@playwright/test';
import { BaseClient } from './base.client';
import { routes } from '../config/routes';

export class UsersClient extends BaseClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async me(token: string) {
    return this.get(routes.me, token);
  }

  async listAdminUsers(token: string) {
    return this.get(routes.users, token);
  }

  async getUser(id: string, token: string) {
    return this.get(routes.userById(id), token);
  }

  async createUser(payload: Record<string, unknown>, token: string) {
    return this.post(routes.users, payload, token);
  }

  async updateUser(id: string, payload: Record<string, unknown>, token: string) {
    return this.patch(routes.userById(id), payload, token);
  }

  async deleteUser(id: string, token: string) {
    return this.delete(routes.userById(id), token);
  }

  async listRoles(token: string) {
    return this.get(routes.roles, token);
  }

  async getRole(id: string, token: string) {
    return this.get(routes.roleById(id), token);
  }

  async createRole(payload: Record<string, unknown>, token: string) {
    return this.post(routes.roles, payload, token);
  }

  async updateRole(id: string, payload: Record<string, unknown>, token: string) {
    return this.patch(routes.roleById(id), payload, token);
  }

  async deleteRole(id: string, token: string) {
    return this.delete(routes.roleById(id), token);
  }

  async currentCompany(token: string) {
    return this.get(routes.companies.current, token);
  }

  async updateCurrentCompany(payload: Record<string, unknown>, token: string) {
    return this.patch(routes.companies.current, payload, token);
  }
}
