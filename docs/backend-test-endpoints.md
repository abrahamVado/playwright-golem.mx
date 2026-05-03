# Recommended Go backend endpoints for testing

For deterministic Playwright API tests, add test-only endpoints guarded by environment.

## Important

These endpoints must only exist when:

```go
APP_ENV=test
```

or:

```go
ENABLE_TEST_ENDPOINTS=true
```

Never expose these in production.

## Suggested endpoints

### POST /test/reset

Clears database tables and runs migrations.

### POST /test/seed

Seeds:

- Platform admin
- Tenant A
- Tenant B
- Tenant A admin
- Tenant B admin
- Tenant A member
- Tenant B member
- Standard roles
- Standard permissions

### POST /test/users

Creates a specific test user.

Example payload:

```json
{
  "name": "Tenant A Member",
  "email": "tenant-a.member@example.com",
  "password": "Password123!Strong",
  "company_id": "tenant-a",
  "role": "member"
}
```

## Required seed users

```txt
admin@example.com / password
tenant-a.admin@example.com / Password123!Strong
tenant-b.admin@example.com / Password123!Strong
tenant-a.member@example.com / Password123!Strong
tenant-b.member@example.com / Password123!Strong
```
