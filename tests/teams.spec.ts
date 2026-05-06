import { test, expect } from '@playwright/test';
import { mockApiGet, mockAuthenticatedSession } from './helpers/frontend';

test.describe('Teams page', () => {
  test('loads team details and switches between workspaces', async ({ page }) => {
    await mockAuthenticatedSession(page);
    await mockApiGet(page, '/teams', [
      { id: 'team-1', name: 'Platform Team', slug: 'platform' },
      { id: 'team-2', name: 'Support Team', slug: 'support' },
    ]);
    await mockApiGet(page, '/teams/team-1/projects', [
      { id: 'project-1', name: 'Platform Revamp', description: 'Core dashboard work' },
    ]);
    await mockApiGet(page, '/teams/team-1/members', [
      { user_id: 'user-1', name: 'Alice Doe', email: 'alice@example.com' },
    ]);
    await mockApiGet(page, '/teams/team-2/projects', [
      { id: 'project-2', name: 'Inbox Automation', description: 'Support workflow cleanup' },
    ]);
    await mockApiGet(page, '/teams/team-2/members', [
      { user_id: 'user-2', name: 'Bob Roe', email: 'bob@example.com' },
      { user_id: 'user-3', name: 'Carla Poe', email: 'carla@example.com' },
    ]);

    await page.goto('/dashboard/teams');

    await expect(page.getByRole('heading', { name: 'Platform Team' })).toBeVisible();
    await expect(page.getByText('Platform Revamp')).toBeVisible();
    await expect(page.getByText('alice@example.com')).toBeVisible();

    await page.getByRole('button', { name: 'Support Team' }).click();

    await expect(page.getByRole('heading', { name: 'Support Team' })).toBeVisible();
    await expect(page.getByText('Inbox Automation')).toBeVisible();
    await expect(page.getByText('bob@example.com')).toBeVisible();
    await expect(page.getByText('carla@example.com')).toBeVisible();
  });

  test('shows the empty state when the user has no teams', async ({ page }) => {
    await mockAuthenticatedSession(page);
    await mockApiGet(page, '/teams', []);

    await page.goto('/dashboard/teams');

    await expect(page.getByText('No teams available')).toBeVisible();
    await expect(page.getByText('none were returned for this user')).toBeVisible();
  });
});
