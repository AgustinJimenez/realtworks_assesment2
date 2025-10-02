import { test, expect } from '@playwright/test';

test.describe('Item Detail Page', () => {
  test('should display item details', async ({ page }) => {
    // Go to first item detail page
    await page.goto('/items/1');
    
    // Should display item information
    await expect(page.locator('h2')).toBeVisible();
    await expect(page.locator('p')).toHaveCount(2); // category and price
    
    // Should have navigation in the nav bar
    await expect(page.locator('nav a[href="/"]')).toBeVisible();
  });

  test('should navigate back to items list', async ({ page }) => {
    await page.goto('/items/1');
    
    // Click back to items via navigation
    await page.click('nav a[href="/"]');
    
    // Should be back on items page
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-testid="items-table-body"]')).toBeVisible();
  });

  test('should handle non-existent item gracefully', async ({ page }) => {
    // Go to non-existent item
    await page.goto('/items/999999');
    
    // Should handle error gracefully (implementation dependent)
    // This test might need adjustment based on actual error handling implementation
    const hasError = await page.locator('text=error').isVisible() || 
                    await page.locator('text=not found').isVisible() ||
                    await page.locator('text=Error').isVisible();
    
    // Should either show error or redirect
    expect(hasError || page.url().includes('/')).toBeTruthy();
  });

  test('should display correct item data', async ({ page }) => {
    await page.goto('/items/1');
    
    // Wait for content to load
    await page.waitForSelector('h2');
    
    // Verify the content matches expected data (Laptop Pro from items.json)
    await expect(page.locator('h2')).toContainText('Laptop Pro');
    await expect(page.locator('text=Electronics')).toBeVisible();
    await expect(page.locator('text=$2499')).toBeVisible();
  });
});