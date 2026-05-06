import { test, expect } from '@playwright/test';
import { mockApiGet, mockAuthenticatedSession } from './helpers/frontend';

test.describe('Kanban page', () => {
  test('renders the selected project board and filters tasks by search', async ({ page }) => {
    await mockAuthenticatedSession(page);
    await page.addInitScript(() => {
      window.localStorage.setItem('current_project_id', 'project-1');
    });

    await mockApiGet(page, '/teams', [{ id: 'team-1', name: 'Platform Team', slug: 'platform' }]);
    await mockApiGet(page, '/teams/team-1/projects', [
      { id: 'project-1', name: 'Platform Revamp', description: 'Core platform work', icon: 'PRJ' },
    ]);
    await mockApiGet(page, '/teams/team-1/members', [
      { user_id: 'user-1', name: 'Alice Doe', email: 'alice@example.com' },
      { user_id: 'user-2', name: 'Bob Roe', email: 'bob@example.com' },
    ]);
    await mockApiGet(page, '/projects/project-1/board', {
      columns: [
        {
          id: 'col-1',
          key: 'backlog',
          title: 'Backlog',
          color: 'gray',
          tasks: [
            {
              id: 'task-1',
              title: 'Fix login redirect',
              description: 'Handle expired refresh token',
              column_key: 'backlog',
              priority: 'HIGH',
              assignees: ['user-1'],
              tags: ['bug'],
            },
          ],
        },
        {
          id: 'col-2',
          key: 'done',
          title: 'Done',
          color: 'green',
          tasks: [
            {
              id: 'task-2',
              title: 'Refresh landing hero copy',
              description: 'Marketing update',
              column_key: 'done',
              priority: 'LOW',
              assignees: ['user-2'],
              tags: ['ui'],
            },
          ],
        },
      ],
    });

    await page.goto('/dashboard/kanban');

    await expect(page.locator('select').first()).toHaveValue('project-1');
    await expect(page.getByText('Fix login redirect')).toBeVisible();
    await expect(page.getByText('Refresh landing hero copy')).toBeVisible();

    await page.getByPlaceholder('Search tasks...').fill('login');

    await expect(page.getByText('Fix login redirect')).toBeVisible();
    await expect(page.getByText('Refresh landing hero copy')).not.toBeVisible();
  });

  test('shows the empty project prompt when no project is available', async ({ page }) => {
    await mockAuthenticatedSession(page);
    await mockApiGet(page, '/teams', []);
    await mockApiGet(page, '/projects', []);

    await page.goto('/dashboard/kanban');

    await expect(page.getByText('Select or create a project')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Project' }).first()).toBeVisible();
  });
});
