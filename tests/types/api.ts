export type ApiUser = {
  id: string | number;
  email: string;
  name?: string;
  company_id?: string | number;
  branch_id?: string | number | null;
  roles?: string[];
  permissions?: string[];
};

export type LoginResponse = {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  user?: ApiUser;
};

export type ApiError = {
  error?: string;
  message?: string;
  code?: string;
  details?: unknown;
};
