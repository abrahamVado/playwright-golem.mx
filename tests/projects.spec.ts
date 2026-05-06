import { test, expect } from '@playwright/test';
import { mockApiGet, mockApiPost, mockAuthenticatedSession } from './helpers/frontend';

test.describe('Projects page', () => {
  test('lists projects and filters them by search', async ({ page }) => {
    await mockAuthenticatedSession(page);
    await mockApiGet(page, '/projects', [
      { id: 'project-1', name: 'Platform Revamp', description: 'Refactor the core dashboard', icon: 'PRJ' },
      { id: 'project-2', name: 'Sales Ops', description: 'CRM workflows', icon: 'OPS' },
    ]);

    await page.goto('/dashboard/projects');

    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    await expect(page.getByText('Platform Revamp')).toBeVisible();
    await expect(page.getByText('Sales Ops')).toBeVisible();

    await page.getByPlaceholder('Search projects').fill('sales');

    await expect(page.getByText('Sales Ops')).toBeVisible();
    await expect(page.getByText('Platform Revamp')).not.toBeVisible();
  });

  test('creates a new project from the modal', async ({ page }) => {
    await mockAuthenticatedSession(page);

    let capturedBody: unknown;
    await mockApiGet(page, '/projects', []);
    await mockApiPost(
      page,
      '/projects',
      {
        id: 'project-3',
        name: 'Client Portal',
        description: 'External workspace for customers',
        icon: 'fas fa-rocket',
      },
      (body) => {
        capturedBody = body;
      }
    );

    await page.goto('/dashboard/projects');

    await expect(page.getByText('No projects yet')).toBeVisible();

    await page.getByRole('button', { name: 'Create Project' }).click();
    await page.getByPlaceholder('Platform Revamp').fill('Client Portal');
    await page.getByPlaceholder('What this project is about').fill('External workspace for customers');
    await page.getByPlaceholder('fas fa-rocket').fill('fas fa-rocket');
    await page.getByRole('button', { name: 'Create', exact: true }).click();

    expect(capturedBody).toEqual({
      name: 'Client Portal',
      description: 'External workspace for customers',
      icon: 'fas fa-rocket',
    });
    await expect(page.getByText('Client Portal')).toBeVisible();
    await expect(page.getByText('External workspace for customers')).toBeVisible();
  });
});
