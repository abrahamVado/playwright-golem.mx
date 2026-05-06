# Playwright API tests for the current Go backend

This suite targets the live contract exposed by the current Go/Gin backend.

## Goals

- Test authentication flows.
- Test auth, session rotation, and logout behavior.
- Test protected routes and standardized API envelopes.
- Test RBAC and tenant-aware authorization boundaries.
- Keep coverage useful even while some backend flows are still scaffolded.

## Run

```bash
npx playwright test --project=api --workers=1
```

## Current backend assumptions

The suite currently assumes:

- Responses use the standard envelope: `{ success, data?, error? }`.
- Auth endpoints live under `/api/v1/auth/*`.
- Protected routes use Bearer access tokens.
- Refresh tokens are returned via `HttpOnly` cookie, not JSON.
- Registration is still scaffolded, so valid payloads currently fail with a `BAD_REQUEST` error containing `register scaffold`.
- Authorization-sensitive routes may legitimately return `403` if the seeded user lacks the required permission in the running backend instance.

Adjust route expectations in `tests/config/routes.ts` if the API surface changes.
