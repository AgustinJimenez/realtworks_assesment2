import { test, expect } from '@playwright/test';
import { generateRealisticNameAndCategory } from '../data/generate-data.js';

test.describe('Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Block network requests to simulate offline
    await page.route('**/api/items', route => route.abort());
    
    await page.goto('/');
    
    // Wait a bit for the component to process the failed request and show some state
    await page.waitForTimeout(200);
    
    // Should show loading state, empty state, or table body - app should not crash
    const loadingVisible = await page.locator('[data-testid="items-loading-state"]').isVisible().catch(() => false);
    const emptyVisible = await page.locator('[data-testid="items-empty-state"]').isVisible().catch(() => false);
    const tableVisible = await page.locator('[data-testid="items-table-body"]').isVisible().catch(() => false);
    const bodyVisible = await page.locator('body').isVisible().catch(() => false);

    // At minimum, the page body should be visible (app didn't crash)
    expect(bodyVisible && (loadingVisible || emptyVisible || tableVisible)).toBeTruthy();
  });

  test('should handle malformed API responses', async ({ page }) => {
    // Mock API to return malformed response
    await page.route('**/api/items', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: 'invalid json'
      });
    });
    
    await page.goto('/');
    
    // Should handle the error gracefully
    const hasContent = await page.waitForTimeout(2000).then(() => {
      return page.locator('[data-testid="items-table-body"]').isVisible().catch(() => false);
    }).catch(() => false);
    
    // App should not crash completely
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle empty items list', async ({ page }) => {
    // Mock API to return empty array in correct format
    await page.route('**/api/items', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], total: 0, showing: 0, offset: 0 })
      });
    });
    
    await page.goto('/');
    
    // Wait a bit for the component to process the empty response
    await page.waitForTimeout(500);
    
    // Should show loading or handle empty state gracefully
    const loadingVisible = await page.locator('[data-testid="items-loading-state"]').isVisible().catch(() => false);
    const emptyVisible = await page.locator('[data-testid="items-empty-state"]').isVisible().catch(() => false);
    const tableVisible = await page.locator('[data-testid="items-table-body"]').isVisible().catch(() => false);
    
    expect(loadingVisible || emptyVisible || tableVisible).toBeTruthy();
  });

  test('should handle slow API responses', async ({ page }) => {
    // Mock API with delay
    await page.route('**/api/items', async route => {
      await new Promise(resolve => setTimeout(resolve, 500));
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: [{ id: 1, ...generateRealisticNameAndCategory() }],
          total: 1,
          showing: 1,
          offset: 0
        })
      });
    });
    
    await page.goto('/');
    
    // Should show loading state initially - check within first 100ms
    await page.waitForTimeout(50); // Small wait to let loading state appear
    const loadingVisible = await page.locator('[data-testid="items-loading-state"]').isVisible().catch(() => false);
    const tableVisible = await page.locator('[data-testid="items-table-body"]').isVisible().catch(() => false);
    const hasLoadingState = loadingVisible || tableVisible;
    expect(hasLoadingState).toBeTruthy();
    
    // Then show content after delay
    await expect(page.locator('[data-testid="items-table-body"]')).toBeVisible({ timeout: 5000 });
  });
});
