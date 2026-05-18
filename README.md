# Playwright Testing Guide (Golem Stack)

This guide explains how to run Playwright tests for the Golem stack using both Docker and local environments.

## 🧱 Stack Overview

- Go API → http://localhost:8080
- Next.js → http://localhost:3000
- Nginx → http://localhost
- Playwright → runs tests against the full stack

## 🚀 1. Run the Full Stack

```bash
docker compose up
```

## 🧪 2. Run Playwright Tests (Docker)

```bash
docker compose --profile test up --build playwright
```

Run again:

```bash
docker compose run --rm playwright
cd playwright-golem.mx; npm install; npx playwright install; npx playwright test
```

## 💻 3. Run Playwright Locally

```bash
cd playwright-golem.mx
npm install
npx playwright install
```

Copy `.env.example` to `.env` and adjust values for your environment:

```bash
cp .env.example .env
```

### Run all tests

```bash
npx playwright test
```

### Run by project

```bash
npx playwright test --project=api
npx playwright test --project=frontend
npx playwright test --project=frontend-real
npx playwright test --project=live
```

### Run by tag

```bash
npm run test:smoke      # @smoke tests
npm run test:security   # @security tests
npm run test:api        # all API tests
npm run test:frontend   # mocked frontend tests
npm run test:frontend-real  # real-API frontend tests
npm run test:live       # live deployment smoke tests
```

### Debug mode

```bash
npx playwright test --ui
```

## 📁 Test Structure

| Directory | Description |
|-----------|-------------|
| `tests/api/` | API contract tests (auth, RBAC, tenancy, security) |
| `tests/frontend-real/` | Frontend tests using real API login |
| `tests/*.spec.ts` | Mocked frontend tests (kanban, projects, teams) |
| `tests/live-deploy.spec.ts` | Live production smoke tests |

## 🏷️ Tags

| Tag | Description |
|-----|-------------|
| `@smoke` | Fast smoke tests |
| `@api` | API tests |
| `@frontend` | Frontend tests |
| `@real-api` | Frontend tests using real backend |
| `@mocked` | Frontend tests using mocked API |
| `@security` | Security-focused tests |
| `@auth` | Authentication tests |
| `@rbac` | RBAC tests |
| `@tenancy` | Tenant isolation tests |
| `@live` | Live deployment tests |

## ⚙️ Configuration

`playwright.config.ts` defines projects:

- **api** — runs `tests/api/**/*.spec.ts` against API_BASE_URL
- **frontend** — runs mocked frontend tests against FRONTEND_BASE_URL
- **frontend-real** — runs real-API frontend tests
- **live** — runs live deployment smoke tests

## 🌐 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `API_URL` | `http://localhost:8080` | Go API base URL |
| `BASE_URL` | `http://localhost:3000` | Frontend base URL |
| `FRONTEND_BASE_URL` | `http://localhost:3000` | Frontend base URL (explicit) |
| `LIVE_FRONTEND_URL` | `https://paladin.mx` | Live frontend URL |
| `LIVE_API_URL` | `https://api.paladin.mx` | Live API URL |
| `E2E_ADMIN_EMAIL` | `admin@example.com` | Test admin email |
| `E2E_ADMIN_PASSWORD` | `password` | Test admin password |
| `E2E_TENANT_A_ID` | `tenant-a` | Tenant A identifier |
| `E2E_TENANT_B_ID` | `tenant-b` | Tenant B identifier |

## 🧪 Test Setup & Teardown

- `tests/global-setup.ts` validates env vars, checks API health, and optionally resets/seeds the test database
- `tests/global-teardown.ts` runs cleanup after all tests

## 🛡️ Security Tests

The suite includes tests for:

- Malformed/expired tokens
- Missing authorization headers
- SQL injection payloads
- Password hash exposure
- Refresh token reuse detection
- Cookie security attributes (HttpOnly, SameSite, Path)
- CORS headers
- Stack trace exposure

## 🔄 Test Admin Endpoints

If your Go backend exposes test endpoints (`/test/reset`, `/test/seed`, `/test/users`), the suite will automatically use them. If not, tests gracefully skip features that depend on them.

## 🐛 Troubleshooting

```bash
docker compose ps

curl http://localhost
curl http://localhost:8080/api/v1/health
```

Rebuild:

```bash
docker compose down
docker compose up --build
```

Run with Docker test profile:

```bash
docker compose --profile test run --rm playwright
```
