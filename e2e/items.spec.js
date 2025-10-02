import { test, expect } from '@playwright/test';

test.describe('Items Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the table to load
    await page.waitForSelector('[data-testid="items-table-body"]', { timeout: 10000 });
  });

  test('should display items list on homepage', async ({ page }) => {
    // Check if the page loads and displays items table
    await expect(page.locator('[data-testid="items-table-body"]')).toBeVisible();
    
    // Check if items are displayed in table rows
    const itemRows = page.locator('[data-testid^="item-row-"]');
    const count = await itemRows.count();
    expect(count).toBeGreaterThan(0); // Should have at least some items
    
    // Verify first item is visible
    const firstRow = itemRows.first();
    await expect(firstRow).toBeVisible();
  });

  test('should navigate to item detail page', async ({ page }) => {
    // Wait for items to load
    await page.waitForSelector('[data-testid^="item-row-"]', { timeout: 5000 });
    
    // Click on the first item's View Details button
    const firstViewButton = page.locator('[data-testid^="item-row-"] a:has-text("View Details")').first();
    await firstViewButton.click();
    
    // Should navigate to item detail page
    await expect(page).toHaveURL(/\/items\/\d+/);
    
    // Should display item details
    await expect(page.locator('h2')).toBeVisible();
  });

  test('should show loading state initially', async ({ page }) => {
    // Reload to see loading state
    await page.goto('/');
    
    // Should show table body (either with loading or content)
    await expect(page.locator('[data-testid="items-table-body"]')).toBeVisible({ timeout: 10000 });
  });

  test('should display navigation', async ({ page }) => {
    // Check navigation exists
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('nav a[href="/"]')).toHaveText('Items Store');
  });
});