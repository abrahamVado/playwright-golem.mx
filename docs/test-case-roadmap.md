# Backend test case roadmap

## Authentication

- Valid login returns access token.
- Invalid password fails.
- Unknown user fails.
- Refresh token rotates.
- Old refresh token cannot be reused.
- Logout revokes session.
- Disabled user cannot login.

## Authorization / RBAC

- Admin can list users.
- Member cannot list users.
- Guest cannot access protected routes.
- User without permission receives 403.
- Permission attached to role grants access.
- Permission removed from role blocks access.

## Tenancy

- Tenant A user can access Tenant A data.
- Tenant A user cannot access Tenant B data.
- Tenant A branch user cannot access Tenant B branch.
- Company ID from request body cannot override token company ID.
- Company ID from URL is validated against token company ID.

## Security

- Malformed token fails.
- Expired token fails.
- Missing Authorization header fails.
- API does not expose stack traces.
- API does not return password hashes.
- API does not return refresh token hashes.
- SQL injection-like payloads fail safely.

## User management

- Admin can create user in own tenant.
- Admin cannot create user in another tenant.
- Duplicate email rejected.
- Weak password rejected.
- User can read own profile.
- User cannot modify own role.

## Next.js compatibility

- CORS allows frontend origin.
- Cookies, if used, have Secure/SameSite/HttpOnly settings.
- API returns consistent JSON errors.
- Validation errors are predictable for form rendering.
