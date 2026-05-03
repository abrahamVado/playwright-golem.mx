# Playwright API testing scaffold for Go/Gin RBAC backend

This scaffold is designed for an API-only backend that will later connect to a Next.js frontend.

## Goals

- Test authentication flows.
- Test protected routes.
- Test RBAC permissions.
- Test multi-tenant isolation.
- Create executable backend requirements before all endpoints exist.

## Run

```bash
npm install
cp .env.example .env
npx playwright install
npm run test:api
```

## Recommended backend testing mode

Expose test-only endpoints only in local/test environment, never in production:

- `POST /test/reset`
- `POST /test/seed`
- `POST /test/users`
- `POST /test/tenants`

These make integration tests deterministic.

## Expected API shape

You can adjust routes in `tests/config/routes.ts`.

Default assumptions:

- `GET /health`
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /me`
- `GET /admin/users`
- `GET /companies/:companyId/users`
- `GET /companies/:companyId/branches`
