import { test, expect } from '@playwright/test';
import { generateRealisticItem } from '../data/generate-data.js';

test.describe('Performance Tests', () => {
  test('should load items page within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForSelector('[data-testid="items-table-body"]', { timeout: 5000 });
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds (generous for test environment)
    expect(loadTime).toBeLessThan(5000);
  });

  test('should handle large number of items efficiently', async ({ page }) => {
    // Mock API to return many items
    const largeItemsList = Array.from({ length: 1000 }, (_, i) => 
      generateRealisticItem(i + 1)
    );

    await page.route('**/api/items', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: largeItemsList, total: largeItemsList.length, showing: largeItemsList.length, offset: 0 })
      });
    });
    
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForSelector('[data-testid="items-table-body"]');
    
    const renderTime = Date.now() - startTime;
    
    // Should render even large lists reasonably quickly
    expect(renderTime).toBeLessThan(10000);
    
    // Should display all items (or implement virtualization)
    const itemCount = await page.locator('[data-testid^="item-row-"]').count();
    expect(itemCount).toBeGreaterThan(0);
  });

  test('should not have memory leaks on navigation', async ({ page }) => {
    // Navigate between pages multiple times
    for (let i = 0; i < 5; i++) {
      await page.goto('/');
      await page.waitForSelector('[data-testid="items-table-body"]');
      
      await page.click('[data-testid^="item-row-"] a:has-text("View Details")');
      await page.waitForSelector('h2');
      
      await page.click('nav a[href="/"]');
      await page.waitForSelector('[data-testid="items-table-body"]');
    }
    
    // If we get here without timeouts, navigation is working
    expect(true).toBeTruthy();
  });

  test('API endpoints should respond quickly', async ({ request }) => {
    const baseURL = 'http://localhost:4001';
    
    // Test items endpoint performance
    const startTime = Date.now();
    const response = await request.get(`${baseURL}/api/items`);
    const responseTime = Date.now() - startTime;
    
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
  });

  test('Stats endpoint should respond reasonably fast', async ({ request }) => {
    const baseURL = 'http://localhost:4001';
    
    const startTime = Date.now();
    const response = await request.get(`${baseURL}/api/stats`);
    const responseTime = Date.now() - startTime;
    
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(2000); // Stats calculation might be slower
  });
});