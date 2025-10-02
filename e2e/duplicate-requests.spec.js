import { test, expect } from '@playwright/test';

test.describe('Duplicate Request Prevention', () => {
  test('should only make one initial request on page load', async ({ page }) => {
    const requests = [];
    
    // Track all API requests
    page.on('request', request => {
      if (request.url().includes('/api/items')) {
        requests.push({
          url: request.url(),
          timestamp: Date.now()
        });
      }
    });
    
    // Load the page
    await page.goto('/');
    
    // Wait for page to fully load using test ID
    await page.waitForSelector('[data-testid="items-table-body"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid^="item-row-"]', { timeout: 5000 });
    
    // Wait a bit more to catch any delayed duplicate requests
    await page.waitForTimeout(1000);
    
    // Filter to initial requests (no offset parameter)
    const initialRequests = requests.filter(req => 
      req.url.includes('limit=50') && !req.url.includes('offset=')
    );
    
    
    // Should only have 1 initial request
    expect(initialRequests.length).toBe(1);
    
    // Verify the request format
    expect(initialRequests[0].url).toContain('limit=50');
    expect(initialRequests[0].url).not.toContain('offset=');
  });

  test('should only make one request when searching for "laptop"', async ({ page }) => {
    const requests = [];
    
    // Track all API requests
    page.on('request', request => {
      if (request.url().includes('/api/items')) {
        requests.push({
          url: request.url(),
          timestamp: Date.now()
        });
      }
    });
    
    // Load the page
    await page.goto('/');
    
    // Wait for initial load to complete using test ID
    await page.waitForSelector('[data-testid="items-table-body"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid^="item-row-"]', { timeout: 5000 });
    
    // Clear the requests array to focus on search requests
    requests.length = 0;
    
    // Type "laptop" in the search box
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('laptop');
    
    // Wait for debounce + request to complete
    await page.waitForTimeout(1000);
    
    // Filter to search requests
    const searchRequests = requests.filter(req => 
      req.url.includes('q=laptop')
    );
    
    
    // Should only have 1 search request
    expect(searchRequests.length).toBe(1);

    // Verify the request format
    expect(searchRequests[0].url).toContain('q=laptop');
    expect(searchRequests[0].url).toContain('limit=50');
  });

  test('should reset pagination and avoid immediate offset requests after searching', async ({ page }) => {
    const requests = [];

    page.on('request', request => {
      if (request.url().includes('/api/items')) {
        requests.push({ url: request.url(), timestamp: Date.now() });
      }
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="items-table-body"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid^="item-row-"]', { timeout: 5000 });

    const tableBody = page.locator('[data-testid="items-table-body"]');
    await tableBody.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });

    await page.waitForTimeout(500);

    // Focus on requests triggered after scrolling by clearing previous ones
    requests.length = 0;

    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('laptop');

    await page.waitForTimeout(1200);

    const searchRequests = requests.filter(req => req.url.includes('q=laptop'));
    expect(searchRequests.length).toBe(1);
    expect(searchRequests[0].url).toContain('q=laptop');
    expect(searchRequests[0].url).toContain('limit=50');
    expect(searchRequests[0].url).not.toContain('offset=');
  });
});
