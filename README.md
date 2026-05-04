# Playwright Testing Guide (Golem Stack)

This guide explains how to run Playwright tests for the Golem stack using both Docker and local environments.

## 🧱 Stack Overview

- Go API → http://localhost:8080
- Next.js → http://localhost:3000
- Nginx → http://localhost
- Playwright → runs tests against the full stack

## 🚀 1. Run the Full Stack

docker compose up

## 🧪 2. Run Playwright Tests (Docker)

docker compose --profile test up --build playwright

Run again:

docker compose run --rm playwright
cd playwright-golem.mx; npm install; npx playwright install; npx playwright test

## 💻 3. Run Playwright Locally

cd playwright-golem.mx
npm install
npx playwright install
npx playwright test

## 🧪 Debug Mode

npx playwright test --ui

## ⚙️ Configuration

playwright.config.ts:

import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost',
    headless: true,
  },
});

## 🌐 URLs

Docker:
BASE_URL=http://nginx
API_URL=http://go-api:8080

Local:
BASE_URL=http://localhost
API_URL=http://localhost:8080

## 🧪 Example Test

import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/./);
});

## Troubleshooting

docker compose ps

curl http://localhost
curl http://localhost:8080

Rebuild:
docker compose down
docker compose up --build
