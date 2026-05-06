import { Page, Route } from '@playwright/test';

type MockOptions = {
  userId?: string;
  companyId?: string;
};

type ApiEnvelope<T> = {
  success: true;
  data: T;
};

const DEFAULT_USER_ID = 'user-1';
const DEFAULT_COMPANY_ID = 'company-1';
const API_BASE_PATTERN = '**/api/v1/**';

function ok<T>(data: T): ApiEnvelope<T> {
  return { success: true, data };
}

export async function mockAuthenticatedSession(page: Page, options: MockOptions = {}) {
  const userId = options.userId ?? DEFAULT_USER_ID;
  const companyId = options.companyId ?? DEFAULT_COMPANY_ID;

  await page.addInitScript(([nextUserId]) => {
    window.localStorage.setItem('golem_access_token', 'test-access-token');
    window.localStorage.setItem('current_project_id', '');
    window.localStorage.setItem('current_team_id', '');
    window.localStorage.setItem('larago-ui-settings', JSON.stringify({ themeMode: 'light' }));
    window.localStorage.setItem('larago-locale', 'en');
    window.localStorage.setItem('mock_user_id', nextUserId);
  }, [userId]);

  await page.route(API_BASE_PATTERN, async (route: Route) => {
    const url = new URL(route.request().url());

    if (url.pathname.endsWith('/me')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ok({ user_id: userId, company_id: companyId, branch_id: null })),
      });
      return;
    }

    await route.continue();
  });
}

export async function mockApiGet<T>(page: Page, path: string, data: T) {
  await page.route(`**/api/v1${path}`, async (route: Route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(ok(data)),
    });
  });
}

export async function mockApiPost<T>(page: Page, path: string, data: T, onRequest?: (body: unknown) => void) {
  await page.route(`**/api/v1${path}`, async (route: Route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }

    if (onRequest) {
      const body = route.request().postDataJSON();
      onRequest(body);
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(ok(data)),
    });
  });
}
