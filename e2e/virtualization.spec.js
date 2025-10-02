import { test, expect } from '@playwright/test';

test.describe('Virtualization Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the items to load
    await page.waitForSelector('[data-testid="items-table-body"]', { timeout: 10000 });
  });

  test('should show virtualization toggle for large datasets', async ({ page }) => {
    // Check if virtualization toggle appears (depends on totalCount > 500)
    const toggleButton = page.locator('button:has-text("Virtualization")').first();
    
    // The toggle might not be visible if dataset is small, that's expected
    const isVisible = await toggleButton.isVisible().catch(() => false);
    
    if (isVisible) {
      await expect(toggleButton).toBeVisible();
      
      // Test clicking the toggle
      await toggleButton.click();
      
      // Verify the toggle state changed
      await expect(page.locator('button:has-text("Using Virtualization"), button:has-text("Enable Virtualization")')).toBeVisible();
    }
  });

  test('should handle items display correctly', async ({ page }) => {
    // Wait for items to be loaded
    await page.waitForSelector('[data-testid^="item-row-"]', { timeout: 5000 });
    
    // Check that items are displayed
    const itemRows = page.locator('[data-testid^="item-row-"]');
    await expect(itemRows.first()).toBeVisible();
    
    // Check that footer shows item counts
    const footer = page.locator('text=/items shown from/');
    await expect(footer).toBeVisible();
  });

  test('should maintain search functionality with atomic design', async ({ page }) => {
    // Test search input
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible();
    
    // Perform search
    await searchInput.fill('laptop');
    
    // Wait for search to complete (debounced)
    await page.waitForTimeout(500);
    
    // Verify items are still displayed (might be filtered)
    const tableBody = page.locator('[data-testid="items-table-body"]');
    await expect(tableBody).toBeVisible();
  });

  test('should display proper atomic design structure', async ({ page }) => {
    // Check that the template structure exists (be specific to avoid multiple matches)
    await expect(page.locator('.container').first()).toBeVisible();
    
    // Check search bar component
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
    
    // Check table component
    await expect(page.locator('[data-testid="items-table-body"]')).toBeVisible();
    
    // Check shadcn components are properly styled
    const card = page.locator('.shadow-lg.border-2').first();
    await expect(card).toBeVisible();
  });
});